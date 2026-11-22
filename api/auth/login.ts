import crypto from 'node:crypto'

interface LoginRequest {
  method?: string
  body?: { email?: string; password?: string }
}

interface LoginResponse {
  status: (code: number) => LoginResponse
  json: (payload: Record<string, unknown>) => void
}

function safeEqual(a: string, b: string): boolean {
  const bufA = Buffer.from(a)
  const bufB = Buffer.from(b)
  if (bufA.length !== bufB.length) return false
  return crypto.timingSafeEqual(bufA, bufB)
}

export default function handler(req: LoginRequest, res: LoginResponse) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' })
    return
  }

  const expectedEmail = process.env.ADMIN_EMAIL || 'admin@blvrsmedia.com'
  const expectedPassword = process.env.ADMIN_PASSWORD
  const secret = process.env.CRON_SECRET || 'blvrs-admin-secret'

  if (!expectedPassword) {
    res.status(500).json({ error: 'ADMIN_PASSWORD is not configured on the server.' })
    return
  }

  const email = String(req.body?.email || '').trim().toLowerCase()
  const password = String(req.body?.password || '')

  if (!safeEqual(email, expectedEmail.toLowerCase()) || !safeEqual(password, expectedPassword)) {
    res.status(401).json({ error: 'E-mail ou palavra-passe inválidos.' })
    return
  }

  const issuedAt = Date.now()
  const token = crypto
    .createHmac('sha256', secret)
    .update(`${email}:${issuedAt}`)
    .digest('hex')

  res.status(200).json({
    ok: true,
    email,
    token: `${issuedAt}.${token}`,
  })
}
