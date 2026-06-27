import type { CSSProperties } from 'react'
import type { TaskKey } from '@/lib/site-config'

export type TaskTheme = {
  kicker: string
  note: string
  dark: boolean
  fontDisplay: string
  fontBody: string
  bg: string
  surface: string
  raised: string
  text: string
  muted: string
  line: string
  accent: string
  accentSoft: string
  onAccent: string
  glow: string
  radius: string
}

const EDITORIAL_FONT = "'Plus Jakarta Sans', system-ui, -apple-system, 'Helvetica Neue', Arial, sans-serif"

const base = {
  dark: false,
  fontDisplay: EDITORIAL_FONT,
  fontBody: EDITORIAL_FONT,
  bg: '#fbfaf8',
  surface: '#ffffff',
  raised: '#f3f0ec',
  text: '#151528',
  muted: '#6d6a7f',
  line: '#e7e0ea',
  accent: '#7a0bc0',
  accentSoft: '#f7d5ee',
  onAccent: '#ffffff',
  glow: 'rgba(122,11,192,0.08)',
  radius: '1.5rem',
} satisfies Omit<TaskTheme, 'kicker' | 'note'>

export const taskThemes: Record<TaskKey, TaskTheme> = {
  article: { ...base, kicker: 'Journal', note: 'Long-form stories with a polished reading pace.' },
  listing: { ...base, kicker: 'Directory', note: 'Refined profiles for places, studios, and businesses.' },
  classified: { ...base, kicker: 'Offers', note: 'Current opportunities with clearer presentation.' },
  image: { ...base, kicker: 'Gallery', note: 'Image-led pages designed like curated collections.' },
  sbm: { ...base, kicker: 'Saved', note: 'Selected references and links worth opening later.' },
  pdf: { ...base, kicker: 'Library', note: 'Documents presented through a calmer workspace.' },
  profile: { ...base, kicker: 'Profiles', note: 'Identity-first pages with a softer editorial frame.' },
}

export function getTaskTheme(task: TaskKey): TaskTheme {
  return taskThemes[task] || taskThemes.article
}

export function taskThemeStyle(task: TaskKey): CSSProperties {
  const t = getTaskTheme(task)
  return {
    '--tk-bg': t.bg,
    '--tk-surface': t.surface,
    '--tk-raised': t.raised,
    '--tk-text': t.text,
    '--tk-muted': t.muted,
    '--tk-line': t.line,
    '--tk-accent': t.accent,
    '--tk-accent-soft': t.accentSoft,
    '--tk-on-accent': t.onAccent,
    '--tk-glow': t.glow,
    '--tk-radius': t.radius,
    '--slot4-accent': t.accent,
    '--slot4-accent-fill': t.accent,
    '--editable-font-display': t.fontDisplay,
    '--editable-font-body': t.fontBody,
    fontFamily: t.fontBody,
  } as CSSProperties
}
