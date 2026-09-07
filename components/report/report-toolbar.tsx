'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Undo2, Redo2, Save, Eye, ChevronLeft, ChevronRight, Bot, Check, Loader2, AlertTriangle, ShieldCheck } from 'lucide-react'
import { useReport } from './report-provider'
import { useLang } from '@/components/lang-provider'
import { Button } from '@/components/ui/button'
import { PAGE_TITLES } from '@/lib/report-schema'
import { cn } from '@/lib/utils'

export function ReportToolbar({ onVerify = () => undefined }: { onVerify?: () => void }) {
  const { id, page, undo, redo, canUndo, canRedo, saveState, saveNow, assistantOpen, setAssistantOpen } = useReport()
  const { t, lang } = useLang()
  const router = useRouter()

  const prev = page > 1 ? `/reports/${id}/page-${page - 1}` : null
  const next = page < 3 ? `/reports/${id}/page-${page + 1}` : null

  return (
    <div className="no-print sticky top-0 lg:top-0 z-20 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-2 px-3 py-2 sm:px-6">
        <div className="flex items-center gap-1">
          {([1, 2, 3] as const).map((n) => (
            <Link
              key={n}
              href={`/reports/${id}/page-${n}`}
              aria-current={page === n ? 'page' : undefined}
              className={cn(
                'rounded-md px-2.5 py-1.5 text-xs font-semibold transition-colors',
                page === n ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground',
              )}
            >
              {t(`page${n}`)}
            </Link>
          ))}
        </div>
        <h2 className={cn('min-w-0 flex-1 truncate text-sm font-semibold', lang === 'ur' && 'urdu-text text-base')} title={PAGE_TITLES[page][lang]}>
          {PAGE_TITLES[page][lang]}
        </h2>

        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" onClick={undo} disabled={!canUndo} aria-label={t('undo')} title={t('undo')}>
            <Undo2 className="size-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={redo} disabled={!canRedo} aria-label={t('redo')} title={t('redo')}>
            <Redo2 className="size-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => void saveNow()} className="gap-1.5" aria-live="polite">
            {saveState === 'saving' ? (
              <Loader2 className="size-4 animate-spin" />
            ) : saveState === 'saved' ? (
              <Check className="size-4 text-primary" />
            ) : saveState === 'error' ? (
              <AlertTriangle className="size-4 text-destructive" />
            ) : (
              <Save className="size-4" />
            )}
            <span className="hidden sm:inline text-xs">
              {saveState === 'saving' ? t('saving') : saveState === 'saved' ? t('saved') : saveState === 'error' ? 'Error' : t('unsaved')}
            </span>
          </Button>
          <Button variant="ghost" size="sm" onClick={onVerify} className="gap-1.5" title={t('verify')}>
            <ShieldCheck className="size-4" />
            <span className="hidden md:inline text-xs">{t('verify')}</span>
          </Button>
          <Button variant="outline" size="sm" onClick={() => router.push(`/reports/${id}/preview`)} className="gap-1.5">
            <Eye className="size-4" />
            <span className="hidden sm:inline text-xs">{t('preview')}</span>
          </Button>
          <Button
            variant={assistantOpen ? 'default' : 'outline'}
            size="sm"
            onClick={() => setAssistantOpen(!assistantOpen)}
            className="gap-1.5"
            aria-pressed={assistantOpen}
          >
            <Bot className="size-4" />
            <span className="hidden sm:inline text-xs">{t('aiAssistant')}</span>
          </Button>
        </div>

        <div className="flex w-full items-center justify-between gap-2 sm:w-auto sm:ms-auto">
          <Button variant="ghost" size="sm" disabled={!prev} onClick={() => prev && router.push(prev)} className="gap-1">
            <ChevronLeft className="size-4" />
            {prev ? t(`page${page - 1}`) : ''}
          </Button>
          <Button variant="ghost" size="sm" disabled={!next} onClick={() => next && router.push(next)} className="gap-1">
            {next ? t(`page${page + 1}`) : ''}
            <ChevronRight className="size-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
