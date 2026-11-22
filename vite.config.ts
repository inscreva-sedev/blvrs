import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import { defineConfig, Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

function localCloudinarySignPlugin(): Plugin {
  return {
    name: 'local-cloudinary-sign',
    configureServer(server) {
      const envPath = path.resolve(process.cwd(), '.env')
      if (fs.existsSync(envPath) && typeof process.loadEnvFile === 'function') {
        try {
          process.loadEnvFile(envPath)
        } catch {
          // Ignore if already loaded
        }
      }

      server.middlewares.use('/api/cloudinary/sign', (req, res, next) => {
        if (req.method !== 'POST') {
          next()
          return
        }

        let rawBody = ''
        req.on('data', (chunk) => {
          rawBody += chunk
        })
        req.on('end', () => {
          const cloudName = process.env.CLOUDINARY_CLOUD_NAME
          const apiKey = process.env.CLOUDINARY_API_KEY
          const apiSecret = process.env.CLOUDINARY_API_SECRET

          if (!cloudName || !apiKey || !apiSecret) {
            res.statusCode = 400
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify({ error: 'Credenciais Cloudinary ausentes no .env.' }))
            return
          }

          let folder = 'blvrs-media/portfolio'
          try {
            const parsed = JSON.parse(rawBody || '{}')
            if (parsed.folder) folder = parsed.folder
          } catch {
            // default folder
          }

          const timestamp = Math.floor(Date.now() / 1000)
          const paramsToSign = `folder=${folder}&timestamp=${timestamp}${apiSecret}`
          const signature = crypto.createHash('sha1').update(paramsToSign).digest('hex')

          res.statusCode = 200
          res.setHeader('Content-Type', 'application/json')
          res.end(
            JSON.stringify({
              cloudName,
              apiKey,
              timestamp,
              signature,
              folder,
            })
          )
        })
      })

      server.middlewares.use('/api/auth/login', (req, res, next) => {
        if (req.method !== 'POST') {
          next()
          return
        }

        let rawBody = ''
        req.on('data', (chunk) => {
          rawBody += chunk
        })
        req.on('end', () => {
          try {
            const { email, password } = JSON.parse(rawBody || '{}')
            const expectedEmail = (process.env.ADMIN_EMAIL || 'admin@blvrsmedia.com').toLowerCase()
            const expectedPassword = process.env.ADMIN_PASSWORD || '@Admin123@'
            const secret = process.env.CRON_SECRET || 'blvrs-admin-secret'

            const cleanEmail = String(email || '').trim().toLowerCase()
            if (cleanEmail !== expectedEmail || String(password || '') !== expectedPassword) {
              res.statusCode = 401
              res.setHeader('Content-Type', 'application/json')
              res.end(JSON.stringify({ error: 'E-mail ou palavra-passe inválidos.' }))
              return
            }

            const issuedAt = Date.now()
            const token = crypto
              .createHmac('sha256', secret)
              .update(`${cleanEmail}:${issuedAt}`)
              .digest('hex')

            res.statusCode = 200
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify({ ok: true, email: cleanEmail, token: `${issuedAt}.${token}` }))
          } catch {
            res.statusCode = 400
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify({ error: 'Pedido inválido.' }))
          }
        })
      })
    },
  }
}

export default defineConfig({
  plugins: [react(), tailwindcss(), localCloudinarySignPlugin()],
  server: {
    watch: {
      ignored: ['**/public/**', '**/dist/**', '**/*.pdf'],
    },
  },
})
