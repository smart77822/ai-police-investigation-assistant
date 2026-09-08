// ReportZimniBairuni.tsx
// پولیس فارم نمبر 25-----54(1)  —  رپورٹ ضمنی بیرونی
//
// Replicates the outer supplementary-report sheet: header identification
// block, then the "حالات تفتیش" (investigation log) table with three
// columns — تاریخ معہ وقت, رپورٹ نمبر, حالات تفتیش — repeated per entry.
//
// Fillable on screen; @media print rules strip input chrome so the
// printed page shows only ruled boxes and typed text, matching the
// original form for court submission.

import React from "react";
import type { PoliceFormProps, ZimniBairuniData, ZimniBairuniEntry } from "./types";

const emptyEntry = (srNo: string): ZimniBairuniEntry => ({
  srNo,
  actionDateTime: "",
  reportNumber: "",
  details: "",
});

export const createEmptyZimniBairuniData = (): ZimniBairuniData => ({
  zimniNumber: "",
  thana: "",
  district: "",
  firNumber: "",
  reportDate: "",
  occurrenceDateTimePlace: "",
  offenceSections: "",
  receivedAtThanaDateTime: "",
  dispatchedFromThanaDateTime: "",
  entries: [emptyEntry("1")],
});

export default function ReportZimniBairuni({
  data,
  onChange,
  readOnly = false,
}: PoliceFormProps<ZimniBairuniData>) {
  const setField = <K extends keyof ZimniBairuniData>(key: K, value: ZimniBairuniData[K]) =>
    onChange({ ...data, [key]: value });

  const setEntryField = (index: number, key: keyof ZimniBairuniEntry, value: string) => {
    const entries = data.entries.slice();
    entries[index] = { ...entries[index], [key]: value };
    onChange({ ...data, entries });
  };

  const addEntry = () => {
    const nextSrNo = String(data.entries.length + 1);
    onChange({ ...data, entries: [...data.entries, emptyEntry(nextSrNo)] });
  };

  const removeEntry = (index: number) => {
    if (data.entries.length <= 1) return;
    const entries = data.entries.filter((_, i) => i !== index);
    onChange({ ...data, entries });
  };

  return (
    <div className="zb-page">
      <div className="zb-toolbar no-print">
        <button type="button" onClick={addEntry}>
          + قطار شامل کریں / Add row
        </button>
        <button type="button" onClick={() => window.print()}>
          پرنٹ / Print
        </button>
      </div>

      <header className="zb-header">
        <div className="zb-form-no">پولیس فارم نمبر 25-----54 (1)</div>
        <h1 className="zb-title">
          رپورٹ ضمنی نمبر{" "}
          <EditableSpan
            value={data.zimniNumber}
            onChange={(v) => setField("zimniNumber", v)}
            readOnly={readOnly}
            placeholder="___"
          />
        </h1>
      </header>

      <table className="zb-meta-table">
        <tbody>
          <tr>
            <td className="zb-label">تھانہ</td>
            <td>
              <EditableSpan value={data.thana} onChange={(v) => setField("thana", v)} readOnly={readOnly} />
            </td>
            <td className="zb-label">ضلع</td>
            <td>
              <EditableSpan
                value={data.district}
                onChange={(v) => setField("district", v)}
                readOnly={readOnly}
              />
            </td>
          </tr>
          <tr>
            <td className="zb-label">ابتدائی اطلاعی رپورٹ نمبر</td>
            <td colSpan={3}>
              <EditableSpan
                value={data.firNumber}
                onChange={(v) => setField("firNumber", v)}
                readOnly={readOnly}
              />
            </td>
          </tr>
          <tr>
            <td className="zb-label">مورخہ</td>
            <td>
              <EditableSpan
                value={data.reportDate}
                onChange={(v) => setField("reportDate", v)}
                readOnly={readOnly}
              />
            </td>
            <td className="zb-label">تاریخ ومقام وقوعہ</td>
            <td>
              <EditableSpan
                value={data.occurrenceDateTimePlace}
                onChange={(v) => setField("occurrenceDateTimePlace", v)}
                readOnly={readOnly}
              />
            </td>
          </tr>
          <tr>
            <td className="zb-label">جرم</td>
            <td colSpan={3}>
              <EditableSpan
                value={data.offenceSections}
                onChange={(v) => setField("offenceSections", v)}
                readOnly={readOnly}
              />
            </td>
          </tr>
          <tr>
            <td className="zb-label">تھانہ میں موصول ہونے کا وقت و تاریخ</td>
            <td>
              <EditableSpan
                value={data.receivedAtThanaDateTime}
                onChange={(v) => setField("receivedAtThanaDateTime", v)}
                readOnly={readOnly}
              />
            </td>
            <td className="zb-label">تھانہ سے روانگی کا وقت و تاریخ</td>
            <td>
              <EditableSpan
                value={data.dispatchedFromThanaDateTime}
                onChange={(v) => setField("dispatchedFromThanaDateTime", v)}
                readOnly={readOnly}
              />
            </td>
          </tr>
        </tbody>
      </table>

      <table className="zb-log-table">
        <thead>
          <tr>
            <th style={{ width: "8%" }}>نمبر شمار</th>
            <th style={{ width: "16%" }}>تاریخ معہ وقت جس پر کارروائی کی گئی</th>
            <th style={{ width: "12%" }}>رپورٹ نمبر شمار سلسلہ وار</th>
            <th>حالات تفتیش</th>
            <th className="no-print" style={{ width: "4%" }} />
          </tr>
        </thead>
        <tbody>
          {data.entries.map((entry, index) => (
            <tr key={index}>
              <td className="zb-srno">{entry.srNo}</td>
              <td>
                <EditableSpan
                  value={entry.actionDateTime}
                  onChange={(v) => setEntryField(index, "actionDateTime", v)}
                  readOnly={readOnly}
                />
              </td>
              <td>
                <EditableSpan
                  value={entry.reportNumber}
                  onChange={(v) => setEntryField(index, "reportNumber", v)}
                  readOnly={readOnly}
                />
              </td>
              <td>
                <EditableTextArea
                  value={entry.details}
                  onChange={(v) => setEntryField(index, "details", v)}
                  readOnly={readOnly}
                />
              </td>
              <td className="no-print">
                {!readOnly && data.entries.length > 1 && (
                  <button type="button" className="zb-remove" onClick={() => removeEntry(index)}>
                    ✕
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <style>{`
        .zb-page {
          direction: rtl;
          font-family: "Noto Nastaliq Urdu", "Jameel Noori Nastaliq", Tahoma, serif;
          background: #fff;
          color: #111;
          width: 210mm;
          min-height: 297mm;
          margin: 0 auto;
          padding: 14mm 12mm;
          box-sizing: border-box;
          font-size: 16px;
          line-height: 2;
        }
        .zb-toolbar {
          display: flex;
          gap: 8px;
          justify-content: flex-end;
          margin-bottom: 12px;
        }
        .zb-toolbar button {
          direction: rtl;
          font-family: inherit;
          padding: 6px 14px;
          border: 1px solid #333;
          background: #f5f5f5;
          border-radius: 4px;
          cursor: pointer;
        }
        .zb-header {
          text-align: center;
          border-bottom: 2px solid #000;
          padding-bottom: 8px;
          margin-bottom: 10px;
        }
        .zb-form-no {
          font-size: 14px;
        }
        .zb-title {
          font-size: 22px;
          margin: 4px 0 0;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 10px;
        }
        .zb-meta-table td {
          border: 1px solid #000;
          padding: 6px 8px;
          vertical-align: top;
        }
        .zb-label {
          font-weight: bold;
          white-space: nowrap;
          background: #fafafa;
          width: 1%;
        }
        .zb-log-table th,
        .zb-log-table td {
          border: 1px solid #000;
          padding: 6px 8px;
          vertical-align: top;
          text-align: center;
        }
        .zb-log-table td:nth-child(4) {
          text-align: right;
        }
        .zb-srno {
          font-weight: bold;
        }
        .zb-remove {
          border: none;
          background: transparent;
          color: #b00020;
          cursor: pointer;
          font-size: 14px;
        }
        @media print {
          .no-print {
            display: none !important;
          }
          .zb-page {
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
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  readOnly?: boolean;
  placeholder?: string;
}) {
  return (
    <input
      className="zb-input"
      type="text"
      value={value}
      placeholder={placeholder}
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
      className="zb-textarea"
      value={value}
      readOnly={readOnly}
      onChange={(e) => onChange(e.target.value)}
      rows={4}
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
