'use client'

import { useMemo, useRef, useState } from 'react'
import { Download, FileDown, Printer } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useReport } from './report-provider'
import { flattenReport, getFieldLabel } from '@/lib/report-schema'
import { useLang } from '@/components/lang-provider'

export function ReportPreview() {
  const { data, id } = useReport()
  const { lang } = useLang()
  const [isDownloading, setIsDownloading] = useState(false)
  const reportRef = useRef<HTMLElement>(null)
  const fields = useMemo(() => flattenReport(data), [data])

  async function downloadPdf() {
    if (!reportRef.current) return
    setIsDownloading(true)
    try {
      const html2pdf = (await import('html2pdf.js')).default
      await html2pdf()
        .set({
          margin: [8, 8, 8, 8],
          filename: `investigation-report-${id}.pdf`,
          image: { type: 'jpeg', quality: 0.98 },
          html2canvas: { scale: 2, useCORS: true, backgroundColor: '#ffffff' },
          jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
          pagebreak: { mode: ['css', 'legacy'] },
        } as never)
        .from(reportRef.current)
        .save()
    } finally {
      setIsDownloading(false)
    }
  }

  function downloadText() {
    const text = fields.map((f) => `${getFieldLabel(f.id, lang)}: ${f.value || '[INFORMATION REQUIRED]'}`).join('\n')
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `investigation-report-${id}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="min-h-dvh bg-paper-texture p-4 sm:p-8">
      <div className="no-print mx-auto mb-5 flex max-w-5xl flex-wrap items-center justify-between gap-3">
        <div><p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Final review</p><h1 className="mt-1 text-2xl font-semibold">Report preview</h1></div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={() => window.print()} className="gap-2"><Printer className="size-4" />Print</Button>
          <Button onClick={downloadPdf} disabled={isDownloading} className="gap-2"><FileDown className="size-4" />{isDownloading ? 'Creating PDF…' : 'Download PDF'}</Button>
          <Button variant="secondary" onClick={downloadText} className="gap-2"><Download className="size-4" />Download text</Button>
        </div>
      </div>
      <article ref={reportRef} className="mx-auto max-w-5xl bg-white p-6 text-slate-900 shadow-xl sm:p-10" dir={lang === 'ur' ? 'rtl' : 'ltr'}>
        <header className="border-b-2 border-slate-900 pb-5 text-center"><p className="text-sm">حکومت پنجاب · پولیس ڈیپارٹمنٹ</p><h2 className="mt-2 text-2xl font-bold">AI Police Investigation Report</h2><p className="mt-1 text-sm">تفتیشی رپورٹ</p></header>
        <div className="mt-6 grid gap-x-6 gap-y-4 sm:grid-cols-2">{fields.map((field) => <div key={field.id} className="break-inside-avoid border-b border-slate-300 pb-2"><p className="text-xs font-semibold text-slate-500">{getFieldLabel(field.id, lang)}</p><p className="mt-1 whitespace-pre-wrap text-sm">{field.value || '[INFORMATION REQUIRED]'}</p></div>)}</div>
        <footer className="mt-10 border-t border-slate-300 pt-4 text-xs text-slate-500">AI-generated language is a draft. Verify all facts before official submission.</footer>
      </article>
    </div>
  )
}
