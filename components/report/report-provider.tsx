'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { usePathname } from 'next/navigation'
import { toast } from 'sonner'
import {
  getFieldValue,
  setFieldValue,
  emptyPage1Entry,
  emptyPage2Row,
  emptyPage3Entry,
  type ReportData,
} from '@/lib/report-schema'
import { saveReport } from '@/app/actions/reports'

export type SaveState = 'saved' | 'saving' | 'dirty' | 'error'

interface ReportContextValue {
  id: string
  data: ReportData
  status: string
  page: 1 | 2 | 3
  setField: (path: string, value: string, opts?: { aiDraft?: boolean }) => void
  setMany: (changes: { path: string; value: string; aiDraft?: boolean }[]) => void
  getField: (path: string) => string
  addRow: (which: 'page1.entries' | 'page2.rows' | 'page3.entries') => void
  removeRow: (which: 'page1.entries' | 'page2.rows' | 'page3.entries', index: number) => void
  undo: () => void
  redo: () => void
  canUndo: boolean
  canRedo: boolean
  saveState: SaveState
  saveNow: (status?: string) => Promise<void>
  activeField: string | null
  setActiveField: (path: string | null) => void
  aiDrafts: Set<string>
  acceptDraft: (path: string) => void
  assistantOpen: boolean
  setAssistantOpen: (open: boolean) => void
  /** Text the assistant should pre-fill (e.g. from a field's "AI rewrite" button). */
  pendingRequest: { text: string; field: string | null } | null
  requestAssistant: (text: string, field: string | null) => void
  clearPendingRequest: () => void
}

const ReportContext = createContext<ReportContextValue | null>(null)

export function ReportProvider({
  id,
  initialData,
  initialStatus,
  children,
}: {
  id: string
  initialData: ReportData
  initialStatus: string
  children: React.ReactNode
}) {
  const [data, setData] = useState<ReportData>(initialData)
  const [status, setStatus] = useState(initialStatus)
  const [past, setPast] = useState<ReportData[]>([])
  const [future, setFuture] = useState<ReportData[]>([])
  const [saveState, setSaveState] = useState<SaveState>('saved')
  const [activeField, setActiveFieldState] = useState<string | null>(null)
  const [aiDrafts, setAiDrafts] = useState<Set<string>>(new Set())
  const [assistantOpen, setAssistantOpen] = useState(false)
  const [pendingRequest, setPendingRequest] = useState<{ text: string; field: string | null } | null>(null)

  const pathname = usePathname()
  const page: 1 | 2 | 3 = pathname.endsWith('page-2') ? 2 : pathname.endsWith('page-3') ? 3 : 1

  const latest = useRef(data)
  latest.current = data
  const dirtyRef = useRef(false)
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const commit = useCallback((next: ReportData) => {
    setPast((p) => [...p.slice(-49), latest.current])
    setFuture([])
    setData(next)
    dirtyRef.current = true
    setSaveState('dirty')
  }, [])

  const setField = useCallback(
    (path: string, value: string, opts?: { aiDraft?: boolean }) => {
      if (getFieldValue(latest.current, path) === value) return
      commit(setFieldValue(latest.current, path, value))
      setAiDrafts((s) => {
        const n = new Set(s)
        if (opts?.aiDraft) n.add(path)
        else n.delete(path)
        return n
      })
    },
    [commit],
  )

  const setMany = useCallback(
    (changes: { path: string; value: string; aiDraft?: boolean }[]) => {
      let next = latest.current
      for (const c of changes) next = setFieldValue(next, c.path, c.value)
      commit(next)
      setAiDrafts((s) => {
        const n = new Set(s)
        for (const c of changes) {
          if (c.aiDraft) n.add(c.path)
          else n.delete(c.path)
        }
        return n
      })
    },
    [commit],
  )

  const getField = useCallback((path: string) => getFieldValue(latest.current, path), [])

  const addRow = useCallback(
    (which: 'page1.entries' | 'page2.rows' | 'page3.entries') => {
      const next = structuredClone(latest.current)
      if (which === 'page1.entries') next.page1.entries.push(emptyPage1Entry())
      else if (which === 'page2.rows') next.page2.rows.push(emptyPage2Row())
      else next.page3.entries.push(emptyPage3Entry())
      commit(next)
    },
    [commit],
  )

  const removeRow = useCallback(
    (which: 'page1.entries' | 'page2.rows' | 'page3.entries', index: number) => {
      const next = structuredClone(latest.current)
      const list = which === 'page1.entries' ? next.page1.entries : which === 'page2.rows' ? next.page2.rows : next.page3.entries
      if (list.length <= 1) return
      list.splice(index, 1)
      commit(next)
    },
    [commit],
  )

  const undo = useCallback(() => {
    setPast((p) => {
      if (p.length === 0) return p
      const prev = p[p.length - 1]
      setFuture((f) => [latest.current, ...f])
      setData(prev)
      dirtyRef.current = true
      setSaveState('dirty')
      return p.slice(0, -1)
    })
  }, [])

  const redo = useCallback(() => {
    setFuture((f) => {
      if (f.length === 0) return f
      const next = f[0]
      setPast((p) => [...p, latest.current])
      setData(next)
      dirtyRef.current = true
      setSaveState('dirty')
      return f.slice(1)
    })
  }, [])

  const saveNow = useCallback(
    async (newStatus?: string) => {
      setSaveState('saving')
      try {
        await saveReport(id, latest.current, newStatus)
        if (newStatus) setStatus(newStatus)
        dirtyRef.current = false
        setSaveState('saved')
      } catch {
        setSaveState('error')
        toast.error('Could not save the report. Check your connection.')
      }
    },
    [id],
  )

  // Debounced autosave — every edit is persisted (encrypted) within 1.5s.
  useEffect(() => {
    if (saveState !== 'dirty') return
    if (timer.current) clearTimeout(timer.current)
    timer.current = setTimeout(() => void saveNow(), 1500)
    return () => {
      if (timer.current) clearTimeout(timer.current)
    }
  }, [data, saveState, saveNow])

  useEffect(() => {
    const onBeforeUnload = (e: BeforeUnloadEvent) => {
      if (dirtyRef.current) e.preventDefault()
    }
    window.addEventListener('beforeunload', onBeforeUnload)
    return () => window.removeEventListener('beforeunload', onBeforeUnload)
  }, [])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const mod = e.ctrlKey || e.metaKey
      if (!mod) return
      const target = e.target as HTMLElement | null
      const inEditable = target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA')
      if (inEditable) return
      if (e.key === 'z' && !e.shiftKey) {
        e.preventDefault()
        undo()
      } else if ((e.key === 'z' && e.shiftKey) || e.key === 'y') {
        e.preventDefault()
        redo()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [undo, redo])

  const setActiveField = useCallback((p: string | null) => setActiveFieldState(p), [])
  const acceptDraft = useCallback(
    (path: string) =>
      setAiDrafts((s) => {
        const n = new Set(s)
        n.delete(path)
        return n
      }),
    [],
  )
  const requestAssistant = useCallback((text: string, field: string | null) => {
    setPendingRequest({ text, field })
    setAssistantOpen(true)
  }, [])
  const clearPendingRequest = useCallback(() => setPendingRequest(null), [])

  const value = useMemo<ReportContextValue>(
    () => ({
      id,
      data,
      status,
      page,
      setField,
      setMany,
      getField,
      addRow,
      removeRow,
      undo,
      redo,
      canUndo: past.length > 0,
      canRedo: future.length > 0,
      saveState,
      saveNow,
      activeField,
      setActiveField,
      aiDrafts,
      acceptDraft,
      assistantOpen,
      setAssistantOpen,
      pendingRequest,
      requestAssistant,
      clearPendingRequest,
    }),
    [
      id,
      data,
      status,
      page,
      setField,
      setMany,
      getField,
      addRow,
      removeRow,
      undo,
      redo,
      past.length,
      future.length,
      saveState,
      saveNow,
      activeField,
      setActiveField,
      aiDrafts,
      acceptDraft,
      assistantOpen,
      pendingRequest,
      requestAssistant,
      clearPendingRequest,
    ],
  )

  return <ReportContext.Provider value={value}>{children}</ReportContext.Provider>
}

export function useReport() {
  const ctx = useContext(ReportContext)
  if (!ctx) throw new Error('useReport must be used inside ReportProvider')
  return ctx
}
