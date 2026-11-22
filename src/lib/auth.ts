const SESSION_KEY = 'blvrs_admin_session_v1'
// Fallback digest used only in purely static builds without /api/auth/login
const FALLBACK_DIGEST = 'cab4bab929017553ddae99e3c870196d37269f46fac3fc0ef1d94318afc1bd90'

export interface AdminSession {
  email: string
  token: string
  loggedInAt: number
}

async function sha256Hex(input: string): Promise<string> {
  const bytes = new TextEncoder().encode(input)
  const digest = await crypto.subtle.digest('SHA-256', bytes)
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}

export function getAdminSession(): AdminSession | null {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as AdminSession
    return parsed?.email && parsed?.token ? parsed : null
  } catch {
    return null
  }
}

export function logoutAdmin(): void {
  try {
    sessionStorage.removeItem(SESSION_KEY)
  } catch {
    // ignore storage errors
  }
}

export async function loginAdmin(email: string, password: string): Promise<AdminSession> {
  const normalizedEmail = email.trim().toLowerCase()

  try {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: normalizedEmail, password }),
    })

    if (res.ok) {
      const data = await res.json()
      const session: AdminSession = {
        email: data.email || normalizedEmail,
        token: data.token,
        loggedInAt: Date.now(),
      }
      sessionStorage.setItem(SESSION_KEY, JSON.stringify(session))
      return session
    }

    if (res.status === 401) {
      const err = await res.json().catch(() => ({}))
      throw new Error(err.error || 'E-mail ou palavra-passe inválidos.')
    }
  } catch (err) {
    if (err instanceof Error && err.message.includes('inválidos')) {
      throw err
    }
    // Fall through to static SHA-256 verification when /api/auth/login is absent
  }

  const candidateHash = await sha256Hex(`${normalizedEmail}:${password}`)
  if (candidateHash !== FALLBACK_DIGEST) {
    throw new Error('E-mail ou palavra-passe inválidos.')
  }

  const session: AdminSession = {
    email: normalizedEmail,
    token: `local.${Date.now()}`,
    loggedInAt: Date.now(),
  }
  sessionStorage.setItem(SESSION_KEY, JSON.stringify(session))
  return session
}
