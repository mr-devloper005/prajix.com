import Link from 'next/link'
import { ArrowRight, Camera, ChevronRight, Star } from 'lucide-react'
import type { SitePost } from '@/lib/site-connector'
import type { HomeTimeSection } from '@/lib/task-data'
import type { TaskKey } from '@/lib/site-config'
import { SITE_CONFIG } from '@/lib/site-config'
import { pagesContent } from '@/editable/content/pages.content'
import { getEditablePostImage, postHref } from '@/editable/cards/PostCards'

type HomeSectionProps = {
  primaryTask: TaskKey
  primaryRoute: string
  posts: SitePost[]
  timeSections: HomeTimeSection[]
}

const container = 'mx-auto w-full max-w-[var(--editable-container)] px-4 sm:px-6 lg:px-8'

function getExcerpt(post?: SitePost | null, limit = 140) {
  const content = post?.content && typeof post.content === 'object' ? (post.content as Record<string, unknown>) : {}
  const raw =
    (typeof content.description === 'string' && content.description) ||
    (typeof content.summary === 'string' && content.summary) ||
    post?.summary ||
    ''
  const clean = raw.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
  return clean.length > limit ? `${clean.slice(0, limit).trim()}...` : clean
}

function getCategory(post?: SitePost | null) {
  const content = post?.content && typeof post.content === 'object' ? (post.content as Record<string, unknown>) : {}
  return (typeof content.category === 'string' && content.category) || post?.tags?.[0] || 'Featured'
}

function dedupePosts(posts: SitePost[]) {
  const seen = new Set<string>()
  return posts.filter((post) => {
    const key = post.slug || post.id || post.title
    if (!key || seen.has(key)) return false
    seen.add(key)
    return true
  })
}

function hashStr(value: string) {
  let h = 0
  for (let i = 0; i < value.length; i += 1) h = (h * 31 + value.charCodeAt(i)) >>> 0
  return h
}

function ratingOf(post: SitePost) {
  const content = post?.content && typeof post.content === 'object' ? (post.content as Record<string, unknown>) : {}
  const real = Number(content.rating)
  if (real >= 1 && real <= 5) return Math.round(real * 10) / 10
  const h = hashStr(post.slug || post.id || post.title || 'x')
  return Math.round((4.1 + (h % 8) / 10) * 10) / 10
}

function reviewsOf(post: SitePost) {
  const content = post?.content && typeof post.content === 'object' ? (post.content as Record<string, unknown>) : {}
  const real = Number(content.reviewCount ?? content.reviews)
  if (real > 0) return Math.floor(real)
  return 12 + (hashStr((post.slug || post.title || 'x') + 'r') % 340)
}

function Stars({ rating }: { rating: number }) {
  const rounded = Math.round(rating)
  return (
    <span className="inline-flex items-center gap-[3px]">
      {[0, 1, 2, 3, 4].map((i) => (
        <Star
          key={i}
          className={`h-3.5 w-3.5 ${i < rounded ? 'fill-[var(--slot4-gold)] text-[var(--slot4-gold)]' : 'fill-white/20 text-white/20'}`}
        />
      ))}
    </span>
  )
}

function EditorialEyebrow({ children, light = false }: { children: React.ReactNode; light?: boolean }) {
  return (
    <p className={`text-[11px] font-semibold uppercase tracking-[0.34em] ${light ? 'text-white/72' : 'text-[var(--slot4-accent)]'}`}>
      {children}
    </p>
  )
}

function SectionHeading({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow: string
  title: string
  description?: string
  action?: { href: string; label: string }
}) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="max-w-2xl">
        <EditorialEyebrow>{eyebrow}</EditorialEyebrow>
        <h2 className="editable-display mt-3 text-3xl font-semibold leading-[1.02] tracking-[-0.04em] text-[var(--slot4-page-text)] sm:text-4xl">
          {title}
        </h2>
        {description ? <p className="mt-3 text-[15px] leading-7 text-[var(--slot4-muted-text)]">{description}</p> : null}
      </div>
      {action ? (
        <Link href={action.href} className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--slot4-page-text)] transition hover:text-[var(--slot4-accent)]">
          {action.label} <ArrowRight className="h-4 w-4" />
        </Link>
      ) : null}
    </div>
  )
}

function FeatureSpotlight({ post, href }: { post: SitePost; href: string }) {
  const rating = ratingOf(post)
  return (
    <Link
      href={href}
      className="group relative block overflow-hidden rounded-[2rem] border border-white/12 bg-[var(--slot4-dark-bg)] text-white shadow-[0_30px_80px_rgba(7,10,30,0.45)]"
    >
      <div className="relative min-h-[520px] overflow-hidden lg:min-h-[590px]">
        <img
          src={getEditablePostImage(post)}
          alt={post.title}
          className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-[1.035]"
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(11,16,44,0.12)_10%,rgba(7,10,30,0.86)_72%,rgba(7,10,30,0.96)_100%)]" />
        <div className="relative z-10 flex h-full flex-col justify-end px-6 py-8 sm:px-10 sm:py-10">
          <EditorialEyebrow light>{pagesContent.home.hero.badge || 'Featured collection'}</EditorialEyebrow>
          <h1 className="editable-display mt-4 max-w-3xl text-balance text-4xl font-semibold leading-[0.98] tracking-[-0.055em] text-white sm:text-5xl lg:text-[4.4rem]">
            {post.title}
          </h1>
          <p className="mt-5 max-w-xl text-[15px] leading-7 text-white/76 sm:text-base">{getExcerpt(post, 210) || pagesContent.home.hero.description}</p>
          <div className="mt-8 flex flex-wrap items-center gap-4 text-sm">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 backdrop-blur-sm">
              <Stars rating={rating} />
              <span className="font-semibold">{rating.toFixed(1)}</span>
              <span className="text-white/62">({reviewsOf(post)})</span>
            </span>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-white/74 backdrop-blur-sm">
              <Camera className="h-4 w-4 text-[var(--slot4-accent)]" />
              {getCategory(post)}
            </span>
          </div>
        </div>
      </div>
    </Link>
  )
}

function CompactCollectionCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  return (
    <Link
      href={href}
      className="group flex gap-4 rounded-[1.6rem] border border-[var(--editable-border)] bg-white p-4 transition duration-300 hover:-translate-y-1 hover:border-[var(--slot4-accent)]/30 hover:shadow-[0_24px_54px_rgba(19,24,58,0.1)]"
    >
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[var(--slot4-soft-accent)] text-sm font-semibold text-[var(--slot4-page-text)]">
        {String(index + 1).padStart(2, '0')}
      </div>
      <div className="min-w-0">
        <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[var(--slot4-accent)]">{getCategory(post)}</p>
        <h3 className="mt-2 line-clamp-2 text-lg font-semibold leading-tight tracking-[-0.03em] text-[var(--slot4-page-text)]">{post.title}</h3>
        <p className="mt-2 line-clamp-2 text-sm leading-6 text-[var(--slot4-muted-text)]">{getExcerpt(post, 90)}</p>
      </div>
    </Link>
  )
}

function CompareCard({ title, copy }: { title: string; copy: string }) {
  return (
    <div className="rounded-[1.7rem] border border-[var(--editable-border)] bg-white p-6">
      <h3 className="text-xl font-semibold tracking-[-0.03em] text-[var(--slot4-page-text)]">{title}</h3>
      <p className="mt-3 text-[15px] leading-7 text-[var(--slot4-muted-text)]">{copy}</p>
    </div>
  )
}

function TestimonialCard({ post }: { post: SitePost }) {
  return (
    <article className="rounded-[1.55rem] border border-white/10 bg-white/6 p-6 text-white/88 backdrop-blur-sm">
      <p className="text-lg leading-8">"{getExcerpt(post, 110) || 'A polished source of fresh visuals and thoughtful profiles every time I visit.'}"</p>
      <p className="mt-5 text-sm font-medium text-white/50">- {post.title}</p>
    </article>
  )
}

function ShowcaseCard({ post, href, tone }: { post: SitePost; href: string; tone: 'light' | 'dark' | 'accent' }) {
  const toneClass =
    tone === 'dark'
      ? 'bg-[var(--slot4-dark-bg)] text-white border-white/8'
      : tone === 'accent'
      ? 'bg-[linear-gradient(160deg,var(--slot4-indigo),var(--slot4-indigo-2))] text-white border-transparent'
      : 'bg-white text-[var(--slot4-page-text)] border-[var(--editable-border)]'
  const buttonClass =
    tone === 'light'
      ? 'border border-[var(--slot4-page-text)]/16 text-[var(--slot4-page-text)] hover:border-[var(--slot4-accent)] hover:text-[var(--slot4-accent)]'
      : 'border border-white/20 text-white hover:bg-white/8'

  return (
    <Link
      href={href}
      className={`group relative flex min-h-[360px] flex-col justify-between overflow-hidden rounded-[1.8rem] border p-7 transition duration-300 hover:-translate-y-1 hover:shadow-[0_28px_64px_rgba(16,20,44,0.14)] ${toneClass}`}
    >
      <div>
        <p className={`text-[11px] font-semibold uppercase tracking-[0.26em] ${tone === 'light' ? 'text-[var(--slot4-accent)]' : 'text-white/60'}`}>
          {getCategory(post)}
        </p>
        <h3 className="editable-display mt-4 text-3xl font-semibold leading-[1.02] tracking-[-0.04em]">{post.title}</h3>
        <p className={`mt-4 text-[15px] leading-7 ${tone === 'light' ? 'text-[var(--slot4-muted-text)]' : 'text-white/72'}`}>{getExcerpt(post, 150)}</p>
      </div>
      <span className={`inline-flex w-fit items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold transition ${buttonClass}`}>
        View collection <ChevronRight className="h-4 w-4" />
      </span>
      <img
        src={getEditablePostImage(post)}
        alt=""
        className={`pointer-events-none absolute bottom-0 right-0 h-48 w-40 rounded-tl-[1.6rem] object-cover transition duration-500 group-hover:scale-[1.03] ${tone === 'light' ? 'opacity-100' : 'opacity-80'}`}
      />
    </Link>
  )
}

function MosaicCard({ post, href, tall = false }: { post: SitePost; href: string; tall?: boolean }) {
  return (
    <Link href={href} className={`group block overflow-hidden rounded-[1.35rem] ${tall ? 'sm:row-span-2' : ''}`}>
      <div className={`relative overflow-hidden bg-[var(--slot4-media-bg)] ${tall ? 'aspect-[4/5] h-full min-h-[420px]' : 'aspect-[4/3]'}`}>
        <img
          src={getEditablePostImage(post)}
          alt={post.title}
          className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-[1.045]"
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(9,12,31,0.02),rgba(9,12,31,0.42)_68%,rgba(9,12,31,0.76))]" />
        <div className="absolute inset-x-0 bottom-0 p-5 text-white">
          <p className="text-[10px] font-semibold uppercase tracking-[0.26em] text-white/66">{getCategory(post)}</p>
          <h3 className="mt-2 line-clamp-2 text-xl font-semibold leading-tight tracking-[-0.03em]">{post.title}</h3>
        </div>
      </div>
    </Link>
  )
}

export function EditableHomeHero({ primaryTask, primaryRoute, posts, timeSections }: HomeSectionProps) {
  const pool = dedupePosts([...posts, ...timeSections.flatMap((section) => section.posts)])
  const featured = pool[0]
  const compact = pool.slice(1, 5)

  if (!featured) return null

  return (
    <section className="relative overflow-hidden border-b border-[var(--editable-border)] bg-[var(--slot4-page-bg)]">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[340px] bg-[linear-gradient(180deg,rgba(250,88,182,0.06),transparent_60%)]" />
      <div className={`pt-10 pb-14 sm:pt-16 sm:pb-20 ${container}`}>
        <div className="h-24 border-b border-[var(--editable-border)]/70 sm:h-40" />
        <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1.15fr)_360px] lg:items-start">
          <FeatureSpotlight post={featured} href={postHref(primaryTask, featured, primaryRoute)} />
          <div className="space-y-4">
            <div className="rounded-[1.8rem] border border-[var(--editable-border)] bg-white p-6">
              <EditorialEyebrow>{pagesContent.home.hero.focusLabel || 'Curated focus'}</EditorialEyebrow>
              <h2 className="editable-display mt-3 text-3xl font-semibold leading-[1.04] tracking-[-0.04em] text-[var(--slot4-page-text)]">
                {pagesContent.home.hero.title?.join(' ') || `Fresh perspectives from ${SITE_CONFIG.name}`}
              </h2>
              <p className="mt-4 text-[15px] leading-7 text-[var(--slot4-muted-text)]">{pagesContent.home.hero.description}</p>
            </div>
            {compact.map((post, index) => (
              <CompactCollectionCard key={post.id || post.slug || index} post={post} href={postHref(primaryTask, post, primaryRoute)} index={index} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export function EditableStoryRail({ primaryTask, primaryRoute, posts, timeSections }: HomeSectionProps) {
  const pool = dedupePosts([...posts, ...timeSections.flatMap((section) => section.posts)])
  const comparePosts = pool.slice(0, 4)
  if (!comparePosts.length) return null

  const compareCopy = comparePosts.map((post) => ({
    title: post.title,
    copy: getExcerpt(post, 150) || 'Thoughtful image stories, profile features, and browsing pages designed to feel easy to move through.',
  }))

  return (
    <section className="bg-[var(--slot4-page-bg)]">
      <div className={`py-16 sm:py-20 ${container}`}>
        <SectionHeading
          eyebrow="Built-in vs. curated"
          title="A cleaner way to browse visual stories and standout profiles."
          description="Structured sections, generous spacing, and a strong editorial rhythm keep discovery feeling focused instead of crowded."
          action={{ href: primaryRoute, label: `Browse ${SITE_CONFIG.tasks.find((task) => task.key === primaryTask)?.label?.toLowerCase() || 'latest posts'}` }}
        />
        <div className="mt-10 grid gap-px overflow-hidden rounded-[1.8rem] border border-[var(--editable-border)] bg-[var(--editable-border)] lg:grid-cols-4">
          {compareCopy.map((item) => <CompareCard key={item.title} title={item.title} copy={item.copy} />)}
        </div>
      </div>
    </section>
  )
}

export function EditableMagazineSplit({ primaryTask, primaryRoute, posts, timeSections }: HomeSectionProps) {
  const pool = dedupePosts([...posts, ...timeSections.flatMap((section) => section.posts)])
  const testimonials = pool.slice(0, 3)
  const showcases = pool.slice(3, 6)
  if (!testimonials.length) return null

  return (
    <>
      <section className="bg-[var(--slot4-dark-bg)] text-white">
        <div className={`py-16 sm:py-20 ${container}`}>
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:gap-10">
            <h2 className="editable-display text-4xl font-semibold leading-none tracking-[-0.05em] text-white sm:text-5xl">Loved for the visual pace</h2>
            <p className="text-lg italic text-white/55">"A refined place to discover new imagery and the people behind it."</p>
          </div>
          <div className="mt-10 grid gap-5 lg:grid-cols-3">
            {testimonials.map((post) => <TestimonialCard key={post.id || post.slug} post={post} />)}
          </div>
        </div>
      </section>

      <section className="bg-[var(--slot4-page-bg)]">
        <div className={`py-16 sm:py-20 ${container}`}>
          <SectionHeading
            eyebrow="What you get"
            title="Multiple ways to enter the collection."
            description="Featured stories, compact summaries, and image-led panels create variety without losing the calm editorial feel."
          />
          <div className="mt-10 grid gap-5 lg:grid-cols-3">
            {showcases.map((post, index) => (
              <ShowcaseCard
                key={post.id || post.slug || index}
                post={post}
                href={postHref(primaryTask, post, primaryRoute)}
                tone={index === 0 ? 'light' : index === 1 ? 'dark' : 'accent'}
              />
            ))}
          </div>
        </div>
      </section>
    </>
  )
}

export function EditableTimeCollections({ primaryTask, primaryRoute, posts, timeSections }: HomeSectionProps) {
  const sections =
    timeSections.length > 0
      ? timeSections
      : ([
          { key: 'spotlight', posts: posts.slice(0, 8), href: primaryRoute },
          { key: 'browse', posts: posts.slice(8, 16), href: primaryRoute },
        ] as Pick<HomeTimeSection, 'key' | 'posts' | 'href'>[])

  const firstSection = sections.find((section) => section.posts.length)
  const mosaicPosts = firstSection?.posts.slice(0, 7) || []
  if (!mosaicPosts.length) return null

  return (
    <>
      <section className="bg-[var(--slot4-page-bg)]">
        <div className={`py-16 sm:py-20 ${container}`}>
          <SectionHeading
            eyebrow="Latest collections"
            title="A hand-picked image grid to start from."
            action={{ href: firstSection?.href || primaryRoute, label: 'See all collections' }}
          />
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {mosaicPosts.map((post, index) => (
              <MosaicCard
                key={post.id || post.slug || index}
                post={post}
                href={postHref(primaryTask, post, primaryRoute)}
                tall={index === 0 || index === 4}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[var(--slot4-page-bg)]">
        <div className={`pb-20 ${container}`}>
          <div className="rounded-[2rem] border border-[var(--editable-border)] bg-white px-6 py-8 sm:px-9 sm:py-10">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div className="max-w-xl">
                <h3 className="editable-display text-3xl font-semibold tracking-[-0.04em] text-[var(--slot4-page-text)]">Need help finding the right place to start?</h3>
                <p className="mt-3 text-[15px] leading-7 text-[var(--slot4-muted-text)]">
                  Explore image stories, profile pages, and curated posts through sections designed to stay clear even as the collection grows.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export function EditableHomeCta() {
  const links = SITE_CONFIG.tasks.filter((task) => task.enabled).slice(0, 10)

  return (
    <section className="border-t border-[var(--editable-border)] bg-[var(--slot4-soft-bg)]">
      <div className={`py-14 sm:py-16 ${container}`}>
        <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-[var(--slot4-muted-text)]">Popular sections</p>
        <div className="mt-6 flex flex-wrap gap-x-6 gap-y-3 text-sm text-[var(--slot4-muted-text)]">
          {links.map((task) => (
            <Link key={task.key} href={task.route} className="transition hover:text-[var(--slot4-accent)]">
              {task.label}
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
