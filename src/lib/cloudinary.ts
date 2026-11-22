import { getAuthHeaders } from './auth'

export const CLOUDINARY_CLOUD_NAME =
  import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'dnvnftvky'

export const CLOUDINARY_UPLOAD_PRESET =
  import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || ''

/**
 * Optimizes Cloudinary asset URLs with automatic format & quality (f_auto,q_auto).
 * Non-Cloudinary URLs (such as local /images/* assets) are returned unchanged.
 */
export function optimizeMediaUrl(url: string, width?: number): string {
  if (!url) return url
  if (!url.includes('res.cloudinary.com')) return url
  if (url.includes('f_auto') || url.includes('q_auto')) return url

  const transforms = width ? `f_auto,q_auto,w_${width},c_limit` : 'f_auto,q_auto'
  return url.replace('/upload/', `/upload/${transforms}/`)
}

export interface CloudinaryUploadResult {
  secureUrl: string
  publicId: string
  resourceType: 'image' | 'video' | 'raw'
  storageMode: 'cloudinary' | 'local-optimized'
}

/**
 * Compresses an image file in-browser as a fallback when offline or without server signing.
 */
async function fileToCompressedDataUrl(file: File): Promise<string> {
  if (!file.type.startsWith('image/')) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(String(reader.result || ''))
      reader.onerror = () => reject(new Error('Falha ao ler ficheiro local.'))
      reader.readAsDataURL(file)
    })
  }

  return new Promise((resolve, reject) => {
    const img = new Image()
    const objectUrl = URL.createObjectURL(file)
    img.onload = () => {
      URL.revokeObjectURL(objectUrl)
      const maxDim = 1600
      let { width, height } = img
      if (width > maxDim || height > maxDim) {
        const scale = Math.min(maxDim / width, maxDim / height)
        width = Math.round(width * scale)
        height = Math.round(height * scale)
      }
      const canvas = document.createElement('canvas')
      canvas.width = width
      canvas.height = height
      const ctx = canvas.getContext('2d')
      if (!ctx) {
        reject(new Error('Não foi possível processar a imagem.'))
        return
      }
      ctx.drawImage(img, 0, 0, width, height)
      const outputMime = file.type === 'image/png' ? 'image/png' : 'image/jpeg'
      resolve(canvas.toDataURL(outputMime, 0.85))
    }
    img.onerror = () => {
      URL.revokeObjectURL(objectUrl)
      reject(new Error('Formato de imagem inválido.'))
    }
    img.src = objectUrl
  })
}

/**
 * Uploads an image or video directly to Cloudinary (via unsigned preset or /api/cloudinary/sign),
 * with automatic local-optimized fallback for images when running offline.
 */
export async function uploadMediaAsset(
  file: File,
  folder = 'blvrs-media/portfolio'
): Promise<CloudinaryUploadResult> {
  const resourceType = file.type.startsWith('video/') ? 'video' : 'image'
  const endpoint = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/${resourceType}/upload`
  const formData = new FormData()
  formData.append('file', file)
  formData.append('folder', folder)

  try {
    if (CLOUDINARY_UPLOAD_PRESET) {
      formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET)
    } else {
      const signRes = await fetch('/api/cloudinary/sign', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders(),
        },
        body: JSON.stringify({ folder }),
      })

      if (!signRes.ok) {
        throw new Error('Assinatura indisponível')
      }

      const { signature, timestamp, apiKey, cloudName } = await signRes.json()
      formData.append('timestamp', String(timestamp))
      formData.append('signature', signature)
      formData.append('api_key', apiKey)

      const targetEndpoint =
        cloudName && cloudName !== CLOUDINARY_CLOUD_NAME
          ? endpoint.replace(CLOUDINARY_CLOUD_NAME, cloudName)
          : endpoint

      const data = await uploadWithExplicitCloud(targetEndpoint, formData)
      return { ...data, storageMode: 'cloudinary' }
    }

    const data = await uploadWithExplicitCloud(endpoint, formData)
    return { ...data, storageMode: 'cloudinary' }
  } catch (err) {
    // Graceful local-optimized fallback for images so uploads always work in preview/offline mode
    if (resourceType === 'image') {
      const dataUrl = await fileToCompressedDataUrl(file)
      return {
        secureUrl: dataUrl,
        publicId: `local-${Date.now()}`,
        resourceType: 'image',
        storageMode: 'local-optimized',
      }
    }
    throw err instanceof Error
      ? err
      : new Error('Falha ao carregar vídeo para o Cloudinary.')
  }
}

async function uploadWithExplicitCloud(
  endpoint: string,
  formData: FormData
): Promise<Omit<CloudinaryUploadResult, 'storageMode'>> {
  const res = await fetch(endpoint, { method: 'POST', body: formData })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.error?.message || 'Falha ao carregar ficheiro para o Cloudinary.')
  }
  const data = await res.json()
  return {
    secureUrl: data.secure_url,
    publicId: data.public_id,
    resourceType: data.resource_type,
  }
}
