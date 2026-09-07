import { pgTable, text, timestamp, boolean } from 'drizzle-orm/pg-core'

export const user = pgTable('user', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  emailVerified: boolean('emailVerified').notNull().default(false),
  image: text('image'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})

export const session = pgTable('session', {
  id: text('id').primaryKey(),
  expiresAt: timestamp('expiresAt').notNull(),
  token: text('token').notNull().unique(),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
  ipAddress: text('ipAddress'),
  userAgent: text('userAgent'),
  userId: text('userId')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
})

export const account = pgTable('account', {
  id: text('id').primaryKey(),
  accountId: text('accountId').notNull(),
  providerId: text('providerId').notNull(),
  userId: text('userId')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  accessToken: text('accessToken'),
  refreshToken: text('refreshToken'),
  idToken: text('idToken'),
  accessTokenExpiresAt: timestamp('accessTokenExpiresAt'),
  refreshTokenExpiresAt: timestamp('refreshTokenExpiresAt'),
  scope: text('scope'),
  password: text('password'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})

export const verification = pgTable('verification', {
  id: text('id').primaryKey(),
  identifier: text('identifier').notNull(),
  value: text('value').notNull(),
  expiresAt: timestamp('expiresAt').notNull(),
  createdAt: timestamp('createdAt').defaultNow(),
  updatedAt: timestamp('updatedAt').defaultNow(),
})

/**
 * Investigation reports. The full three-page form payload is stored encrypted
 * (AES-256-GCM) in `encryptedData`; only non-sensitive search keys are kept in
 * plaintext columns so the Saved Reports page can filter server-side.
 */
export const reports = pgTable('reports', {
  id: text('id').primaryKey(),
  userId: text('userId').notNull(),
  title: text('title').notNull().default(''),
  firNumber: text('firNumber').notNull().default(''),
  caseNumber: text('caseNumber').notNull().default(''),
  policeStation: text('policeStation').notNull().default(''),
  district: text('district').notNull().default(''),
  reportDate: text('reportDate').notNull().default(''),
  status: text('status').notNull().default('draft'),
  encryptedData: text('encryptedData').notNull().default(''),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})

export const userSettings = pgTable('user_settings', {
  userId: text('userId').primaryKey(),
  uiLanguage: text('uiLanguage').notNull().default('ur'),
  voiceLanguage: text('voiceLanguage').notNull().default('ur-PK'),
  defaultDistrict: text('defaultDistrict').notNull().default(''),
  defaultPoliceStation: text('defaultPoliceStation').notNull().default(''),
  officerName: text('officerName').notNull().default(''),
  officerRank: text('officerRank').notNull().default(''),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})
