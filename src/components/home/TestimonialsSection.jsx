import { Star } from 'lucide-react'

function TestimonialsSection() {
  return (
    <section className="bg-[#fffdf7] px-4 py-14 sm:px-7 sm:py-20">
      <div className="mx-auto max-w-7xl">
        <span className="mb-5 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-[#81622f]"><span className="h-2.5 w-2.5 rotate-45 bg-[#b88a3e]" />What our customers say</span>
        <h2 className="text-[38px] font-semibold leading-tight tracking-[-0.04em] text-[#2c1e19] sm:text-6xl">Voices of <span className="text-[#85642e]">Elegance</span></h2>
        <p className="mt-3 max-w-2xl text-base leading-7 text-[#71645b] sm:text-xl sm:leading-8">Real stories from women who wear our sarees to their most cherished moments</p>

        <article className="mt-10 rounded-[28px] border border-[#ddd4bf] bg-[#faf7ed] p-6 shadow-[0_10px_30px_rgba(44,30,25,0.06)] sm:mt-14 sm:p-10">
          <span className="block h-8 text-5xl leading-none text-[#eee5d7]">“</span>
          <div className="mt-2 flex gap-1 text-[#b88a3e]" aria-label="5 out of 5 stars">{[1, 2, 3, 4, 5].map((star) => <Star key={star} size={21} fill="currentColor" />)}</div>
          <blockquote className="mt-5 text-lg italic leading-8 text-[#71645b] sm:text-2xl sm:leading-10">“Absolutely divine design and premium fabric. The sheen of the organza is breathtaking. Fast delivery and simply perfect packaging.”</blockquote>
          <div className="mt-6 flex items-center gap-3 border-t border-[#e2d9c5] pt-5">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#f5e8ea] text-sm font-medium text-[#b98791]">PP</span>
            <span><strong className="block text-base font-semibold text-[#2c1e19]">Priya Patel</strong><small className="text-sm text-[#71645b]">Vadodara</small></span>
          </div>
        </article>
        <div className="mt-7 flex items-center justify-center gap-2" aria-hidden="true"><span className="h-2 w-2 rounded-full bg-[#dfd5c0]"/><span className="h-2.5 w-6 rounded-full bg-[#b98791]"/><span className="h-2 w-2 rounded-full bg-[#dfd5c0]"/><span className="h-2 w-2 rounded-full bg-[#dfd5c0]"/><span className="h-2 w-2 rounded-full bg-[#dfd5c0]"/></div>
      </div>
    </section>
  )
}

export default TestimonialsSection
