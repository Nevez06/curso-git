// ========================
// Validadores de Seguranca (convertido de SecurityValidator.cs)
// ========================

const DANGEROUS_PATTERNS = [
  /<script[^>]*>.*?<\/script>/gi,
  /javascript:/gi,
  /vbscript:/gi,
  /onload\s*=/gi,
  /onerror\s*=/gi,
  /onclick\s*=/gi,
  /onmouseover\s*=/gi,
  /<iframe[^>]*>/gi,
  /<object[^>]*>/gi,
  /<embed[^>]*>/gi,
  /<form[^>]*>/gi,
  /'\s*OR\s*'/gi,
  /'\s*OR\s+1=1/gi,
  /UNION\s+SELECT/gi,
  /DROP\s+TABLE/gi,
  /INSERT\s+INTO/gi,
  /DELETE\s+FROM/gi,
  /EXEC\(/gi,
  /xp_/gi,
  /\.\.\//g,
  /\.\.\\/g,
  /%2e%2e/gi,
]

export function isValidInput(input: string, allowHtml = false): boolean {
  if (!input || input.trim() === '') return true
  const trimmed = input.trim()
  if (trimmed.length > 10000) return false
  if (allowHtml) return isSafeHtml(trimmed)
  return !containsDangerousContent(trimmed)
}

export function isValidEmail(email: string): boolean {
  if (!email || email.trim() === '') return false
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email) && email.length <= 256
}

export function isValidCPF(cpf: string): boolean {
  if (!cpf) return false
  const cleaned = cpf.replace(/\D/g, '')
  if (cleaned.length !== 11) return false
  if (new Set(cleaned.split('')).size === 1) return false

  // Primeiro digito verificador
  let soma = 0
  for (let i = 0; i < 9; i++) soma += parseInt(cleaned[i]) * (10 - i)
  let resto = soma % 11
  const digito1 = resto < 2 ? 0 : 11 - resto

  // Segundo digito verificador
  soma = 0
  for (let i = 0; i < 10; i++) soma += parseInt(cleaned[i]) * (11 - i)
  resto = soma % 11
  const digito2 = resto < 2 ? 0 : 11 - resto

  return cleaned.endsWith(`${digito1}${digito2}`)
}

export function isValidCNPJ(cnpj: string): boolean {
  const cleaned = cnpj.replace(/\D/g, '')
  return cleaned.length === 14
}

export function isValidPhoneNumber(phone: string): boolean {
  if (!phone) return true
  const numeric = phone.replace(/\D/g, '')
  return numeric.length >= 10 && numeric.length <= 11
}

export function sanitizeInput(input: string): string {
  if (!input) return ''
  let sanitized = input.replace(/[\x00-\x1F\x7F]/g, '')
  if (sanitized.length > 10000) sanitized = sanitized.substring(0, 10000)
  return sanitized.trim()
}

export function sanitizeHtml(html: string): string {
  if (!html) return ''
  let sanitized = html.replace(/<script[^>]*>.*?<\/script>/gi, '')
  sanitized = sanitized.replace(/on\w+\s*=\s*['"][^'"]*['"]/gi, '')
  sanitized = sanitized.replace(/javascript:/gi, '')
  return sanitized
}

function containsDangerousContent(input: string): boolean {
  const lower = input.toLowerCase()
  return DANGEROUS_PATTERNS.some(pattern => pattern.test(lower))
}

function isSafeHtml(html: string): boolean {
  if (!html) return true
  const allowedTags = ['p', 'br', 'strong', 'b', 'em', 'i', 'u', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'ul', 'ol', 'li', 'a', 'img']
  const tagRegex = /<\/?([a-zA-Z][a-zA-Z0-9]*)\b[^>]*>/gi
  let match
  while ((match = tagRegex.exec(html)) !== null) {
    const tagName = match[1].toLowerCase()
    if (!allowedTags.includes(tagName)) return false
  }
  return true
}

// ========================
// Helper para obter dados do User-Agent
// ========================
export function getNavegador(userAgent: string): string {
  if (!userAgent) return 'Desconhecido'
  if (userAgent.includes('Chrome')) return 'Chrome'
  if (userAgent.includes('Firefox')) return 'Firefox'
  if (userAgent.includes('Safari') && !userAgent.includes('Chrome')) return 'Safari'
  if (userAgent.includes('Edge')) return 'Edge'
  if (userAgent.includes('Opera')) return 'Opera'
  return 'Outro'
}

export function getSistemaOperacional(userAgent: string): string {
  if (!userAgent) return 'Desconhecido'
  if (userAgent.includes('Windows NT 10')) return 'Windows 10'
  if (userAgent.includes('Android')) return 'Android'
  if (userAgent.includes('iOS')) return 'iOS'
  if (userAgent.includes('Mac OS X')) return 'macOS'
  if (userAgent.includes('Linux')) return 'Linux'
  return 'Outro'
}
