'use client'

import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import type { Lang } from '@/lib/report-schema'
import { t as translate } from '@/lib/i18n'
import type { Settings } from '@/app/actions/reports'
import { saveSettings } from '@/app/actions/reports'

interface LangContextValue {
  lang: Lang
  setLang: (l: Lang) => void
  t: (key: string) => string
  dir: 'rtl' | 'ltr'
  settings: Settings
}

const LangContext = createContext<LangContextValue | null>(null)

export function LangProvider({ settings = { uiLanguage: 'ur', voiceLanguage: 'ur-PK', defaultDistrict: '', defaultPoliceStation: '', officerName: '', officerRank: '' }, children }: { settings?: Settings; children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>(settings.uiLanguage)

  const setLang = useCallback(
    (l: Lang) => {
      setLangState(l)
      void saveSettings({ ...settings, uiLanguage: l })
    },
    [settings],
  )

  const value = useMemo<LangContextValue>(
    () => ({
      lang,
      setLang,
      t: (key: string) => translate(key, lang),
      dir: lang === 'ur' ? 'rtl' : 'ltr',
      settings: { ...settings, uiLanguage: lang },
    }),
    [lang, setLang, settings],
  )

  return <LangContext.Provider value={value}>{children}</LangContext.Provider>
}

export function useLang() {
  const ctx = useContext(LangContext)
  if (!ctx) throw new Error('useLang must be used inside LangProvider')
  return ctx
}
