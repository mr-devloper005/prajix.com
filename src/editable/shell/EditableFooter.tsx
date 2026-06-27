'use client'

import Link from 'next/link'
import { SITE_CONFIG } from '@/lib/site-config'
import { globalContent } from '@/editable/content/global.content'
import { useEditableLocalAuthSession } from '@/editable/components/EditableLocalAuthForms'

export function EditableFooter() {
  const year = new Date().getFullYear()
  const { session, logout } = useEditableLocalAuthSession()

  return (
    <footer className="border-t border-[var(--editable-border)] bg-[var(--editable-footer-bg)] text-[var(--editable-footer-text)]">
      <div className="mx-auto max-w-[var(--editable-container)] px-4 py-14 sm:px-6 sm:py-16 lg:px-8">
        <div className="border-b border-[var(--editable-border)] pb-10">
          <div className="rounded-[1.8rem] border border-[var(--editable-border)] bg-white px-6 py-7">
            <h3 className="editable-display text-2xl font-semibold tracking-[-0.04em] text-[var(--slot4-page-text)]">{SITE_CONFIG.name}</h3>
            <p className="mt-3 max-w-md text-[15px] leading-7 text-[var(--slot4-muted-text)]">
              {globalContent.footer?.description || SITE_CONFIG.description}
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-6 pt-8 text-sm text-[var(--slot4-muted-text)] lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap gap-x-8 gap-y-3">
            <Link href="/search" className="transition hover:text-[var(--slot4-accent)]">Search</Link>
            <Link href="/about" className="transition hover:text-[var(--slot4-accent)]">About</Link>
            <Link href="/contact" className="transition hover:text-[var(--slot4-accent)]">Contact</Link>
            {session ? (
              <button type="button" onClick={logout} className="text-left transition hover:text-[var(--slot4-accent)]">
                Logout
              </button>
            ) : (
              <>
                <Link href="/login" className="transition hover:text-[var(--slot4-accent)]">Sign In</Link>
                <Link href="/signup" className="transition hover:text-[var(--slot4-accent)]">Get Access</Link>
              </>
            )}
          </div>
          <p>
            &copy; {year} {SITE_CONFIG.name}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
