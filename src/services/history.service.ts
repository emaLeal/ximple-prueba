import api from "../api/axios";

export class HistoryService {
  getAll() {
    return api.get('/api/histories/')
  }
}