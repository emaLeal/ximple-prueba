import { confirmDialog } from "primereact/confirmdialog"
import { AuthService } from "../services/auth.service"
import { useAuthStore } from "../store/useAuthStore"
import { useGlobalStore } from "../store/useDashboardStore"

interface Params {
  refresh: string,
  setRefresh: (refresh: string) => void,
  setToken: (token: string) => void,
  logout: () => void,
  globalLogout: () => void
}

/** 
 * Confirms if the user has a refresh token for avoiding logout
 * @param refresh is the param used for refresh the session
 * @param setRefresh is the param that manages the value from the refresh token
 * @param setToken is the param that manages the value of the main token
 * @param logout is the param for logout when the refresh is not valid 
 * @param globalLogout is the param for deleting the permissions
*/
const verify = () => {
  const refresh = useAuthStore.getState().refresh
  const setRefresh = useAuthStore.getState().setRefresh
  const setToken = useAuthStore.getState().setToken
  const logout = useAuthStore.getState().logout
  const globalLogout = useGlobalStore.getState().logout
  const authService = new AuthService()

  if (refresh != '') {
    confirmDialog({
      message: 'Quieres prolongar tu sesion?',
      header: 'Posponer Sesion',
      accept: async () => {
        try {
          const tryRefresh = await authService.refresh(refresh)
          if (tryRefresh.status === 200) {
            setToken(tryRefresh.data.access)
            setRefresh('')
            location.reload()
          }
        } catch (e) {
          logout()
        }
      },
      reject: () => {
        logout()
        globalLogout()
      }
    })
  } else {
    logout()
    globalLogout()
  }
}

export default verify