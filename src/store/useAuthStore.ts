import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type State = {
  token: string,
  isAuth: boolean,
  refresh: string,
  rol: number
}

type Actions = {
  setToken: (token: string) => void,
  setRefresh: (refresh: string) => void,
  setRol: (number: number) => void,
  logout: () => void
}

export const useAuthStore = create(persist<State & Actions>((set) => ({
  token: '',
  isAuth: false,
  refresh: '',
  rol: 0,
  setToken: (token: string) => set((state) => ({
    token,
    isAuth: true
  })),
  setRefresh: (refresh: string) => set((state) => ({
    refresh,
    isAuth: true
  })),
  setRol: (rol) => set((state) => ({
    rol
  })),
  logout: () => set({
    token: '',
    refresh: '',
    isAuth: false,
    rol: 0
  })
}), {
  name: 'token'
}))