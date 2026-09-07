import { auth } from '@/lib/auth'
import { gateway, transcribe } from 'ai'
import { headers } from 'next/headers'

export const maxDuration = 60

/**
 * Server-side speech-to-text fallback for browsers without the Web Speech API
 * (or when the user prefers Whisper for mixed Urdu/English). Audio is
 * processed in memory and never persisted.
 */
export async function POST(req: Request) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  const form = await req.formData()
  const file = form.get('audio')
  const lang = (form.get('lang') as string | null) ?? undefined
  if (!(file instanceof Blob)) return Response.json({ error: 'No audio' }, { status: 400 })
  if (file.size > 15 * 1024 * 1024) return Response.json({ error: 'Audio too large' }, { status: 413 })

  try {
    const result = await transcribe({
      model: gateway.transcription('openai/whisper-1'),
      audio: new Uint8Array(await file.arrayBuffer()),
      ...(lang && lang !== 'auto' ? { providerOptions: { openai: { language: lang } } } : {}),
    })
    return Response.json({ text: result.text, language: result.language })
  } catch (err) {
    console.error('[transcribe] failed', err instanceof Error ? err.message : err)
    return Response.json({ error: 'Transcription failed' }, { status: 500 })
  }
}
