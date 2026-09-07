"use client"

import { ExactTemplatePage, FORM_IMAGES } from "@/components/report/exact-template-page"

export function PageOne({ editable = true }: { editable?: boolean }) {
  return <ExactTemplatePage page={1} image={FORM_IMAGES.pageOne} editable={editable} />
}
