import { getDatabase } from './_lib/mongodb'

interface ApiRequest {
  method?: string
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

    if (req.method === 'GET') {
      const quotes = await collection
        .find({}, { projection: { _id: 0 } })
        .sort({ createdAt: -1 })
        .limit(50)
        .toArray()
      res.status(200).json({ quotes })
      return
    }

    if (req.method === 'POST') {
      const quote = req.body
      if (!quote || !quote.name || !quote.email || !quote.message) {
        res.status(400).json({ error: 'Name, email and message are required' })
        return
      }
      await collection.insertOne({ ...quote, createdAt: quote.createdAt || new Date().toISOString() })
      res.status(201).json({ ok: true, quote })
      return
    }

    res.status(405).json({ error: 'Method not allowed' })
  } catch (err) {
    res.status(500).json({
      error: err instanceof Error ? err.message : 'MongoDB quotes error',
    })
  }
}
