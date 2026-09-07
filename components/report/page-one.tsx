'use client'

import { FormField } from './form-field'
import { useReport } from './report-provider'
import { useLang } from '@/components/lang-provider'
import { Button } from '@/components/ui/button'
import { Plus, Trash2 } from 'lucide-react'
import { PAGE_FORM_NUMBERS } from '@/lib/report-schema'

/**
 * Digital reproduction of Police Form 25-54(I) — رپورٹ ضمنی بیرونی.
 * Layout mirrors the paper: three-part header line, two header columns,
 * then the ruled three-column table headed حالات تفتیش.
 */
export function PageOne() {
  const { data, addRow, removeRow } = useReport()
  const { t } = useLang()

  return (
    <section dir="rtl" className="form-sheet mx-auto w-full max-w-4xl rounded-sm px-4 py-6 sm:px-8 sm:py-8 print-page" aria-labelledby="p1-title">
      <header className="grid grid-cols-1 sm:grid-cols-3 items-start gap-3">
        <div className="flex items-end gap-2 sm:order-1">
          <span className="urdu-text text-base font-semibold shrink-0">بک نمبر</span>
          <FormField path="page1.bookNumber" hideLabel inputClassName="text-center" />
        </div>
        <h1 id="p1-title" className="urdu-text text-center text-3xl font-bold sm:order-2">
          رپورٹ ضمنی بیرونی
        </h1>
        <p className="urdu-text text-sm text-ink/80 sm:order-3 sm:text-left">{PAGE_FORM_NUMBERS[1]}</p>
      </header>

      <div className="mt-6 grid grid-cols-1 gap-x-10 gap-y-4 md:grid-cols-2">
        <div className="flex flex-col gap-4">
          <FormField path="page1.policeStation" inline />
          <FormField path="page1.firNumber" inline />
          <fieldset className="flex flex-col gap-2">
            <legend className="urdu-text text-[15px] font-semibold text-ink mb-1">تاریخ و مقام وقوعہ</legend>
            <div className="grid grid-cols-2 gap-3">
              <FormField path="page1.occurrenceDate" />
              <FormField path="page1.occurrenceTime" />
            </div>
            <FormField path="page1.occurrencePlace" />
          </fieldset>
          <FormField path="page1.offence" inline />
        </div>

        <div className="flex flex-col gap-4">
          <FormField path="page1.district" inline />
          <div className="grid grid-cols-2 gap-3">
            <FormField path="page1.year" />
            <FormField path="page1.zimniNumber" />
          </div>
          <fieldset className="flex flex-col gap-2">
            <legend className="urdu-text text-[15px] font-semibold text-ink mb-1">تھانہ میں موصول ہونے کا وقت و تاریخ</legend>
            <div className="grid grid-cols-2 gap-3">
              <FormField path="page1.receivedAtStationTime" hideLabel type="time" label="Time received" />
              <FormField path="page1.receivedAtStationDate" hideLabel type="date" label="Date received" />
            </div>
          </fieldset>
          <fieldset className="flex flex-col gap-2">
            <legend className="urdu-text text-[15px] font-semibold text-ink mb-1">تھانہ سے روانگی کا وقت و تاریخ</legend>
            <div className="grid grid-cols-2 gap-3">
              <FormField path="page1.dispatchedFromStationTime" hideLabel type="time" label="Time dispatched" />
              <FormField path="page1.dispatchedFromStationDate" hideLabel type="date" label="Date dispatched" />
            </div>
          </fieldset>
        </div>
      </div>

      <div className="mt-8 border-y-2 rule">
        <div className="grid grid-cols-[minmax(0,1fr)] md:grid-cols-[9rem_7rem_minmax(0,1fr)] border-b-2 rule">
          <div className="hidden md:flex items-center justify-center border-s rule px-2 py-3 urdu-text text-sm font-semibold text-center leading-loose">
            تاریخ مع وقت جس پر کارروائی کی گئی
          </div>
          <div className="hidden md:flex items-center justify-center border-s rule px-2 py-3 urdu-text text-sm font-semibold text-center leading-loose">
            رپورٹ نمبر شمار سلسلہ وار
          </div>
          <h2 className="urdu-text text-center text-3xl font-bold py-3">حالات تفتیش</h2>
        </div>

        {data.page1.entries.map((_, i) => (
          <div key={i} className="group/row relative grid grid-cols-1 md:grid-cols-[9rem_7rem_minmax(0,1fr)] border-b rule/40 last:border-b-0">
            <div className="md:border-s rule px-2 py-3 flex flex-col gap-1">
              <span className="md:hidden urdu-text text-xs text-ink/70">تاریخ مع وقت جس پر کارروائی کی گئی</span>
              <FormField path={`page1.entries[${i}].actionDateTime`} hideLabel type="datetime" label={`Action date/time #${i + 1}`} inputClassName="text-xs" />
            </div>
            <div className="md:border-s rule px-2 py-3 flex flex-col gap-1">
              <span className="md:hidden urdu-text text-xs text-ink/70">رپورٹ نمبر شمار سلسلہ وار</span>
              <FormField path={`page1.entries[${i}].serialNumber`} hideLabel type="text" label={`Serial #${i + 1}`} inputClassName="text-center" />
            </div>
            <div className="px-2 py-3 flex flex-col gap-1">
              <span className="md:hidden urdu-text text-xs text-ink/70">حالات تفتیش</span>
              <FormField path={`page1.entries[${i}].investigationDetails`} hideLabel type="textarea" rows={6} label={`Investigation details #${i + 1}`} inputClassName="border-0 border-b bg-transparent leading-[2.4] ruled" />
            </div>
            {data.page1.entries.length > 1 && (
              <button
                type="button"
                onClick={() => removeRow('page1.entries', i)}
                aria-label={t('removeRow')}
                className="no-print absolute top-2 left-2 rounded-sm p-1 text-ink/50 opacity-0 transition-opacity hover:text-destructive group-hover/row:opacity-100 focus:opacity-100"
              >
                <Trash2 className="size-4" />
              </button>
            )}
          </div>
        ))}
      </div>

      <div className="no-print mt-4 flex justify-start">
        <Button type="button" variant="outline" size="sm" onClick={() => addRow('page1.entries')} className="gap-2 bg-transparent border-ink/40 text-ink hover:bg-ink/5">
          <Plus className="size-4" aria-hidden="true" />
          <span className="urdu-text">{t('addRow')}</span>
        </Button>
      </div>
    </section>
  )
}
