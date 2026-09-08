"use client"

import { ExactTemplatePage } from "@/components/report/exact-template-page"

export function PageTwo({ editable = true }: { editable?: boolean }) {
  return <ExactTemplatePage page={2} editable={editable} />
}
