'use client'

import { FormField } from './form-field'
import { useReport } from './report-provider'
import { useLang } from '@/components/lang-provider'
import { Button } from '@/components/ui/button'
import { Plus, Trash2 } from 'lucide-react'
import { PAGE_FORM_NUMBERS } from '@/lib/report-schema'

const COLUMNS: { key: string; no: string; label: string; group?: boolean }[] = [
  { key: 'complainant', no: '۱', label: 'نام و ولدیت و سکونت مستغیث' },
  { key: 'accusedAbsconding', no: '۲', label: 'اشتہاری / مفرور', group: true },
  { key: 'accusedInCustody', no: '۳', label: 'زیر حراست', group: true },
  { key: 'accusedOnBail', no: '۴', label: 'بر ضمانت', group: true },
  { key: 'caseProperty', no: '۵', label: 'مال مقدمہ' },
  { key: 'witnesses', no: '۶', label: 'نام و پتہ گواہان' },
  { key: 'briefFacts', no: '۷', label: 'مختصر حالات و کیفیت جرم' },
]

/**
 * Digital reproduction of the Police Challan Form u/s 173 CrPC —
 * فارم چالان پولیس زیر دفعہ ۱۷۳ ض ف. Header lines followed by the seven
 * numbered columns of the paper form (columns 2–4 grouped under "ملزمان").
 */
export function PageTwo() {
  const { data, addRow, removeRow } = useReport()
  const { t } = useLang()

  return (
    <section dir="rtl" className="form-sheet mx-auto w-full max-w-6xl rounded-sm px-4 py-6 sm:px-8 sm:py-8 print-page" aria-labelledby="p2-title">
      <header className="flex flex-col gap-3">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div className="flex items-end gap-2 w-full sm:w-64">
            <span className="urdu-text text-base font-semibold shrink-0">ضلع</span>
            <FormField path="page2.district" hideLabel />
          </div>
          <p className="urdu-text text-sm text-ink/80">{PAGE_FORM_NUMBERS[2]}</p>
        </div>
        <h1 id="p2-title" className="urdu-text text-center text-3xl font-bold">
          فارم چالان پولیس زیر دفعہ ۱۷۳ ض ف
        </h1>
        <div className="grid grid-cols-1 gap-x-8 gap-y-3 sm:grid-cols-2 lg:grid-cols-5">
          <div className="flex items-end gap-2">
            <span className="urdu-text text-base font-semibold shrink-0">تھانہ</span>
            <FormField path="page2.policeStation" hideLabel />
          </div>
          <div className="flex items-end gap-2">
            <span className="urdu-text text-base font-semibold shrink-0">مقدمہ نمبر</span>
            <FormField path="page2.caseNumber" hideLabel inputClassName="text-center" />
          </div>
          <div className="flex items-end gap-2">
            <span className="urdu-text text-base font-semibold shrink-0">جرم</span>
            <FormField path="page2.offence" hideLabel />
          </div>
          <div className="flex items-end gap-2">
            <span className="urdu-text text-base font-semibold shrink-0">مورخہ</span>
            <FormField path="page2.caseDate" hideLabel type="date" />
          </div>
          <div className="flex items-end gap-2">
            <span className="urdu-text text-base font-semibold shrink-0">تاریخ چالان</span>
            <FormField path="page2.challanDate" hideLabel type="date" />
          </div>
        </div>
      </header>

      {/* Desktop / tablet: real 7-column table */}
      <div className="mt-8 hidden lg:block overflow-x-auto">
        <table className="w-full table-fixed border-collapse border-2 rule text-sm">
          <colgroup>
            <col className="w-[13%]" />
            <col className="w-[12%]" />
            <col className="w-[11%]" />
            <col className="w-[11%]" />
            <col className="w-[12%]" />
            <col className="w-[14%]" />
            <col />
          </colgroup>
          <thead>
            <tr>
              <th rowSpan={2} className="border rule px-2 py-2 urdu-text font-semibold align-bottom leading-loose">
                نام و ولدیت و سکونت مستغیث
              </th>
              <th colSpan={3} className="border rule px-2 py-1 urdu-text font-semibold leading-loose">
                نام و ولدیت و سکونت ملزمان
              </th>
              <th rowSpan={2} className="border rule px-2 py-2 urdu-text font-semibold align-bottom leading-loose">
                مال مقدمہ
              </th>
              <th rowSpan={2} className="border rule px-2 py-2 urdu-text font-semibold align-bottom leading-loose">
                نام و پتہ گواہان
              </th>
              <th rowSpan={2} className="border rule px-2 py-2 urdu-text font-semibold align-bottom leading-loose">
                مختصر حالات و کیفیت جرم
              </th>
            </tr>
            <tr>
              <th className="border rule px-2 py-1 urdu-text font-medium">اشتہاری / مفرور</th>
              <th className="border rule px-2 py-1 urdu-text font-medium">زیر حراست</th>
              <th className="border rule px-2 py-1 urdu-text font-medium">بر ضمانت</th>
            </tr>
            <tr>
              {COLUMNS.map((c, ci) => (
                <th key={c.key} className="border rule py-1 text-center font-mono text-xs font-semibold" dir="ltr">
                  {ci + 1}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.page2.rows.map((_, i) => (
              <tr key={i} className="group/row">
                {COLUMNS.map((c, ci) => (
                  <td key={c.key} className="relative border rule p-1 align-top">
                    <FormField
                      path={`page2.rows[${i}].${c.key}`}
                      hideLabel
                      type="textarea"
                      rows={8}
                      label={`${c.label} #${i + 1}`}
                      inputClassName="border-0 text-[13px] min-h-40"
                    />
                    {ci === COLUMNS.length - 1 && data.page2.rows.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeRow('page2.rows', i)}
                        aria-label={t('removeRow')}
                        className="no-print absolute bottom-1 left-1 rounded-sm p-1 text-ink/50 opacity-0 hover:text-destructive group-hover/row:opacity-100 focus:opacity-100"
                      >
                        <Trash2 className="size-4" />
                      </button>
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Phone / small tablet: each row becomes a numbered stack */}
      <div className="mt-8 flex flex-col gap-6 lg:hidden">
        {data.page2.rows.map((_, i) => (
          <div key={i} className="relative rounded-sm border-2 rule p-3 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <span className="urdu-text text-sm font-semibold text-ink/70">سطر {i + 1}</span>
              {data.page2.rows.length > 1 && (
                <button type="button" onClick={() => removeRow('page2.rows', i)} aria-label={t('removeRow')} className="no-print rounded-sm p-1 text-ink/50 hover:text-destructive">
                  <Trash2 className="size-4" />
                </button>
              )}
            </div>
            {COLUMNS.map((c) => (
              <div key={c.key} className="flex flex-col gap-1">
                <span className="urdu-text text-sm font-semibold text-ink">
                  {c.no}۔ {c.group ? `ملزمان ${c.label}` : c.label}
                </span>
                <FormField path={`page2.rows[${i}].${c.key}`} hideLabel type="textarea" rows={3} label={`${c.label} #${i + 1}`} />
              </div>
            ))}
          </div>
        ))}
      </div>

      <div className="no-print mt-4 flex justify-start">
        <Button type="button" variant="outline" size="sm" onClick={() => addRow('page2.rows')} className="gap-2 bg-transparent border-ink/40 text-ink hover:bg-ink/5">
          <Plus className="size-4" aria-hidden="true" />
          <span className="urdu-text">{t('addRow')}</span>
        </Button>
      </div>
    </section>
  )
}
