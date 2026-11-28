export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const chatverseKey = process.env.CHATVERSE_KEY
  if (!chatverseKey) {
    return res.status(500).json({ error: 'CHATVERSE_KEY is not configured on the server.' })
  }

  // Verify the admin user's Firebase ID token when Firebase API key is available
  const authHeader = req.headers.authorization || ''
  const idToken = authHeader.startsWith('Bearer ') ? authHeader.slice(7).trim() : ''
  if (!idToken) {
    return res.status(401).json({ error: 'Authentication required.' })
  }

  const firebaseApiKey = process.env.FIREBASE_API_KEY || process.env.VITE_FIREBASE_API_KEY
  if (firebaseApiKey) {
    try {
      const verifyRes = await fetch(
        `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${encodeURIComponent(firebaseApiKey)}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ idToken }),
        }
      )
      if (!verifyRes.ok) {
        return res.status(401).json({ error: 'Invalid or expired admin session.' })
      }
    } catch {
      return res.status(401).json({ error: 'Failed to verify admin session.' })
    }
  }

  try {
    const r = await fetch('https://api.chatverse.io/embed/launch', {
      method: 'POST',
      headers: { Authorization: `Bearer ${chatverseKey}` },
    })
    const body = await r.json().catch(() => ({}))
    if (!r.ok) {
      return res.status(r.status).json({ error: body.detail?.message || 'ChatVerse launch failed.' })
    }
    return res.status(200).json({ launchPath: body.data?.launch_path })
  } catch {
    return res.status(502).json({ error: 'Unable to reach ChatVerse API.' })
  }
}
