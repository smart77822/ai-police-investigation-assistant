import { auth } from '@/lib/auth'
import { interpretSystemPrompt, transformSystemPrompt, verifySystemPrompt, reportSnapshot } from '@/lib/ai/prompts'
import { normalizeSpokenNumbers } from '@/lib/urdu-numbers'
import { type Lang, type ReportData } from '@/lib/report-schema'
import { generateText, Output } from 'ai'
import { headers } from 'next/headers'
import { z } from 'zod'

const MODEL = 'anthropic/claude-sonnet-4.6'

export const maxDuration = 60

const extractedFieldSchema = z.object({
  fieldId: z.string().describe('Exact field id, e.g. page1.firNumber or page2.rows[0].witnesses'),
  value: z.string().describe('Value to insert, formatted for the field type'),
  confidence: z.number().min(0).max(1),
  needsConfirmation: z.boolean(),
  source: z.enum(['user_fact', 'ai_formatting']).describe('user_fact = value stated by the user; ai_formatting = narrative drafted by AI from user facts'),
  note: z.string().optional().describe('Short reason when confidence is low, e.g. "year assumed"'),
})

const interpretSchema = z.object({
  intent: z.enum(['fill', 'draft', 'command', 'question', 'unclear']),
  message: z.string().describe('Brief reply to the user in the output language'),
  fields: z.array(extractedFieldSchema),
  conflicts: z.array(
    z.object({
      fieldId: z.string(),
      currentValue: z.string(),
      newValue: z.string(),
      question: z.string(),
    }),
  ),
  clarifications: z.array(z.string()).describe('Questions to ask the user for missing/uncertain information'),
  correctedTranscript: z.string().describe('The transcript with obvious speech-to-text errors corrected, numbers as digits'),
})

const verifySchema = z.object({
  items: z.array(
    z.object({
      status: z.enum(['provided', 'missing', 'unclear', 'contradiction']),
      fieldId: z.string(),
      message: z.string(),
    }),
  ),
  summary: z.string(),
})

const bodySchema = z.discriminatedUnion('mode', [
  z.object({
    mode: z.literal('interpret'),
    text: z.string().min(1).max(8000),
    lang: z.enum(['ur', 'en', 'roman']),
    page: z.union([z.literal(1), z.literal(2), z.literal(3)]),
    activeField: z.string().nullable(),
    activeFieldValue: z.string().optional(),
    data: z.any(),
  }),
  z.object({
    mode: z.literal('transform'),
    action: z.enum(['rewrite', 'improve', 'formal', 'concise', 'detailed', 'grammar', 'chronological', 'translate']),
    text: z.string().min(1).max(12000),
    targetLang: z.enum(['ur', 'en', 'roman']),
  }),
  z.object({
    mode: z.literal('verify'),
    data: z.any(),
  }),
])

export async function POST(req: Request) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  const parsed = bodySchema.safeParse(await req.json())
  if (!parsed.success) return Response.json({ error: 'Invalid request' }, { status: 400 })
  const body = parsed.data

  try {
    if (body.mode === 'interpret') {
      const normalized = normalizeSpokenNumbers(body.text)
      const today = new Date().toISOString().slice(0, 10)
      const { output } = await generateText({
        model: MODEL,
        output: Output.object({ schema: interpretSchema }),
        system: interpretSystemPrompt({
          lang: body.lang as Lang,
          page: body.page,
          activeField: body.activeField,
          data: body.data as ReportData,
          today,
        }),
        prompt: [
          `RAW TRANSCRIPT: ${body.text}`,
          `NORMALISED TRANSCRIPT (numbers converted to digits): ${normalized}`,
          body.activeField
            ? `ACTIVE FIELD "${body.activeField}" CURRENT VALUE: ${JSON.stringify(body.activeFieldValue ?? '')}`
            : '',
        ]
          .filter(Boolean)
          .join('\n'),
      })
      return Response.json({ ...output, normalizedTranscript: normalized })
    }

    if (body.mode === 'transform') {
      const { text } = await generateText({
        model: MODEL,
        system: transformSystemPrompt(body.action, body.targetLang as Lang),
        prompt: body.text,
      })
      return Response.json({ text: text.trim() })
    }

    const { output } = await generateText({
      model: MODEL,
      output: Output.object({ schema: verifySchema }),
      system: verifySystemPrompt(),
      prompt: `REPORT CONTENTS:\n${reportSnapshot(body.data as ReportData)}`,
    })
    return Response.json(output)
  } catch (err) {
    console.error('[ai] request failed', err instanceof Error ? err.message : err)
    return Response.json({ error: 'AI request failed' }, { status: 500 })
  }
}
