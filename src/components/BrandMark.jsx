import { Link } from 'react-router-dom'
import brandLogo from '../assets/dori-taaga-logo.png'

function BrandMark({ alignStart = false, light = false, hideTextOnMobile = false }) {
  return (
    <Link
      to="/"
      className={`flex shrink-0 items-center gap-2.5 sm:gap-3 ${alignStart ? 'justify-start' : 'lg:mx-auto'}`}
      aria-label="Dori Taaga home"
    >
      <img
        className={`h-[64px] w-auto object-contain sm:h-[82px] ${
          light ? 'rounded-full ring-1 ring-[#d9b676]/40 shadow-md' : ''
        }`}
        src={brandLogo}
        alt="Dori Taaga"
      />
      <span
        className={`whitespace-nowrap font-serif text-[22px] font-semibold tracking-[0.04em] sm:text-[26px] ${
          light ? 'text-[#f8f5e9]' : 'text-[#2c1e19]'
        } ${hideTextOnMobile ? 'hidden md:inline' : ''}`}
      >
        Dori Taaga
      </span>
    </Link>
  )
}

export default BrandMark
