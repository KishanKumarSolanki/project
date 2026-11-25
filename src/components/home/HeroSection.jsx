import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'

const HERO_SLIDES = [
  {
    id: 'blush-linen',
    image: '/images/DSC_0437.webp',
    alt: 'Model draped in a blush pink floral handwoven saree',
    eyebrow: 'ARTISAN HANDLOOM',
    title: 'Blush Floral\nLinen Saree',
    subtitle: 'Handpainted Motifs · Effortless Grace for Every Occasion',
    ctaLabel: 'EXPLORE COLLECTION',
    to: '/shop',
    backdrop: 'from-[#2b1d19] via-[#221613] to-[#170f0d]',
  },
  {
    id: 'ivory-rose',
    image: '/images/DSC_0453.webp',
    alt: 'Model wearing an ivory floral saree with a contrasting pink blouse',
    eyebrow: 'THE ETERNAL WEAVE',
    title: 'A Legacy of\nFloral & Zari',
    subtitle: 'Ivory Linen · The Art of Timeless Weaving',
    ctaLabel: 'DISCOVER COLLECTION',
    to: '/shop?sort=new',
    backdrop: 'from-[#281d18] via-[#1f1612] to-[#150f0c]',
  },
  {
    id: 'aqua-mint',
    image: '/images/DSC_0639.webp',
    alt: 'Model draped in a mint aqua floral handwoven saree',
    eyebrow: 'FESTIVE & DAYWEAR',
    title: 'Aqua Mint\nHandloom',
    subtitle: 'Breezy Drape · Crafted by Skilled Weavers',
    ctaLabel: 'SHOP NOW',
    to: '/shop',
    backdrop: 'from-[#1a2422] via-[#161c1a] to-[#111514]',
  },
]

const AUTO_SCROLL_INTERVAL = 5000

function HeroSection() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const touchStartX = useRef(null)

  const totalSlides = HERO_SLIDES.length

  useEffect(() => {
    if (isPaused) return undefined
    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % totalSlides)
    }, AUTO_SCROLL_INTERVAL)
    return () => window.clearInterval(timer)
  }, [isPaused, totalSlides])

  const handleTouchStart = (event) => {
    touchStartX.current = event.touches[0]?.clientX ?? null
    setIsPaused(true)
  }

  const handleTouchEnd = (event) => {
    if (touchStartX.current !== null) {
      const endX = event.changedTouches[0]?.clientX ?? touchStartX.current
      const diff = touchStartX.current - endX
      if (diff > 45) {
        setActiveIndex((current) => (current + 1) % totalSlides)
      } else if (diff < -45) {
        setActiveIndex((current) => (current - 1 + totalSlides) % totalSlides)
      }
    }
    touchStartX.current = null
    setIsPaused(false)
  }

  return (
    <section
      aria-label="Featured collections"
      className="relative w-full overflow-hidden bg-[#18110e]"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Sliding track */}
      <div
        className="flex transition-transform duration-700 ease-out"
        style={{ transform: `translateX(-${activeIndex * 100}%)` }}
      >
        {HERO_SLIDES.map((slide) => (
          <div
            key={slide.id}
            className={`relative h-[560px] w-full shrink-0 bg-gradient-to-br ${slide.backdrop} sm:h-[600px] md:h-[580px] lg:h-[630px]`}
          >
            {/* Mobile: Full-bleed portrait image */}
            <img
              src={slide.image}
              alt={slide.alt}
              className="h-full w-full object-cover object-top md:hidden"
            />
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-black/10 md:hidden"
            />

            {/* Desktop: Framed editorial layout so portrait saree images show completely & cleanly */}
            <div className="relative mx-auto hidden h-full max-w-7xl items-center justify-between gap-10 px-10 md:flex lg:px-16">
              {/* Subtle warm ambient glow behind image */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute left-16 top-1/2 h-96 w-96 -translate-y-1/2 rounded-full bg-[#c49a55]/15 blur-3xl"
              />

              {/* Left: Cleanly framed portrait saree image */}
              <div className="relative flex h-full w-[48%] items-center justify-center py-7 lg:w-[46%]">
                <div className="relative h-full max-h-[540px] w-full max-w-[400px] overflow-hidden rounded-2xl border border-[#d9b676]/25 bg-black/25 shadow-[0_24px_60px_rgba(0,0,0,0.55)]">
                  <img
                    src={slide.image}
                    alt={slide.alt}
                    className="h-full w-full object-cover object-top transition-transform duration-1000 hover:scale-[1.03]"
                  />
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent"
                  />
                </div>
              </div>

              {/* Right: Editorial typography & CTA */}
              <div className="relative z-10 flex w-[50%] flex-col items-end text-right lg:w-[48%]">
                <span className="inline-flex items-center gap-2.5 text-[11px] font-semibold uppercase tracking-[0.28em] text-[#d9b676]">
                  <span aria-hidden="true" className="h-px w-6 bg-[#d9b676]/70" />
                  {slide.eyebrow}
                </span>

                <h1 className="mt-4 whitespace-pre-line font-serif text-5xl font-semibold leading-[1.08] tracking-tight text-white lg:text-6xl">
                  {slide.title}
                </h1>

                <div className="mt-5 h-[1.5px] w-16 bg-gradient-to-l from-[#d9b676] to-transparent" />

                <p className="mt-4 max-w-md text-base leading-relaxed text-[#e6ddd2]/90 lg:text-lg">
                  {slide.subtitle}
                </p>

                <Link
                  to={slide.to}
                  className="mt-8 inline-flex items-center justify-center rounded-sm border border-[#d9b676]/80 bg-[#d9b676]/10 px-8 py-3.5 text-xs font-semibold uppercase tracking-[0.24em] text-[#f7efe4] transition duration-300 hover:border-[#d9b676] hover:bg-[#d9b676] hover:text-[#1b130f] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#d9b676]"
                >
                  {slide.ctaLabel}
                </Link>
              </div>
            </div>

            {/* Mobile: Bottom-left text overlay */}
            <div className="absolute inset-0 flex items-end justify-start px-6 pb-14 text-left md:hidden">
              <div className="max-w-sm">
                <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#d9b676]">
                  {slide.eyebrow}
                </p>

                <h1 className="mt-2 whitespace-pre-line font-serif text-[36px] font-semibold leading-[1.08] tracking-tight text-white">
                  {slide.title}
                </h1>

                <div className="mt-3.5 h-[1.5px] w-12 bg-[#d9b676]/85" />

                <p className="mt-3 text-sm leading-relaxed text-white/90">
                  {slide.subtitle}
                </p>

                <Link
                  to={slide.to}
                  className="mt-5 inline-flex items-center justify-center rounded-sm border border-[#d9b676]/80 bg-black/35 px-6 py-2.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-white backdrop-blur-xs transition hover:bg-[#d9b676] hover:text-[#1b130f] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#d9b676]"
                >
                  {slide.ctaLabel}
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Pagination Indicators */}
      <div
        className="absolute bottom-5 left-1/2 z-10 flex -translate-x-1/2 items-center gap-2.5"
        role="tablist"
        aria-label="Slide pagination"
      >
        {HERO_SLIDES.map((slide, index) => {
          const isActive = index === activeIndex
          return (
            <button
              key={slide.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              aria-label={`Go to slide ${index + 1}`}
              onClick={() => setActiveIndex(index)}
              className={`h-[3px] rounded-full transition-all duration-300 ${
                isActive ? 'w-9 bg-[#d9b676]' : 'w-4 bg-white/40 hover:bg-white/75'
              }`}
            />
          )
        })}
      </div>
    </section>
  )
}

export default HeroSection