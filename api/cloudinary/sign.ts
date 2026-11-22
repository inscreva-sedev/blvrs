import crypto from 'node:crypto'

interface SignRequest {
  method?: string
  body?: { folder?: string }
}

interface SignResponse {
  status: (code: number) => SignResponse
  json: (payload: Record<string, unknown>) => void
}

/**
 * Serverless endpoint to generate a Cloudinary upload signature using CLOUDINARY_API_SECRET.
 * Secrets stay strictly on the server and are never bundled into client assets.
 */
export default function handler(req: SignRequest, res: SignResponse) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' })
    return
  }

  const cloudName = process.env.CLOUDINARY_CLOUD_NAME
  const apiSecret = process.env.CLOUDINARY_API_SECRET
  const apiKey = process.env.CLOUDINARY_API_KEY

  if (!cloudName || !apiSecret) {
    res.status(500).json({ error: 'Cloudinary server environment variables are missing.' })
    return
  }

  if (!apiKey) {
    res.status(400).json({
      error:
        'CLOUDINARY_API_KEY is required on the server for signed uploads, or set VITE_CLOUDINARY_UPLOAD_PRESET for unsigned uploads.',
    })
    return
  }

  const timestamp = Math.floor(Date.now() / 1000)
  const folder = req.body?.folder || 'blvrs-media/portfolio'

  const paramsToSign = `folder=${folder}&timestamp=${timestamp}${apiSecret}`
  const signature = crypto.createHash('sha1').update(paramsToSign).digest('hex')

  res.status(200).json({
    cloudName,
    apiKey,
    timestamp,
    signature,
    folder,
  })
}
