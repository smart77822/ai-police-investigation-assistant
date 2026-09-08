'use client'

import PoliceChallanForm from './templates/police-challan-form'
import type { ChallanFormData } from './templates/types'
import { useReport } from './report-provider'

export function PageTwo({ editable = true }: { editable?: boolean }) {
  const { data, setMany } = useReport()
  const form: ChallanFormData = {
    thana: data.page2.policeStation,
    district: data.page2.district,
    caseNumber: data.page2.caseNumber,
    offence: data.page2.offence,
    date: data.page2.caseDate,
    challanDate: data.page2.challanDate,
    year: data.page2.year,
    entries: data.page2.rows.map((row, index) => ({ srNo: String(index + 1), accused: { nameAddressCapacity: row.complainant, proclaimedOffenders: row.accusedAbsconding, inCustody: row.accusedInCustody, onBail: row.accusedOnBail }, caseProperty: row.caseProperty, witnesses: row.witnesses, briefFacts: row.briefFacts })),
  }

  return <PoliceChallanForm data={form} readOnly={!editable} onChange={(next) => setMany([
    { path: 'page2.policeStation', value: next.thana }, { path: 'page2.district', value: next.district }, { path: 'page2.caseNumber', value: next.caseNumber }, { path: 'page2.offence', value: next.offence }, { path: 'page2.caseDate', value: next.date }, { path: 'page2.challanDate', value: next.challanDate }, { path: 'page2.year', value: next.year },
    { path: 'page2.rows[0].complainant', value: next.entries[0]?.accused.nameAddressCapacity ?? '' }, { path: 'page2.rows[0].accusedAbsconding', value: next.entries[0]?.accused.proclaimedOffenders ?? '' }, { path: 'page2.rows[0].accusedInCustody', value: next.entries[0]?.accused.inCustody ?? '' }, { path: 'page2.rows[0].accusedOnBail', value: next.entries[0]?.accused.onBail ?? '' }, { path: 'page2.rows[0].caseProperty', value: next.entries[0]?.caseProperty ?? '' }, { path: 'page2.rows[0].witnesses', value: next.entries[0]?.witnesses ?? '' }, { path: 'page2.rows[0].briefFacts', value: next.entries[0]?.briefFacts ?? '' },
  ])} />
}

export default PageTwo
