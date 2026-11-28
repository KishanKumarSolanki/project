import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'
import { defineConfig, loadEnv } from 'vite'
import tailwindcss from '@tailwindcss/vite'

function chatverseDevMiddleware(chatverseKey) {
  return {
    name: 'chatverse-dev-launch',
    configureServer(server) {
      server.middlewares.use('/api/chatverse-launch', async (req, res) => {
        res.setHeader('Content-Type', 'application/json')

        if (req.method !== 'GET') {
          res.statusCode = 405
          res.end(JSON.stringify({ error: 'Method not allowed' }))
          return
        }

        if (!chatverseKey) {
          res.statusCode = 500
          res.end(JSON.stringify({ error: 'CHATVERSE_KEY is missing in .env.' }))
          return
        }

        const authHeader = req.headers.authorization || ''
        if (!authHeader.startsWith('Bearer ') || !authHeader.slice(7).trim()) {
          res.statusCode = 401
          res.end(JSON.stringify({ error: 'Authentication required.' }))
          return
        }

        try {
          const r = await fetch('https://api.chatverse.io/embed/launch', {
            method: 'POST',
            headers: { Authorization: `Bearer ${chatverseKey}` },
          })
          const body = await r.json().catch(() => ({}))
          if (!r.ok) {
            res.statusCode = r.status
            res.end(JSON.stringify({ error: body.detail?.message || 'ChatVerse launch failed.' }))
            return
          }
          res.statusCode = 200
          res.end(JSON.stringify({ launchPath: body.data?.launch_path }))
        } catch {
          res.statusCode = 502
          res.end(JSON.stringify({ error: 'Unable to reach ChatVerse API.' }))
        }
      })
    },
  }
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [
      react(),
      tailwindcss(),
      babel({ presets: [reactCompilerPreset()] }),
      chatverseDevMiddleware(env.CHATVERSE_KEY),
    ],
  }
})
