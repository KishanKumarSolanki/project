import { Link } from 'react-router-dom'
import brandLogo from '../assets/dori-taaga-logo.png'

function BrandMark({ alignStart = false }) {
  return (
    <Link
      to="/"
      className={`brand-mark${alignStart ? ' brand-mark--start' : ''}`}
      aria-label="Dori Taaga home"
    >
      <img className="brand-mark__image" src={brandLogo} alt="Dori Taaga" />
    </Link>
  )
}

export default BrandMark
