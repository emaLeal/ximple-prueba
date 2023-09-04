import { Navigate, Outlet } from 'react-router'
import { useGlobalStore } from '../store/useDashboardStore'

const CanDownload = () => {
  const canDownload = useGlobalStore(state => state.canDownload)

  return canDownload ? <Outlet /> : <Navigate to='/' />
}

export default CanDownload