'use server'

import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { reports, userSettings } from '@/lib/db/schema'
import { decryptJson, encryptJson } from '@/lib/crypto'
import { createEmptyReport, type ReportData } from '@/lib/report-schema'
import { and, desc, eq, ilike, or } from 'drizzle-orm'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { nanoid } from 'nanoid'

async function getUserId() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) throw new Error('Unauthorized')
  return session.user.id
}

export interface ReportSummary {
  id: string
  title: string
  firNumber: string
  caseNumber: string
  policeStation: string
  district: string
  reportDate: string
  status: string
  createdAt: Date
  updatedAt: Date
}

function summaryFromData(data: ReportData) {
  const title =
    data.page1.firNumber || data.page2.caseNumber
      ? `FIR ${data.page1.firNumber || '—'} / ${data.page1.policeStation || data.page2.policeStation || '—'}`
      : ''
  return {
    title,
    firNumber: data.page1.firNumber,
    caseNumber: data.page2.caseNumber,
    policeStation: data.page1.policeStation || data.page2.policeStation,
    district: data.page1.district || data.page2.district,
    reportDate: data.page1.occurrenceDate || data.page2.caseDate,
  }
}

export async function createReport(initial?: ReportData) {
  const userId = await getUserId()
  const settings = await getSettings()
  const data = initial ?? createEmptyReport()
  if (!initial) {
    data.page1.district = settings.defaultDistrict
    data.page1.policeStation = settings.defaultPoliceStation
    data.page2.district = settings.defaultDistrict
    data.page2.policeStation = settings.defaultPoliceStation
    data.page1.year = String(new Date().getFullYear())
    data.page2.year = String(new Date().getFullYear())
  }
  const id = nanoid(12)
  await db.insert(reports).values({
    id,
    userId,
    ...summaryFromData(data),
    encryptedData: encryptJson(data),
  })
  return id
}

export async function createReportAndRedirect() {
  const id = await createReport()
  redirect(`/reports/${id}/page-1`)
}

export async function listReports(query?: string): Promise<ReportSummary[]> {
  const userId = await getUserId()
  const q = query?.trim()
  const where = q
    ? and(
        eq(reports.userId, userId),
        or(
          ilike(reports.firNumber, `%${q}%`),
          ilike(reports.caseNumber, `%${q}%`),
          ilike(reports.policeStation, `%${q}%`),
          ilike(reports.district, `%${q}%`),
          ilike(reports.reportDate, `%${q}%`),
          ilike(reports.title, `%${q}%`),
        ),
      )
    : eq(reports.userId, userId)
  return db
    .select({
      id: reports.id,
      title: reports.title,
      firNumber: reports.firNumber,
      caseNumber: reports.caseNumber,
      policeStation: reports.policeStation,
      district: reports.district,
      reportDate: reports.reportDate,
      status: reports.status,
      createdAt: reports.createdAt,
      updatedAt: reports.updatedAt,
    })
    .from(reports)
    .where(where)
    .orderBy(desc(reports.updatedAt))
}

export async function getReport(id: string): Promise<{ id: string; data: ReportData; status: string; updatedAt: Date } | null> {
  const userId = await getUserId()
  const [row] = await db
    .select()
    .from(reports)
    .where(and(eq(reports.id, id), eq(reports.userId, userId)))
    .limit(1)
  if (!row) return null
  const data = decryptJson<ReportData>(row.encryptedData) ?? createEmptyReport()
  return { id: row.id, data, status: row.status, updatedAt: row.updatedAt }
}

export async function saveReport(id: string, data: ReportData, status?: string) {
  const userId = await getUserId()
  await db
    .update(reports)
    .set({
      ...summaryFromData(data),
      ...(status ? { status } : {}),
      encryptedData: encryptJson(data),
      updatedAt: new Date(),
    })
    .where(and(eq(reports.id, id), eq(reports.userId, userId)))
  revalidatePath('/reports')
  return { ok: true, savedAt: new Date().toISOString() }
}

export async function duplicateReport(id: string) {
  const existing = await getReport(id)
  if (!existing) throw new Error('Not found')
  const newId = await createReport(existing.data)
  return newId
}

export async function deleteReport(id: string) {
  const userId = await getUserId()
  await db.delete(reports).where(and(eq(reports.id, id), eq(reports.userId, userId)))
  revalidatePath('/reports')
}

export async function deleteAllMyReports() {
  const userId = await getUserId()
  await db.delete(reports).where(eq(reports.userId, userId))
  revalidatePath('/reports')
}

export async function getLatestReportId() {
  const userId = await getUserId()
  const [row] = await db
    .select({ id: reports.id })
    .from(reports)
    .where(eq(reports.userId, userId))
    .orderBy(desc(reports.updatedAt))
    .limit(1)
  return row?.id ?? null
}

export async function getDashboardStats() {
  const userId = await getUserId()
  const rows = await db
    .select({ status: reports.status, updatedAt: reports.updatedAt })
    .from(reports)
    .where(eq(reports.userId, userId))
  return {
    total: rows.length,
    drafts: rows.filter((r) => r.status === 'draft').length,
    finalized: rows.filter((r) => r.status === 'final').length,
  }
}

export interface Settings {
  uiLanguage: 'ur' | 'en' | 'roman'
  voiceLanguage: string
  defaultDistrict: string
  defaultPoliceStation: string
  officerName: string
  officerRank: string
}

export async function getSettings(): Promise<Settings> {
  const userId = await getUserId()
  const [row] = await db.select().from(userSettings).where(eq(userSettings.userId, userId)).limit(1)
  return {
    uiLanguage: (row?.uiLanguage as Settings['uiLanguage']) ?? 'ur',
    voiceLanguage: row?.voiceLanguage ?? 'ur-PK',
    defaultDistrict: row?.defaultDistrict ?? '',
    defaultPoliceStation: row?.defaultPoliceStation ?? '',
    officerName: row?.officerName ?? '',
    officerRank: row?.officerRank ?? '',
  }
}

export async function saveSettings(s: Settings) {
  const userId = await getUserId()
  await db
    .insert(userSettings)
    .values({ userId, ...s, updatedAt: new Date() })
    .onConflictDoUpdate({ target: userSettings.userId, set: { ...s, updatedAt: new Date() } })
  revalidatePath('/settings')
  revalidatePath('/')
}
