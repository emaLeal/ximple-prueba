import { Navigate, Outlet } from 'react-router'
import { useGlobalStore } from '../store/useDashboardStore'

const CanEdit = () => {
  const canEdit = useGlobalStore(state => state.canEdit)

  return canEdit ? <Outlet /> : <Navigate to='/' />
}

export default CanEdit