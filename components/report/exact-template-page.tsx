"use client"

import { FormField } from "@/components/report/form-field"
import { useReport } from "@/components/report/report-provider"

export const FORM_IMAGES = {
  pageOne: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/CamScanner%2009-08-2026%2000.24_1-LedNAPqaijDJexavfOJ3gRc3zYcSZu.jpg",
  pageTwo: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/CamScanner%2009-08-2026%2000.24_3-u6LoiRiSAAVOOWpfDMfqD027q5J0F2.jpg",
  pageThree: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/CamScanner%2009-08-2026%2000.24_2-LGDX8LbE3yXZcL34TvffXNiI6Sk5zN.jpg",
}

type Overlay = { id: string; className: string; label: string; type?: 'text' | 'textarea' | 'date' | 'time' }

const PAGE_ONE_OVERLAYS: Overlay[] = [
  { id: 'page1.bookNumber', className: 'left-[72%] top-[3.2%] w-[22%]', label: 'بک نمبر' },
  { id: 'page1.policeStation', className: 'left-[72%] top-[10.5%] w-[22%]', label: 'تھانہ' },
  { id: 'page1.district', className: 'left-[5%] top-[10.5%] w-[22%]', label: 'ضلع' },
  { id: 'page1.firNumber', className: 'left-[62%] top-[17.5%] w-[32%]', label: 'ابتدائی اطلاعی رپورٹ نمبر' },
  { id: 'page1.occurrenceDate', className: 'left-[64%] top-[25%] w-[29%]', label: 'تاریخ وقوعہ', type: 'date' },
  { id: 'page1.occurrenceTime', className: 'left-[38%] top-[25%] w-[20%]', label: 'وقت وقوعہ', type: 'time' },
  { id: 'page1.occurrencePlace', className: 'left-[5%] top-[25%] w-[28%]', label: 'مقام وقوعہ' },
  { id: 'page1.offence', className: 'left-[45%] top-[32%] w-[49%]', label: 'جرم' },
  { id: 'page1.receivedAtStationDate', className: 'left-[67%] top-[39%] w-[25%]', label: 'موصول تاریخ', type: 'date' },
  { id: 'page1.receivedAtStationTime', className: 'left-[38%] top-[39%] w-[22%]', label: 'موصول وقت', type: 'time' },
  { id: 'page1.dispatchedFromStationDate', className: 'left-[67%] top-[45%] w-[25%]', label: 'روانگی تاریخ', type: 'date' },
  { id: 'page1.dispatchedFromStationTime', className: 'left-[38%] top-[45%] w-[22%]', label: 'روانگی وقت', type: 'time' },
  { id: 'page1.entries[0].investigationDetails', className: 'left-[5%] top-[54%] w-[87%] h-[35%]', label: 'حالات مقدمہ', type: 'textarea' },
]

const PAGE_TWO_OVERLAYS: Overlay[] = [
  { id: 'page2.district', className: 'left-[74%] top-[4%] w-[20%]', label: 'ضلع' },
  { id: 'page2.policeStation', className: 'left-[52%] top-[4%] w-[20%]', label: 'تھانہ' },
  { id: 'page2.caseNumber', className: 'left-[29%] top-[4%] w-[20%]', label: 'مقدمہ نمبر' },
  { id: 'page2.offence', className: 'left-[5%] top-[4%] w-[22%]', label: 'جرم' },
  { id: 'page2.caseDate', className: 'left-[70%] top-[11%] w-[24%]', label: 'مقدمہ تاریخ', type: 'date' },
  { id: 'page2.challanDate', className: 'left-[42%] top-[11%] w-[24%]', label: 'چالان تاریخ', type: 'date' },
  { id: 'page2.rows[0].briefFacts', className: 'left-[5%] top-[20%] w-[87%] h-[68%]', label: 'تفصیل', type: 'textarea' },
]

const PAGE_THREE_OVERLAYS: Overlay[] = [
  { id: 'page3.bookNumber', className: 'left-[74%] top-[3%] w-[20%]', label: 'بک نمبر' },
  { id: 'page3.district', className: 'left-[74%] top-[9%] w-[20%]', label: 'ضلع' },
  { id: 'page3.policeStation', className: 'left-[51%] top-[9%] w-[21%]', label: 'تھانہ' },
  { id: 'page3.caseNumber', className: 'left-[28%] top-[9%] w-[21%]', label: 'مقدمہ نمبر' },
  { id: 'page3.offence', className: 'left-[5%] top-[9%] w-[21%]', label: 'جرم' },
  { id: 'page3.entries[0].margin', className: 'left-[72%] top-[27%] w-[20%]', label: 'حاشیہ' },
  { id: 'page3.entries[0].text', className: 'left-[5%] top-[27%] w-[64%] h-[60%]', label: 'حالات و کارروائی', type: 'textarea' },
]

export function ExactTemplatePage({ page, image, editable = true }: { page: 1 | 2 | 3; image: string; editable?: boolean }) {
  const overlays = page === 1 ? PAGE_ONE_OVERLAYS : page === 2 ? PAGE_TWO_OVERLAYS : PAGE_THREE_OVERLAYS
  const { getField } = useReport()
  return (
    <section className="pdf-page form-sheet relative mx-auto aspect-[210/297] w-full max-w-[794px] overflow-hidden bg-white shadow-xl" dir="rtl">
      <img src={image} alt={`اصل اردو پولیس رپورٹ فارم صفحہ ${page}`} className="pointer-events-none absolute inset-0 h-full w-full object-cover" />
      {overlays.map((overlay) => {
        const value = getField(overlay.id) ?? ""
        return (
          <div key={overlay.id} className={`absolute ${overlay.className}`}>
            {editable ? (
              <FormField
                path={overlay.id}
                label={overlay.label}
                type={overlay.type}
                hideLabel
                rows={8}
                inputClassName="border-0 bg-white/60 px-1 text-[clamp(10px,1.25vw,17px)] font-semibold leading-relaxed text-black shadow-none focus-visible:ring-1 focus-visible:ring-primary/40"
              />
            ) : (
              <div className="min-h-8 whitespace-pre-wrap bg-white/20 px-1 text-[clamp(10px,1.2vw,16px)] font-semibold leading-relaxed text-black" dir="rtl">{value}</div>
            )}
          </div>
        )
      })}
    </section>
  )
}
