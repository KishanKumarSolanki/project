import { useState } from 'react'
import { ArrowRight, Check, Mail, ShieldCheck, Sparkles, Truck } from 'lucide-react'
import { Link } from 'react-router-dom'
import BrandMark from './BrandMark'

const SHOP_LINKS = [
  { label: 'All sarees', to: '/shop' },
  { label: 'New arrivals', to: '/shop?sort=new' },
  { label: 'Best sellers', to: '/shop?sort=popular' },
  { label: 'Banarasi', to: '/shop?category=Banarasi' },
  { label: 'Chanderi', to: '/shop?category=Chanderi' },
  { label: 'Kora Silk', to: '/shop?category=Kora%20Silk' },
]

const HELP_LINKS = [
  { label: 'Track my order', to: '/account' },
  { label: 'Cancellations & returns', to: '/account' },
  { label: 'Shipping policy', to: '/shop' },
  { label: 'Our story', to: '/#story' },
  { label: 'Contact us', to: '/account' },
]

const TRUST_BADGES = [
  { label: 'Authentic Handloom', Icon: ShieldCheck },
  { label: 'Pan-India Delivery', Icon: Truck },
  { label: 'Artisan Crafted', Icon: Sparkles },
]

function Footer() {
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)

  const handleSubscribe = (event) => {
    event.preventDefault()
    if (!email.trim()) return
    setSubscribed(true)
    setEmail('')
  }

  return (
    <footer
      id="contact"
      className="relative overflow-hidden border-t border-[#d9b676]/25 bg-[#1d1410] px-4 pb-24 pt-12 text-[#e5dccf] sm:px-7 sm:pt-16 md:pb-12"
    >
      {/* Subtle warm ambient glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 left-1/2 h-64 w-[520px] -translate-x-1/2 rounded-full bg-[#b88a3e]/10 blur-3xl"
      />

      <div className="relative mx-auto max-w-7xl">
        {/* Main 12-column grid */}
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-12 lg:gap-10">
          {/* Brand column */}
          <div className="lg:col-span-4">
            <BrandMark alignStart light />
            <p className="mt-4 max-w-sm text-sm leading-6 text-[#c7bba9]">
              Handwoven sarees and artisanal drapes, crafted by master weavers across India and
              brought to your home with care.
            </p>

            <ul className="mt-6 flex flex-wrap gap-2.5">
              {TRUST_BADGES.map(({ label, Icon }) => (
                <li
                  key={label}
                  className="inline-flex items-center gap-1.5 rounded-full border border-[#d9b676]/25 bg-white/[0.04] px-3 py-1.5 text-[11px] font-medium text-[#e5dccf]"
                >
                  <Icon size={13} className="text-[#d9b676]" aria-hidden="true" />
                  {label}
                </li>
              ))}
            </ul>
          </div>

          {/* Shop links */}
          <div className="lg:col-span-2">
            <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-[#d9b676]">
              Shop
            </h2>
            <ul className="mt-4 space-y-2.5 text-sm text-[#c7bba9]">
              {SHOP_LINKS.map((item) => (
                <li key={item.label}>
                  <Link
                    to={item.to}
                    className="inline-block transition hover:translate-x-0.5 hover:text-white"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Care links */}
          <div className="lg:col-span-2">
            <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-[#d9b676]">
              Customer Care
            </h2>
            <ul className="mt-4 space-y-2.5 text-sm text-[#c7bba9]">
              {HELP_LINKS.map((item) => (
                <li key={item.label}>
                  <Link
                    to={item.to}
                    className="inline-block transition hover:translate-x-0.5 hover:text-white"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter column */}
          <div className="lg:col-span-4">
            <div className="rounded-2xl border border-[#d9b676]/20 bg-white/[0.04] p-5 sm:p-6">
              <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.22em] text-[#d9b676]">
                <Mail size={12} aria-hidden="true" />
                Private Invite
              </span>
              <h2 className="mt-2 font-serif text-2xl font-semibold tracking-tight text-white">
                New weaves, first.
              </h2>
              <p className="mt-2 text-sm leading-6 text-[#c7bba9]">
                Get new arrivals, weaving stories and festive previews in your inbox. No spam.
              </p>

              {subscribed ? (
                <p
                  role="status"
                  className="mt-4 inline-flex items-center gap-2 rounded-xl border border-emerald-400/30 bg-emerald-500/10 px-3.5 py-2.5 text-xs font-medium text-emerald-200"
                >
                  <Check size={15} />
                  Thank you for subscribing to Dori Taaga!
                </p>
              ) : (
                <form onSubmit={handleSubscribe} className="mt-4 flex gap-2">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    aria-label="Email address"
                    placeholder="Your email address"
                    className="min-w-0 flex-1 rounded-xl border border-white/15 bg-black/25 px-3.5 py-2.5 text-sm text-white outline-none transition placeholder:text-[#9c8f7f] focus:border-[#d9b676]"
                  />
                  <button
                    type="submit"
                    className="inline-flex shrink-0 items-center gap-1.5 rounded-xl bg-[#d9b676] px-4 py-2.5 text-sm font-semibold text-[#1d1410] transition hover:bg-[#c49a55]"
                  >
                    Join
                    <ArrowRight size={15} />
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 flex flex-col gap-3 border-t border-white/10 pt-6 text-xs text-[#a59786] sm:flex-row sm:items-center sm:justify-between">
          <span>© {new Date().getFullYear()} Dori Taaga. All rights reserved.</span>
          <div className="flex flex-wrap items-center gap-4">
            <Link to="/shop" className="transition hover:text-white">
              Privacy Policy
            </Link>
            <span aria-hidden="true">·</span>
            <Link to="/shop" className="transition hover:text-white">
              Terms & Conditions
            </Link>
            <span aria-hidden="true">·</span>
            <span className="text-[#d9b676]">Crafted in India</span>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
