import { ChevronRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { categories } from '../../data/products'

function CategorySection() {
  return (
    <section className="section-wrap" id="collections">
      <div className="container">
        <div className="section-header">
          <div>
            <span className="section-label">Find your drape</span>
            <h2 className="section-title">Explore our collections</h2>
          </div>
        </div>
        <div className="category-grid">
          {categories.map((category) => (
            <Link
              key={category.name}
              to={`/shop?category=${encodeURIComponent(category.name)}`}
              className="category-card"
            >
              <img src={category.image} alt={category.name} />
              <div className="category-card__overlay" />
              <div className="category-card__content">
                <span>{category.name}</span>
                <small>{category.accent}</small>
                <strong>Explore collection <ChevronRight size={16} /></strong>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

export default CategorySection
