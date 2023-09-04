import api from "../api/axios";
import { RolType } from "../types/rol";

export class RolesService {
  getAllRoles () {
    return api.get('/api/roles/')
  }

  getOneRol (id: number) {
    return api.get(`/api/roles/${id}/`)
  }

  createRol (rol: RolType) {
    return api.post('/api/roles/', rol)
  }

  updateRol (id: number, rol: RolType) {
    return api.put(`/api/roles/${id}/`, rol)
  }

  deleteRol (id: number) {
    return api.delete(`/api/roles/${id}/`)
  }
}