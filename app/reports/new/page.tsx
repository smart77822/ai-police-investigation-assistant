import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { createReportAndRedirect } from '@/app/actions/reports'

export default async function NewReportPage() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) redirect('/sign-in')
  await createReportAndRedirect()
}
