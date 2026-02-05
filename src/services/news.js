import axios from 'axios';

// instancia para no repetir la URL base ni la API Key
const apiClient = axios.create({
  baseURL: 'https://gnews.io/api/v4', // su documentación indica la URL base
  params: {
    'apikey': import.meta.env.VITE_GNEWS_KEY 
  }
});

export const getJapanNews = async () => {
  try {
    const response = await apiClient.get('/top-headlines', {
      params: {
        'country': 'jp',
        'lang': 'ja'
      }
    });
    // GNews devuelve los datos en un objeto 'articles'
    return response.data.articles;
  } catch (error) {
    console.error("Error cargando noticias:", error);
    throw error;
  }
};