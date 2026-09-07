'use client'

import { useEffect, useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { useLang } from '@/components/lang-provider'
import { Sparkles } from 'lucide-react'

interface Props {
  open: boolean
  title: string
  original: string
  draft: string
  onAccept: (text: string) => void
  onCancel: () => void
}

export function AiPreviewDialog({ open, title, original, draft, onAccept, onCancel }: Props) {
  const { t } = useLang()
  const [text, setText] = useState(draft)
  const [editing, setEditing] = useState(false)

  useEffect(() => {
    setText(draft)
    setEditing(false)
  }, [draft, open])

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onCancel()}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="size-4 text-brass" aria-hidden="true" />
            {title}
          </DialogTitle>
          <DialogDescription>{t('aiDraft')}</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <Badge variant="outline" className="w-fit">{t('factProvided')}</Badge>
            <p dir="auto" className="rounded-md border bg-muted/40 p-3 text-sm leading-relaxed whitespace-pre-wrap urdu-auto max-h-64 overflow-y-auto">
              {original || '—'}
            </p>
          </div>
          <div className="flex flex-col gap-1.5">
            <Badge className="w-fit bg-brass text-brass-foreground hover:bg-brass">{t('aiFormatting')}</Badge>
            {editing ? (
              <Textarea dir="auto" value={text} onChange={(e) => setText(e.target.value)} rows={8} className="text-sm leading-relaxed" />
            ) : (
              <p dir="auto" className="rounded-md border border-brass/50 bg-brass/10 p-3 text-sm leading-relaxed whitespace-pre-wrap max-h-64 overflow-y-auto">
                {text}
              </p>
            )}
          </div>
        </div>
        <DialogFooter className="gap-2">
          <Button variant="ghost" onClick={onCancel}>
            {t('cancel')}
          </Button>
          <Button variant="outline" onClick={() => setEditing((e) => !e)}>
            {t('edit')}
          </Button>
          <Button onClick={() => onAccept(text)}>{t('confirmInsert')}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
