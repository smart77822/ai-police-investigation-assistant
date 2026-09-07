'use client'

import { useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'
import { Mic, Square, Send, Loader2, Bot, X, AlertTriangle, Check, Pencil, Sparkles, Cpu, Cloud } from 'lucide-react'
import { useReport } from '@/components/report/report-provider'
import { useLang } from '@/components/lang-provider'
import { useSpeech } from '@/hooks/use-speech'
import { interpret, type ExtractedField, type InterpretResult } from '@/lib/ai/client'
import { getFieldLabel, type Lang } from '@/lib/report-schema'
import { SPEECH_LOCALES } from '@/lib/i18n'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

interface Message {
  id: string
  role: 'user' | 'assistant'
  text: string
  result?: InterpretResult
}

interface Proposal extends ExtractedField {
  key: string
  accepted: boolean
  rejected: boolean
  editing: boolean
}

export function AssistantPanel({ className, onClose }: { className?: string; onClose?: () => void }) {
  const { data, page, activeField, getField, setMany, pendingRequest, clearPendingRequest, id } = useReport()
  const { lang, t } = useLang()
  const [input, setInput] = useState('')
  const [interim, setInterim] = useState('')
  const [messages, setMessages] = useState<Message[]>([])
  const [proposals, setProposals] = useState<Proposal[]>([])
  const [conflicts, setConflicts] = useState<InterpretResult['conflicts']>([])
  const [busy, setBusy] = useState(false)
  const [voiceLang, setVoiceLang] = useState<Lang | 'mixed'>(lang)
  const scrollRef = useRef<HTMLDivElement>(null)
  const targetFieldRef = useRef<string | null>(null)

  const speech = useSpeech({
    locale: voiceLang === 'mixed' ? 'ur-PK' : SPEECH_LOCALES[voiceLang],
    serverLang: voiceLang === 'en' ? 'en' : voiceLang === 'ur' ? 'ur' : 'auto',
    onInterim: setInterim,
    onFinal: (text) => {
      setInterim('')
      void submit(text)
    },
    onError: (m) => toast.error(m),
  })

  // A field's "voice" button routes here with the field pre-targeted.
  useEffect(() => {
    if (!pendingRequest) return
    targetFieldRef.current = pendingRequest.field
    if (pendingRequest.text) setInput(pendingRequest.text)
    else if (!speech.listening) speech.start()
    clearPendingRequest()
  }, [pendingRequest, clearPendingRequest, speech])

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages, proposals, busy])

  useEffect(() => {
    setMessages([])
    setProposals([])
    setConflicts([])
  }, [id])

  async function submit(text: string) {
    const trimmed = text.trim()
    if (!trimmed || busy) return
    setInput('')
    setBusy(true)
    const field = targetFieldRef.current ?? activeField
    targetFieldRef.current = null
    setMessages((m) => [...m, { id: crypto.randomUUID(), role: 'user', text: trimmed }])
    try {
      const result = await interpret({
        text: trimmed,
        lang,
        page,
        activeField: field,
        activeFieldValue: field ? getField(field) : undefined,
        data,
      })
      setMessages((m) => [...m, { id: crypto.randomUUID(), role: 'assistant', text: result.message, result }])
      setConflicts(result.conflicts ?? [])
      const next: Proposal[] = result.fields.map((f) => ({
        ...f,
        key: crypto.randomUUID(),
        accepted: false,
        rejected: false,
        editing: false,
      }))
      // Low-risk, high-confidence formatting can be applied immediately as an AI draft;
      // everything flagged needsConfirmation waits for the user.
      const auto = next.filter((p) => !p.needsConfirmation && p.confidence >= 0.9)
      if (auto.length) {
        setMany(auto.map((p) => ({ path: p.fieldId, value: p.value, aiDraft: p.source === 'ai_formatting' })))
      }
      setProposals((prev) => [...prev.filter((p) => !p.accepted && !p.rejected), ...next.map((p) => (auto.includes(p) ? { ...p, accepted: true } : p))])
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'AI request failed')
    } finally {
      setBusy(false)
    }
  }

  function acceptProposal(p: Proposal, value?: string) {
    setMany([{ path: p.fieldId, value: value ?? p.value, aiDraft: p.source === 'ai_formatting' }])
    setProposals((list) => list.map((x) => (x.key === p.key ? { ...x, accepted: true, editing: false, value: value ?? x.value } : x)))
  }

  function acceptAll() {
    const pending = proposals.filter((p) => !p.accepted && !p.rejected)
    if (!pending.length) return
    setMany(pending.map((p) => ({ path: p.fieldId, value: p.value, aiDraft: p.source === 'ai_formatting' })))
    setProposals((list) => list.map((x) => (pending.some((p) => p.key === x.key) ? { ...x, accepted: true, editing: false } : x)))
  }

  function resolveConflict(c: InterpretResult['conflicts'][number], useNew: boolean) {
    if (useNew) setMany([{ path: c.fieldId, value: c.newValue }])
    setConflicts((list) => list.filter((x) => x !== c))
  }

  const pendingCount = proposals.filter((p) => !p.accepted && !p.rejected).length

  return (
    <aside className={cn('flex h-full min-h-0 flex-col bg-card text-card-foreground', className)} aria-label={t('aiAssistant')}>
      <div className="flex items-center gap-2 border-b px-3 py-2">
        <span className="flex size-7 items-center justify-center rounded-md bg-brass text-brass-foreground">
          <Bot className="size-4" aria-hidden="true" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold leading-tight">{t('aiAssistant')}</p>
          <p className="truncate text-[11px] text-muted-foreground">
            {t('page' + page)} · {t('currentField')}: {activeField ? getFieldLabel(activeField, lang) : t('none')}
          </p>
        </div>
        {onClose && (
          <Button variant="ghost" size="icon" onClick={onClose} aria-label="Close assistant">
            <X className="size-4" />
          </Button>
        )}
      </div>

      <div ref={scrollRef} className="flex-1 min-h-0 overflow-y-auto px-3 py-3 flex flex-col gap-3">
        {messages.length === 0 && (
          <div className="rounded-md border border-dashed p-3 text-xs text-muted-foreground leading-relaxed">
            <p dir="auto" className={cn(lang === 'ur' && 'urdu-text text-sm')}>
              {lang === 'ur'
                ? 'بولیں یا لکھیں۔ مثال: "مقدمہ نمبر ایک سو پینتالیس، تھانہ شکرگڑھ، تاریخ سات ستمبر دو ہزار چھبیس" — میں معلومات سمجھ کر درست خانوں میں درج کروں گا۔'
                : lang === 'roman'
                  ? 'Bolain ya likhain. Misal: "Case number 145, thana Shakargarh, tareekh 7 September 2026" — main information samajh kar sahi fields mein dalunga.'
                  : 'Speak or type. Example: "Case number 145, police station Shakargarh, date 7 September 2026" — I will understand it and place each value in the correct field.'}
            </p>
          </div>
        )}

        {messages.map((m) => (
          <div key={m.id} className={cn('flex', m.role === 'user' ? 'justify-end' : 'justify-start')}>
            <div
              dir="auto"
              className={cn(
                'max-w-[92%] rounded-lg px-3 py-2 text-sm leading-relaxed whitespace-pre-wrap',
                m.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted text-foreground',
                /[\u0600-\u06FF]/.test(m.text) && 'urdu-text',
              )}
            >
              {m.text}
              {m.result?.correctedTranscript && m.role === 'assistant' && m.result.correctedTranscript !== messages[messages.indexOf(m) - 1]?.text && (
                <p className="mt-1 border-t border-foreground/10 pt-1 text-[11px] text-muted-foreground" dir="auto">
                  {lang === 'ur' ? 'سمجھا گیا:' : 'Understood as:'} {m.result.correctedTranscript}
                </p>
              )}
              {m.result?.clarifications?.length ? (
                <ul className="mt-2 flex flex-col gap-1">
                  {m.result.clarifications.map((c, i) => (
                    <li key={i} className="flex gap-1.5 text-[12px] text-amber-700 dark:text-amber-400">
                      <AlertTriangle className="mt-0.5 size-3 shrink-0" aria-hidden="true" />
                      <span dir="auto">{c}</span>
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>
          </div>
        ))}

        {conflicts.map((c, i) => (
          <div key={i} className="rounded-md border border-destructive/40 bg-destructive/5 p-3 text-sm flex flex-col gap-2">
            <p className="flex items-center gap-1.5 font-semibold text-destructive">
              <AlertTriangle className="size-4" aria-hidden="true" />
              {lang === 'ur' ? 'ممکنہ تضاد' : 'Possible contradiction'} — {getFieldLabel(c.fieldId, lang)}
            </p>
            <p dir="auto" className="text-xs text-muted-foreground">{c.question}</p>
            <div className="flex flex-wrap gap-2">
              <Button size="sm" variant="outline" onClick={() => resolveConflict(c, false)} dir="auto">
                {lang === 'ur' ? 'موجودہ رکھیں:' : 'Keep current:'} {c.currentValue}
              </Button>
              <Button size="sm" onClick={() => resolveConflict(c, true)} dir="auto">
                {lang === 'ur' ? 'نئی قدر:' : 'Use new:'} {c.newValue}
              </Button>
            </div>
          </div>
        ))}

        {proposals.length > 0 && (
          <div className="rounded-md border p-2 flex flex-col gap-2">
            <div className="flex items-center justify-between px-1">
              <p className="text-xs font-semibold text-muted-foreground">{lang === 'ur' ? 'اے آئی نے سمجھا:' : 'AI understood:'}</p>
              {pendingCount > 1 && (
                <Button size="sm" variant="secondary" onClick={acceptAll} className="h-7 text-xs gap-1">
                  <Check className="size-3" /> {t('confirmInsert')} ({pendingCount})
                </Button>
              )}
            </div>
            {proposals.map((p) => (
              <ProposalCard
                key={p.key}
                p={p}
                lang={lang}
                onAccept={(v) => acceptProposal(p, v)}
                onReject={() => setProposals((l) => l.map((x) => (x.key === p.key ? { ...x, rejected: true, editing: false } : x)))}
                onEdit={() => setProposals((l) => l.map((x) => (x.key === p.key ? { ...x, editing: !x.editing } : x)))}
              />
            ))}
          </div>
        )}

        {busy && (
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Loader2 className="size-3.5 animate-spin" /> {lang === 'ur' ? 'سمجھ رہا ہے…' : 'Understanding…'}
          </div>
        )}
      </div>

      <div className="border-t p-3 flex flex-col gap-2">
        <div className="flex items-center gap-1 text-[11px]">
          <span className="text-muted-foreground me-1">{t('language')}:</span>
          {(['ur', 'en', 'roman', 'mixed'] as const).map((l) => (
            <button
              key={l}
              type="button"
              onClick={() => setVoiceLang(l)}
              className={cn('rounded px-1.5 py-0.5', voiceLang === l ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-accent')}
              aria-pressed={voiceLang === l}
            >
              {l === 'ur' ? 'اردو' : l === 'en' ? 'English' : l === 'roman' ? 'Roman' : 'Mixed'}
            </button>
          ))}
          <button
            type="button"
            onClick={() => speech.setEngine(speech.engine === 'browser' ? 'server' : 'browser')}
            className="ms-auto inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-muted-foreground hover:bg-accent"
            title={speech.engine === 'browser' ? 'Browser speech recognition (switch to Whisper)' : 'Whisper server transcription (switch to browser)'}
          >
            {speech.engine === 'browser' ? <Cpu className="size-3" /> : <Cloud className="size-3" />}
            {speech.engine === 'browser' ? 'Browser' : 'Whisper'}
          </button>
        </div>

        {(speech.listening || interim) && (
          <p dir="auto" className="rounded-md bg-muted px-3 py-2 text-sm urdu-auto min-h-9" aria-live="polite">
            {interim || t('listening')}
          </p>
        )}

        <form
          onSubmit={(e) => {
            e.preventDefault()
            void submit(input)
          }}
          className="flex items-end gap-2"
        >
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing && e.keyCode !== 229) {
                e.preventDefault()
                void submit(input)
              }
            }}
            placeholder={t('tellAi')}
            dir="auto"
            rows={2}
            className={cn('min-h-10 resize-none text-sm', /[\u0600-\u06FF]/.test(input) && 'urdu-text')}
            aria-label={t('tellAi')}
          />
          <Button type="submit" size="icon" disabled={!input.trim() || busy} aria-label="Send">
            <Send className="size-4" />
          </Button>
        </form>

        <Button
          type="button"
          onClick={speech.toggle}
          disabled={!speech.supported || speech.processing}
          className={cn(
            'relative h-14 w-full gap-3 text-base font-semibold',
            speech.listening ? 'bg-destructive text-white hover:bg-destructive/90 mic-pulse' : 'bg-brass text-brass-foreground hover:bg-brass/90',
          )}
          aria-pressed={speech.listening}
        >
          {speech.processing ? <Loader2 className="size-6 animate-spin" /> : speech.listening ? <Square className="size-5" /> : <Mic className="size-6" />}
          <span className={cn(lang === 'ur' && 'urdu-text')}>
            {speech.processing ? '…' : speech.listening ? t('stop') : t('speak')}
          </span>
        </Button>
        {!speech.supported && <p className="text-[11px] text-destructive">Microphone / speech recognition is not available in this browser.</p>}
      </div>
    </aside>
  )
}

function ProposalCard({
  p,
  lang,
  onAccept,
  onReject,
  onEdit,
}: {
  p: Proposal
  lang: Lang
  onAccept: (value?: string) => void
  onReject: () => void
  onEdit: () => void
}) {
  const [draft, setDraft] = useState(p.value)
  useEffect(() => setDraft(p.value), [p.value])
  const isUrdu = /[\u0600-\u06FF]/.test(p.value)
  const low = p.confidence < 0.75

  return (
    <div
      className={cn(
        'rounded-md border p-2 flex flex-col gap-1.5 text-sm',
        p.accepted && 'border-primary/40 bg-primary/5',
        p.rejected && 'opacity-50',
        !p.accepted && !p.rejected && low && 'border-amber-500/50 bg-amber-500/5',
      )}
    >
      <div className="flex items-center gap-2">
        <span className={cn('text-xs font-semibold', lang === 'ur' && 'urdu-text text-sm')}>{getFieldLabel(p.fieldId, lang)}</span>
        <Badge variant="outline" className={cn('ms-auto h-5 text-[10px]', p.source === 'ai_formatting' ? 'border-brass text-brass-foreground bg-brass/20' : '')}>
          {p.source === 'ai_formatting' ? <Sparkles className="size-3 me-1" /> : null}
          {p.source === 'ai_formatting' ? (lang === 'ur' ? 'اے آئی مسودہ' : 'AI draft') : lang === 'ur' ? 'حقیقت' : 'Fact'}
        </Badge>
        <span className="text-[10px] text-muted-foreground tabular-nums">{Math.round(p.confidence * 100)}%</span>
      </div>
      {p.editing ? (
        p.value.length > 60 ? (
          <Textarea dir="auto" value={draft} onChange={(e) => setDraft(e.target.value)} rows={4} className={cn('text-sm', isUrdu && 'urdu-text')} />
        ) : (
          <Input dir="auto" value={draft} onChange={(e) => setDraft(e.target.value)} className={cn('text-sm', isUrdu && 'urdu-text')} />
        )
      ) : (
        <p dir="auto" className={cn('whitespace-pre-wrap leading-relaxed text-[13px]', isUrdu && 'urdu-text text-sm')}>
          {p.value}
        </p>
      )}
      {p.note && !p.accepted && (
        <p className="text-[11px] text-amber-700 dark:text-amber-400 flex items-center gap-1">
          <AlertTriangle className="size-3" /> {p.note}
        </p>
      )}
      {!p.accepted && !p.rejected && (
        <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
          {low && <span className="text-[11px] text-muted-foreground me-1">{lang === 'ur' ? 'کیا آپ کا مطلب یہ تھا؟' : 'Did you mean:'}</span>}
          <Button size="sm" className="h-7 text-xs gap-1" onClick={() => onAccept(p.editing ? draft : undefined)}>
            <Check className="size-3" /> {p.editing ? (lang === 'ur' ? 'محفوظ کریں' : 'Save') : lang === 'ur' ? 'جی ہاں، استعمال کریں' : 'Yes, Use It'}
          </Button>
          <Button size="sm" variant="outline" className="h-7 text-xs gap-1" onClick={onEdit}>
            <Pencil className="size-3" /> {lang === 'ur' ? 'ترمیم' : 'Edit'}
          </Button>
          <Button size="sm" variant="ghost" className="h-7 text-xs" onClick={onReject}>
            {lang === 'ur' ? 'منسوخ' : 'Cancel'}
          </Button>
        </div>
      )}
      {p.accepted && (
        <p className="text-[11px] text-primary flex items-center gap-1">
          <Check className="size-3" /> {lang === 'ur' ? 'رپورٹ میں درج ہو گیا' : 'Inserted into the report'}
        </p>
      )}
    </div>
  )
}
