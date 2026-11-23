import crypto from 'node:crypto'
import { verifyAdminToken } from '../_lib/auth.js'

interface SignRequest {
  method?: string
  headers?: Record<string, string | string[] | undefined>
  body?: { folder?: string }
}

interface SignResponse {
  status: (code: number) => SignResponse
  json: (payload: Record<string, unknown>) => void
}

/**
 * Serverless endpoint to generate a Cloudinary upload signature using CLOUDINARY_API_SECRET.
 * Protected by admin Bearer token so only authenticated admins can sign uploads.
 */
export default function handler(req: SignRequest, res: SignResponse) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' })
    return
  }

  if (!verifyAdminToken(req)) {
    res.status(401).json({ error: 'Unauthorized: admin session required' })
    return
  }

  const cloudName = process.env.CLOUDINARY_CLOUD_NAME
  const apiSecret = process.env.CLOUDINARY_API_SECRET
  const apiKey = process.env.CLOUDINARY_API_KEY

  if (!cloudName || !apiSecret || !apiKey) {
    res.status(500).json({ error: 'Cloudinary server environment variables are missing.' })
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
