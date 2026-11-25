import { useEffect, useRef, useState } from 'react'
import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import ImageWithFallback from '../ImageWithFallback'

function CategorySection({ categories }) {
  const scrollRef = useRef(null)
  const scrollPosRef = useRef(0)
  const [isPaused, setIsPaused] = useState(false)

  const visibleCategories = categories.slice(0, 10)
  const shouldLoop = visibleCategories.length > 1
  const displayCategories = shouldLoop ? [...visibleCategories, ...visibleCategories] : visibleCategories

  useEffect(() => {
    const container = scrollRef.current
    if (!container || !shouldLoop) return undefined

    let frameId
    let lastTime = performance.now()
    const pixelsPerSecond = 42

    const step = (now) => {
      const delta = Math.min(now - lastTime, 50)
      lastTime = now

      if (!isPaused) {
        const halfWidth = container.scrollWidth / 2
        scrollPosRef.current += (pixelsPerSecond * delta) / 1000
        if (halfWidth > 0 && scrollPosRef.current >= halfWidth) {
          scrollPosRef.current -= halfWidth
        }
        container.scrollLeft = scrollPosRef.current
      }

      frameId = window.requestAnimationFrame(step)
    }

    frameId = window.requestAnimationFrame(step)
    return () => window.cancelAnimationFrame(frameId)
  }, [isPaused, shouldLoop, visibleCategories.length])

  const handleManualScroll = () => {
    if (isPaused && scrollRef.current) {
      scrollPosRef.current = scrollRef.current.scrollLeft
    }
  }

  return (
    <section className="py-9 sm:py-16" id="collections">
      <div className="mx-auto max-w-7xl px-4 sm:px-7">
        <div className="mb-6 flex items-end justify-between gap-3 sm:mb-8 sm:gap-4">
          <div className="min-w-0 text-left">
            <span className="mb-2 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-[#81622f]">
              <span className="h-2.5 w-2.5 rotate-45 bg-[#b88a3e]" />
              Browse
            </span>
            <h2 className="text-[28px] font-semibold leading-tight tracking-[-0.04em] text-[#2c1e19] sm:text-5xl">
              Shop by category
            </h2>
          </div>

          <Link
            to="/shop"
            className="group inline-flex shrink-0 items-center gap-1.5 rounded-full border border-[#d6cbb5] bg-[#fffdf7] px-3.5 py-2 text-xs font-semibold tracking-wide text-[#2c1e19] shadow-sm transition duration-300 hover:border-[#b88a3e] hover:bg-[#2c1e19] hover:text-white hover:shadow-md sm:px-5 sm:py-2.5 sm:text-sm"
          >
            View all
            <ArrowRight size={15} className="transition-transform duration-300 group-hover:translate-x-0.5" />
          </Link>
        </div>

        <div
          ref={scrollRef}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onTouchStart={() => setIsPaused(true)}
          onTouchEnd={() => setIsPaused(false)}
          onScroll={handleManualScroll}
          className="-mx-4 flex gap-4 overflow-x-auto px-4 pb-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:mx-0 sm:gap-5 sm:px-0"
        >
          {displayCategories.map((category, index) => (
            <Link
              key={`${category.id || category.name}-${index}`}
              to={`/shop?category=${encodeURIComponent(category.name)}`}
              className="group relative h-[300px] w-[76vw] max-w-[320px] shrink-0 overflow-hidden rounded-[28px] border border-[#e2d9c5] bg-[#513c34] sm:h-[340px] sm:w-[320px] lg:w-[380px]"
            >
              <ImageWithFallback
                src={category.image}
                alt={category.name}
                className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#211713]/85 via-[#211713]/10 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-5 text-white sm:p-6">
                <span className="block text-2xl font-semibold tracking-tight">
                  {category.name.replace(' Sarees', '')}
                </span>
                <span className="mt-1 block text-sm text-white/80">{category.accent}</span>
                <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold">
                  Shop now <ArrowRight size={17} />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

export default CategorySection
