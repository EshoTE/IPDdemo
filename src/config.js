// Backend URL - localhost during dev, Railway in production (set automatically by Vite)
const API_URL = import.meta.env.DEV
  ? 'http://localhost:8080'
  : 'https://termtrack-production.up.railway.app';

export default API_URL;