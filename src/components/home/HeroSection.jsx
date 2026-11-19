import { BadgeCheck, RotateCcw, Truck } from 'lucide-react'
import { Link } from 'react-router-dom'

const TRUST_POINTS = [
  { label: 'Authentic handloom', Icon: BadgeCheck },
  { label: 'Free delivery ₹1,999+', Icon: Truck },
  { label: '7-day easy returns', Icon: RotateCcw },
]

const QUICK_LINKS = [
  {
    to: '/shop?maxPrice=2000',
    eyebrow: 'Little luxuries',
    title: 'Under ₹2,000',
    symbol: '₹',
    symbolClass: 'text-xl',
  },
  {
    to: '/shop',
    eyebrow: 'Festive edit',
    title: '20% off & more',
    symbol: '%',
    symbolClass: 'text-2xl',
  },
]

const focusRing =
  'focus:outline-none focus-visible:ring-2 focus-visible:ring-[#b88a3e] focus-visible:ring-offset-2 focus-visible:ring-offset-[#fffaf0]'

function HeroSection() {
  return (
    <section
      aria-labelledby="hero-heading"
      className="relative overflow-hidden bg-[#fffaf0] px-4 pb-10 pt-8 sm:px-7 sm:pb-16 sm:pt-12"
    >
      <div className="mx-auto max-w-4xl text-center">
        <p className="mb-5 inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-[#81622f] sm:text-xs">
          <span aria-hidden="true" className="h-2.5 w-2.5 rotate-45 bg-[#b88a3e]" />
          Handloom · Made by artisans
        </p>

        <h1
          id="hero-heading"
          className="mx-auto max-w-3xl text-[38px] font-semibold leading-[1.12] tracking-[-0.045em] text-[#2c1e19] sm:text-6xl sm:leading-[1.08]"
        >
          Handwoven sarees,
          <span className="mt-1 block text-[#b98791]">straight from the weavers.</span>
        </h1>

        <p className="mx-auto mt-5 max-w-2xl text-[16px] leading-7 text-[#71645b] sm:mt-7 sm:text-xl sm:leading-9">
          Banarasi, organza, kora silk and more — real zari, real handloom, delivered to your door.
        </p>

        <div className="mx-auto mt-7 flex w-full max-w-md gap-2 sm:mt-9 sm:w-auto sm:justify-center sm:gap-3">
          <Link
            to="/shop"
            className={`inline-flex min-h-14 min-w-0 flex-1 items-center justify-center whitespace-nowrap rounded-2xl bg-[#b88a3e] px-2 text-sm font-semibold text-[#2c1e19] shadow-sm transition hover:bg-[#a77b34] sm:flex-none sm:px-8 sm:text-base ${focusRing}`}
          >
            Shop all sarees
          </Link>
          <Link
            to="/shop?sort=new"
            className={`inline-flex min-h-14 min-w-0 flex-1 items-center justify-center whitespace-nowrap rounded-2xl border border-[#2c1e19] px-2 text-sm font-semibold text-[#2c1e19] transition hover:bg-[#eee7d7] sm:flex-none sm:px-8 sm:text-base ${focusRing}`}
          >
            See new arrivals
          </Link>
        </div>
      </div>

      <ul className="mt-8 flex flex-wrap items-center justify-center gap-x-5 gap-y-3 text-[13px] text-[#71645b] sm:mt-10 sm:gap-x-8 sm:text-sm">
        {TRUST_POINTS.map(({ label, Icon }) => (
          <li key={label} className="inline-flex items-center gap-2">
            <Icon size={19} aria-hidden="true" className="shrink-0 text-[#85642e]" />
            {label}
          </li>
        ))}
      </ul>

      <nav
        aria-label="Shop highlights"
        className="mx-auto mt-7 grid max-w-4xl grid-cols-2 gap-3 sm:mt-9 sm:gap-4"
      >
        {QUICK_LINKS.map((link) => (
          <Link
            key={link.title}
            to={link.to}
            className={`group flex min-h-[84px] items-center gap-3 rounded-2xl border border-[#e2d9c5] bg-[#fffdf7] px-3 py-3 shadow-[0_5px_18px_rgba(44,30,25,0.04)] transition hover:border-[#b88a3e] sm:min-h-28 sm:gap-4 sm:px-6 ${focusRing}`}
          >
            <span
              aria-hidden="true"
              className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#f6f0e2] text-[#b98791] transition group-hover:bg-[#b88a3e] group-hover:text-[#2c1e19] sm:h-14 sm:w-14 ${link.symbolClass}`}
            >
              {link.symbol}
            </span>
            <span className="min-w-0">
              <span className="block text-[10px] uppercase tracking-wider text-[#8a7e71] sm:text-xs">
                {link.eyebrow}
              </span>
              <span className="mt-1 block text-sm font-semibold leading-5 text-[#2c1e19] sm:text-lg">
                {link.title}
              </span>
            </span>
          </Link>
        ))}
      </nav>
    </section>
  )
}

export default HeroSection