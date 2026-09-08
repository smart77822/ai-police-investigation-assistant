"use client"

import { ExactTemplatePage } from "@/components/report/exact-template-page"

export function PageOne({ editable = true }: { editable?: boolean }) {
  return <ExactTemplatePage page={1} editable={editable} />
}
