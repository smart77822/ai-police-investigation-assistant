'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

type RecognitionCtor = new () => SpeechRecognitionLike

interface SpeechRecognitionLike {
  lang: string
  continuous: boolean
  interimResults: boolean
  maxAlternatives: number
  start(): void
  stop(): void
  abort(): void
  onresult: ((e: { resultIndex: number; results: ArrayLike<ArrayLike<{ transcript: string }> & { isFinal: boolean }> }) => void) | null
  onerror: ((e: { error: string }) => void) | null
  onend: (() => void) | null
}

function getRecognitionCtor(): RecognitionCtor | null {
  if (typeof window === 'undefined') return null
  const w = window as unknown as { SpeechRecognition?: RecognitionCtor; webkitSpeechRecognition?: RecognitionCtor }
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null
}

export interface UseSpeechOptions {
  /** BCP-47 locale for the browser recogniser, e.g. ur-PK, en-US. */
  locale: string
  /** ISO-639-1 hint for the server transcriber (or 'auto'). */
  serverLang?: string
  onFinal: (text: string) => void
  onInterim?: (text: string) => void
  onError?: (message: string) => void
}

/**
 * Voice capture with two engines:
 *  1. Browser Web Speech API (real-time, works well for ur-PK / en on Chrome & Android).
 *  2. MediaRecorder → /api/transcribe (Whisper via AI Gateway) when the browser has
 *     no recogniser, or when the caller forces server mode for mixed-language speech.
 */
export function useSpeech(opts: UseSpeechOptions) {
  const [listening, setListening] = useState(false)
  const [supported, setSupported] = useState(true)
  const [engine, setEngine] = useState<'browser' | 'server'>('browser')
  const [processing, setProcessing] = useState(false)
  const recRef = useRef<SpeechRecognitionLike | null>(null)
  const mediaRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])
  const finalRef = useRef('')
  const optsRef = useRef(opts)
  optsRef.current = opts

  useEffect(() => {
    const ctor = getRecognitionCtor()
    setSupported(Boolean(ctor) || typeof MediaRecorder !== 'undefined')
    if (!ctor) setEngine('server')
  }, [])

  const stop = useCallback(() => {
    recRef.current?.stop()
    if (mediaRef.current && mediaRef.current.state !== 'inactive') mediaRef.current.stop()
    setListening(false)
  }, [])

  const startBrowser = useCallback(() => {
    const ctor = getRecognitionCtor()
    if (!ctor) return false
    const rec = new ctor()
    rec.lang = optsRef.current.locale
    rec.continuous = true
    rec.interimResults = true
    rec.maxAlternatives = 1
    finalRef.current = ''
    rec.onresult = (e) => {
      let interim = ''
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const res = e.results[i]
        const txt = res[0]?.transcript ?? ''
        if (res.isFinal) finalRef.current += (finalRef.current ? ' ' : '') + txt.trim()
        else interim += txt
      }
      optsRef.current.onInterim?.((finalRef.current + ' ' + interim).trim())
    }
    rec.onerror = (e) => {
      if (e.error === 'no-speech') return
      if (e.error === 'not-allowed') optsRef.current.onError?.('Microphone permission was denied.')
      else if (e.error === 'language-not-supported') optsRef.current.onError?.('This language is not supported by the browser recogniser. Switching to server transcription.')
      else optsRef.current.onError?.(`Speech recognition error: ${e.error}`)
      if (e.error === 'language-not-supported') setEngine('server')
    }
    rec.onend = () => {
      setListening(false)
      const text = finalRef.current.trim()
      if (text) optsRef.current.onFinal(text)
      recRef.current = null
    }
    recRef.current = rec
    rec.start()
    setListening(true)
    return true
  }, [])

  const startServer = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mime = MediaRecorder.isTypeSupported('audio/webm;codecs=opus') ? 'audio/webm;codecs=opus' : MediaRecorder.isTypeSupported('audio/mp4') ? 'audio/mp4' : ''
      const rec = mime ? new MediaRecorder(stream, { mimeType: mime }) : new MediaRecorder(stream)
      chunksRef.current = []
      rec.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data)
      }
      rec.onstop = async () => {
        stream.getTracks().forEach((t) => t.stop())
        setListening(false)
        const blob = new Blob(chunksRef.current, { type: rec.mimeType || 'audio/webm' })
        if (blob.size < 1000) return
        setProcessing(true)
        try {
          const fd = new FormData()
          fd.append('audio', blob, 'speech.webm')
          fd.append('lang', optsRef.current.serverLang ?? 'auto')
          const res = await fetch('/api/transcribe', { method: 'POST', body: fd })
          const json = (await res.json()) as { text?: string; error?: string }
          if (!res.ok || !json.text) throw new Error(json.error ?? 'Transcription failed')
          optsRef.current.onFinal(json.text.trim())
        } catch (err) {
          optsRef.current.onError?.(err instanceof Error ? err.message : 'Transcription failed')
        } finally {
          setProcessing(false)
        }
      }
      mediaRef.current = rec
      rec.start()
      setListening(true)
    } catch {
      optsRef.current.onError?.('Microphone access is not available.')
    }
  }, [])

  const start = useCallback(() => {
    if (listening) return
    if (engine === 'browser' && startBrowser()) return
    void startServer()
  }, [engine, listening, startBrowser, startServer])

  const toggle = useCallback(() => (listening ? stop() : start()), [listening, start, stop])

  useEffect(() => () => stop(), [stop])

  return { listening, processing, supported, engine, setEngine, start, stop, toggle }
}
