import { useEffect, useRef, useState } from 'react'
import { Star } from 'lucide-react'

const REVIEWS = [
  {
    id: 'ananya-sharma',
    initials: 'AS',
    name: 'Ananya Sharma',
    city: 'Delhi',
    badgeBg: 'bg-[#f3ead8]',
    badgeText: 'text-[#85642e]',
    quote:
      '“The Banarasi silk quality is unmatched. I felt like wearing a piece of heritage on my wedding day. Every thread tells a story.”',
  },
  {
    id: 'priya-patel',
    initials: 'PP',
    name: 'Priya Patel',
    city: 'Vadodara',
    badgeBg: 'bg-[#f5e8ea]',
    badgeText: 'text-[#b98791]',
    quote:
      '“Absolutely divine design and premium fabric. The sheen of the organza is breathtaking. Fast delivery and simply perfect packaging.”',
  },
  {
    id: 'sneha-reddy',
    initials: 'SR',
    name: 'Sneha Reddy',
    city: 'Hyderabad',
    badgeBg: 'bg-[#eceae6]',
    badgeText: 'text-[#5c534a]',
    quote:
      '“The attention to detail in the zari work is breathtaking. True luxury experience from order to delivery. Will definitely order again!”',
  },
]

const MOBILE_AUTO_SCROLL_MS = 3500

function TestimonialsSection() {
  const scrollRef = useRef(null)
  const indexRef = useRef(0)
  const [isPaused, setIsPaused] = useState(false)

  useEffect(() => {
    if (isPaused) return undefined

    const timer = window.setInterval(() => {
      const container = scrollRef.current
      if (!container || window.innerWidth >= 768) return

      const cards = container.children
      if (!cards.length) return

      indexRef.current = (indexRef.current + 1) % cards.length
      const firstCard = cards[0]
      const targetCard = cards[indexRef.current]
      const targetLeft = targetCard.offsetLeft - firstCard.offsetLeft

      container.scrollTo({ left: targetLeft, behavior: 'smooth' })
    }, MOBILE_AUTO_SCROLL_MS)

    return () => window.clearInterval(timer)
  }, [isPaused])

  return (
    <section
      className="bg-[#fffdf7] px-4 py-14 sm:px-7 sm:py-20"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={() => setIsPaused(true)}
      onTouchEnd={() => setIsPaused(false)}
    >
      <div className="mx-auto max-w-7xl">
        <div className="text-center sm:text-left">
          <span className="mb-5 inline-flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-[#81622f] sm:justify-start">
            <span className="h-2.5 w-2.5 rotate-45 bg-[#b88a3e]" />
            What our customers say
          </span>
          <h2 className="text-[38px] font-semibold leading-tight tracking-[-0.04em] text-[#2c1e19] sm:text-6xl">
            Voices of <span className="text-[#85642e]">Elegance</span>
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-base leading-7 text-[#71645b] sm:mx-0 sm:text-xl sm:leading-8">
            Real stories from women who wear our sarees to their most cherished moments
          </p>
        </div>

        <div
          ref={scrollRef}
          className="-mx-4 mt-10 flex snap-x snap-mandatory scroll-px-4 gap-4 overflow-x-auto px-4 pb-3 [scrollbar-width:none] sm:mt-14 md:mx-0 md:grid md:grid-cols-3 md:gap-6 md:overflow-visible md:px-0 md:pb-0"
        >
          {REVIEWS.map((review) => (
            <article
              key={review.id}
              className="flex w-[84vw] max-w-[340px] shrink-0 snap-start flex-col justify-between rounded-[26px] border border-[#ddd4bf] bg-[#faf7ed] p-6 shadow-[0_10px_30px_rgba(44,30,25,0.06)] sm:p-7 md:w-auto md:max-w-none"
            >
              <div>
                <span className="block h-7 text-4xl leading-none text-[#e5dcc9]">“</span>
                <div
                  className="mt-2 flex gap-1 text-[#b88a3e]"
                  aria-label="5 out of 5 stars"
                >
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} size={18} fill="currentColor" />
                  ))}
                </div>
                <blockquote className="mt-4 text-base italic leading-7 text-[#71645b] sm:text-[17px] sm:leading-8">
                  {review.quote}
                </blockquote>
              </div>
              <div className="mt-6 flex items-center gap-3 border-t border-[#e2d9c5] pt-5">
                <span
                  className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-sm font-semibold ${review.badgeBg} ${review.badgeText}`}
                >
                  {review.initials}
                </span>
                <span>
                  <strong className="block text-sm font-semibold text-[#2c1e19] sm:text-base">
                    {review.name}
                  </strong>
                  <small className="text-xs text-[#71645b] sm:text-sm">{review.city}</small>
                </span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

export default TestimonialsSection
