/**
 * Digital model of the three attached Punjab Police forms.
 *
 * Page 1 — رپورٹ ضمنی بیرونی   (Police Form No. 25-54 (I))
 * Page 2 — فارم چالان پولیس زیر دفعہ ۱۷۳ ض ف  (Challan form u/s 173 CrPC)
 * Page 3 — رپورٹ ضمنی اندرونی  (Police Form No. 25-54 (II))
 *
 * Every field below corresponds to a printed label on the forms. Nothing has
 * been added that is not on the paper, except the row-array structures needed
 * to represent the ruled tables.
 */

export type Lang = 'ur' | 'en' | 'roman'

export type FieldType = 'text' | 'number' | 'date' | 'time' | 'datetime' | 'textarea'

export interface FieldDef {
  id: string
  type: FieldType
  label: Record<Lang, string>
  /** Hint for the AI about what belongs here. */
  hint: string
  page: 1 | 2 | 3
  /** Table column fields are addressed as `page1.entries[n].investigationDetails`. */
  repeatable?: boolean
}

export interface Page1Entry {
  actionDateTime: string
  serialNumber: string
  investigationDetails: string
}

export interface Page2Row {
  complainant: string
  accusedAbsconding: string
  accusedInCustody: string
  accusedOnBail: string
  caseProperty: string
  witnesses: string
  briefFacts: string
}

export interface Page3Entry {
  margin: string
  text: string
}

export interface ReportData {
  page1: {
    bookNumber: string
    policeStation: string
    district: string
    firNumber: string
    year: string
    zimniNumber: string
    occurrenceDate: string
    occurrenceTime: string
    occurrencePlace: string
    offence: string
    receivedAtStationDate: string
    receivedAtStationTime: string
    dispatchedFromStationDate: string
    dispatchedFromStationTime: string
    entries: Page1Entry[]
  }
  page2: {
    district: string
    policeStation: string
    caseNumber: string
    offence: string
    caseDate: string
    challanDate: string
    year: string
    rows: Page2Row[]
  }
  page3: {
    bookNumber: string
    entries: Page3Entry[]
  }
}

export const emptyPage1Entry = (): Page1Entry => ({
  actionDateTime: '',
  serialNumber: '',
  investigationDetails: '',
})

export const emptyPage2Row = (): Page2Row => ({
  complainant: '',
  accusedAbsconding: '',
  accusedInCustody: '',
  accusedOnBail: '',
  caseProperty: '',
  witnesses: '',
  briefFacts: '',
})

export const emptyPage3Entry = (): Page3Entry => ({ margin: '', text: '' })

export function createEmptyReport(): ReportData {
  return {
    page1: {
      bookNumber: '',
      policeStation: '',
      district: '',
      firNumber: '',
      year: '',
      zimniNumber: '',
      occurrenceDate: '',
      occurrenceTime: '',
      occurrencePlace: '',
      offence: '',
      receivedAtStationDate: '',
      receivedAtStationTime: '',
      dispatchedFromStationDate: '',
      dispatchedFromStationTime: '',
      entries: [emptyPage1Entry()],
    },
    page2: {
      district: '',
      policeStation: '',
      caseNumber: '',
      offence: '',
      caseDate: '',
      challanDate: '',
      year: '',
      rows: [emptyPage2Row()],
    },
    page3: {
      bookNumber: '',
      entries: [emptyPage3Entry()],
    },
  }
}

export const FIELD_DEFS: FieldDef[] = [
  // ---------- PAGE 1 : رپورٹ ضمنی بیرونی ----------
  { id: 'page1.bookNumber', type: 'text', page: 1, label: { ur: 'بک نمبر', en: 'Book Number', roman: 'Book Number' }, hint: 'Register/book number printed top-right of page 1' },
  { id: 'page1.policeStation', type: 'text', page: 1, label: { ur: 'تھانہ', en: 'Police Station', roman: 'Thana' }, hint: 'Name of the police station (thana)' },
  { id: 'page1.district', type: 'text', page: 1, label: { ur: 'ضلع', en: 'District', roman: 'Zila' }, hint: 'District name' },
  { id: 'page1.firNumber', type: 'text', page: 1, label: { ur: 'ابتدائی اطلاعی رپورٹ نمبر', en: 'FIR Number', roman: 'FIR Number' }, hint: 'First Information Report number (ابتدائی اطلاعی رپورٹ). Keep digits exactly as dictated' },
  { id: 'page1.year', type: 'text', page: 1, label: { ur: 'سال (20__ء)', en: 'Year (20__)', roman: 'Saal (20__)' }, hint: 'Year of the zimni, e.g. 2026' },
  { id: 'page1.zimniNumber', type: 'text', page: 1, label: { ur: 'ضمنی نمبر', en: 'Zimni Number', roman: 'Zimni Number' }, hint: 'Serial number of this zimni (supplementary) report' },
  { id: 'page1.occurrenceDate', type: 'date', page: 1, label: { ur: 'تاریخ وقوعہ', en: 'Date of Occurrence', roman: 'Tareekh-e-Waqua' }, hint: 'Date the offence occurred (ISO yyyy-mm-dd)' },
  { id: 'page1.occurrenceTime', type: 'time', page: 1, label: { ur: 'وقت وقوعہ', en: 'Time of Occurrence', roman: 'Waqt-e-Waqua' }, hint: 'Time the offence occurred (HH:mm 24h)' },
  { id: 'page1.occurrencePlace', type: 'text', page: 1, label: { ur: 'مقام وقوعہ', en: 'Place of Occurrence', roman: 'Maqam-e-Waqua' }, hint: 'Location/address where the offence occurred' },
  { id: 'page1.offence', type: 'text', page: 1, label: { ur: 'جرم', en: 'Offence', roman: 'Jurm' }, hint: 'Offence and legal sections, e.g. 379 PPC' },
  { id: 'page1.receivedAtStationDate', type: 'date', page: 1, label: { ur: 'تھانہ میں موصول ہونے کی تاریخ', en: 'Date Received at Police Station', roman: 'Thana mein mausool honay ki tareekh' }, hint: 'Date the report was received at the police station' },
  { id: 'page1.receivedAtStationTime', type: 'time', page: 1, label: { ur: 'تھانہ میں موصول ہونے کا وقت', en: 'Time Received at Police Station', roman: 'Thana mein mausool honay ka waqt' }, hint: 'Time the report was received at the police station' },
  { id: 'page1.dispatchedFromStationDate', type: 'date', page: 1, label: { ur: 'تھانہ سے روانگی کی تاریخ', en: 'Date Dispatched from Police Station', roman: 'Thana se rawangi ki tareekh' }, hint: 'Date the report was dispatched from the police station' },
  { id: 'page1.dispatchedFromStationTime', type: 'time', page: 1, label: { ur: 'تھانہ سے روانگی کا وقت', en: 'Time Dispatched from Police Station', roman: 'Thana se rawangi ka waqt' }, hint: 'Time the report was dispatched from the police station' },
  { id: 'page1.entries[].actionDateTime', type: 'datetime', page: 1, repeatable: true, label: { ur: 'تاریخ مع وقت جس پر کارروائی کی گئی', en: 'Date & Time Action Taken', roman: 'Tareekh ma waqt jis par karwai ki gai' }, hint: 'Table column: date and time on which the investigation action was taken' },
  { id: 'page1.entries[].serialNumber', type: 'text', page: 1, repeatable: true, label: { ur: 'رپورٹ نمبر شمار سلسلہ وار', en: 'Report Serial Number', roman: 'Report number shumar silsila-war' }, hint: 'Table column: serial number of the report entry' },
  { id: 'page1.entries[].investigationDetails', type: 'textarea', page: 1, repeatable: true, label: { ur: 'حالات تفتیش', en: 'Circumstances of Investigation', roman: 'Halaat-e-Tafteesh' }, hint: 'Table column: narrative of investigation proceedings for this entry' },

  // ---------- PAGE 2 : فارم چالان پولیس زیر دفعہ ۱۷۳ ----------
  { id: 'page2.district', type: 'text', page: 2, label: { ur: 'ضلع', en: 'District', roman: 'Zila' }, hint: 'District name' },
  { id: 'page2.policeStation', type: 'text', page: 2, label: { ur: 'تھانہ', en: 'Police Station', roman: 'Thana' }, hint: 'Police station' },
  { id: 'page2.caseNumber', type: 'text', page: 2, label: { ur: 'مقدمہ نمبر', en: 'Case Number', roman: 'Muqadma Number' }, hint: 'Case (muqadma) number. Keep digits exactly as dictated' },
  { id: 'page2.offence', type: 'text', page: 2, label: { ur: 'جرم', en: 'Offence', roman: 'Jurm' }, hint: 'Offence and legal sections' },
  { id: 'page2.caseDate', type: 'date', page: 2, label: { ur: 'مورخہ', en: 'Dated', roman: 'Morkha' }, hint: 'Date of the case / FIR registration' },
  { id: 'page2.challanDate', type: 'date', page: 2, label: { ur: 'تاریخ چالان', en: 'Date of Challan', roman: 'Tareekh-e-Challan' }, hint: 'Date the challan is submitted' },
  { id: 'page2.year', type: 'text', page: 2, label: { ur: 'سال (20__ء)', en: 'Year (20__)', roman: 'Saal' }, hint: 'Year of challan' },
  { id: 'page2.rows[].complainant', type: 'textarea', page: 2, repeatable: true, label: { ur: '۱۔ نام و ولدیت و سکونت مستغیث', en: '1. Name, Parentage & Residence of Complainant', roman: '1. Naam, Waldiyat aur Sakoonat Mustaghees' }, hint: 'Column 1: complainant name, father name and residence' },
  { id: 'page2.rows[].accusedAbsconding', type: 'textarea', page: 2, repeatable: true, label: { ur: '۲۔ نام و ولدیت و سکونت ملزمان اشتہاری / مفرور', en: '2. Accused Absconding / Proclaimed', roman: '2. Mulziman Ishtihari / Mafroor' }, hint: 'Column 2: names, parentage and residence of absconding/proclaimed accused' },
  { id: 'page2.rows[].accusedInCustody', type: 'textarea', page: 2, repeatable: true, label: { ur: '۳۔ ملزمان زیر حراست', en: '3. Accused in Custody', roman: '3. Mulziman Zair-e-Hirasat' }, hint: 'Column 3: accused persons in custody' },
  { id: 'page2.rows[].accusedOnBail', type: 'textarea', page: 2, repeatable: true, label: { ur: '۴۔ ملزمان بر ضمانت', en: '4. Accused on Bail', roman: '4. Mulziman Bar-Zamanat' }, hint: 'Column 4: accused persons released on bail' },
  { id: 'page2.rows[].caseProperty', type: 'textarea', page: 2, repeatable: true, label: { ur: '۵۔ مال مقدمہ', en: '5. Case Property', roman: '5. Maal-e-Muqadma' }, hint: 'Column 5: recovered / case property including amounts' },
  { id: 'page2.rows[].witnesses', type: 'textarea', page: 2, repeatable: true, label: { ur: '۶۔ نام و پتہ گواہان', en: '6. Names & Addresses of Witnesses', roman: '6. Naam o Pata Gawahan' }, hint: 'Column 6: witnesses with addresses' },
  { id: 'page2.rows[].briefFacts', type: 'textarea', page: 2, repeatable: true, label: { ur: '۷۔ مختصر حالات و کیفیت جرم', en: '7. Brief Facts & Nature of Offence', roman: '7. Mukhtasir Halaat o Kaifiyat-e-Jurm' }, hint: 'Column 7: brief facts and nature of the offence' },

  // ---------- PAGE 3 : رپورٹ ضمنی اندرونی ----------
  { id: 'page3.bookNumber', type: 'text', page: 3, label: { ur: 'بک نمبر', en: 'Book Number', roman: 'Book Number' }, hint: 'Register/book number of the inner zimni' },
  { id: 'page3.entries[].margin', type: 'text', page: 3, repeatable: true, label: { ur: 'حاشیہ (تاریخ / نمبر)', en: 'Margin (Date / No.)', roman: 'Hashia (Tareekh / Number)' }, hint: 'Right-hand ruled margin column: date or reference for the paragraph' },
  { id: 'page3.entries[].text', type: 'textarea', page: 3, repeatable: true, label: { ur: 'رپورٹ ضمنی اندرونی (متن)', en: 'Inner Zimni Report (Body)', roman: 'Report Zimni Androoni (Matan)' }, hint: 'Main ruled body: final/inner investigation report narrative' },
]

export const FIELD_MAP = new Map(FIELD_DEFS.map((f) => [f.id, f]))

/** Normalise `page1.entries[2].serialNumber` → `page1.entries[].serialNumber`. */
export function genericFieldId(id: string) {
  return id.replace(/\[\d+\]/g, '[]')
}

export function getFieldDef(id: string) {
  return FIELD_MAP.get(genericFieldId(id))
}

export function getFieldLabel(id: string, lang: Lang) {
  const def = getFieldDef(id)
  if (!def) return id
  const idx = id.match(/\[(\d+)\]/)?.[1]
  return idx !== undefined ? `${def.label[lang]} (#${Number(idx) + 1})` : def.label[lang]
}

/** Read a value by path like `page2.rows[0].witnesses`. */
export function getFieldValue(data: ReportData, path: string): string {
  const parts = path.replace(/\[(\d+)\]/g, '.$1').split('.')
  let cur: unknown = data
  for (const p of parts) {
    if (cur === null || cur === undefined) return ''
    cur = (cur as Record<string, unknown>)[p]
  }
  return typeof cur === 'string' ? cur : ''
}

/** Immutable set by path; automatically grows table arrays as needed. */
export function setFieldValue(data: ReportData, path: string, value: string): ReportData {
  const parts = path.replace(/\[(\d+)\]/g, '.$1').split('.')
  const clone = structuredClone(data) as unknown as Record<string, unknown>
  let cur: Record<string, unknown> = clone
  for (let i = 0; i < parts.length - 1; i++) {
    const key = parts[i]
    let next = cur[key]
    if (Array.isArray(next)) {
      const idx = Number(parts[i + 1])
      while (next.length <= idx) {
        if (key === 'entries' && path.startsWith('page1')) next.push(emptyPage1Entry())
        else if (key === 'rows') next.push(emptyPage2Row())
        else next.push(emptyPage3Entry())
      }
    } else if (next === undefined || next === null) {
      next = {}
      cur[key] = next
    }
    cur = next as Record<string, unknown>
  }
  cur[parts[parts.length - 1]] = value
  return clone as unknown as ReportData
}

/** Flat list of concrete (indexed) field ids with current values, for AI context. */
export function flattenReport(data: ReportData): { id: string; value: string }[] {
  const out: { id: string; value: string }[] = []
  for (const def of FIELD_DEFS) {
    if (!def.repeatable) {
      out.push({ id: def.id, value: getFieldValue(data, def.id) })
      continue
    }
    const [root, col] = def.id.split('[].')
    const list = (root === 'page1.entries' ? data.page1.entries : root === 'page2.rows' ? data.page2.rows : data.page3.entries) as unknown as Record<string, string>[]
    list.forEach((row, i) => out.push({ id: `${root}[${i}].${col}`, value: row[col] ?? '' }))
  }
  return out
}

export const PAGE_TITLES: Record<1 | 2 | 3, Record<Lang, string>> = {
  1: { ur: 'رپورٹ ضمنی بیرونی', en: 'Police Report Form (Outer Zimni)', roman: 'Report Zimni Bairooni' },
  2: { ur: 'فارم چالان پولیس زیر دفعہ ۱۷۳ ض ف', en: 'Investigation Details (Challan u/s 173)', roman: 'Form Challan Police 173' },
  3: { ur: 'رپورٹ ضمنی اندرونی', en: 'Investigation / Final Report (Inner Zimni)', roman: 'Report Zimni Androoni' },
}

export const PAGE_FORM_NUMBERS: Record<1 | 2 | 3, string> = {
  1: 'پولیس فارم نمبر ۲۵ ۔۔۔۔۔ ۵۴ (I)',
  2: 'پولیس فارم نمبر ۲۵ ۔۔۔۔۔ ۵۶ (I)',
  3: 'پولیس فارم نمبر ۲۵ ۔۔۔۔۔ ۵۴ (II)',
}
