"use client"

import { ExactTemplatePage, FORM_IMAGES } from "@/components/report/exact-template-page"

export function PageThree({ editable = true }: { editable?: boolean }) {
  return <ExactTemplatePage page={3} image={FORM_IMAGES.pageThree} editable={editable} />
}
