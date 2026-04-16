import axios from 'axios'

/**
 * IMPORTANTE: Para que esto funcione, debes tener el archivo vercel.json en la raíz:
 * {
 * "rewrites": [{ "source": "/api/gnews/:path*", "destination": "https://gnews.io/api/v4/:path*" }]
 * }
 */

const apiClient = axios.create({
  // Reemplazamos la URL directa por la ruta del proxy de Vercel
  // En desarrollo (localhost), esto fallará a menos que uses 'vercel dev'
  baseURL: '/api/gnews', 
  params: {
    apikey: import.meta.env.VITE_GNEWS_KEY,
  },
})

const CACHE_KEY = 'gnews:japanNews'
const now = () => new Date().getTime()

function getCache() {
  try {
    const raw = localStorage.getItem(CACHE_KEY)
    if (!raw) return null
    return JSON.parse(raw)
  } catch (e) {
    console.warn('No se pudo leer cache de noticias:', e)
    return null
  }
}

function setCache(data) {
  try {
    const payload = { ts: now(), data }
    localStorage.setItem(CACHE_KEY, JSON.stringify(payload))
  } catch (e) {
    console.warn('No se pudo escribir cache de noticias:', e)
  }
}

export function clearNewsCache() {
  try {
    localStorage.removeItem(CACHE_KEY)
  } catch (e) {
    console.warn('No se pudo limpiar cache de noticias:', e)
  }
}

export const getJapanNews = async (opts = {}) => {
  const ttl = typeof opts.ttl === 'number' ? opts.ttl : 10 * 60 * 1000

  const cached = getCache()
  // Si hay cache y no ha expirado, la usamos
  if (cached && (now() - cached.ts < ttl)) {
    return cached.data
  }

  try {
    const response = await apiClient.get('/top-headlines', {
      params: {
        country: 'jp',
        lang: 'ja',
        // La apikey ya va en la instancia, pero se asegura aquí
        apikey: import.meta.env.VITE_GNEWS_KEY,
      },
    })
    
    const articles = response.data.articles
    setCache(articles)
    return articles
  } catch (error) {
    console.error('Error al obtener noticias:', error)
    // Fallback: si la API falla (por CORS o límite), usamos lo que haya en cache aunque sea viejo
    if (cached && cached.data) {
      console.info('Sirviendo noticias antiguas desde cache debido a un error de red.');
      return cached.data
    }
    throw error
  }
}