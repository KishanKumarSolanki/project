import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'

function StorySection() {
  return (
    <section id="story" className="px-4 py-14 sm:px-7 sm:py-20">
      <div className="mx-auto max-w-7xl">
        <span className="mb-5 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-[#81622f]"><span className="h-2.5 w-2.5 rotate-45 bg-[#b88a3e]" />Our heritage</span>
        <h2 className="max-w-3xl text-[48px] font-semibold leading-[1.03] tracking-[-0.045em] text-[#2c1e19] sm:text-7xl">Handcrafted<br /> <span className="text-[#85642e]">with Love</span></h2>
        <span className="mt-7 block h-0.5 w-16 bg-[#b88a3e]" />
        <p className="mt-7 max-w-4xl text-lg leading-8 text-[#71645b] sm:mt-10 sm:text-2xl sm:leading-[1.7]">
          Discover the elegance of Indian handwoven sarees, crafted with timeless artistry and intricate designs. Each saree is a story of tradition — woven by skilled artisans who carry forward generations of heritage.
        </p>
        <div className="mt-10 grid max-w-3xl grid-cols-3 gap-4 sm:mt-14 sm:gap-8">
          {[
            ['500+', 'Artisans'],
            ['20+', 'Craft clusters'],
            ['1000+', 'Unique weaves'],
          ].map(([value, label]) => (
            <div key={label}>
              <strong className="block text-3xl font-semibold tracking-tight text-[#2c1e19] sm:text-5xl">{value}</strong>
              <span className="mt-2 block max-w-[100px] text-[10px] uppercase leading-4 tracking-[0.16em] text-[#71645b] sm:max-w-none sm:text-sm">{label}</span>
            </div>
          ))}
        </div>
        <Link to="/shop" className="mt-9 inline-flex min-h-14 items-center gap-3 rounded-2xl border border-[#2c1e19] px-7 text-base font-semibold text-[#2c1e19] transition hover:bg-[#eee7d7] sm:mt-12 sm:px-9 sm:text-lg">The Collection <ArrowRight size={20} /></Link>
      </div>
    </section>
  )
}

export default StorySection
