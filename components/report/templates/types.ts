import type { ReactNode } from 'react'

export type PoliceFormProps<T> = {
  data: T
  onChange: (data: T) => void
  readOnly?: boolean
}

export type ZimniBairuniEntry = {
  srNo: string
  actionDateTime: string
  reportNumber: string
  details: string
}

export type ZimniBairuniData = {
  zimniNumber: string
  thana: string
  district: string
  firNumber: string
  reportDate: string
  occurrenceDateTimePlace: string
  offenceSections: string
  receivedAtThanaDateTime: string
  dispatchedFromThanaDateTime: string
  entries: ZimniBairuniEntry[]
}

export type ZimniAndaruniLine = {
  reportNumber: string
  actionDateTime: string
  text: string
}

export type ZimniAndaruniData = {
  bookNumber: string
  zimniNumber: string
  thana: string
  firNumber: string
  occurrenceDateTimePlace: string
  offence: string
  receivedAtThanaDateTime: string
  dispatchedFromThanaDateTime: string
  lines: ZimniAndaruniLine[]
}

export type ChallanEntry = {
  srNo: string
  accused: {
    nameAddressCapacity: string
    proclaimedOffenders: string
    inCustody: string
    onBail: string
  }
  caseProperty: string
  witnesses: string
  briefFacts: string
}

export type ChallanFormData = {
  thana: string
  district: string
  caseNumber: string
  offence: string
  date: string
  challanDate: string
  year: string
  entries: ChallanEntry[]
}

export type TemplateSlotProps = { children?: ReactNode }

// Compatibility declarations allow the copied sample templates to run as standalone report components.
