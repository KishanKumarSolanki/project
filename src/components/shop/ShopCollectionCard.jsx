import { Plus } from 'lucide-react'
import ImageWithFallback from '../ImageWithFallback'

function ShopCollectionCard({ collection, onSelect }) {
  const shape =
    collection.size === 'wide'
      ? 'col-span-2 aspect-[1.6] sm:aspect-[2.15]'
      : collection.size === 'tall'
        ? 'row-span-2 aspect-[0.67] sm:aspect-[0.72]'
        : 'aspect-[0.84] sm:aspect-[0.9]'

  const handleSelect = () => {
    onSelect(collection.category)
    document
      .getElementById('shop-products')
      ?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <button
      type="button"
      onClick={handleSelect}
      aria-label={`Browse ${collection.name} collection`}
      className={`group relative block w-full overflow-hidden rounded-sm bg-[#e6e1d7] text-left outline-none focus-visible:ring-2 focus-visible:ring-[#b88a3e] focus-visible:ring-offset-2 focus-visible:ring-offset-[#fffaf0] ${shape}`}
    >
      <ImageWithFallback
        src={collection.image}
        alt=""
        aria-hidden="true"
        className="absolute inset-0 h-full w-full object-cover transition duration-700 ease-out group-hover:scale-105"
      />

      <span
        aria-hidden="true"
        className="absolute inset-0 bg-linear-to-t from-[#211713]/80 via-[#211713]/10 to-transparent transition-opacity duration-500 group-hover:from-[#211713]/90"
      />

      <span className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-4 text-white sm:p-6">
        <span className="text-lg font-semibold leading-tight tracking-tight drop-shadow-sm sm:text-2xl">
          {collection.name}
        </span>

        <span
          aria-hidden="true"
          className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-white/40 bg-white/10 text-white backdrop-blur-sm transition duration-300 group-hover:rotate-90 group-hover:border-[#b88a3e] group-hover:bg-[#b88a3e] group-hover:text-[#2c1e19]"
        >
          <Plus size={22} strokeWidth={1.7} />
        </span>
      </span>
    </button>
  )
}

export default ShopCollectionCard