import { getDatabase } from '../_lib/mongodb.js'

interface CronRequest {
  headers: Record<string, string | string[] | undefined>
}

interface CronResponse {
  status: (code: number) => CronResponse
  json: (payload: Record<string, unknown>) => void
}

/**
 * Protected scheduled maintenance / health endpoint authenticated via CRON_SECRET.
 */
export default async function handler(req: CronRequest, res: CronResponse) {
  const cronSecret = process.env.CRON_SECRET
  const authHeader = req.headers.authorization

  if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
    res.status(401).json({ error: 'Unauthorized' })
    return
  }

  let mongoStatus = 'not_configured'
  if (process.env.MONGODB_URI) {
    try {
      const db = await getDatabase()
      await db.command({ ping: 1 })
      mongoStatus = 'connected'
    } catch {
      mongoStatus = 'error'
    }
  }

  res.status(200).json({
    ok: true,
    service: 'blvrs-media-cron',
    cloudinaryCloud: process.env.CLOUDINARY_CLOUD_NAME || null,
    mongodb: mongoStatus,
    timestamp: new Date().toISOString(),
  })
}
