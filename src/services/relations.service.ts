import { apiNoAuth } from "../api/axios";

export class RelationsService {
  async createRelation(data: any) {
    return apiNoAuth.post('/api/relations/', data)
  }
}