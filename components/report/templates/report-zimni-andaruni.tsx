// ReportZimniAndaruni.tsx
// پولیس فارم نمبر 25-----35 (11)  —  رپورٹ ضمنی اندرونی
//
// This is the continuation/inner sheet used when a supplementary report
// (Report Zimni Bairuni) runs past its first page: ruled writing lines
// with a narrow right-hand margin column for serial/report numbers,
// matching the blank ledger-style layout of the original form.

import React from "react";
import type { PoliceFormProps, ZimniAndaruniData, ZimniAndaruniLine } from "./types";

const emptyLine = (): ZimniAndaruniLine => ({ reportNumber: "", actionDateTime: "", text: "" });

export const createEmptyZimniAndaruniData = (): ZimniAndaruniData => ({
  bookNumber: "",
  zimniNumber: "",
  thana: "",
  firNumber: "",
  occurrenceDateTimePlace: "",
  offence: "",
  receivedAtThanaDateTime: "",
  dispatchedFromThanaDateTime: "",
  lines: Array.from({ length: 20 }, emptyLine),
});

export default function ReportZimniAndaruni({
  data,
  onChange,
  readOnly = false,
}: PoliceFormProps<ZimniAndaruniData>) {
  const setField = <K extends keyof ZimniAndaruniData>(key: K, value: ZimniAndaruniData[K]) =>
    onChange({ ...data, [key]: value });

  const setLineField = (index: number, key: keyof ZimniAndaruniLine, value: string) => {
    const lines = data.lines.slice();
    lines[index] = { ...lines[index], [key]: value };
    onChange({ ...data, lines });
  };

  const addLine = () => onChange({ ...data, lines: [...data.lines, emptyLine()] });

  return (
    <div className="za-page">
      <div className="za-toolbar no-print">
        <button type="button" onClick={addLine}>
          + مزید سطر / Add line
        </button>
        <button type="button" onClick={() => window.print()}>
          پرنٹ / Print
        </button>
      </div>

      <header className="za-header">
        <div className="za-form-no">پولیس فارم نمبر 25-----35 (11)</div>
        <h1 className="za-title">رپورٹ ضمنی اندرونی</h1>
      </header>

      <table className="za-meta-table no-print">
        <tbody>
          <tr>
            <td className="za-label">بک نمبر</td>
            <td>
              <EditableSpan value={data.bookNumber} onChange={(v) => setField("bookNumber", v)} readOnly={readOnly} />
            </td>
            <td className="za-label">ضمنی نمبر</td>
            <td>
              <EditableSpan
                value={data.zimniNumber}
                onChange={(v) => setField("zimniNumber", v)}
                readOnly={readOnly}
              />
            </td>
          </tr>
          <tr>
            <td className="za-label">تھانہ</td>
            <td>
              <EditableSpan value={data.thana} onChange={(v) => setField("thana", v)} readOnly={readOnly} />
            </td>
            <td className="za-label">ابتدائی اطلاعی رپورٹ نمبر</td>
            <td>
              <EditableSpan value={data.firNumber} onChange={(v) => setField("firNumber", v)} readOnly={readOnly} />
            </td>
          </tr>
          <tr>
            <td className="za-label">تاریخ ومقام وقوعہ</td>
            <td>
              <EditableSpan
                value={data.occurrenceDateTimePlace}
                onChange={(v) => setField("occurrenceDateTimePlace", v)}
                readOnly={readOnly}
              />
            </td>
            <td className="za-label">جرم</td>
            <td>
              <EditableSpan value={data.offence} onChange={(v) => setField("offence", v)} readOnly={readOnly} />
            </td>
          </tr>
          <tr>
            <td className="za-label">تھانہ میں موصول ہونے کا وقت و تاریخ</td>
            <td>
              <EditableSpan
                value={data.receivedAtThanaDateTime}
                onChange={(v) => setField("receivedAtThanaDateTime", v)}
                readOnly={readOnly}
              />
            </td>
            <td className="za-label">تھانہ سے روانگی کا وقت و تاریخ</td>
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

      {/* Printed header strip — same fields, condensed to match the paper form's
          single-line right-hand block above the ruled body. */}
      <table className="za-print-meta print-only">
        <tbody>
          <tr>
            <td>بک نمبر: {data.bookNumber}</td>
            <td>تھانہ: {data.thana}</td>
            <td>ابتدائی اطلاعی رپورٹ نمبر: {data.firNumber}</td>
            <td>تاریخ ومقام وقوعہ: {data.occurrenceDateTimePlace}</td>
            <td>جرم: {data.offence}</td>
          </tr>
        </tbody>
      </table>

      <table className="za-body-table">
        <thead>
          <tr>
            <th style={{ width: "8%" }}>رپورٹ نمبر شمار سلسلہ وار</th>
            <th style={{ width: "12%" }}>تاریخ معہ وقت جس پر کارروائی کی گئی</th>
            <th>حالات تفتیش</th>
          </tr>
        </thead>
        <tbody>
          {data.lines.map((line, index) => (
            <tr key={index} className="za-ruled-row">
              <td>
                <EditableSpan
                  value={line.reportNumber ?? ""}
                  onChange={(v) => setLineField(index, "reportNumber", v)}
                  readOnly={readOnly}
                />
              </td>
              <td>
                <EditableSpan
                  value={line.actionDateTime ?? ""}
                  onChange={(v) => setLineField(index, "actionDateTime", v)}
                  readOnly={readOnly}
                />
              </td>
              <td>
                <EditableSpan
                  value={line.text}
                  onChange={(v) => setLineField(index, "text", v)}
                  readOnly={readOnly}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <style>{`
        .za-page {
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
        }
        .za-toolbar {
          display: flex;
          gap: 8px;
          justify-content: flex-end;
          margin-bottom: 12px;
        }
        .za-toolbar button {
          direction: rtl;
          font-family: inherit;
          padding: 6px 14px;
          border: 1px solid #333;
          background: #f5f5f5;
          border-radius: 4px;
          cursor: pointer;
        }
        .za-header {
          text-align: center;
          border-bottom: 2px solid #000;
          padding-bottom: 8px;
          margin-bottom: 10px;
        }
        .za-form-no {
          font-size: 14px;
        }
        .za-title {
          font-size: 22px;
          margin: 4px 0 0;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 10px;
        }
        .za-meta-table td {
          border: 1px solid #000;
          padding: 6px 8px;
        }
        .za-label {
          font-weight: bold;
          white-space: nowrap;
          background: #fafafa;
          width: 1%;
        }
        .print-only {
          display: none;
        }
        .za-print-meta td {
          font-size: 11px;
          padding: 2px 6px;
          border: none;
          white-space: nowrap;
        }
        .za-body-table th {
          border: 1px solid #000;
          padding: 4px 6px;
          font-size: 13px;
        }
        .za-ruled-row td {
          border-bottom: 1px solid #999;
          border-left: 1px solid #000;
          border-right: 1px solid #000;
          padding: 4px 6px;
          height: 30px;
        }
        @media print {
          .no-print {
            display: none !important;
          }
          .print-only {
            display: table;
          }
          .za-page {
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
