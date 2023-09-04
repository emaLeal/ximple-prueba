import api from "../api/axios";

export class EmpriseService {
  getEmprise(id: number) {
    return api.get(`api/emprise/${id}/`)
  }

  createEmprise(emprise: any) {
    return api.post('api/emprise/', emprise)
  }

  updateEmprise(emprise: any, id: number) {
    return api.put(`api/emprise/${id}/`, emprise)
  }
}