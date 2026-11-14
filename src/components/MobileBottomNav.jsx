import { Heart, Home, LayoutGrid, ShoppingBag, UserRound } from 'lucide-react'
import { NavLink } from 'react-router-dom'

function MobileBottomNav({ cartCount, wishlistCount }) {
  const links = [
    { to: '/', label: 'Home', Icon: Home },
    { to: '/shop', label: 'Shop', Icon: LayoutGrid },
    { to: '/shop', label: 'Wishlist', Icon: Heart, badge: wishlistCount },
    { to: '/account', label: 'Account', Icon: UserRound },
    { to: '/cart', label: 'Bag', Icon: ShoppingBag, badge: cartCount },
  ]

  return (
    <nav className="mobile-bottom-nav" aria-label="Mobile navigation">
      {links.map(({ to, label, Icon, badge }) => (
        <NavLink
          key={label}
          to={to}
          className={({ isActive }) => `mobile-bottom-nav__link${isActive ? ' active' : ''}`}
          aria-label={label}
        >
          <span className="mobile-bottom-nav__icon">
            <Icon size={22} strokeWidth={1.8} />
            {badge > 0 && <span className="mobile-bottom-nav__badge">{badge}</span>}
          </span>
          <span>{label}</span>
        </NavLink>
      ))}
    </nav>
  )
}

export default MobileBottomNav
