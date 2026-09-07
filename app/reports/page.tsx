import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { auth } from '@/lib/auth'
import { AppShell } from '@/components/app-shell'
import { LangProvider } from '@/components/lang-provider'
import { listReports } from '@/app/actions/reports'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export default async function ReportsPage() {
  const session = await auth.api.getSession({ headers: await headers() }); if (!session) redirect('/sign-in')
  const reports = await listReports()
  return <LangProvider><AppShell user={{ name: session.user.name, email: session.user.email }} currentReportId={reports[0]?.id ?? null}><div className="min-h-dvh bg-paper-texture p-4 sm:p-8"><div className="mx-auto max-w-5xl"><div className="mb-6"><p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Private archive</p><h1 className="mt-2 text-3xl font-semibold">Saved reports</h1></div><Card><CardHeader><CardTitle>All investigation reports</CardTitle></CardHeader><CardContent className="space-y-2">{reports.map((r) => <Link key={r.id} href={`/reports/${r.id}/page-1`} className="flex items-center justify-between rounded-lg border p-4 hover:bg-muted/50"><div><p className="font-medium">{r.title || 'Untitled investigation report'}</p><p className="text-sm text-muted-foreground">{r.policeStation || 'Station not set'} {r.firNumber ? `· FIR ${r.firNumber}` : ''}</p></div><Badge variant={r.status === 'final' ? 'default' : 'secondary'}>{r.status}</Badge></Link>)}{!reports.length && <p className="py-10 text-center text-muted-foreground">No saved reports yet.</p>}</CardContent></Card></div></div></AppShell></LangProvider>
}
