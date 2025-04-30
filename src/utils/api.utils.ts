import { AppConfig } from '../config'

export const ENDPOINTS = {
  // auth
  AUTH: '/auth',
  PROJECTS: '/projects',
  ULTIMO_PROJECT: '/projects/last-worked',
  USER: '/auth/user',
  COLABORADOR: '/auth/subuser',
  RESET_PASSWORD: '/api/reset-password',
  RECOVER_PASSWORD: '/api/forgot-password',
  // /last-worked
  LOGIN: '/api/login',
  VERIFY: '/api/checkToken',
  LOGOUT: '/api/logout',
  // RECOVER_PASSWORD: '/api/forgot-password',
  // RESET_PASSWORD: '/api/reset-password',
  STORE: '/api/store',
  STORE_COMMENT: '/api/store-comment',
  CATEGORY: '/api/category'
}

export const API_BASEURL = AppConfig.API_URL
export const buildUrl = ({ endpoint, id = undefined, query = undefined }: { endpoint: string, id?: string, query?: string }) => {
  return `${API_BASEURL}${endpoint}${id ? `/${id}` : ''}${query ? `?${query}` : ''}`
}
