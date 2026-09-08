'use client'

import ReportZimniBairuni from './templates/report-zimni-bairuni'
import type { ZimniBairuniData } from './templates/types'
import { useReport } from './report-provider'

export function PageOne({ editable = true }: { editable?: boolean }) {
  const { data, setMany } = useReport()
  const form: ZimniBairuniData = {
    zimniNumber: data.page1.zimniNumber,
    thana: data.page1.policeStation,
    district: data.page1.district,
    firNumber: data.page1.firNumber,
    reportDate: data.page1.year,
    occurrenceDateTimePlace: [data.page1.occurrenceDate, data.page1.occurrenceTime, data.page1.occurrencePlace].filter(Boolean).join(' '),
    offenceSections: data.page1.offence,
    receivedAtThanaDateTime: [data.page1.receivedAtStationDate, data.page1.receivedAtStationTime].filter(Boolean).join(' '),
    dispatchedFromThanaDateTime: [data.page1.dispatchedFromStationDate, data.page1.dispatchedFromStationTime].filter(Boolean).join(' '),
    entries: data.page1.entries.map((entry, index) => ({ srNo: String(index + 1), actionDateTime: entry.actionDateTime, reportNumber: entry.serialNumber, details: entry.investigationDetails })),
  }

  return <ReportZimniBairuni data={form} readOnly={!editable} onChange={(next) => setMany([
    { path: 'page1.zimniNumber', value: next.zimniNumber },
    { path: 'page1.policeStation', value: next.thana },
    { path: 'page1.district', value: next.district },
    { path: 'page1.firNumber', value: next.firNumber },
    { path: 'page1.year', value: next.reportDate },
    { path: 'page1.offence', value: next.offenceSections },
    { path: 'page1.entries.0.actionDateTime', value: next.entries[0]?.actionDateTime ?? '' },
    { path: 'page1.entries.0.serialNumber', value: next.entries[0]?.reportNumber ?? '' },
    { path: 'page1.entries.0.investigationDetails', value: next.entries[0]?.details ?? '' },
  ])} />
}

export default PageOne
