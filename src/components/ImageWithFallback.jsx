import { useState } from 'react'
import brandLogo from '../assets/dori-taaga-logo.png'

function ImageWithFallback({ src, alt, className = '' }) {
  const [failed, setFailed] = useState(false)

  if (failed) {
    return (
      <div role="img" aria-label={alt} className={`relative flex items-center justify-center overflow-hidden bg-gradient-to-b from-[#f4f1e9] to-[#d3d1ca] ${className}`}>
        <img src={brandLogo} alt="" className="h-auto w-[42%] max-w-36 object-contain opacity-35" />
      </div>
    )
  }

  return <img src={src} alt={alt} className={className} loading="lazy" onError={() => setFailed(true)} />
}

export default ImageWithFallback
