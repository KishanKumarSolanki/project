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
  {
    id: 'meera-iyer',
    initials: 'MI',
    name: 'Meera Iyer',
    city: 'Chennai',
    badgeBg: 'bg-[#f6efe2]',
    badgeText: 'text-[#9a7432]',
    quote:
      '“I gifted a Kanjivaram to my mother and she was in tears. The drape, the lustre, the craftsmanship — every bit worth it.”',
  },
  {
    id: 'kavitha-nair',
    initials: 'KN',
    name: 'Kavitha Nair',
    city: 'Kochi',
    badgeBg: 'bg-[#f5e8ea]',
    badgeText: 'text-[#b98791]',
    quote:
      '“My go-to for handloom sarees. The Chanderi I ordered arrived beautifully packed with a handwritten note. Such a personal touch.”',
  },
]

const AUTO_SCROLL_INTERVAL = 4500

function TestimonialsSection() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const touchStartX = useRef(null)

  const totalReviews = REVIEWS.length

  useEffect(() => {
    if (isPaused) return undefined
    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % totalReviews)
    }, AUTO_SCROLL_INTERVAL)
    return () => window.clearInterval(timer)
  }, [isPaused, totalReviews])

  const handleTouchStart = (event) => {
    touchStartX.current = event.touches[0]?.clientX ?? null
    setIsPaused(true)
  }

  const handleTouchEnd = (event) => {
    if (touchStartX.current !== null) {
      const endX = event.changedTouches[0]?.clientX ?? touchStartX.current
      const diff = touchStartX.current - endX
      if (diff > 40) {
        setActiveIndex((current) => (current + 1) % totalReviews)
      } else if (diff < -40) {
        setActiveIndex((current) => (current - 1 + totalReviews) % totalReviews)
      }
    }
    touchStartX.current = null
    setIsPaused(false)
  }

  return (
    <section
      className="bg-[#fffdf7] px-4 py-14 sm:px-7 sm:py-20"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
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

        {/* Carousel viewport */}
        <div className="mt-10 overflow-hidden sm:mt-14">
          <div
            className="flex transition-transform duration-700 ease-out"
            style={{ transform: `translateX(-${activeIndex * 100}%)` }}
          >
            {REVIEWS.map((review) => (
              <div key={review.id} className="w-full shrink-0 px-0.5">
                <article className="rounded-[28px] border border-[#ddd4bf] bg-[#faf7ed] p-6 shadow-[0_10px_30px_rgba(44,30,25,0.06)] sm:p-10">
                  <span className="block h-8 text-5xl leading-none text-[#eee5d7]">“</span>
                  <div
                    className="mt-2 flex gap-1 text-[#b88a3e]"
                    aria-label="5 out of 5 stars"
                  >
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} size={21} fill="currentColor" />
                    ))}
                  </div>
                  <blockquote className="mt-5 text-lg italic leading-8 text-[#71645b] sm:text-2xl sm:leading-10">
                    {review.quote}
                  </blockquote>
                  <div className="mt-6 flex items-center gap-3 border-t border-[#e2d9c5] pt-5">
                    <span
                      className={`flex h-12 w-12 items-center justify-center rounded-xl text-sm font-semibold ${review.badgeBg} ${review.badgeText}`}
                    >
                      {review.initials}
                    </span>
                    <span>
                      <strong className="block text-base font-semibold text-[#2c1e19]">
                        {review.name}
                      </strong>
                      <small className="text-sm text-[#71645b]">{review.city}</small>
                    </span>
                  </div>
                </article>
              </div>
            ))}
          </div>
        </div>

        {/* Interactive pagination dots */}
        <div
          className="mt-7 flex items-center justify-center gap-2"
          role="tablist"
          aria-label="Customer reviews"
        >
          {REVIEWS.map((review, index) => {
            const isActive = index === activeIndex
            return (
              <button
                key={review.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                aria-label={`Show review by ${review.name}`}
                onClick={() => setActiveIndex(index)}
                className={`h-2.5 rounded-full transition-all duration-300 ${
                  isActive ? 'w-7 bg-[#b98791]' : 'w-2.5 bg-[#dfd5c0] hover:bg-[#cbbd9f]'
                }`}
              />
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default TestimonialsSection
