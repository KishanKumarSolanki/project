import { Link } from 'react-router-dom'
import { useLocation } from 'react-router-dom'
import BrandMark from './BrandMark'

function Footer() {
  const { pathname } = useLocation()
  const shopFooter = pathname === '/shop'
  const footerTone = shopFooter
    ? 'border-[#67462f] bg-[#482b1e] text-[#e0d4c3]'
    : 'border-[#e2d9c5] bg-[#f3eedf] text-[#493b32]'
  const headingTone = shopFooter ? 'text-[#c7a65e]' : 'text-[#2c1e19]'
  const copyTone = shopFooter ? 'text-[#d1c2ae]' : 'text-[#71645b]'

  return (
    <footer id="contact" className={`border-t px-4 py-12 pb-28 sm:px-7 sm:py-16 md:pb-12 ${footerTone}`}>
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-9 sm:grid-cols-2 lg:grid-cols-4 lg:gap-12">
          <div>
            <BrandMark alignStart light={shopFooter} />
            <p className={`mt-4 max-w-xs text-sm leading-6 ${copyTone}`}>Handwoven sarees and suits, made by artisans and brought to your home with care.</p>
          </div>
          <div>
            <h2 className={`font-semibold uppercase tracking-[0.16em] ${headingTone}`}>Shop</h2>
            <ul className={`mt-4 space-y-3 text-sm sm:text-base ${copyTone}`}>
              <li><Link to="/shop" className="hover:text-[#85642e]">All sarees</Link></li>
              <li><Link to="/shop?sort=new" className="hover:text-[#85642e]">New arrivals</Link></li>
              <li><Link to="/shop?sort=popular" className="hover:text-[#85642e]">Best sellers</Link></li>
              <li><Link to="/shop" className="hover:text-[#c7a65e]">Banarasi</Link></li>
              <li><Link to="/shop" className="hover:text-[#c7a65e]">Chanderi</Link></li>
              <li><Link to="/shop" className="hover:text-[#c7a65e]">Sale</Link></li>
            </ul>
          </div>
          <div>
            <h2 className={`font-semibold uppercase tracking-[0.16em] ${headingTone}`}>Help</h2>
            <ul className={`mt-4 space-y-3 text-sm sm:text-base ${copyTone}`}>
              <li><Link to="/account" className="hover:text-[#c7a65e]">Track my order</Link></li>
              <li><Link to="/account" className="hover:text-[#c7a65e]">Cancellations & returns</Link></li>
              <li><Link to="/shop" className="hover:text-[#c7a65e]">Shipping policy</Link></li>
              <li><Link to="/shop" className="hover:text-[#c7a65e]">FAQs</Link></li>
              <li><Link to="/account" className="hover:text-[#c7a65e]">Contact us</Link></li>
            </ul>
          </div>
          <div>
            <h2 className={`font-semibold uppercase tracking-[0.16em] ${headingTone}`}>Company</h2>
            <ul className={`mt-4 space-y-3 text-sm sm:text-base ${copyTone}`}>
              <li><Link to="/#story" className="hover:text-[#c7a65e]">Our story</Link></li>
              <li><Link to="/shop" className="hover:text-[#c7a65e]">Privacy policy</Link></li>
              <li><Link to="/shop" className="hover:text-[#c7a65e]">Terms & conditions</Link></li>
            </ul>
            <h2 className="mt-8 text-2xl font-semibold tracking-tight text-white sm:text-3xl">New weaves, first.</h2>
            <p className={`mt-2 text-sm leading-6 sm:text-base ${copyTone}`}>Get new arrivals, weaving stories and offers in your inbox. No spam.</p>
            <div className="mt-3 flex gap-2">
              <input type="email" aria-label="Email address" placeholder="Your email address" className={`min-w-0 flex-1 rounded-xl border px-3 py-2.5 text-sm outline-none ${shopFooter ? 'border-white/20 bg-white/5 text-white placeholder:text-[#c9b9a7]' : 'border-[#ddd4bf] bg-[#fffdf7] text-[#2c1e19]'} focus:border-[#b88a3e]`} />
              <button type="button" className="rounded-xl bg-[#b88a3e] px-4 text-sm font-semibold text-[#2c1e19]">Join</button>
            </div>
          </div>
        </div>
        <div className={`mt-10 flex flex-col gap-2 border-t pt-5 text-xs sm:flex-row sm:items-center sm:justify-between ${shopFooter ? 'border-white/15 text-[#c9b9a7]' : 'border-[#e2d9c5] text-[#817970]'}`}>
          <span>© 2026 Dori Taaga. All rights reserved.</span>
          <span>Crafted in India</span>
        </div>
      </div>
    </footer>
  )
}

export default Footer
