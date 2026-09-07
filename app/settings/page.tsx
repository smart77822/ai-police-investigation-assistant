import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { AppShell } from '@/components/app-shell'
import { LangProvider } from '@/components/lang-provider'
import { getSettings } from '@/app/actions/reports'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default async function SettingsPage() {
  const session = await auth.api.getSession({ headers: await headers() }); if (!session) redirect('/sign-in')
  const settings = await getSettings()
  return <LangProvider settings={settings}><AppShell user={{ name: session.user.name, email: session.user.email }} currentReportId={null}><div className="min-h-dvh bg-paper-texture p-4 sm:p-8"><div className="mx-auto max-w-3xl"><p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Workspace preferences</p><h1 className="mt-2 text-3xl font-semibold">Settings</h1><Card className="mt-6"><CardHeader><CardTitle>Officer profile</CardTitle></CardHeader><CardContent className="grid gap-4 sm:grid-cols-2"><div><p className="text-sm text-muted-foreground">Officer name</p><p className="mt-1 font-medium">{settings.officerName || session.user.name}</p></div><div><p className="text-sm text-muted-foreground">Rank</p><p className="mt-1 font-medium">{settings.officerRank || 'Not set'}</p></div><div><p className="text-sm text-muted-foreground">Default district</p><p className="mt-1 font-medium">{settings.defaultDistrict || 'Not set'}</p></div><div><p className="text-sm text-muted-foreground">Default station</p><p className="mt-1 font-medium">{settings.defaultPoliceStation || 'Not set'}</p></div></CardContent></Card></div></div></AppShell></LangProvider>
}
