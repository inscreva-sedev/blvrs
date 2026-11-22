import { getDatabase } from './_lib/mongodb'

interface ApiRequest {
  method?: string
  query?: Record<string, string | string[] | undefined>
  body?: Record<string, unknown>
}

interface ApiResponse {
  status: (code: number) => ApiResponse
  json: (payload: unknown) => void
}

export default async function handler(req: ApiRequest, res: ApiResponse) {
  try {
    const db = await getDatabase()
    const collection = db.collection('projects')

    if (req.method === 'GET') {
      const items = await collection
        .find({}, { projection: { _id: 0 } })
        .sort({ createdAt: -1 })
        .toArray()
      res.status(200).json({ projects: items })
      return
    }

    if (req.method === 'POST') {
      const project = req.body
      if (!project || !project.id || !project.title) {
        res.status(400).json({ error: 'Invalid project payload' })
        return
      }
      await collection.insertOne({ ...project, createdAt: new Date().toISOString() })
      res.status(201).json({ ok: true, project })
      return
    }

    if (req.method === 'PUT') {
      const project = req.body
      if (!project || !project.id || !project.title) {
        res.status(400).json({ error: 'Invalid project payload' })
        return
      }
      await collection.updateOne(
        { id: project.id },
        { $set: { ...project, updatedAt: new Date().toISOString() } },
        { upsert: true }
      )
      res.status(200).json({ ok: true, project })
      return
    }

    if (req.method === 'DELETE') {
      const id = Array.isArray(req.query?.id) ? req.query?.id[0] : req.query?.id
      if (!id) {
        res.status(400).json({ error: 'Project id is required' })
        return
      }
      await collection.deleteOne({ id })
      res.status(200).json({ ok: true, deletedId: id })
      return
    }

    res.status(405).json({ error: 'Method not allowed' })
  } catch (err) {
    res.status(500).json({
      error: err instanceof Error ? err.message : 'MongoDB projects error',
    })
  }
}
