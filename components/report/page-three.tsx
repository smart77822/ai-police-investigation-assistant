'use client'

import { FormField } from './form-field'
import { useReport } from './report-provider'
import { useLang } from '@/components/lang-provider'
import { Button } from '@/components/ui/button'
import { Plus, Trash2 } from 'lucide-react'
import { PAGE_FORM_NUMBERS } from '@/lib/report-schema'

/**
 * Digital reproduction of Police Form 25-54(II) — رپورٹ ضمنی اندرونی.
 * The paper has a header rule, a book-number line and a wide ruled body with a
 * narrow vertical margin column on the right; each entry here is one
 * margin + body pair.
 */
export function PageThree() {
  const { data, addRow, removeRow } = useReport()
  const { t } = useLang()

  return (
    <section dir="rtl" className="form-sheet mx-auto w-full max-w-4xl rounded-sm px-4 py-6 sm:px-8 sm:py-8 print-page" aria-labelledby="p3-title">
      <header className="grid grid-cols-1 sm:grid-cols-3 items-end gap-3 border-b-2 rule pb-4">
        <div className="flex items-end gap-2 sm:order-1">
          <span className="urdu-text text-base font-semibold shrink-0">بک نمبر</span>
          <FormField path="page3.bookNumber" hideLabel inputClassName="text-center" />
        </div>
        <h1 id="p3-title" className="urdu-text text-center text-3xl font-bold sm:order-2">
          رپورٹ ضمنی اندرونی
        </h1>
        <p className="urdu-text text-sm text-ink/80 sm:order-3 sm:text-left">{PAGE_FORM_NUMBERS[3]}</p>
      </header>

      <div className="mt-2 grid grid-cols-1 md:grid-cols-[8rem_minmax(0,1fr)]">
        {data.page3.entries.map((_, i) => (
          <div key={i} className="group/row contents">
            <div className="md:border-s-2 rule px-2 pt-4 pb-1 md:pb-4 flex flex-col gap-1">
              <span className="urdu-text text-xs text-ink/70">حاشیہ (تاریخ / نمبر)</span>
              <FormField path={`page3.entries[${i}].margin`} hideLabel type="text" label={`Margin #${i + 1}`} inputClassName="text-sm" />
            </div>
            <div className="relative px-2 pb-4 md:pt-4 border-b rule/30 md:border-b-0">
              <FormField
                path={`page3.entries[${i}].text`}
                hideLabel
                type="textarea"
                rows={10}
                label={`Inner zimni body #${i + 1}`}
                inputClassName="border-0 bg-[repeating-linear-gradient(transparent,transparent_calc(2.4em_-_1px),color-mix(in_oklch,var(--ink)_28%,transparent)_calc(2.4em_-_1px),color-mix(in_oklch,var(--ink)_28%,transparent)_2.4em)] leading-[2.4] text-[15px] min-h-64"
              />
              {data.page3.entries.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeRow('page3.entries', i)}
                  aria-label={t('removeRow')}
                  className="no-print absolute bottom-5 left-3 rounded-sm p-1 text-ink/50 opacity-0 hover:text-destructive group-hover/row:opacity-100 focus:opacity-100"
                >
                  <Trash2 className="size-4" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="no-print mt-2 flex justify-start">
        <Button type="button" variant="outline" size="sm" onClick={() => addRow('page3.entries')} className="gap-2 bg-transparent border-ink/40 text-ink hover:bg-ink/5">
          <Plus className="size-4" aria-hidden="true" />
          <span className="urdu-text">{t('addRow')}</span>
        </Button>
      </div>
    </section>
  )
}
