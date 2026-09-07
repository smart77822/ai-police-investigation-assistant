'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useState } from 'react'
import {
  LayoutDashboard,
  FilePlus2,
  FileText,
  Bot,
  FolderOpen,
  Settings,
  LogOut,
  Menu,
  ShieldCheck,
  Languages,
} from 'lucide-react'
import { authClient } from '@/lib/auth-client'
import { useLang } from '@/components/lang-provider'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import type { Lang } from '@/lib/report-schema'

interface Props {
  user: { name: string; email: string }
  currentReportId: string | null
  children: React.ReactNode
}

export function AppShell({ user, currentReportId, children }: Props) {
  const { t, lang, setLang } = useLang()
  const pathname = usePathname()
  const router = useRouter()
  const [open, setOpen] = useState(false)

  const reportBase = currentReportId ? `/reports/${currentReportId}` : null
  const pageHref = (n: 1 | 2 | 3) => (reportBase ? `${reportBase}/page-${n}` : '/reports/new')

  const nav = [
    { href: '/', label: t('dashboard'), icon: LayoutDashboard, exact: true },
    { href: '/reports/new', label: t('newReport'), icon: FilePlus2 },
    { href: pageHref(1), label: t('page1'), icon: FileText, match: /\/page-1$/ },
    { href: pageHref(2), label: t('page2'), icon: FileText, match: /\/page-2$/ },
    { href: pageHref(3), label: t('page3'), icon: FileText, match: /\/page-3$/ },
    { href: '/assistant', label: t('aiAssistant'), icon: Bot },
    { href: '/reports', label: t('savedReports'), icon: FolderOpen, exact: true },
    { href: '/settings', label: t('settings'), icon: Settings },
  ]

  function isActive(item: (typeof nav)[number]) {
    if (item.match) return item.match.test(pathname)
    if (item.exact) return pathname === item.href
    return pathname.startsWith(item.href)
  }

  async function signOut() {
    await authClient.signOut()
    router.push('/sign-in')
    router.refresh()
  }

  const NavList = (
    <nav aria-label="Main" className="flex flex-col gap-1">
      {nav.map((item) => {
        const Icon = item.icon
        const active = isActive(item)
        return (
          <Link
            key={item.label}
            href={item.href}
            onClick={() => setOpen(false)}
            aria-current={active ? 'page' : undefined}
            className={cn(
              'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
              active
                ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                : 'text-sidebar-foreground/80 hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground',
              lang === 'ur' && 'font-urdu text-base',
            )}
          >
            <Icon className="size-4 shrink-0" aria-hidden="true" />
            <span>{item.label}</span>
          </Link>
        )
      })}
    </nav>
  )

  const LangSwitch = (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button variant="ghost" size="sm" className="gap-2 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground" />
        }
      >
        <Languages className="size-4" aria-hidden="true" />
        <span className="text-xs uppercase">{lang === 'ur' ? 'اردو' : lang === 'en' ? 'EN' : 'Roman'}</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {(['ur', 'en', 'roman'] as Lang[]).map((l) => (
          <DropdownMenuItem key={l} onClick={() => setLang(l)} className={cn(l === lang && 'font-semibold')}>
            {l === 'ur' ? 'اردو — Urdu' : l === 'en' ? 'English' : 'Roman Urdu'}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )

  return (
    <div className="min-h-dvh flex bg-background">
      <aside className="hidden lg:flex w-64 shrink-0 flex-col bg-sidebar text-sidebar-foreground border-e border-sidebar-border">
        <div className="flex items-center gap-3 px-4 py-5 border-b border-sidebar-border">
          <span className="flex size-9 items-center justify-center rounded-md bg-sidebar-primary text-sidebar-primary-foreground">
            <ShieldCheck className="size-5" aria-hidden="true" />
          </span>
          <div className="min-w-0">
            <p className="text-sm font-semibold leading-tight">Investigation Reports</p>
            <p className="urdu-text text-sm leading-tight text-sidebar-foreground/70">تفتیشی رپورٹ اسسٹنٹ</p>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto px-3 py-4">{NavList}</div>
        <div className="border-t border-sidebar-border p-3 flex flex-col gap-2">
          <div className="flex items-center justify-between gap-2">
            <div className="min-w-0">
              <p className="truncate text-sm font-medium">{user.name}</p>
              <p className="truncate text-xs text-sidebar-foreground/60">{user.email}</p>
            </div>
            {LangSwitch}
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={signOut}
            className="justify-start gap-2 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
          >
            <LogOut className="size-4" aria-hidden="true" />
            {t('signOut')}
          </Button>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="lg:hidden sticky top-0 z-30 flex items-center justify-between gap-2 bg-sidebar text-sidebar-foreground px-3 py-2 border-b border-sidebar-border">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger
              render={<Button variant="ghost" size="icon" aria-label="Open menu" className="text-sidebar-foreground hover:bg-sidebar-accent" />}
            >
              <Menu className="size-5" />
            </SheetTrigger>
            <SheetContent side="left" className="w-72 bg-sidebar text-sidebar-foreground border-sidebar-border p-0">
              <SheetTitle className="sr-only">Navigation</SheetTitle>
              <div className="flex items-center gap-3 px-4 py-5 border-b border-sidebar-border">
                <ShieldCheck className="size-5 text-sidebar-primary" aria-hidden="true" />
                <p className="text-sm font-semibold">Investigation Reports</p>
              </div>
              <div className="px-3 py-4">{NavList}</div>
              <div className="border-t border-sidebar-border p-3">
                <Button variant="ghost" size="sm" onClick={signOut} className="w-full justify-start gap-2 text-sidebar-foreground">
                  <LogOut className="size-4" aria-hidden="true" />
                  {t('signOut')}
                </Button>
              </div>
            </SheetContent>
          </Sheet>
          <p className="text-sm font-semibold truncate">Investigation Reports</p>
          {LangSwitch}
        </header>
        <main className="flex-1 min-w-0">{children}</main>
      </div>
    </div>
  )
}
