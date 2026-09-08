'use client'

import { useRef, useState } from 'react'
import { Download, FileDown, Printer } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useReport } from './report-provider'
import { useLang } from '@/components/lang-provider'
import { PageOne } from './page-one'
import { PageTwo } from './page-two'
import { PageThree } from './page-three'

export function ReportPreview() {
  const { id } = useReport()
  const { lang } = useLang()
  const [isDownloading, setIsDownloading] = useState(false)
  const reportRef = useRef<HTMLDivElement>(null)

  async function downloadPdf() {
    if (!reportRef.current) return
    setIsDownloading(true)
    try {
      const html2pdf = (await import('html2pdf.js')).default
      await html2pdf()
        .set({
          margin: 0,
          filename: `police-investigation-report-${id}.pdf`,
          image: { type: 'jpeg', quality: 0.98 },
          html2canvas: { scale: 2, useCORS: true, backgroundColor: '#ffffff', scrollY: 0 },
          jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
          pagebreak: { mode: ['css', 'legacy'], before: '.pdf-page-break' },
        } as never)
        .from(reportRef.current)
        .save()
    } finally {
      setIsDownloading(false)
    }
  }

  function printReport() {
    const previousTitle = document.title
    document.title = 'Police Investigation Report'
    document.body.classList.add('report-printing')
    window.setTimeout(() => {
      window.print()
      window.setTimeout(() => {
        document.body.classList.remove('report-printing')
        document.title = previousTitle
      }, 500)
    }, 50)
  }

  function downloadText() {
    const text = [
      'AI Police Investigation Report',
      `Report ID: ${id}`,
      '',
      'Page 1 — رپورٹ ضمنی بیرونی',
      '',
      'Page 2 — فارم چالان پولیس زیر دفعہ ۱۷۳ ض ف',
      '',
      'Page 3 — رپورٹ ضمنی اندرونی',
      '',
      'The PDF download contains the completed three-page report in the original form layout.',
    ].join('\n')
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const anchor = document.createElement('a')
    anchor.href = url
    anchor.download = `police-investigation-report-${id}.txt`
    anchor.click()
    URL.revokeObjectURL(url)
  }

  return (
    <main className="min-h-dvh bg-paper-texture p-4 sm:p-8">
      <div className="no-print mx-auto mb-5 flex max-w-6xl flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Completed report</p>
          <h1 className="mt-1 text-2xl font-semibold">Three-page report export</h1>
          <p className="mt-1 text-sm text-muted-foreground">The PDF preserves the filled official form pages, tables, numbering, and Urdu layout.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={printReport} className="gap-2"><Printer className="size-4" />Print three pages</Button>
          <Button onClick={downloadPdf} disabled={isDownloading} className="gap-2"><FileDown className="size-4" />{isDownloading ? 'Creating PDF…' : 'Save three-page PDF'}</Button>
          <Button variant="secondary" onClick={downloadText} className="gap-2"><Download className="size-4" />Download text</Button>
        </div>
      </div>

      <div ref={reportRef} dir={lang === 'ur' ? 'rtl' : 'ltr'} className="mx-auto max-w-6xl bg-white text-slate-900 shadow-xl">
        <div className="pdf-page"><PageOne /></div>
        <div className="pdf-page-break pdf-page"><PageTwo /></div>
        <div className="pdf-page-break pdf-page"><PageThree /></div>
      </div>
    </main>
  )
}
