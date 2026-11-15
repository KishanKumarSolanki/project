import { Heart, Home, LayoutGrid, ShoppingBag, UserRound } from 'lucide-react'
import { NavLink } from 'react-router-dom'

function MobileBottomNav({ cartCount, wishlistCount }) {
  const links = [
    { to: '/', label: 'Home', Icon: Home, end: true },
    { to: '/shop', label: 'Shop', Icon: LayoutGrid, end: true },
    { to: '/wishlist', label: 'Wishlist', Icon: Heart, badge: wishlistCount, end: true },
    { to: '/account', label: 'Account', Icon: UserRound, end: true },
    { to: '/cart', label: 'Bag', Icon: ShoppingBag, badge: cartCount, end: true },
  ]

  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 grid grid-cols-5 border-t border-[#e2d9c5] bg-[#fffdf6]/95 px-1 pt-2 pb-[max(env(safe-area-inset-bottom),8px)] shadow-[0_-8px_24px_rgba(44,30,25,0.06)] backdrop-blur md:hidden" aria-label="Mobile navigation">
      {links.map(({ to, label, Icon, badge, end }) => (
        <NavLink
          key={label}
          to={to}
          end={end}
          className={({ isActive }) => `relative flex min-h-[58px] flex-col items-center justify-center gap-1 text-[11px] leading-tight transition-colors ${isActive ? 'text-[#b98791]' : 'text-[#817970]'}`}
          aria-label={label}
        >
          {({ isActive }) => (
            <>
              {isActive && <span className="absolute -top-2 h-1 w-9 rounded-b-full bg-[#b88a3e]" />}
              <span className="relative inline-flex h-7 items-center justify-center">
                <Icon size={27} strokeWidth={1.8} />
                {badge > 0 && <span className="absolute -right-2 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#b88a3e] px-1 text-[9px] font-semibold text-white">{badge}</span>}
              </span>
              <span className="text-[12px]">{label}</span>
            </>
          )}
        </NavLink>
      ))}
    </nav>
  )
}

export default MobileBottomNav
