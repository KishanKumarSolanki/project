import { Link } from 'react-router-dom'
import brandLogo from '../assets/dori-taaga-logo.png'

function BrandMark({ alignStart = false, light = false }) {
  return (
    <Link
      to="/"
      className={`flex shrink-0 items-center justify-center ${alignStart ? 'justify-start' : 'lg:mx-auto'}`}
      aria-label="Dori Taaga home"
    >
      <img
        className={`h-[46px] w-auto object-contain sm:h-[64px] ${
          light ? 'rounded-full ring-1 ring-[#d9b676]/40 shadow-md' : ''
        }`}
        src={brandLogo}
        alt="Dori Taaga"
      />
    </Link>
  )
}

export default BrandMark
