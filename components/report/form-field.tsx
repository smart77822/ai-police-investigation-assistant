'use client'

import { useId, useState } from 'react'
import { toast } from 'sonner'
import { Mic, Sparkles, Languages, Wand2, Copy, ClipboardPaste, Eraser, Check, Loader2 } from 'lucide-react'
import { useReport } from './report-provider'
import { useLang } from '@/components/lang-provider'
import { getFieldDef, type FieldType, type Lang } from '@/lib/report-schema'
import { transform, type TransformAction } from '@/lib/ai/client'
import { AiPreviewDialog } from './ai-preview-dialog'
import { cn } from '@/lib/utils'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface Props {
  path: string
  type?: FieldType
  /** Override label (used for table cells where the header already carries the label). */
  label?: string
  hideLabel?: boolean
  rows?: number
  className?: string
  inputClassName?: string
  /** Display the label inline with the underline field (header style of the paper form). */
  inline?: boolean
  placeholder?: string
}

export function FormField({ path, type, label, hideLabel, rows = 4, className, inputClassName, inline, placeholder }: Props) {
  const { getField, setField, activeField, setActiveField, aiDrafts, acceptDraft, requestAssistant } = useReport()
  const { lang, t } = useLang()
  const def = getFieldDef(path)
  const fieldType = type ?? def?.type ?? 'text'
  const value = getField(path)
  const id = useId()
  const isActive = activeField === path
  const isDraft = aiDrafts.has(path)
  const [busy, setBusy] = useState<string | null>(null)
  const [preview, setPreview] = useState<{ title: string; draft: string } | null>(null)

  const urduLabel = def?.label.ur ?? label ?? path
  const otherLabel = lang === 'ur' ? '' : def?.label[lang] ?? ''

  async function runTransform(action: TransformAction, targetLang: Lang, title: string) {
    if (!value.trim()) {
      toast.message(lang === 'ur' ? 'فیلڈ خالی ہے' : 'Field is empty')
      return
    }
    setBusy(action)
    try {
      const res = await transform(action, value, targetLang)
      setPreview({ title, draft: res.text })
    } catch {
      toast.error('AI request failed')
    } finally {
      setBusy(null)
    }
  }

  async function paste() {
    try {
      const text = await navigator.clipboard.readText()
      if (text) setField(path, value ? `${value} ${text}` : text)
    } catch {
      toast.error('Clipboard access denied')
    }
  }

  const isText = fieldType === 'text' || fieldType === 'textarea'
  const isUrduish = /[\u0600-\u06FF]/.test(value)

  const inputProps = {
    id,
    value,
    onFocus: () => setActiveField(path),
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setField(path, e.target.value),
    placeholder,
    'aria-label': label ?? urduLabel,
    dir: 'auto' as const,
    className: cn(
      'w-full rounded-none border-0 border-b bg-transparent px-1 py-1 text-[15px] leading-relaxed transition-shadow',
      isUrduish && 'urdu-text',
      fieldType === 'textarea' && 'rounded-sm border px-2 py-1.5 resize-y min-h-20',
      isDraft && 'ai-draft',
      inputClassName,
    ),
  }

  return (
    <div className={cn('group relative flex flex-col gap-1', inline && 'md:flex-row md:items-end md:gap-2', className)}>
      {!hideLabel && (
        <label htmlFor={id} className={cn('flex flex-col shrink-0', inline && 'md:min-w-32')}>
          <span className="urdu-text text-[15px] font-semibold text-ink">{urduLabel}</span>
          {otherLabel && <span className="text-[11px] uppercase tracking-wide text-ink/60">{otherLabel}</span>}
        </label>
      )}
      <div className="relative flex-1 min-w-0">
        {fieldType === 'textarea' ? (
          <textarea rows={rows} {...inputProps} />
        ) : (
          <input
            type={fieldType === 'datetime' ? 'datetime-local' : fieldType === 'number' ? 'text' : fieldType}
            inputMode={fieldType === 'number' ? 'numeric' : undefined}
            {...inputProps}
          />
        )}

        <div
          className={cn(
            'no-print absolute -top-3.5 end-0 z-10 flex items-center gap-0.5 rounded-md border bg-card p-0.5 text-card-foreground shadow-sm transition-opacity',
            isActive ? 'opacity-100' : 'opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto group-focus-within:opacity-100 group-focus-within:pointer-events-auto',
          )}
          role="toolbar"
          aria-label={`${label ?? urduLabel} tools`}
        >
          <ToolButton title={t('voiceInput')} onClick={() => requestAssistant('', path)}>
            <Mic className="size-3.5" />
          </ToolButton>
          {isText && (
            <>
              <ToolButton title={t('aiRewrite')} disabled={busy !== null} onClick={() => runTransform('rewrite', lang, t('aiRewrite'))}>
                {busy === 'rewrite' ? <Loader2 className="size-3.5 animate-spin" /> : <Sparkles className="size-3.5 text-brass" />}
              </ToolButton>
              <DropdownMenu>
                <DropdownMenuTrigger render={<button type="button" title={t('aiTranslate')} className={toolClass} />}>
                  {busy === 'translate' ? <Loader2 className="size-3.5 animate-spin" /> : <Languages className="size-3.5" />}
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => runTransform('translate', 'ur', `${t('aiTranslate')} → اردو`)}>→ اردو (Urdu)</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => runTransform('translate', 'en', `${t('aiTranslate')} → English`)}>→ English</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => runTransform('translate', 'roman', `${t('aiTranslate')} → Roman Urdu`)}>→ Roman Urdu</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <DropdownMenu>
                <DropdownMenuTrigger render={<button type="button" title={t('aiImprove')} className={toolClass} />}>
                  {busy && !['rewrite', 'translate'].includes(busy) ? <Loader2 className="size-3.5 animate-spin" /> : <Wand2 className="size-3.5" />}
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => runTransform('improve', lang, t('aiImprove'))}>{lang === 'ur' ? 'بہتر کریں' : 'Improve'}</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => runTransform('grammar', lang, t('aiImprove'))}>{lang === 'ur' ? 'گرامر درست کریں' : 'Correct grammar'}</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => runTransform('concise', lang, t('aiImprove'))}>{lang === 'ur' ? 'مختصر کریں' : 'Make concise'}</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => runTransform('detailed', lang, t('aiImprove'))}>{lang === 'ur' ? 'تفصیلی کریں' : 'Make more detailed'}</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => runTransform('chronological', lang, t('aiImprove'))}>{lang === 'ur' ? 'تاریخ وار ترتیب' : 'Organise chronologically'}</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          )}
          <ToolButton
            title={t('copy')}
            onClick={() => {
              void navigator.clipboard.writeText(value)
              toast.success(t('copy'))
            }}
          >
            <Copy className="size-3.5" />
          </ToolButton>
          <ToolButton title={t('paste')} onClick={paste}>
            <ClipboardPaste className="size-3.5" />
          </ToolButton>
          <ToolButton title={t('clear')} onClick={() => setField(path, '')}>
            <Eraser className="size-3.5" />
          </ToolButton>
          {isDraft && (
            <ToolButton title="Accept AI draft" onClick={() => acceptDraft(path)} className="text-brass">
              <Check className="size-3.5" />
            </ToolButton>
          )}
        </div>
      </div>

      {preview && (
        <AiPreviewDialog
          open
          title={preview.title}
          original={value}
          draft={preview.draft}
          onCancel={() => setPreview(null)}
          onAccept={(text) => {
            setField(path, text, { aiDraft: true })
            setPreview(null)
          }}
        />
      )}
    </div>
  )
}

const toolClass =
  'inline-flex size-7 items-center justify-center rounded-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground disabled:opacity-50'

function ToolButton({
  title,
  onClick,
  children,
  disabled,
  className,
}: {
  title: string
  onClick: () => void
  children: React.ReactNode
  disabled?: boolean
  className?: string
}) {
  return (
    <button type="button" title={title} aria-label={title} onClick={onClick} disabled={disabled} className={cn(toolClass, className)}>
      {children}
    </button>
  )
}
