import axios from 'axios'

const addAuth = (instance) => {
  instance.interceptors.request.use(config => {
    const token = localStorage.getItem('token')
    if (token) config.headers.Authorization = `Bearer ${token}`
    return config
  })
  return instance
}

// Relative URLs: work on any domain through Nginx in production.
// In local dev (no Docker) Vite proxies these — see vite.config.js.
export const authApi     = addAuth(axios.create({ baseURL: '/api/auth' }))
export const groupsApi   = addAuth(axios.create({ baseURL: '/api/groups' }))
export const messagesApi = addAuth(axios.create({ baseURL: '/api/messages' }))
