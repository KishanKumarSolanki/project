export function isAllowedImageUrl(value) {
  if (typeof value !== 'string' || !value.trim()) return false

  try {
    return new URL(value).protocol === 'https:'
  } catch {
    return false
  }
}
