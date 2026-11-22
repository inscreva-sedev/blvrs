import { getDatabase } from './_lib/mongodb'
import { verifyAdminToken } from './_lib/auth'

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
    const collection = db.collection('quotes')

    if (req.method === 'POST') {
      const quote = req.body
      if (!quote || !quote.name || !quote.email || !quote.message) {
        res.status(400).json({ error: 'Name, email and message are required' })
        return
      }
      await collection.insertOne({
        ...quote,
        status: quote.status || 'Novo',
        createdAt: quote.createdAt || new Date().toISOString(),
      })
      res.status(201).json({ ok: true, quote })
      return
    }

    if (!verifyAdminToken(req)) {
      res.status(401).json({ error: 'Unauthorized: admin session required' })
      return
    }

    if (req.method === 'GET') {
      const quotes = await collection
        .find({}, { projection: { _id: 0 } })
        .sort({ createdAt: -1 })
        .limit(100)
        .toArray()
      res.status(200).json({ quotes })
      return
    }

    if (req.method === 'PATCH') {
      const id = req.body?.id
      const status = req.body?.status
      if (!id || !status) {
        res.status(400).json({ error: 'Quote id and status are required' })
        return
      }
      await collection.updateOne({ id }, { $set: { status, updatedAt: new Date().toISOString() } })
      res.status(200).json({ ok: true })
      return
    }

    res.status(405).json({ error: 'Method not allowed' })
  } catch (err) {
    res.status(500).json({
      error: err instanceof Error ? err.message : 'MongoDB quotes error',
    })
  }
}
