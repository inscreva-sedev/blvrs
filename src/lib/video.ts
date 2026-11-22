export type ParsedVideo =
  | { kind: 'iframe'; src: string; externalUrl?: string; provider: 'youtube' | 'vimeo' | 'instagram' }
  | { kind: 'video'; src: string }
  | null

/**
 * Converts YouTube, Vimeo, Instagram Reels/Posts, or direct MP4/WebM/Cloudinary URLs
 * into a playable format.
 */
export function parseVideoUrl(rawUrl?: string): ParsedVideo {
  const url = (rawUrl || '').trim()
  if (!url) return null

  // YouTube watch / short / shorts / embed URLs
  const ytMatch = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([A-Za-z0-9_-]{6,})/
  )
  if (ytMatch?.[1]) {
    return {
      kind: 'iframe',
      provider: 'youtube',
      src: `https://www.youtube.com/embed/${ytMatch[1]}?autoplay=1&rel=0`,
      externalUrl: url,
    }
  }

  // Vimeo URLs
  const vimeoMatch = url.match(/vimeo\.com\/(?:video\/)?(\d+)/)
  if (vimeoMatch?.[1]) {
    return {
      kind: 'iframe',
      provider: 'vimeo',
      src: `https://player.vimeo.com/video/${vimeoMatch[1]}?autoplay=1`,
      externalUrl: url,
    }
  }

  // Instagram Post / Reel URLs
  const igMatch = url.match(/instagram\.com\/(?:p|reel|tv)\/([A-Za-z0-9_-]+)/)
  if (igMatch?.[1]) {
    return {
      kind: 'iframe',
      provider: 'instagram',
      src: `https://www.instagram.com/p/${igMatch[1]}/embed`,
      externalUrl: url,
    }
  }

  // Direct video files (MP4, WebM, MOV, or Cloudinary video upload URLs)
  return {
    kind: 'video',
    src: url,
  }
}
