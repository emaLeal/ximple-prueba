import { Navigate, Outlet } from 'react-router'
import { useGlobalStore } from '../store/useDashboardStore'

const CanCreate = () => {
  const canCreate = useGlobalStore(state => state.canCreate)

  return canCreate ? <Outlet /> : <Navigate to='/' />
}

export default CanCreate