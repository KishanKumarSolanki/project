import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'

function PromoBannerSection() {
  return (
    <section className="promo-banner-wrap section-wrap">
      <div className="container">
        <div className="promo-banner">
          <div className="promo-content">
            <span className="section-label">A little something special</span>
            <h2>Up to 30% off</h2>
            <p>Discover handwoven heirlooms made to make every occasion unforgettable.</p>
            <Link to="/shop" className="primary-btn">
              Shop the collection <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

export default PromoBannerSection
