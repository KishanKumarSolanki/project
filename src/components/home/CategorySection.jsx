import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { categories } from '../../data/products'
import ImageWithFallback from '../ImageWithFallback'

function CategorySection() {
  return (
    <section className="py-9 sm:py-16" id="collections">
      <div className="mx-auto max-w-7xl px-4 sm:px-7">
        <div className="mb-6 sm:mb-8">
          <span className="mb-2 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-[#81622f]"><span className="h-2.5 w-2.5 rotate-45 bg-[#b88a3e]" />Browse</span>
          <h2 className="text-[34px] font-semibold leading-tight tracking-[-0.04em] text-[#2c1e19] sm:text-5xl">Shop by category</h2>
        </div>
        <div className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-3 [scrollbar-width:none] sm:mx-0 sm:grid sm:grid-cols-2 sm:px-0 lg:grid-cols-3">
          {categories.map((category) => (
            <Link
              key={category.name}
              to={`/shop?category=${encodeURIComponent(category.name)}`}
              className="group relative h-[300px] w-[82vw] max-w-[370px] shrink-0 snap-start overflow-hidden rounded-[28px] border border-[#e2d9c5] bg-[#513c34] sm:h-[340px] sm:w-auto sm:max-w-none"
            >
              <ImageWithFallback src={category.image} alt={category.name} className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#211713]/85 via-[#211713]/10 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-5 text-white sm:p-6">
                <span className="block text-2xl font-semibold tracking-tight">{category.name.replace(' Sarees', '')}</span>
                <span className="mt-1 block text-sm text-white/80">{category.accent}</span>
                <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold">Shop now <ArrowRight size={17} /></span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

export default CategorySection
