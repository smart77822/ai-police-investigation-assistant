'use server'

import Link from 'next/link'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { FilePlus2, FileText, Bot, FolderOpen, ArrowUpRight, ShieldCheck, Clock3 } from 'lucide-react'
import { auth } from '@/lib/auth'
import { AppShell } from '@/components/app-shell'
import { LangProvider } from '@/components/lang-provider'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { getDashboardStats, getLatestReportId, listReports } from '@/app/actions/reports'
import { createReportAndRedirect } from '@/app/actions/reports'

export default async function DashboardPage() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) redirect('/sign-in')
  const [stats, latestId, recent] = await Promise.all([getDashboardStats(), getLatestReportId(), listReports()])
  const user = { name: session.user.name, email: session.user.email }
  return (
    <LangProvider>
      <AppShell user={user} currentReportId={latestId}>
        <div className="min-h-dvh bg-paper-texture p-4 sm:p-6 lg:p-10">
          <div className="mx-auto max-w-6xl space-y-8">
            <header className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Authorized workspace</p>
                <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">Investigation reports</h1>
                <p className="mt-2 max-w-xl text-sm text-muted-foreground">Prepare official reports with structured forms, source-grounded AI drafting, and secure private storage.</p>
              </div>
              <form action={createReportAndRedirect}><Button size="lg" className="gap-2"><FilePlus2 className="size-4" />New report</Button></form>
            </header>

            <section className="grid gap-4 sm:grid-cols-3">
              {[
                { label: 'Total reports', value: stats.total, icon: FileText },
                { label: 'Drafts in progress', value: stats.drafts, icon: Clock3 },
                { label: 'Finalized', value: stats.finalized, icon: ShieldCheck },
              ].map(({ label, value, icon: Icon }) => <Card key={label} className="border-border/70 bg-card/85"><CardContent className="flex items-center justify-between p-5"><div><p className="text-sm text-muted-foreground">{label}</p><p className="mt-1 text-3xl font-semibold">{value}</p></div><Icon className="size-5 text-primary" /></CardContent></Card>)}
            </section>

            <section className="grid gap-5 lg:grid-cols-[1fr_320px]">
              <Card className="border-border/70 bg-card/90"><CardHeader className="flex flex-row items-center justify-between"><CardTitle className="text-lg">Recent reports</CardTitle><Link href="/reports" className="text-sm font-medium text-primary hover:underline">View all</Link></CardHeader><CardContent className="space-y-2">
                {recent.slice(0, 5).map((report) => <Link key={report.id} href={`/reports/${report.id}/page-1`} className="flex items-center justify-between rounded-lg border border-border/60 p-4 transition-colors hover:bg-muted/60"><div className="min-w-0"><p className="truncate font-medium">{report.title || 'Untitled investigation report'}</p><p className="mt-1 text-xs text-muted-foreground">{report.policeStation || 'Police station not set'}{report.firNumber ? ` · FIR ${report.firNumber}` : ''}</p></div><ArrowUpRight className="size-4 shrink-0 text-muted-foreground" /></Link>)}
                {!recent.length && <div className="rounded-lg border border-dashed border-border p-8 text-center"><FileText className="mx-auto size-8 text-muted-foreground" /><p className="mt-3 font-medium">No reports yet</p><p className="mt-1 text-sm text-muted-foreground">Start a new report to open the digital forms.</p></div>}
              </CardContent></Card>
              <div className="space-y-5"><Card className="border-primary/20 bg-primary text-primary-foreground"><CardContent className="p-6"><Bot className="size-7" /><h2 className="mt-5 text-xl font-semibold">AI report assistant</h2><p className="mt-2 text-sm text-primary-foreground/80">Speak in Urdu, Roman Urdu, English, or mixed language. The assistant extracts only what you provide and asks before inserting important details.</p><Link href={latestId ? `/reports/${latestId}/page-1?assistant=1` : '/reports/new'} className="mt-5 inline-flex items-center gap-2 text-sm font-semibold underline underline-offset-4">Open assistant <ArrowUpRight className="size-4" /></Link></CardContent></Card><Card><CardContent className="p-5"><div className="flex items-center gap-3"><FolderOpen className="size-5 text-primary" /><div><p className="font-medium">Private by design</p><p className="text-xs text-muted-foreground">Reports are encrypted before storage.</p></div></div></CardContent></Card></div>
            </section>
          </div>
        </div>
      </AppShell>
    </LangProvider>
  )
}

export { Badge }
