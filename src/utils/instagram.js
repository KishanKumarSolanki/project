/**
 * Parses an Instagram Post, Reel, or IGTV URL into a safe embed URL.
 * Supports formats such as:
 * - https://www.instagram.com/reel/SHORTCODE/
 * - https://www.instagram.com/reels/SHORTCODE/
 * - https://www.instagram.com/p/SHORTCODE/
 * - https://www.instagram.com/tv/SHORTCODE/
 * - https://www.instagram.com/username/reel/SHORTCODE/
 */
export function parseInstagramUrl(rawUrl) {
  if (!rawUrl || typeof rawUrl !== 'string') return null
  const trimmed = rawUrl.trim()
  if (!trimmed) return null

  try {
    const parsed = new URL(trimmed)
    if (parsed.protocol !== 'https:' && parsed.protocol !== 'http:') return null

    const hostname = parsed.hostname.toLowerCase()
    if (!hostname.endsWith('instagram.com') && !hostname.endsWith('instagr.am')) {
      return null
    }

    const match = parsed.pathname.match(/\/(p|reel|reels|tv)\/([A-Za-z0-9_-]+)/i)
    if (!match) return null

    const rawType = match[1].toLowerCase()
    const type = rawType === 'reels' ? 'reel' : rawType
    const shortcode = match[2]

    return {
      url: `https://www.instagram.com/${type}/${shortcode}/`,
      type,
      shortcode,
      embedUrl: `https://www.instagram.com/${type}/${shortcode}/embed/`,
    }
  } catch {
    return null
  }
}

export function isValidInstagramUrl(rawUrl) {
  if (!rawUrl || typeof rawUrl !== 'string' || !rawUrl.trim()) return true
  return Boolean(parseInstagramUrl(rawUrl))
}
