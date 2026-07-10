import crypto from 'node:crypto'

const ALGORITHM = 'aes-256-gcm'

function getKey() {
  const secret = process.env.AI_SETTINGS_SECRET || process.env.BETTER_AUTH_SECRET
  if (!secret) throw new Error('Thiếu AI_SETTINGS_SECRET hoặc BETTER_AUTH_SECRET')
  return crypto.createHash('sha256').update(secret, 'utf8').digest()
}

export function encryptSecret(value: string) {
  const iv = crypto.randomBytes(12)
  const cipher = crypto.createCipheriv(ALGORITHM, getKey(), iv)
  const encrypted = Buffer.concat([cipher.update(value, 'utf8'), cipher.final()])
  return [iv, cipher.getAuthTag(), encrypted].map((part) => part.toString('base64url')).join('.')
}

export function decryptSecret(value: string) {
  const [iv, tag, encrypted] = value.split('.').map((part) => Buffer.from(part, 'base64url'))
  if (!iv || !tag || !encrypted) throw new Error('API key đã mã hóa không hợp lệ')
  const decipher = crypto.createDecipheriv(ALGORITHM, getKey(), iv)
  decipher.setAuthTag(tag)
  return Buffer.concat([decipher.update(encrypted), decipher.final()]).toString('utf8')
}

export function maskApiKey(value: string) {
  if (value.length < 8) return '••••••••'
  return `${value.slice(0, 3)}-••••${value.slice(-4)}`
}
