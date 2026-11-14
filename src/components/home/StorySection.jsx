import { ArrowRight, Check } from 'lucide-react'
import { Link } from 'react-router-dom'
import { reviewHighlights } from '../../data/products'

function StorySection() {
  return (
    <section id="story" className="story-section section-wrap">
      <div className="container story-layout">
        <div className="story-image">
          <img
            src="https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1200&q=80"
            alt="Artisan-inspired Indian occasionwear"
          />
        </div>
        <div className="story-copy">
          <span className="section-label">The Dori Taaga story</span>
          <h2 className="section-title">Tradition, woven with intention.</h2>
          <p>
            Every saree carries the hands, heritage and imagination of its maker. We bring
            authentic handloom stories closer to the women who will make them their own.
          </p>
          <ul className="story-points">
            {reviewHighlights.map((point) => (
              <li key={point}><Check size={16} />{point}</li>
            ))}
          </ul>
          <Link to="/shop" className="primary-btn">
            Discover our story <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </section>
  )
}

export default StorySection
