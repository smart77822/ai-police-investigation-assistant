import { headers } from 'next/headers'
import { notFound, redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { getReport } from '@/app/actions/reports'
import { AppShell } from '@/components/app-shell'
import { LangProvider } from '@/components/lang-provider'
import { ReportProvider } from '@/components/report/report-provider'
import { ReportToolbar } from '@/components/report/report-toolbar'
import { PageThree } from '@/components/report/page-three'
import { AssistantPanel } from '@/components/ai/assistant-panel'

export default async function ReportPageThree({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth.api.getSession({ headers: await headers() }); if (!session) redirect('/sign-in')
  const { id } = await params; const report = await getReport(id); if (!report) notFound()
  return <LangProvider><AppShell user={{ name: session.user.name, email: session.user.email }} currentReportId={id}><ReportProvider id={id} initialData={report.data} initialStatus={report.status}><div className="report-workspace"><div className="report-main"><ReportToolbar /><PageThree /></div><AssistantPanel /></div></ReportProvider></AppShell></LangProvider>
}
