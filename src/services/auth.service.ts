import api, { apiNoAuth } from "../api/axios";
import { LoginForm, User } from "../types/auth";

export class AuthService {
  async verifyUser(code: string) {
    return await apiNoAuth.get(`/api/verify-user/${code}`)
  }

  async getProfile() {
    return await api.get('/auth/users/me/')
  }

  async getReferalUsers(code: string) {
    return await api.get(`/api/get-invited-user/${code}`)
  }

  async login (data: LoginForm) {
    return  await api.post('/auth/jwt/create', data)
  }

  async register(data: User) {
    return await apiNoAuth.post('/auth/users/', data)
  }

  async activate(uid: string, token: string) {
    return await apiNoAuth.post('/auth/users/activation/', {
      uid,
      token
    })
  }
  
  async verify(token: string) {
    return  await apiNoAuth.post('/auth/jwt/verify/', {
      token
    })
  }

  async refresh(refresh: string) {
    return await apiNoAuth.post('/auth/jwt/refresh', {
      refresh
    })
  }  
}