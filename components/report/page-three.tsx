"use client"

import { ExactTemplatePage } from "@/components/report/exact-template-page"

export function PageThree({ editable = true }: { editable?: boolean }) {
  return <ExactTemplatePage page={3} editable={editable} />
}
