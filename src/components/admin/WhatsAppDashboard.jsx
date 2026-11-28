import { useEffect, useRef, useState } from 'react'
import { CircleAlert, LoaderCircle, RefreshCw } from 'lucide-react'

const EMBED_SCRIPT_SRC = 'https://chatverse.io/embed.js'

function loadChatVerseScript() {
  if (window.ChatVerse) return Promise.resolve(window.ChatVerse)

  const existing = document.querySelector(`script[src="${EMBED_SCRIPT_SRC}"]`)
  if (existing) {
    return new Promise((resolve, reject) => {
      existing.addEventListener('load', () => resolve(window.ChatVerse), { once: true })
      existing.addEventListener('error', () => reject(new Error('Failed to load ChatVerse embed script.')), { once: true })
    })
  }

  return new Promise((resolve, reject) => {
    const script = document.createElement('script')
    script.src = EMBED_SCRIPT_SRC
    script.async = true
    script.onload = () => resolve(window.ChatVerse)
    script.onerror = () => reject(new Error('Failed to load ChatVerse embed script.'))
    document.body.appendChild(script)
  })
}

function WhatsAppDashboard({ user }) {
  const [status, setStatus] = useState('loading') // 'loading' | 'ready' | 'error'
  const [errorMessage, setErrorMessage] = useState('')
  const [mountKey, setMountKey] = useState(0)
  const containerRef = useRef(null)

  useEffect(() => {
    let cancelled = false

    async function initDashboard() {
      setStatus('loading')
      setErrorMessage('')

      try {
        const ChatVerse = await loadChatVerseScript()
        if (cancelled) return

        if (!ChatVerse?.mount) {
          throw new Error('ChatVerse embed SDK did not initialize properly.')
        }

        if (containerRef.current) {
          containerRef.current.innerHTML = ''
        }

        await ChatVerse.mount('#chatverse-whatsapp', {
          getLaunchPath: async () => {
            const token = await user?.getIdToken?.()
            const response = await fetch('/api/chatverse-launch', {
              headers: token ? { Authorization: `Bearer ${token}` } : {},
            })
            const data = await response.json().catch(() => ({}))
            if (!response.ok || !data.launchPath) {
              throw new Error(data.error || 'Could not start WhatsApp dashboard session.')
            }
            return data.launchPath
          },
        })

        if (!cancelled) {
          setStatus('ready')
        }
      } catch (err) {
        if (!cancelled) {
          setStatus('error')
          setErrorMessage(err?.message || 'Unable to open WhatsApp dashboard.')
        }
      }
    }

    initDashboard()
    return () => {
      cancelled = true
    }
  }, [user, mountKey])

  return (
    <section className="relative flex flex-1 w-full flex-col bg-[#111315]">
      {status === 'loading' && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 bg-[#fffdf7]/90 p-6 text-center">
          <LoaderCircle size={28} className="animate-spin text-[#b88a3e]" />
          <p className="text-sm font-medium text-[#574d3d]">Connecting WhatsApp dashboard…</p>
        </div>
      )}

      {status === 'error' && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-4 bg-[#fffdf7] p-6 text-center">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-rose-50 text-rose-600 ring-1 ring-rose-100">
            <CircleAlert size={22} />
          </span>
          <div className="max-w-md">
            <h3 className="font-serif text-lg text-[#241f18]">Could not open WhatsApp dashboard</h3>
            <p className="mt-1 text-sm text-[#7a7060]">{errorMessage}</p>
          </div>
          <button
            type="button"
            onClick={() => setMountKey((prev) => prev + 1)}
            className="inline-flex h-10 items-center gap-2 rounded-xl bg-[#241f18] px-5 text-sm font-semibold text-[#f6efe2] transition hover:bg-[#3a3026]"
          >
            <RefreshCw size={15} /> Try again
          </button>
        </div>
      )}

      <div id="chatverse-whatsapp" ref={containerRef} className="h-[calc(100vh-76px)] w-full flex-1" />
    </section>
  )
}

export default WhatsAppDashboard
