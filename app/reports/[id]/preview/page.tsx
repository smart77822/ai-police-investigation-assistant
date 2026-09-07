import { headers } from 'next/headers'
import { notFound, redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { getReport } from '@/app/actions/reports'
import { LangProvider } from '@/components/lang-provider'
import { ReportProvider } from '@/components/report/report-provider'
import { ReportPreview } from '@/components/report/report-preview'

export default async function PreviewPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth.api.getSession({ headers: await headers() }); if (!session) redirect('/sign-in')
  const { id } = await params; const report = await getReport(id); if (!report) notFound()
  return <LangProvider><ReportProvider id={id} initialData={report.data} initialStatus={report.status}><ReportPreview /></ReportProvider></LangProvider>
}
