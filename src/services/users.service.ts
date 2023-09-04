import api from "../api/axios";

export class UserService {
  getAll() {
    return api.get('/api/users/')
  }

  getOne(id: number) {
    return api.get(`/api/users/${id}/`)
  }

  updateRol(id: number, rol: number) {
    return api.put(`/api/user_rol/${id}/`, {
      rol
    })
  }
}