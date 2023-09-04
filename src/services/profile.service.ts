import api from "../api/axios";
import { Wallet } from "../types/wallet";

export class ProfileService {
  createWallet(wallet: Wallet) {
    return api.post('/api/wallet/', wallet)
  }

  getWallet(id: number) {
    return api.get(`/api/wallet/${id}/`)
  }

  updateWallet(id: number, wallet: Wallet) {
    return api.put(`/api/wallet/${id}/`, wallet)
  }

  getWallets() {
    return api.get('/api/wallets/')
  }

  chargeWallet(charges: any[]) {
    return api.put('/api/recharge/', charges)
  }
}