import { Box, Search, ShieldCheck, Sparkles } from 'lucide-react'

const steps = [
  {
    title: 'Choose your weave',
    description: 'Filter by fabric, colour and price. Every product shows real photos, ratings and reviews.',
    Icon: Search,
    tag: 'Step one',
  },
  {
    title: 'Pay securely',
    description: 'UPI, cards or net banking through Razorpay. Cancel for a full refund until it ships.',
    Icon: ShieldCheck,
    tag: 'Step two',
  },
  {
    title: 'Delivered with tracking',
    description: 'Track your parcel live. Not right? Return it within 7 days.',
    Icon: Box,
    tag: 'Step three',
  },
]

function BenefitsSection() {
  return (
    <section className="relative overflow-hidden px-4 py-16 sm:px-7 sm:py-24">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(184,138,62,0.10),transparent_40%),radial-gradient(circle_at_85%_80%,rgba(184,138,62,0.08),transparent_40%)]" />

      <div className="relative mx-auto max-w-7xl">
        <div className="mb-12 text-center sm:mb-16">
          <div className="mx-auto mb-6 flex max-w-5xl items-center gap-4 text-[#b88a3e]">
            <span className="h-px flex-1 bg-gradient-to-r from-transparent via-[#b88a3e]/70 to-[#b88a3e]" />
            <span className="flex h-3.5 w-3.5 rotate-45 items-center justify-center border border-[#b88a3e] bg-[#f8f5e9]">
              <span className="h-1.5 w-1.5 bg-[#b88a3e]" />
            </span>
            <span className="h-px flex-1 bg-gradient-to-l from-transparent via-[#b88a3e]/70 to-[#b88a3e]" />
          </div>

          <p className="mb-3 inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#85642e]">
            <Sparkles size={13} strokeWidth={2} />
            How it works
          </p>
          <h2 className="text-3xl font-semibold tracking-[-0.035em] text-[#2c1e19] sm:text-5xl">
            Simple, from loom to
            <br className="sm:hidden" /> doorstep
          </h2>
        </div>

        <div className="relative grid gap-6 md:grid-cols-3 md:gap-6">
          <div className="pointer-events-none absolute left-[16%] right-[16%] top-[4.5rem] hidden h-px bg-gradient-to-r from-transparent via-[#b88a3e]/50 to-transparent md:block" />

          {steps.map(({ title, description, Icon, tag }, index) => (
            <article
              key={title}
              className="group relative rounded-[30px] border border-[#e4dac6] bg-gradient-to-b from-[#fffdf7] to-[#faf5e6] px-7 pb-9 pt-14 text-center shadow-[0_1px_0_rgba(255,255,255,0.9)_inset,0_18px_40px_-24px_rgba(44,30,25,0.25)] transition duration-500 hover:-translate-y-1 hover:shadow-[0_28px_60px_-28px_rgba(44,30,25,0.35)] sm:px-8 sm:pb-10"
            >
              {/* Decorative blob clipped separately so the number badge is not cut */}
              <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-[30px]">
                <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-[#f1e5ce]/60 transition duration-500 group-hover:scale-125" />
              </div>

              {/* <span className="absolute left-1/2 top-0 z-10 flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-gradient-to-br from-[#d4a95a] to-[#a87d3d] text-base font-semibold text-[#2c1e19] shadow-lg ring-4 ring-[#faf5e6]">
                {index + 1}
              </span> */}

              <div className="relative">
                <span className="mx-auto flex h-[72px] w-[72px] items-center justify-center rounded-full bg-gradient-to-br from-[#f6ebd2] to-[#ead9b1] text-[#85642e] shadow-inner ring-1 ring-[#dcc596] transition duration-500 group-hover:rotate-[-4deg] group-hover:scale-105">
                  <Icon size={30} strokeWidth={1.7} />
                </span>

                <span className="mt-5 inline-block rounded-full border border-[#dcc596] bg-[#fbf5e6] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#85642e]">
                  {tag}
                </span>

                <h3 className="mt-4 text-2xl font-semibold tracking-tight text-[#2c1e19]">{title}</h3>
                <p className="mx-auto mt-3 max-w-sm text-base leading-7 text-[#71645b] sm:text-lg sm:leading-8">
                  {description}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

export default BenefitsSection