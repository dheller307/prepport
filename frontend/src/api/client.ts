import { clearToken, getToken } from '../auth/token'

const baseUrl = import.meta.env.VITE_API_URL

type ApiOptions = {
  method?: string
  body?: unknown
  /** Default true. Set false for login/register. */
  auth?: boolean
}

async function request<T>(path: string, options: ApiOptions = {}, responseType: 'json' | 'text' = 'json'): Promise<T> {
  const { method = 'GET', body, auth = true } = options

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  }

  if (auth) {
    const token = getToken()
    if (token) {
      headers.Authorization = `Bearer ${token}`
    }
  }

  const response = await fetch(`${baseUrl}${path}`, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  })

  if (!response.ok) {
    if (response.status === 401 && auth) {
      clearToken()
    }
    const message = await response.text()
    throw new Error(message || `Request failed (${response.status})`)
  }

  if (response.status === 204) {
    return undefined as T;
  }

  if (responseType === 'json') {
    return (await response.json()) as T
  } else {
    return (await response.text()) as T
  }
}

export async function apiJson<T>(path: string, options: ApiOptions = {}): Promise<T> {
  return request<T>(path, options, 'json')
}

export async function apiText(path: string, options: ApiOptions = {}): Promise<string> {
  return request<string>(path, options, 'text')
}