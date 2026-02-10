import axios from 'axios'

// instancia para no repetir la URL base ni la API Key
const apiClient = axios.create({
  baseURL: 'https://gnews.io/api/v4', // su documentación indica la URL base
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

// getJapanNews ahora acepta una opción TTL en milisegundos (por defecto 10 minutos)
export const getJapanNews = async (opts = {}) => {
  const ttl = typeof opts.ttl === 'number' ? opts.ttl : 10 * 60 * 1000

  const cached = getCache()
  if (cached && now() - cached.ts < ttl) {
    return cached.data
  }

  try {
    const response = await apiClient.get('/top-headlines', {
      params: {
        country: 'jp',
        lang: 'ja',
      },
    })
    const articles = response.data.articles
    setCache(articles)
    return articles
  } catch (error) {
    console.error('Error cargando noticias:', error)
    // si hay cache anterior pero la petición falla, devolverla como fallback (datos que ya estaban guardados en localStorage)
    if (cached && cached.data) return cached.data
    throw error
  }
}
