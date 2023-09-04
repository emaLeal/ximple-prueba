import api from "../api/axios";
import { Product } from "../types/product";

export class ProductsService {
  getAll (id: number) {
    return api.get(`/api/products/${id}/`)
  }

  getAllShow () {
    return api.get('/api/products/')
  }

  getOne (id: number) {
    return api.get(`/api/products/${id}/`)
  }

  postOne (product: Product) {
    return api.post('/api/products/', product)
  }

  postMany (products: Product[]) {
    return api.post('/api/postproducts/', products)
  }

  updateProduct (id: number, product: any) {
    return api.put(`/api/products/${id}/`, product)
  }

  deleteProduct (id: number) {
    return api.delete(`/api/products/${id}/`)
  }
}