import axios from 'axios'
import environment from '../environment/environment'
import { useAuthStore } from '../store/useAuthStore'

const api = axios.create({
  baseURL: environment.baseUrl,
  withCredentials: true
})

api.interceptors.request.use((config: any) => {
  const token = useAuthStore.getState().token
  config.headers = {
    Authorization: `Bearer ${token}`,
    'Content-type': 'application/x-www-form-urlencoded'
  }
  return config
})

export const apiNoAuth = axios.create({
  baseURL: environment.baseUrl,
})

export default api