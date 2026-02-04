// netlify/functions/news.js
import fetch from 'node-fetch';
export async function handler(event) {
  const q = event.queryStringParameters.q || 'general';
  const apiKey = process.env.NEWS_API_KEY;
  const r = await fetch(`https://api.example.com/search?q=${encodeURIComponent(q)}`, {
    headers: { 'Authorization': `Bearer ${apiKey}` }
  });
  const data = await r.json();
  return { statusCode: 200, body: JSON.stringify(data) };
}