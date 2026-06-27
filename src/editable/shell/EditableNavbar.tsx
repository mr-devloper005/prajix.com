'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LogIn, Menu, Search, UserPlus, X } from 'lucide-react'
import { SITE_CONFIG } from '@/lib/site-config'
import { globalContent } from '@/editable/content/global.content'
import { useEditableLocalAuthSession } from '@/editable/components/EditableLocalAuthForms'

export function EditableNavbar() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  const { session, logout } = useEditableLocalAuthSession()

  const supportLinks = session
    ? [{ label: 'Contact', href: '/contact' }, { label: 'Logout', href: '#' }]
    : [{ label: 'Contact', href: '/contact' }, { label: 'Sign In', href: '/login' }]

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--editable-border)] bg-[var(--editable-nav-bg)]/94 text-[var(--editable-nav-text)] backdrop-blur-xl">
      <nav className="mx-auto flex min-h-[74px] w-full max-w-[var(--editable-container)] items-center gap-4 px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex shrink-0 items-center gap-3">
          <span className="editable-display text-[2rem] font-semibold leading-none tracking-[-0.05em] text-[var(--slot4-page-text)]">
            {SITE_CONFIG.name}
          </span>
        </Link>

        <div className="ml-auto hidden items-center gap-7 lg:flex">
          <Link href="/search" className="text-[15px] font-medium text-[var(--slot4-muted-text)] transition hover:text-[var(--slot4-page-text)]">
            Search
          </Link>
          {session ? (
            <Link href="/create" className="text-[15px] font-medium text-[var(--slot4-muted-text)] transition hover:text-[var(--slot4-page-text)]">
              Create
            </Link>
          ) : null}
          {supportLinks.map((item) => {
            if (item.label === 'Logout') {
              return (
                <button
                  key={item.label}
                  type="button"
                  onClick={logout}
                  className="text-[15px] font-semibold text-[var(--slot4-page-text)] transition hover:text-[var(--slot4-accent)]"
                >
                  Logout
                </button>
              )
            }
            return (
              <Link key={item.href} href={item.href} className="text-[15px] font-medium text-[var(--slot4-muted-text)] transition hover:text-[var(--slot4-page-text)]">
                {item.label}
              </Link>
            )
          })}
        </div>

        <Link
          href={session ? '/create' : '/signup'}
          className="hidden rounded-full bg-[var(--slot4-dark-bg)] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[var(--slot4-indigo)] sm:inline-flex"
        >
          {session ? 'Create' : 'Get Access'}
        </Link>

        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          className="ml-auto inline-flex rounded-full border border-[var(--editable-border)] p-2.5 text-[var(--slot4-page-text)] lg:hidden"
          aria-label="Toggle menu"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      {open ? (
        <div className="border-t border-[var(--editable-border)] bg-white px-4 py-5 lg:hidden">
          <form action="/search" className="flex items-center gap-3 rounded-full border border-[var(--editable-border)] px-4 py-3">
            <Search className="h-4 w-4 text-[var(--slot4-muted-text)]" />
            <input
              name="q"
              type="search"
              placeholder={globalContent.nav.tagline || 'Search'}
              className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-[var(--slot4-muted-text)]"
            />
          </form>

          <div className="mt-5 grid gap-1">
            {[{ label: 'Home', href: '/' }, { label: 'Search', href: '/search' }, ...(session ? [{ label: 'Create', href: '/create' }] : []), { label: 'Contact', href: '/contact' }].map((item) => {
              const active = pathname === item.href || pathname.startsWith(`${item.href}/`)
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={`rounded-2xl px-4 py-3 text-sm font-medium transition ${active ? 'bg-[var(--slot4-soft-accent)] text-[var(--slot4-page-text)]' : 'text-[var(--slot4-muted-text)] hover:bg-[var(--slot4-soft-bg)] hover:text-[var(--slot4-page-text)]'}`}
                >
                  {item.label}
                </Link>
              )
            })}
            {session ? (
              <button
                type="button"
                onClick={() => {
                  logout()
                  setOpen(false)
                }}
                className="rounded-2xl px-4 py-3 text-left text-sm font-medium text-[var(--slot4-muted-text)] transition hover:bg-[var(--slot4-soft-bg)] hover:text-[var(--slot4-page-text)]"
              >
                Logout
              </button>
            ) : (
              <>
                <Link href="/login" onClick={() => setOpen(false)} className="rounded-2xl px-4 py-3 text-sm font-medium text-[var(--slot4-muted-text)] transition hover:bg-[var(--slot4-soft-bg)] hover:text-[var(--slot4-page-text)]">
                  <span className="inline-flex items-center gap-2"><LogIn className="h-4 w-4" /> Sign In</span>
                </Link>
                <Link href="/signup" onClick={() => setOpen(false)} className="rounded-2xl px-4 py-3 text-sm font-medium text-[var(--slot4-muted-text)] transition hover:bg-[var(--slot4-soft-bg)] hover:text-[var(--slot4-page-text)]">
                  <span className="inline-flex items-center gap-2"><UserPlus className="h-4 w-4" /> Get Access</span>
                </Link>
              </>
            )}
          </div>
        </div>
      ) : null}
    </header>
  )
}
