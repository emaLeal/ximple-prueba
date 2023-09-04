import {create} from 'zustand'
import { persist } from 'zustand/middleware'
import { profile } from '../types/auth'

type State = {
  title: string,
  canWatch: boolean,
  canEdit: boolean,
  canDownload: boolean,
  canCreate: boolean,
  profile: profile,
}

type Actions = {
  setTitle: (title: string) => void,
  setWatch: (canWatch: boolean) => void,
  setEdit: (canEdit: boolean) => void,
  setDownload: (canDownload: boolean) => void,
  setCreate: (canCreate: boolean) => void,
  setProfile: (profile: profile) => void,
  logout: () => void
}

export const useGlobalStore = create(persist<State & Actions>((set) => ({
  title: 'Dashboard',
  canCreate: false,
  canDownload: false,
  canEdit: false,
  canWatch: false,
  profile: {
    referal: '',
    id: 0,
    username: '',
    email: '',
    first_name: '',
    last_name: ''
  },
  setTitle: (title: string) => set((state) => ({
    title
  })),
  setCreate: (canCreate: boolean) => set((state) => ({
    canCreate
  })),
  setEdit: (canEdit: boolean) => set((state) => ({
    canEdit
  })),
  setDownload: (canDownload: boolean) => set((state) => ({
    canDownload
  })),
  setWatch: (canWatch: boolean) => set((state) => ({
    canWatch
  })),
  setProfile: (profile: profile) => set((state) => ({
    profile
  })),
  logout: () => set({
    canCreate: false,
    canEdit: false,
    canDownload: false,
    canWatch: false,
    profile: {
      referal: '',
      id: 0,
      username: '',
      email: '',
      first_name: '',
      last_name: ''
    }
  })
}), {
  name: 'global'
}))