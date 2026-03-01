// api/get-news.js
import { VITE_GNEWS_KEY } from '$env/static/public'

export default async function handler(req, res) {
  const { country, lang } = req.query;
  const apiKey = VITE_GNEWS_KEY;
  const url = `https://gnews.io/api/v4/top-headlines?apikey=${apiKey}&country=${country}&lang=${lang}`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    
    // Devolvemos los datos a tu app de Vue
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: "Error al llamar a GNews" });
  }
}