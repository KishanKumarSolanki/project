import { BadgeCheck, RotateCcw, Truck } from 'lucide-react'
import { Link } from 'react-router-dom'

const promises = [
  { label: 'Authentic handloom', Icon: BadgeCheck },
  { label: 'Free delivery ₹1,999+', Icon: Truck },
  { label: '7-day easy returns', Icon: RotateCcw },
]

function HeroSection() {
  return (
    <section className="px-4 pb-8 pt-6 sm:px-7 sm:pb-14 sm:pt-10">
      <div className="mx-auto max-w-4xl">
        <div className="text-center">
          <div className="mb-5 inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-[#81622f] sm:text-xs">
            <span className="h-2.5 w-2.5 rotate-45 bg-[#b88a3e]" />
            Handloom · Made by artisans
          </div>
          <h1 className="mx-auto max-w-3xl text-[38px] font-semibold leading-[1.12] tracking-[-0.045em] text-[#2c1e19] sm:text-6xl sm:leading-[1.08]">
            Handwoven sarees,<br className="hidden sm:block" /> <span className="text-[#b98791]">straight from the weavers.</span>
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-[16px] leading-7 text-[#71645b] sm:mt-7 sm:text-xl sm:leading-9">
            Banarasi, organza, kora silk and more — real zari, real handloom, delivered to your door.
          </p>
          <div className="mx-auto mt-7 flex max-w-md flex-col gap-3 sm:mt-9 sm:flex-row sm:justify-center">
            <Link to="/shop" className="inline-flex min-h-14 items-center justify-center rounded-2xl bg-[#b88a3e] px-8 text-base font-semibold text-[#2c1e19] shadow-sm transition hover:bg-[#a77b34]">Shop all sarees</Link>
            <Link to="/shop?sort=new" className="inline-flex min-h-14 items-center justify-center rounded-2xl border border-[#2c1e19] px-8 text-base font-semibold text-[#2c1e19] transition hover:bg-[#eee7d7]">See new arrivals</Link>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-x-5 gap-y-3 text-[13px] text-[#71645b] sm:mt-10 sm:gap-x-8 sm:text-sm">
          {promises.map(({ label, Icon }) => (
            <span key={label} className="inline-flex items-center gap-2"><Icon size={19} className="shrink-0 text-[#85642e]" />{label}</span>
          ))}
        </div>

        <div className="mt-7 grid grid-cols-2 gap-3 sm:mt-9 sm:gap-4">
          <Link to="/shop?maxPrice=2000" className="flex min-h-[84px] items-center gap-3 rounded-2xl border border-[#e2d9c5] bg-[#fffdf7] px-3 py-3 shadow-[0_5px_18px_rgba(44,30,25,0.04)] sm:min-h-28 sm:gap-4 sm:px-6">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#f6f0e2] text-xl text-[#b98791] sm:h-14 sm:w-14">₹</span>
            <span className="min-w-0"><small className="block text-[10px] uppercase tracking-wider text-[#8a7e71] sm:text-xs">Little luxuries</small><strong className="mt-1 block text-sm leading-5 text-[#2c1e19] sm:text-lg">Under ₹2,000</strong></span>
          </Link>
          <Link to="/shop" className="flex min-h-[84px] items-center gap-3 rounded-2xl border border-[#e2d9c5] bg-[#fffdf7] px-3 py-3 shadow-[0_5px_18px_rgba(44,30,25,0.04)] sm:min-h-28 sm:gap-4 sm:px-6">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#f6f0e2] text-2xl text-[#b98791] sm:h-14 sm:w-14">%</span>
            <span className="min-w-0"><small className="block text-[10px] uppercase tracking-wider text-[#8a7e71] sm:text-xs">Festive edit</small><strong className="mt-1 block text-sm leading-5 text-[#2c1e19] sm:text-lg">20% off & more</strong></span>
          </Link>
        </div>
      </div>
    </section>
  )
}

export default HeroSection
