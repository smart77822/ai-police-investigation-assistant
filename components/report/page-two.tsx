"use client"

import { ExactTemplatePage, FORM_IMAGES } from "@/components/report/exact-template-page"

export function PageTwo({ editable = true }: { editable?: boolean }) {
  return <ExactTemplatePage page={2} image={FORM_IMAGES.pageTwo} editable={editable} />
}
