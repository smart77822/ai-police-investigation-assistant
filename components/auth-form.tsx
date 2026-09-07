'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { authClient } from '@/lib/auth-client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ShieldCheck } from 'lucide-react'

export function AuthForm({ mode }: { mode: 'sign-in' | 'sign-up' }) {
  const router = useRouter()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    const result =
      mode === 'sign-up'
        ? await authClient.signUp.email({ email, password, name })
        : await authClient.signIn.email({ email, password })
    setLoading(false)
    if (result.error) {
      setError(
        mode === 'sign-up'
          ? 'Could not create the account. Check the details and try again.'
          : 'Sign-in failed. Check your email and password.',
      )
      return
    }
    router.push('/')
    router.refresh()
  }

  return (
    <main className="min-h-dvh flex flex-col items-center justify-center bg-sidebar px-4 py-10">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center gap-3 text-center text-sidebar-foreground mb-8">
          <span className="flex size-12 items-center justify-center rounded-md bg-sidebar-primary text-sidebar-primary-foreground">
            <ShieldCheck className="size-6" aria-hidden="true" />
          </span>
          <div>
            <h1 className="text-lg font-semibold tracking-tight">AI Police Investigation Report Assistant</h1>
            <p className="urdu-text text-base text-sidebar-foreground/80">اے آئی پولیس تفتیشی رپورٹ اسسٹنٹ</p>
          </div>
          <p className="text-xs text-sidebar-foreground/70">Authorized personnel only. All reports are encrypted at rest.</p>
        </div>

        <form onSubmit={onSubmit} className="rounded-lg bg-card text-card-foreground p-6 flex flex-col gap-4 shadow-lg">
          <h2 className="text-base font-semibold">{mode === 'sign-up' ? 'Create account' : 'Sign in'}</h2>
          {mode === 'sign-up' && (
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="name">Officer name</Label>
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required autoComplete="name" />
            </div>
          )}
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email" />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
              autoComplete={mode === 'sign-up' ? 'new-password' : 'current-password'}
            />
          </div>
          {error && (
            <p role="alert" className="text-sm text-destructive">
              {error}
            </p>
          )}
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? 'Please wait…' : mode === 'sign-up' ? 'Create account' : 'Sign in'}
          </Button>
          <p className="text-sm text-muted-foreground text-center">
            {mode === 'sign-up' ? (
              <>
                Already have an account?{' '}
                <Link href="/sign-in" className="text-primary underline underline-offset-4">
                  Sign in
                </Link>
              </>
            ) : (
              <>
                New officer?{' '}
                <Link href="/sign-up" className="text-primary underline underline-offset-4">
                  Create an account
                </Link>
              </>
            )}
          </p>
        </form>
      </div>
    </main>
  )
}
