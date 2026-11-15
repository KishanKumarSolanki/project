import { MessageCircle, Phone } from 'lucide-react'
import { Link } from 'react-router-dom'

function SupportBubble() {
  return (
    <Link to="/#contact" aria-label="Contact support" className="fixed bottom-[96px] right-4 z-40 inline-flex h-[62px] w-[62px] items-center justify-center rounded-full bg-[#19c96b] text-white shadow-[0_8px_24px_rgba(25,201,107,0.28)] transition hover:scale-105 sm:right-7 md:bottom-7">
      <MessageCircle size={39} fill="white" strokeWidth={0} />
      <Phone size={17} fill="#19c96b" stroke="#19c96b" className="absolute rotate-[-38deg]" />
    </Link>
  )
}

export default SupportBubble
