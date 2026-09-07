"use client"

import { FormField } from "@/components/report/form-field"
import { useReport } from "@/components/report/report-provider"

export const FORM_IMAGES = {
  pageOne: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/CamScanner%2009-08-2026%2000.24_1-LedNAPqaijDJexavfOJ3gRc3zYcSZu.jpg",
  pageTwo: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/CamScanner%2009-08-2026%2000.24_3-u6LoiRiSAAVOOWpfDMfqD027q5J0F2.jpg",
  pageThree: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/CamScanner%2009-08-2026%2000.24_2-LGDX8LbE3yXZcL34TvffXNiI6Sk5zN.jpg",
}

type Overlay = { id: string; className: string; label: string; dir?: "rtl" | "ltr" }

const PAGE_ONE_OVERLAYS: Overlay[] = [
  { id: "page1.bookNumber", className: "left-[76%] top-[4.5%] w-[18%]", label: "کتب نمبر" },
  { id: "page1.policeStation", className: "left-[75%] top-[12%] w-[19%]", label: "تھانہ" },
  { id: "page1.initialReport", className: "left-[65%] top-[20%] w-[28%]", label: "ابتدائی اطلاعی رپورٹ نمبر" },
  { id: "page1.datePlace", className: "left-[62%] top-[28%] w-[31%]", label: "تاریخ و مقام وقوعہ" },
  { id: "page1.offence", className: "left-[45%] top-[34%] w-[48%]", label: "جرم" },
  { id: "page1.caseDetails", className: "left-[4%] top-[42%] w-[87%] h-[42%]", label: "حالات مقدمہ" },
]

const PAGE_TWO_OVERLAYS: Overlay[] = [
  { id: "page2.notes", className: "left-[5%] top-[18%] w-[86%] h-[67%]", label: "تفتیشی کارروائی / تفصیل" },
]

const PAGE_THREE_OVERLAYS: Overlay[] = [
  { id: "page3.district", className: "left-[73%] top-[8%] w-[18%]", label: "ضلع" },
  { id: "page3.policeStation", className: "left-[52%] top-[8%] w-[19%]", label: "تھانہ" },
  { id: "page3.caseNumber", className: "left-[30%] top-[8%] w-[19%]", label: "مقدمہ نمبر" },
  { id: "page3.offence", className: "left-[7%] top-[8%] w-[20%]", label: "جرم" },
  { id: "page3.complainant", className: "left-[71%] top-[18%] w-[21%]", label: "مدعی" },
  { id: "page3.accused", className: "left-[42%] top-[18%] w-[25%]", label: "ملزمان" },
  { id: "page3.table", className: "left-[5%] top-[34%] w-[87%] h-[52%]", label: "حالات و کارروائی" },
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
          <div key={overlay.id} className={`absolute ${overlay.className} ${overlay.id.includes("Details") || overlay.id.includes("notes") || overlay.id.includes("table") ? "h-auto" : "h-[4.5%]"}`}>
            {editable ? (
              <FormField path={overlay.id} label={overlay.label} />
            ) : (
              <div className="min-h-8 whitespace-pre-wrap bg-white/15 px-1 text-[clamp(10px,1.2vw,16px)] font-semibold leading-relaxed text-black" dir="rtl">{value}</div>
            )}
          </div>
        )
      })}
    </section>
  )
}
