import api from "../api/axios";

export class CategoriesService {
  getAll() {
    return api.get('/api/categories/')
  }

  post(description: string) {
    return api.post('/api/categories/', {
      description
    })
  }

  put(id: number, description: string) {
    return api.put(`/api/categories/${id}/`, {
      description
    })
  }

  delete(id: number) {
    return api.delete(`/api/categories/${id}/`)
  }
}