import type { Lang, ReportData } from '@/lib/report-schema'

export interface ExtractedField {
  fieldId: string
  value: string
  confidence: number
  needsConfirmation: boolean
  source: 'user_fact' | 'ai_formatting'
  note?: string
}

export interface InterpretResult {
  intent: 'fill' | 'draft' | 'command' | 'question' | 'unclear'
  message: string
  fields: ExtractedField[]
  conflicts: { fieldId: string; currentValue: string; newValue: string; question: string }[]
  clarifications: string[]
  correctedTranscript: string
  normalizedTranscript: string
}

export type TransformAction =
  | 'rewrite'
  | 'improve'
  | 'formal'
  | 'concise'
  | 'detailed'
  | 'grammar'
  | 'chronological'
  | 'translate'

export interface VerifyResult {
  items: { status: 'provided' | 'missing' | 'unclear' | 'contradiction'; fieldId: string; message: string }[]
  summary: string
}

async function post<T>(body: unknown): Promise<T> {
  const res = await fetch('/api/ai', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  })
  const json = await res.json()
  if (!res.ok) throw new Error(json.error ?? 'AI request failed')
  return json as T
}

export function interpret(input: {
  text: string
  lang: Lang
  page: 1 | 2 | 3
  activeField: string | null
  activeFieldValue?: string
  data: ReportData
}) {
  return post<InterpretResult>({ mode: 'interpret', ...input })
}

export function transform(action: TransformAction, text: string, targetLang: Lang) {
  return post<{ text: string }>({ mode: 'transform', action, text, targetLang })
}

export function verify(data: ReportData) {
  return post<VerifyResult>({ mode: 'verify', data })
}
