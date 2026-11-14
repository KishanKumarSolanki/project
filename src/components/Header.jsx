import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  Heart,
  Menu,
  Search,
  ShoppingCart,
  UserRound,
  X,
} from 'lucide-react'
import { Link, NavLink } from 'react-router-dom'
import { categories } from '../data/products'
import BrandMark from './BrandMark'

function Header({ cartCount, wishlist }) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [megaMenuOpen, setMegaMenuOpen] = useState(false)

  return (
    <header className="top-header">
      <div className="container header-inner">
        <button
          type="button"
          className="mobile-menu-button"
          onClick={() => setMobileOpen(true)}
          aria-label="Open menu"
        >
          <Menu size={20} />
        </button>

        <nav className="desktop-nav" aria-label="Main Navigation">
          <NavLink className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} to="/">Home</NavLink>
          <NavLink className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} to="/shop">Shop All</NavLink>
          <div
            className="nav-mega"
            onMouseEnter={() => setMegaMenuOpen(true)}
            onMouseLeave={() => setMegaMenuOpen(false)}
          >
            <button type="button" className="nav-link nav-link-button">Sarees</button>
            {megaMenuOpen && (
              <div className="mega-menu-panel">
                <div className="mega-menu-grid">
                  {categories.map((category) => (
                    <Link
                      key={category.name}
                      to={`/shop?category=${encodeURIComponent(category.name)}`}
                      className="menu-card"
                      onClick={() => setMegaMenuOpen(false)}
                    >
                      <img src={category.image} alt={category.name} className="menu-card__image" />
                      <div className="menu-card__content">
                        <span>{category.name}</span>
                        <small>{category.accent}</small>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
          <NavLink className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} to="/shop">New Arrivals</NavLink>
          <NavLink className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} to="/shop">Collections</NavLink>
          <NavLink className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} to="/#story">About Us</NavLink>
          <NavLink className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} to="/#contact">Contact</NavLink>
        </nav>

        <BrandMark />

        <div className="header-actions">
          <button type="button" className="icon-button" aria-label="Search">
            <Search size={18} />
          </button>
          <Link to="/account" className="icon-button" aria-label="Account">
            <UserRound size={18} />
          </Link>
          <Link to="/shop" className="icon-button" aria-label="Wishlist">
            <Heart size={18} />
            {wishlist.length > 0 && <span className="count-badge">{wishlist.length}</span>}
          </Link>
          <Link to="/cart" className="cart-button" aria-label="Cart">
            <ShoppingCart size={18} />
            <span>Cart</span>
            <span className="count-badge">{cartCount}</span>
          </Link>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="mobile-nav-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMobileOpen(false)}
          >
            <motion.aside
              className="mobile-nav-panel"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ duration: 0.28, ease: 'easeInOut' }}
              onClick={(event) => event.stopPropagation()}
            >
              <div className="mobile-nav-header">
                <BrandMark />
                <button
                  type="button"
                  className="icon-button"
                  onClick={() => setMobileOpen(false)}
                  aria-label="Close menu"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="mobile-nav-group">
                <NavLink to="/" onClick={() => setMobileOpen(false)}>Home</NavLink>
                <NavLink to="/shop" onClick={() => setMobileOpen(false)}>Shop All</NavLink>
                <NavLink to="/shop" onClick={() => setMobileOpen(false)}>Sarees</NavLink>
                <NavLink to="/shop" onClick={() => setMobileOpen(false)}>New Arrivals</NavLink>
                <NavLink to="/shop" onClick={() => setMobileOpen(false)}>Collections</NavLink>
                <NavLink to="/#story" onClick={() => setMobileOpen(false)}>About Us</NavLink>
                <NavLink to="/#contact" onClick={() => setMobileOpen(false)}>Contact</NavLink>
              </div>

              <div className="mobile-menu-cards">
                {categories.slice(0, 4).map((category) => (
                  <Link
                    key={category.name}
                    to={`/shop?category=${encodeURIComponent(category.name)}`}
                    onClick={() => setMobileOpen(false)}
                    className="mobile-menu-card"
                  >
                    <img src={category.image} alt={category.name} />
                    <span>{category.name}</span>
                  </Link>
                ))}
              </div>
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}

export default Header
