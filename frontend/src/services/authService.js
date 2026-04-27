import { authApi } from './api'

export const login = async (username, password) => {
  return authApi.post('/login/', { username, password })
}

export const register = async (username, password) => {
  return authApi.post('/register/', { username, password })
}
