"use client"

import { FormField } from "@/components/report/form-field"

type Field = {
  id: string
  label: string
  type?: "text" | "textarea" | "date" | "time"
  className?: string
}

const pageOne: Field[] = [
  { id: "page1.bookNumber", label: "بک نمبر" },
  { id: "page1.policeStation", label: "تھانہ" },
  { id: "page1.district", label: "ضلع" },
  { id: "page1.firNumber", label: "ابتدائی اطلاعی رپورٹ نمبر" },
  { id: "page1.occurrenceDate", label: "تاریخ وقوعہ", type: "date" },
  { id: "page1.occurrenceTime", label: "وقت وقوعہ", type: "time" },
  { id: "page1.occurrencePlace", label: "مقام وقوعہ" },
  { id: "page1.offence", label: "جرم" },
  { id: "page1.receivedAtStationDate", label: "تھانہ میں وصولی کی تاریخ", type: "date" },
  { id: "page1.receivedAtStationTime", label: "تھانہ میں وصولی کا وقت", type: "time" },
  { id: "page1.dispatchedFromStationDate", label: "تھانہ سے روانگی کی تاریخ", type: "date" },
  { id: "page1.dispatchedFromStationTime", label: "تھانہ سے روانگی کا وقت", type: "time" },
  { id: "page1.entries[0].investigationDetails", label: "حالات مقدمہ اور کارروائی کی مکمل تفصیل", type: "textarea", className: "md:col-span-2" },
]

const pageTwo: Field[] = [
  { id: "page2.district", label: "ضلع" },
  { id: "page2.policeStation", label: "تھانہ" },
  { id: "page2.caseNumber", label: "مقدمہ نمبر" },
  { id: "page2.offence", label: "جرم / دفعات" },
  { id: "page2.caseDate", label: "مقدمہ کی تاریخ", type: "date" },
  { id: "page2.challanDate", label: "چالان / رپورٹ کی تاریخ", type: "date" },
  { id: "page2.rows[0].briefFacts", label: "تحقیقات، گواہان، دستاویزات اور مختصر حقائق", type: "textarea", className: "md:col-span-2" },
]

const pageThree: Field[] = [
  { id: "page3.bookNumber", label: "بک نمبر" },
  { id: "page3.district", label: "ضلع" },
  { id: "page3.policeStation", label: "تھانہ" },
  { id: "page3.caseNumber", label: "مقدمہ نمبر" },
  { id: "page3.offence", label: "جرم / دفعات" },
  { id: "page3.complainant", label: "مدعی / درخواست گزار" },
  { id: "page3.accused", label: "ملزمان" },
  { id: "page3.entries[0].margin", label: "حاشیہ / ملاحظات" },
  { id: "page3.entries[0].text", label: "حالات مقدمہ، تفتیشی کارروائی اور نتیجہ", type: "textarea", className: "md:col-span-2" },
]

const titles = {
  1: { ur: "رپورٹ مخفی بیروی", en: "ابتدائی اطلاعی رپورٹ" },
  2: { ur: "رپورٹ مخفی بیروی — جاری", en: "تحقیقات اور کارروائی" },
  3: { ur: "رپورٹ مخفی بیروی — تفصیلی جدول", en: "گواہان، دفعات اور حتمی تفصیل" },
} as const

export function ExactTemplatePage({ page, editable = true }: { page: 1 | 2 | 3; image?: string; editable?: boolean }) {
  const fields = page === 1 ? pageOne : page === 2 ? pageTwo : pageThree
  const title = titles[page]

  return (
    <section className="pdf-page form-sheet mx-auto w-full max-w-[900px] overflow-hidden rounded-xl border border-emerald-950/15 bg-[#fffdf7] shadow-xl" dir="rtl">
      <header className="border-b-4 border-emerald-950 bg-emerald-950 px-5 py-6 text-center text-white sm:px-10">
        <p className="mb-2 text-xs font-medium tracking-[0.22em] text-emerald-200">POLICE INVESTIGATION REPORT · PAGE {page} OF 3</p>
        <h1 className="urdu-text text-3xl font-bold sm:text-5xl">{title.ur}</h1>
        <p className="mt-2 text-sm text-emerald-100">{title.en}</p>
      </header>

      <div className="border-b border-emerald-950/15 bg-[#f4eee1] px-5 py-4 sm:px-10">
        <div className="grid gap-4 sm:grid-cols-3">
          <div><p className="urdu-text text-sm font-bold text-emerald-950">محکمہ / دفتر</p><div className="mt-2 border-b-2 border-emerald-950/45" /></div>
          <div><p className="urdu-text text-sm font-bold text-emerald-950">رپورٹ کی حیثیت</p><div className="mt-2 border-b-2 border-emerald-950/45" /></div>
          <div><p className="urdu-text text-sm font-bold text-emerald-950">صفحہ {page}</p><div className="mt-2 border-b-2 border-emerald-950/45" /></div>
        </div>
      </div>

      <div className="grid gap-x-8 gap-y-6 px-5 py-7 sm:grid-cols-2 sm:px-10 sm:py-10">
        {fields.map((field) => (
          <div key={field.id} className={field.className}>
            <FormField
              path={field.id}
              label={field.label}
              type={field.type}
              rows={field.type === "textarea" ? 10 : 4}
              inputClassName="border-0 border-b-2 border-emerald-950/45 bg-transparent px-0 py-2 text-base font-semibold text-emerald-950 shadow-none focus-visible:border-emerald-700 focus-visible:ring-0"
              className="gap-2"
            />
          </div>
        ))}
      </div>

      <footer className="border-t border-emerald-950/15 bg-[#f4eee1] px-5 py-5 sm:px-10">
        <div className="grid gap-6 sm:grid-cols-3">
          {['تحریر کنندہ کے دستخط', 'تفتیشی افسر کے دستخط', 'تاریخ و وقت'].map((label) => (
            <div key={label}><p className="urdu-text text-sm font-bold text-emerald-950">{label}</p><div className="mt-6 border-b-2 border-emerald-950/45" /></div>
          ))}
        </div>
      </footer>
    </section>
  )
}

export { FORM_IMAGES } from "./form-assets"
