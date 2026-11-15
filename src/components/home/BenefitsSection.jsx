import { Box, Search, ShieldCheck } from 'lucide-react'

const steps = [
  { title: 'Choose your weave', description: 'Filter by fabric, colour and price. Every product shows real photos, ratings and reviews.', Icon: Search },
  { title: 'Pay securely', description: 'UPI, cards or net banking through Razorpay. Cancel for a full refund until it ships.', Icon: ShieldCheck },
  { title: 'Delivered with tracking', description: 'Track your parcel live. Not right? Return it within 7 days.', Icon: Box },
]

function BenefitsSection() {
  return (
    <section className="px-4 py-14 sm:px-7 sm:py-20">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 text-center sm:mb-14">
          <div className="mx-auto mb-6 flex max-w-5xl items-center gap-3 text-[#b88a3e]"><span className="h-px flex-1 bg-gradient-to-r from-transparent to-[#b88a3e]"/><span className="h-3 w-3 rotate-45 border-2 border-[#b88a3e]"/><span className="h-px flex-1 bg-gradient-to-l from-transparent to-[#b88a3e]"/></div>
          <h2 className="text-3xl font-semibold tracking-[-0.035em] text-[#2c1e19] sm:text-5xl">Simple, from loom to<br className="sm:hidden" /> doorstep</h2>
        </div>
        <div className="grid gap-8 md:grid-cols-3 md:gap-5">
          {steps.map(({ title, description, Icon }, index) => (
            <article key={title} className="relative rounded-[28px] border border-[#ddd4bf] bg-[#faf7ed] px-6 pb-8 pt-10 text-center sm:px-8 sm:pb-10 sm:pt-12">
              <span className="absolute left-1/2 top-0 flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-[#b88a3e] text-xl font-semibold text-[#2c1e19]">{index + 1}</span>
              <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#f1e5ce] text-[#85642e]"><Icon size={30} strokeWidth={1.8} /></span>
              <h3 className="mt-5 text-2xl font-semibold tracking-tight text-[#2c1e19]">{title}</h3>
              <p className="mx-auto mt-3 max-w-sm text-base leading-7 text-[#71645b] sm:text-lg sm:leading-8">{description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

export default BenefitsSection
