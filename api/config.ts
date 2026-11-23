import { getDatabase } from './_lib/mongodb.js'
import { verifyAdminToken } from './_lib/auth.js'

interface ApiRequest {
  method?: string
  headers?: Record<string, string | string[] | undefined>
  body?: Record<string, unknown>
}

interface ApiResponse {
  status: (code: number) => ApiResponse
  json: (payload: unknown) => void
}

export default async function handler(req: ApiRequest, res: ApiResponse) {
  try {
    const db = await getDatabase()
    const collection = db.collection('site_config')

    if (req.method === 'GET') {
      const doc = await collection.findOne({ key: 'main' }, { projection: { _id: 0, key: 0 } })
      res.status(200).json({ bundle: doc || null })
      return
    }

    if (!verifyAdminToken(req)) {
      res.status(401).json({ error: 'Unauthorized: admin session required' })
      return
    }

    if (req.method === 'PUT') {
      const bundle = req.body
      if (!bundle) {
        res.status(400).json({ error: 'Content bundle payload is required' })
        return
      }
      await collection.updateOne(
        { key: 'main' },
        { $set: { ...bundle, key: 'main', updatedAt: new Date().toISOString() } },
        { upsert: true }
      )
      res.status(200).json({ ok: true })
      return
    }

    res.status(405).json({ error: 'Method not allowed' })
  } catch (err) {
    res.status(500).json({
      error: err instanceof Error ? err.message : 'MongoDB config error',
    })
  }
}
