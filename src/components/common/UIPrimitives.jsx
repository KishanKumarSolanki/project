import { useEffect } from 'react'
import { ArrowRight } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'
import Header from '../Header'
import Footer from '../Footer'
import SupportBubble from '../SupportBubble'
import MobileBottomNav from '../MobileBottomNav'
import { ui } from '../../constants/store'

export function ScrollToTop() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return null
}

export function Field({ label, error, className = '', children }) {
  return (
    <div className={`flex min-w-0 flex-col ${className}`}>
      <label className={ui.label}>{label}</label>
      {children}
      {error && <p className={ui.errorText}>{error}</p>}
    </div>
  )
}

export function StepHeader({ step, title, subtitle }) {
  return (
    <div className="mb-5">
      <div className="flex items-center gap-3">
        <span className={ui.stepBadge}>{step}</span>
        <h3 className={ui.h3}>{title}</h3>
      </div>
      {subtitle && <p className={`mt-2 pl-10 ${ui.body}`}>{subtitle}</p>}
    </div>
  )
}

export function OptionCard({ name, value, description, checked, onChange }) {
  return (
    <label
      className={`flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition ${
        checked
          ? 'border-[#b88a3e] bg-[#fbf6ea] ring-1 ring-[#b88a3e]'
          : 'border-[#e2d9c5] bg-white hover:border-[#b88a3e]/60'
      }`}
    >
      <input
        type="radio"
        name={name}
        value={value}
        checked={checked}
        onChange={onChange}
        className="mt-0.5 h-4 w-4 shrink-0 accent-[#b88a3e]"
      />
      <span className="min-w-0">
        <span className="block text-sm font-semibold text-[#2c1e19]">{value}</span>
        {description && <span className="mt-0.5 block text-xs text-[#71645b]">{description}</span>}
      </span>
    </label>
  )
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel = 'Explore Sarees',
  actionTo = '/shop',
}) {
  return (
    <section className={ui.section}>
      <div className={`${ui.container} flex justify-center`}>
        <div
          className={`${ui.card} flex w-full max-w-lg flex-col items-center gap-3 px-6 py-14 text-center sm:py-20`}
        >
          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-[#eee7d7] text-[#81622f]">
            <Icon size={28} strokeWidth={1.6} />
          </span>
          <h2 className={ui.h2}>{title}</h2>
          <p className={`max-w-sm ${ui.body}`}>{description}</p>
          <Link to={actionTo} className={`${ui.btnPrimary} mt-4`}>
            {actionLabel}
            <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </section>
  )
}

export function GoogleIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 48 48" className="h-5 w-5">
      <path
        fill="#EA4335"
        d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5Z"
      />
      <path
        fill="#4285F4"
        d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.76 7.18l7.73 6C44.42 38.05 46.98 31.97 46.98 24.55Z"
      />
      <path
        fill="#FBBC05"
        d="M10.53 28.59A14.4 14.4 0 0 1 9.75 24c0-1.59.27-3.13.76-4.59l-7.98-6.19A23.9 23.9 0 0 0 0 24c0 3.88.93 7.55 2.56 10.78l7.97-6.19Z"
      />
      <path
        fill="#34A853"
        d="M24 48c6.48 0 11.93-2.13 15.91-5.8l-7.73-6c-2.14 1.44-4.89 2.3-8.18 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48Z"
      />
    </svg>
  )
}

export function AppFrame({ children, cartCount, wishlistCount }) {
  const { pathname } = useLocation()
  const isAdminPage = pathname === '/admin'

  return (
    <div className={isAdminPage ? 'min-h-screen bg-[#f4f2ed]' : ui.page}>
      {!isAdminPage && <Header cartCount={cartCount} wishlist={wishlistCount} />}
      <main>{children}</main>
      {!isAdminPage && (
        <>
          <Footer />
          <SupportBubble />
          <MobileBottomNav cartCount={cartCount} wishlistCount={wishlistCount} />
        </>
      )}
    </div>
  )
}
