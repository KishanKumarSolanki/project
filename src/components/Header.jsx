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

const desktopNavLink = ({ isActive }) =>
  `relative whitespace-nowrap py-1 text-[13px] font-medium uppercase tracking-[0.14em] transition-colors duration-300 after:absolute after:-bottom-0.5 after:left-0 after:h-px after:w-full after:origin-left after:bg-[#b88a3e] after:transition-transform after:duration-300 hover:text-[#85642e] hover:after:scale-x-100 ${
    isActive ? 'text-[#85642e] after:scale-x-100' : 'text-[#4a3a2e] after:scale-x-0'
  }`

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
    <h2 className="mb-5 flex items-center gap-3 text-xs font-bold uppercase tracking-[0.2em] text-[#81622f]">
      <span className="h-2 w-2 rotate-45 bg-[#b88a3e]" />
      {children}
    </h2>
  )
}

function IconButton({ to, label, count, children }) {
  return (
    <Link
      to={to}
      className="group relative inline-flex h-11 w-11 items-center justify-center rounded-full text-[#2c1e19] transition duration-300 hover:bg-[#ece4d1] hover:text-[#85642e]"
      aria-label={label}
    >
      {children}
      {count > 0 && (
        <span className="absolute -right-0.5 -top-0.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-gradient-to-br from-[#d4a95a] to-[#a87d3d] px-1 text-[10px] font-semibold text-white shadow-md ring-2 ring-[#f8f5e9]">
          {count}
        </span>
      )}
    </Link>
  )
}

function Header({ cartCount, wishlist }) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [isSearchFocused, setIsSearchFocused] = useState(false)
  const navigate = useNavigate()
  const { pathname } = useLocation()

  const submitSearch = (event) => {
    event.preventDefault()
    navigate(`/shop?search=${encodeURIComponent(search)}`)
  }

  const searchForm = (
    <form
      onSubmit={submitSearch}
      className={`group flex h-11 w-full items-center gap-2.5 rounded-full border bg-[#fffdf7] pl-4 pr-1.5 text-[#71645b] transition duration-300 ${
        isSearchFocused
          ? 'border-[#b88a3e] shadow-[0_0_0_4px_rgba(184,138,62,0.15)]'
          : 'border-[#ded5c3] shadow-sm hover:border-[#c9b89a]'
      }`}
    >
      <Search size={17} strokeWidth={1.9} className={`shrink-0 transition ${isSearchFocused ? 'text-[#85642e]' : 'text-[#9a8f7e]'}`} />
      <input
        aria-label="Search sarees, fabrics and colours"
        value={search}
        onChange={(event) => setSearch(event.target.value)}
        onFocus={() => setIsSearchFocused(true)}
        onBlur={() => setIsSearchFocused(false)}
        placeholder="Search sarees, fabrics, colours…"
        className="min-w-0 flex-1 bg-transparent text-sm text-[#2c1e19] outline-none placeholder:text-[#9a8f7e]"
      />
      <button
        type="submit"
        aria-label="Search"
        className="inline-flex h-8 shrink-0 items-center gap-1.5 rounded-full bg-gradient-to-b from-[#3a2a20] to-[#2c1e19] px-3.5 text-xs font-semibold tracking-wide text-[#f8f5e9] shadow-md transition hover:-translate-y-px hover:shadow-lg"
      >
        <Search size={14} strokeWidth={2} />
        <span className="hidden sm:inline">Search</span>
      </button>
    </form>
  )

  return (
    <>
      <div className="relative overflow-hidden bg-[#2c1e19] px-3 py-2 text-center text-[11px] font-medium uppercase tracking-[0.18em] text-[#f1ead8] sm:text-xs">
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,transparent,rgba(212,169,90,0.12),transparent)]" />
        <span className="relative">
          {pathname === '/shop' ? (
            'Free delivery on orders ₹1,999+'
          ) : (
            <>
              7-day easy returns <span className="px-2 text-[#d4a95a]">◆</span> Secure online payment
            </>
          )}
        </span>
      </div>

      <header className="sticky top-0 z-40 border-b border-[#e2d9c5]/80 bg-[#f8f5e9]/90 shadow-[0_8px_30px_-18px_rgba(44,30,25,0.25)] backdrop-blur-xl">
        <div className="mx-auto flex h-[76px] max-w-7xl items-center justify-between gap-3 px-4 sm:gap-5 sm:px-7">
          {/* Left: logo and desktop main nav */}
          <div className="flex min-w-0 items-center gap-3 lg:gap-7">
            <BrandMark />

            <nav className="hidden items-center gap-7 lg:flex" aria-label="Main navigation">
              <NavLink className={desktopNavLink} to="/">Home</NavLink>
              <NavLink className={desktopNavLink} to="/shop">Shop</NavLink>
              <NavLink className={desktopNavLink} to="/shop?sort=new">New arrivals</NavLink>
            </nav>
          </div>

          {/* Center: desktop search */}
          <div className="hidden min-w-0 flex-1 justify-center xl:flex">
            <div className="w-full max-w-md">{searchForm}</div>
          </div>

          {/* Right: desktop links, login, icons, and mobile menu button at the end */}
          <div className="ml-auto flex shrink-0 items-center gap-1 sm:gap-2">
            <nav className="mr-3 hidden items-center gap-6 2xl:flex" aria-label="More links">
              <NavLink className={desktopNavLink} to="/shop">Collections</NavLink>
              <NavLink className={desktopNavLink} to="/#story">Our story</NavLink>
            </nav>

            <Link
              to="/account"
              className="group mr-1 hidden h-11 items-center gap-2 rounded-full border border-[#ded5c3] bg-[#fffdf7] px-4 text-[13px] font-semibold tracking-wide text-[#2c1e19] shadow-sm transition duration-300 hover:border-[#b88a3e] hover:text-[#85642e] hover:shadow-md md:inline-flex"
            >
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#f1ead8] text-[#85642e] transition group-hover:bg-[#b88a3e] group-hover:text-white">
                <UserRound size={14} strokeWidth={2} />
              </span>
              Login
            </Link>

            <div className="hidden md:block">
              <IconButton to="/wishlist" label="Wishlist" count={wishlist.length}>
                <Heart size={22} strokeWidth={1.7} />
              </IconButton>
            </div>

            <div className="hidden md:block">
              <IconButton to="/cart" label="Shopping bag" count={cartCount}>
                <ShoppingBag size={22} strokeWidth={1.7} />
              </IconButton>
            </div>

            <button
              type="button"
              className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-[#2c1e19] transition hover:bg-[#ece4d1] lg:hidden"
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
            >
              <Menu size={24} strokeWidth={1.8} />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile and tablet search row */}
      <div className="border-b border-[#e2d9c5] bg-[#f8f5e9] px-4 py-3 sm:px-7 xl:hidden">
        <div className="mx-auto max-w-2xl">{searchForm}</div>
      </div>

      {/* Drawer: always opens from the right edge */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="fixed inset-0 z-[70] flex justify-end bg-[#1f1612]/50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMobileOpen(false)}
          >
            <motion.aside
              className="fixed inset-y-0 right-0 h-[100dvh] w-[86vw] max-w-[420px] overflow-y-auto overscroll-contain bg-[#f8f5e9] shadow-2xl"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              onClick={(event) => event.stopPropagation()}
              aria-label="Shop menu"
            >
              <div className="sticky top-0 z-10 flex h-[72px] items-center justify-between bg-gradient-to-r from-[#2c1e19] to-[#3a2a20] px-5 text-[#fffdf7]">
                <Link to="/account" onClick={() => setMobileOpen(false)} className="flex min-w-0 items-center gap-3 text-base font-medium sm:text-lg">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 ring-1 ring-white/15">
                    <UserRound size={18} strokeWidth={1.8} />
                  </span>
                  <span className="truncate">Sign in / Create account</span>
                </Link>
                <button
                  type="button"
                  className="ml-3 inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition hover:bg-white/10"
                  onClick={() => setMobileOpen(false)}
                  aria-label="Close menu"
                >
                  <X size={24} strokeWidth={1.7} />
                </button>
              </div>

              <section className="border-b border-[#ded5c3] px-5 py-7 sm:px-6">
                <SectionLabel>Shop</SectionLabel>
                <nav className="space-y-1" aria-label="Shop links">
                  {shopLinks.map(({ label, to, Icon }) => (
                    <Link
                      key={label}
                      to={to}
                      onClick={() => setMobileOpen(false)}
                      className="group flex min-h-[52px] items-center gap-4 rounded-2xl px-3 text-[17px] text-[#2c1e19] transition duration-300 hover:bg-[#efe7d5] sm:text-lg"
                    >
                      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#f1ead8] text-[#85642e] transition group-hover:bg-[#b88a3e] group-hover:text-white">
                        <Icon size={18} strokeWidth={1.9} />
                      </span>
                      {label}
                    </Link>
                  ))}
                </nav>
              </section>

              <section className="border-b border-[#ded5c3] px-5 py-7 sm:px-6">
                <SectionLabel>Categories</SectionLabel>
                <nav className="grid grid-cols-2 gap-x-4 gap-y-4" aria-label="Categories">
                  {menuCategories.map(([label, category]) => (
                    <Link
                      key={label}
                      to={`/shop?category=${encodeURIComponent(category)}`}
                      onClick={() => setMobileOpen(false)}
                      className="min-h-8 text-[15px] leading-6 text-[#4a3a2e] transition hover:text-[#85642e] sm:text-base"
                    >
                      {label}
                    </Link>
                  ))}
                </nav>
              </section>

              <section className="px-5 py-7 sm:px-6">
                <SectionLabel>My account</SectionLabel>
                <nav className="space-y-1" aria-label="Account links">
                  {accountLinks.map(({ label, to, Icon }) => (
                    <Link
                      key={label}
                      to={to}
                      onClick={() => setMobileOpen(false)}
                      className="group flex min-h-[52px] items-center gap-4 rounded-2xl px-3 text-[17px] text-[#4a3a2e] transition duration-300 hover:bg-[#efe7d5] sm:text-lg"
                    >
                      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#f1ead8] text-[#71645b] transition group-hover:bg-[#2c1e19] group-hover:text-[#f8f5e9]">
                        <Icon size={18} strokeWidth={1.8} />
                      </span>
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