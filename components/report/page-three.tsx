'use client'

import ReportZimniAndaruni from './templates/report-zimni-andaruni'
import type { ZimniAndaruniData } from './templates/types'
import { useReport } from './report-provider'

export function PageThree({ editable = true }: { editable?: boolean }) {
  const { data, setMany } = useReport()
  const form: ZimniAndaruniData = {
    bookNumber: data.page3.bookNumber,
    zimniNumber: data.page1.zimniNumber,
    thana: data.page1.policeStation,
    firNumber: data.page1.firNumber,
    occurrenceDateTimePlace: [data.page1.occurrenceDate, data.page1.occurrenceTime, data.page1.occurrencePlace].filter(Boolean).join(' '),
    offence: data.page1.offence,
    receivedAtThanaDateTime: [data.page1.receivedAtStationDate, data.page1.receivedAtStationTime].filter(Boolean).join(' '),
    dispatchedFromThanaDateTime: [data.page1.dispatchedFromStationDate, data.page1.dispatchedFromStationTime].filter(Boolean).join(' '),
    lines: data.page3.entries.map((entry, index) => ({ reportNumber: String(index + 1), actionDateTime: '', text: entry.text })),
  }

  return <ReportZimniAndaruni data={form} readOnly={!editable} onChange={(next) => setMany([
    { path: 'page3.bookNumber', value: next.bookNumber },
    { path: 'page1.zimniNumber', value: next.zimniNumber },
    { path: 'page1.policeStation', value: next.thana },
    { path: 'page1.firNumber', value: next.firNumber },
    { path: 'page1.offence', value: next.offence },
    { path: 'page3.entries[0].text', value: next.lines[0]?.text ?? '' },
  ])} />
}

export default PageThree
