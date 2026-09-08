// PoliceChallanForm.tsx
// فارم چالان پولیس زیر دفعہ 173 ض.ف
//
// Replicates the challan form: header identification block, then the
// 7-column accused/witness/property table. Columns are laid out in the
// same right-to-left order as the printed form (col. 1 rightmost):
//   1. نام و پتہ مسیفیت
//   2. ملزمان جو چالان کے نہ کئے گئے (اشتہاری ملزمان)
//   3. ملزمان زیر حراست
//   4. ملزمان برضمانت
//   5. مال مقدمہ
//   6. نام و پتہ گواہان
//   7. مختصر حالات و کیفیت بہ جرم

import React from "react";
import type { ChallanEntry, ChallanFormData, PoliceFormProps } from "./types";

const emptyEntry = (srNo: string): ChallanEntry => ({
  srNo,
  accused: {
    nameAddressCapacity: "",
    proclaimedOffenders: "",
    inCustody: "",
    onBail: "",
  },
  caseProperty: "",
  witnesses: "",
  briefFacts: "",
});

export const createEmptyChallanFormData = (): ChallanFormData => ({
  thana: "",
  district: "",
  caseNumber: "",
  offence: "",
  date: "",
  challanDate: "",
  year: "",
  entries: [emptyEntry("1")],
});

export default function PoliceChallanForm({
  data,
  onChange,
  readOnly = false,
}: PoliceFormProps<ChallanFormData>) {
  const setField = <K extends keyof ChallanFormData>(key: K, value: ChallanFormData[K]) =>
    onChange({ ...data, [key]: value });

  const setEntryField = (index: number, key: keyof ChallanEntry, value: string) => {
    const entries = data.entries.slice();
    entries[index] = { ...entries[index], [key]: value };
    onChange({ ...data, entries });
  };

  const setAccusedField = (
    index: number,
    key: keyof ChallanEntry["accused"],
    value: string
  ) => {
    const entries = data.entries.slice();
    entries[index] = {
      ...entries[index],
      accused: { ...entries[index].accused, [key]: value },
    };
    onChange({ ...data, entries });
  };

  const addEntry = () => {
    const nextSrNo = String(data.entries.length + 1);
    onChange({ ...data, entries: [...data.entries, emptyEntry(nextSrNo)] });
  };

  const removeEntry = (index: number) => {
    if (data.entries.length <= 1) return;
    onChange({ ...data, entries: data.entries.filter((_, i) => i !== index) });
  };

  return (
    <div className="cf-page">
      <div className="cf-toolbar no-print">
        <button type="button" onClick={addEntry}>
          + قطار شامل کریں / Add row
        </button>
        <button type="button" onClick={() => window.print()}>
          پرنٹ / Print
        </button>
      </div>

      <header className="cf-header">
        <h1 className="cf-title">فارم چالان پولیس زیر دفعہ 173 ض.ف</h1>
        <table className="cf-meta-table">
          <tbody>
            <tr>
              <td className="cf-label">تھانہ</td>
              <td>
                <EditableSpan value={data.thana} onChange={(v) => setField("thana", v)} readOnly={readOnly} />
              </td>
              <td className="cf-label">ضلع</td>
              <td>
                <EditableSpan
                  value={data.district}
                  onChange={(v) => setField("district", v)}
                  readOnly={readOnly}
                />
              </td>
            </tr>
            <tr>
              <td className="cf-label">مقدمہ نمبر</td>
              <td>
                <EditableSpan
                  value={data.caseNumber}
                  onChange={(v) => setField("caseNumber", v)}
                  readOnly={readOnly}
                />
              </td>
              <td className="cf-label">جرم</td>
              <td>
                <EditableSpan
                  value={data.offence}
                  onChange={(v) => setField("offence", v)}
                  readOnly={readOnly}
                />
              </td>
            </tr>
            <tr>
              <td className="cf-label">مورخہ</td>
              <td>
                <EditableSpan value={data.date} onChange={(v) => setField("date", v)} readOnly={readOnly} />
              </td>
              <td className="cf-label">تاریخ چالان</td>
              <td>
                <EditableSpan
                  value={data.challanDate}
                  onChange={(v) => setField("challanDate", v)}
                  readOnly={readOnly}
                />
                <span className="cf-year-prefix"> &nbsp;20</span>
                <EditableSpan
                  value={data.year}
                  onChange={(v) => setField("year", v)}
                  readOnly={readOnly}
                />
              </td>
            </tr>
          </tbody>
        </table>
      </header>

      <table className="cf-body-table">
        <thead>
          <tr>
            <th style={{ width: "5%" }}>نمبر شمار</th>
            <th style={{ width: "15%" }}>نام و پتہ مسیفیت</th>
            <th style={{ width: "10%" }}>اشتہاری ملزمان</th>
            <th style={{ width: "10%" }}>زیر حراست</th>
            <th style={{ width: "10%" }}>برضمانت</th>
            <th style={{ width: "10%" }}>مال مقدمہ</th>
            <th style={{ width: "15%" }}>نام و پتہ گواہان</th>
            <th>مختصر حالات و کیفیت بہ جرم</th>
            <th className="no-print" style={{ width: "4%" }} />
          </tr>
          <tr className="cf-subhead no-print">
            <th colSpan={2} />
            <th colSpan={2}>ملزمان جو چالان کے نہ کئے گئے</th>
            <th>ملزمان جو چالان کئے گئے</th>
            <th colSpan={3} />
            <th />
          </tr>
        </thead>
        <tbody>
          {data.entries.map((entry, index) => (
            <tr key={index}>
              <td className="cf-srno">{entry.srNo}</td>
              <td>
                <EditableTextArea
                  value={entry.accused.nameAddressCapacity}
                  onChange={(v) => setAccusedField(index, "nameAddressCapacity", v)}
                  readOnly={readOnly}
                />
              </td>
              <td>
                <EditableTextArea
                  value={entry.accused.proclaimedOffenders}
                  onChange={(v) => setAccusedField(index, "proclaimedOffenders", v)}
                  readOnly={readOnly}
                />
              </td>
              <td>
                <EditableTextArea
                  value={entry.accused.inCustody}
                  onChange={(v) => setAccusedField(index, "inCustody", v)}
                  readOnly={readOnly}
                />
              </td>
              <td>
                <EditableTextArea
                  value={entry.accused.onBail}
                  onChange={(v) => setAccusedField(index, "onBail", v)}
                  readOnly={readOnly}
                />
              </td>
              <td>
                <EditableTextArea
                  value={entry.caseProperty}
                  onChange={(v) => setEntryField(index, "caseProperty", v)}
                  readOnly={readOnly}
                />
              </td>
              <td>
                <EditableTextArea
                  value={entry.witnesses}
                  onChange={(v) => setEntryField(index, "witnesses", v)}
                  readOnly={readOnly}
                />
              </td>
              <td>
                <EditableTextArea
                  value={entry.briefFacts}
                  onChange={(v) => setEntryField(index, "briefFacts", v)}
                  readOnly={readOnly}
                />
              </td>
              <td className="no-print">
                {!readOnly && data.entries.length > 1 && (
                  <button type="button" className="cf-remove" onClick={() => removeEntry(index)}>
                    ✕
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <style>{`
        .cf-page {
          direction: rtl;
          font-family: "Noto Nastaliq Urdu", "Jameel Noori Nastaliq", Tahoma, serif;
          background: #fff;
          color: #111;
          width: 297mm;
          min-height: 210mm;
          margin: 0 auto;
          padding: 12mm;
          box-sizing: border-box;
          font-size: 15px;
          line-height: 1.9;
        }
        .cf-toolbar {
          display: flex;
          gap: 8px;
          justify-content: flex-end;
          margin-bottom: 12px;
        }
        .cf-toolbar button {
          direction: rtl;
          font-family: inherit;
          padding: 6px 14px;
          border: 1px solid #333;
          background: #f5f5f5;
          border-radius: 4px;
          cursor: pointer;
        }
        .cf-header {
          text-align: center;
          margin-bottom: 10px;
        }
        .cf-title {
          font-size: 22px;
          border-bottom: 2px solid #000;
          padding-bottom: 8px;
          margin: 0 0 10px;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 10px;
        }
        .cf-meta-table td {
          border: 1px solid #000;
          padding: 6px 8px;
          text-align: right;
        }
        .cf-label {
          font-weight: bold;
          white-space: nowrap;
          background: #fafafa;
          width: 1%;
        }
        .cf-year-prefix {
          font-weight: bold;
        }
        .cf-body-table th,
        .cf-body-table td {
          border: 1px solid #000;
          padding: 6px 6px;
          vertical-align: top;
          text-align: center;
          font-size: 14px;
        }
        .cf-subhead th {
          font-size: 12px;
          background: #fafafa;
        }
        .cf-srno {
          font-weight: bold;
        }
        .cf-remove {
          border: none;
          background: transparent;
          color: #b00020;
          cursor: pointer;
        }
        @media print {
          .no-print {
            display: none !important;
          }
          .cf-page {
            width: auto;
            min-height: 0;
            padding: 0;
            margin: 0;
          }
        }
      `}</style>
    </div>
  );
}

function EditableSpan({
  value,
  onChange,
  readOnly,
}: {
  value: string;
  onChange: (v: string) => void;
  readOnly?: boolean;
}) {
  return (
    <input
      type="text"
      value={value}
      readOnly={readOnly}
      onChange={(e) => onChange(e.target.value)}
      style={{
        width: "100%",
        border: "none",
        outline: "none",
        background: "transparent",
        font: "inherit",
        direction: "rtl",
        textAlign: "right",
      }}
    />
  );
}

function EditableTextArea({
  value,
  onChange,
  readOnly,
}: {
  value: string;
  onChange: (v: string) => void;
  readOnly?: boolean;
}) {
  return (
    <textarea
      value={value}
      readOnly={readOnly}
      onChange={(e) => onChange(e.target.value)}
      rows={3}
      style={{
        width: "100%",
        border: "none",
        outline: "none",
        background: "transparent",
        font: "inherit",
        resize: "vertical",
        direction: "rtl",
        textAlign: "right",
      }}
    />
  );
}
