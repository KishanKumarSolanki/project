import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { products } from '../../data/products'
import ImageWithFallback from '../ImageWithFallback'

const editorialImages = [
  { image: products[1].images[0], label: 'Work sarees', featured: true },
  { image: products[0].images[1], label: 'Silk threads' },
  { image: products[2].images[0], label: 'Traditional embroidery' },
]

function PromoBannerSection() {
  return (
    <section className="px-4 py-12 sm:px-7 sm:py-20">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-3 sm:gap-5">
        {editorialImages.map(({ image, label, featured }) => (
          <Link key={label} to="/shop" className={`group relative overflow-hidden bg-[#e9dfcd] ${featured ? 'row-span-2 aspect-[0.77] rounded-l-2xl sm:rounded-3xl' : 'aspect-[0.9] rounded-r-2xl sm:rounded-3xl'}`}>
            <ImageWithFallback src={image} alt={label} className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#211713]/75 via-transparent to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-3 text-white sm:p-5">
              <span className="block text-base font-semibold uppercase tracking-wide sm:text-2xl">{label}</span>
              {featured && <span className="mt-2 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider sm:mt-3 sm:text-sm">Shop now <ArrowRight size={16} /></span>}
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}

export default PromoBannerSection
