import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  Flame,
  Grid2X2,
  Heart,
  MapPin,
  Menu,
  MessageCircle,
  Package,
  Percent,
  Search,
  ShoppingBag,
  Sparkles,
  Star,
  UserRound,
  X,
} from 'lucide-react'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import BrandMark from './BrandMark'

const headerLink = ({ isActive }) =>
  `whitespace-nowrap text-sm font-medium transition-colors hover:text-[#a77b34] ${isActive ? 'text-[#a77b34]' : 'text-[#493b32]'}`

const shopLinks = [
  { label: 'All collections', to: '/shop', Icon: Grid2X2 },
  { label: 'Suits', to: '/shop?category=Suits', Icon: Sparkles },
  { label: 'New arrivals', to: '/shop?sort=new', Icon: Sparkles },
  { label: 'Best sellers', to: '/shop?sort=popular', Icon: Flame },
  { label: 'Top rated', to: '/shop?sort=popular', Icon: Star },
  { label: 'Sale', to: '/shop?category=Sale', Icon: Percent },
]

const menuCategories = [
  ['Banarasi', 'Banarasi'],
  ['Banarsi Silk', 'Banarsi Silk'],
  ['Chanderi', 'Chanderi'],
  ['Chanderi Suits', 'Chanderi Suits'],
  ['Chiffon', 'Chiffon'],
  ['Cotton', 'Cotton'],
  ['Cotton Suits', 'Cotton Suits'],
  ['Embroidered Suits', 'Embroidered Suits'],
  ['Georgette Suits', 'Georgette Suits'],
  ['Kanjivaram', 'Kanjivaram'],
  ['Katan Silk', 'Katan Silk'],
  ['Kora Organza Silk', 'Kora Organza Silk'],
  ['Maheshwari', 'Maheshwari'],
  ['Matka Silk', 'Matka Silk'],
  ['Mukaish', 'Mukaish'],
  ['Office Wear', 'Office Wear'],
]

const accountLinks = [
  { label: 'My orders', to: '/account', Icon: Package },
  { label: 'Wishlist', to: '/wishlist', Icon: Heart },
  { label: 'Saved addresses', to: '/account', Icon: MapPin },
  { label: 'My profile', to: '/account', Icon: UserRound },
  { label: 'Help & FAQs', to: '/account', Icon: Star },
  { label: 'Our story', to: '/#story', Icon: Sparkles },
  { label: 'Contact us', to: '/#contact', Icon: MessageCircle },
]

function SectionLabel({ children }) {
  return (
    <h2 className="mb-5 flex items-center gap-3 text-sm font-bold uppercase tracking-[0.16em] text-[#81622f]">
      <span className="h-2.5 w-2.5 rotate-45 bg-[#b88a3e]" />{children}
    </h2>
  )
}

function Header({ cartCount, wishlist }) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [search, setSearch] = useState('')
  const navigate = useNavigate()
  const { pathname } = useLocation()

  return (
    <>
      <div className="bg-[#2c1e19] px-3 py-2 text-center text-xs tracking-wide text-[#f8f5e9] sm:text-sm">
        {pathname === '/shop' ? 'Free delivery on orders ₹1,999+' : <>7-day easy returns <span className="px-1 text-[#c59a4b]">·</span> Secure online payment</>}
      </div>
      <header className="sticky top-0 z-40 border-b border-[#e2d9c5] bg-[#f8f5e9]/95 backdrop-blur-md">
        <div className="mx-auto flex h-[76px] max-w-7xl items-center gap-4 px-4 sm:px-7">
          <button
            type="button"
            className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-[#2c1e19] transition hover:bg-[#eee7d7] md:hidden"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
          >
            <Menu size={27} strokeWidth={1.8} />
          </button>

          <nav className="hidden items-center gap-5 lg:flex" aria-label="Main navigation">
            <NavLink className={headerLink} to="/">Home</NavLink>
            <NavLink className={headerLink} to="/shop">Shop</NavLink>
            <NavLink className={headerLink} to="/shop?sort=new">New arrivals</NavLink>
          </nav>

          <BrandMark />

          <nav className="hidden items-center gap-5 lg:flex" aria-label="More links">
            <NavLink className={headerLink} to="/shop">Collections</NavLink>
            <NavLink className={headerLink} to="/#story">Our story</NavLink>
          </nav>

          <div className="ml-auto flex shrink-0 items-center gap-2 sm:gap-4">
            <Link
              to="/account"
              className="hidden min-h-10 items-center gap-2 rounded-full border border-[#ded5c3] px-4 text-sm font-semibold text-[#493b32] transition hover:border-[#b88a3e] hover:bg-[#fffdf7] hover:text-[#85642e] md:inline-flex"
            >
              <UserRound size={18} strokeWidth={1.8} />
              Login
            </Link>
            <Link to="/wishlist" className="relative inline-flex h-10 w-10 items-center justify-center rounded-full text-[#493b32] transition hover:bg-[#eee7d7]" aria-label="Wishlist">
              <Heart size={26} strokeWidth={1.8} />
              {wishlist.length > 0 && <span className="absolute right-0 top-0 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#b88a3e] px-1 text-[10px] text-white">{wishlist.length}</span>}
            </Link>
            <Link to="/cart" className="relative inline-flex h-10 w-10 items-center justify-center rounded-full text-[#493b32] transition hover:bg-[#eee7d7]" aria-label="Shopping bag">
              <ShoppingBag size={26} strokeWidth={1.8} />
              {cartCount > 0 && <span className="absolute right-0 top-0 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#b88a3e] px-1 text-[10px] text-white">{cartCount}</span>}
            </Link>
          </div>
        </div>
      </header>

      <div className="border-b border-[#e2d9c5] bg-[#f8f5e9] px-4 py-2 sm:px-7">
        <form
          onSubmit={(event) => { event.preventDefault(); navigate(`/shop?search=${encodeURIComponent(search)}`) }}
          className="mx-auto flex h-12 max-w-7xl items-center gap-3 rounded-2xl border border-[#d9d1c1] bg-[#fffdf7] px-4 text-[#71645b] shadow-sm sm:h-14 sm:max-w-2xl"
        >
          <Search size={20} className="shrink-0" />
          <input
            aria-label="Search sarees, fabrics and colours"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search sarees, fabrics, colours..."
            className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-[#8f8578] sm:text-base"
          />
          <button type="submit" className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#b88a3e] text-[#2c1e19]" aria-label="Search"><Search size={19} /></button>
        </form>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="fixed inset-0 z-[70] flex bg-black/45"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMobileOpen(false)}
          >
            <motion.aside
              className="h-[100dvh] w-[86vw] max-w-[420px] shrink-0 overflow-y-auto overscroll-contain bg-[#f8f5e9] shadow-2xl"
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ duration: 0.26, ease: 'easeInOut' }}
              onClick={(event) => event.stopPropagation()}
              aria-label="Shop menu"
            >
              <div className="sticky top-0 z-10 flex h-[72px] items-center justify-between bg-[#2c1e19] px-5 text-[#fffdf7]">
                <Link to="/account" onClick={() => setMobileOpen(false)} className="flex min-w-0 items-center gap-3 text-base font-medium sm:text-lg">
                  <UserRound size={25} strokeWidth={1.8} />
                  <span className="truncate">Sign in / Create account</span>
                </Link>
                <button type="button" className="ml-3 inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full hover:bg-white/10" onClick={() => setMobileOpen(false)} aria-label="Close menu">
                  <X size={27} strokeWidth={1.7} />
                </button>
              </div>

              <section className="border-b border-[#ded5c3] px-5 py-6 sm:px-6">
                <SectionLabel>Shop</SectionLabel>
                <nav className="space-y-1" aria-label="Shop links">
                  {shopLinks.map(({ label, to, Icon }) => (
                    <Link key={label} to={to} onClick={() => setMobileOpen(false)} className="flex min-h-[50px] items-center gap-4 rounded-xl px-1 text-[17px] text-[#2c1e19] transition hover:bg-[#efe7d5] sm:text-lg">
                      <Icon size={23} strokeWidth={1.9} className="shrink-0 text-[#85642e]" />
                      {label}
                    </Link>
                  ))}
                </nav>
              </section>

              <section className="border-b border-[#ded5c3] px-5 py-6 sm:px-6">
                <SectionLabel>Categories</SectionLabel>
                <nav className="grid grid-cols-2 gap-x-4 gap-y-5" aria-label="Categories">
                  {menuCategories.map(([label, category]) => (
                    <Link key={label} to={`/shop?category=${encodeURIComponent(category)}`} onClick={() => setMobileOpen(false)} className="min-h-8 text-[15px] leading-6 text-[#493b32] hover:text-[#85642e] sm:text-base">
                      {label}
                    </Link>
                  ))}
                </nav>
              </section>

              <section className="px-5 py-6 sm:px-6">
                <SectionLabel>My account</SectionLabel>
                <nav className="space-y-1" aria-label="Account links">
                  {accountLinks.map(({ label, to, Icon }) => (
                    <Link key={label} to={to} onClick={() => setMobileOpen(false)} className="flex min-h-[50px] items-center gap-4 rounded-xl px-1 text-[17px] text-[#493b32] transition hover:bg-[#efe7d5] sm:text-lg">
                      <Icon size={23} strokeWidth={1.8} className="shrink-0 text-[#71645b]" />
                      {label}
                    </Link>
                  ))}
                </nav>
              </section>
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default Header
