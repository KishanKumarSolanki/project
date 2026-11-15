import { Link } from 'react-router-dom'
import brandLogo from '../assets/dori-taaga-logo.png'

function BrandMark({ alignStart = false, light = false }) {
  return (
    <Link
      to="/"
      className={`flex shrink-0 items-center justify-center ${alignStart ? 'justify-start' : 'lg:mx-auto'}`}
      aria-label="Dori Taaga home"
    >
      <img className={`h-auto w-[126px] object-contain sm:w-[142px] ${light ? 'brightness-0 invert' : ''}`} src={brandLogo} alt="Dori Taaga" />
    </Link>
  )
}

export default BrandMark
