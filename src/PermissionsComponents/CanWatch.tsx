import { Navigate, Outlet } from 'react-router'
import { useGlobalStore } from '../store/useDashboardStore'

const CanWatch = () => {
  const canWatch = useGlobalStore(state => state.canWatch)

  return canWatch ? <Outlet /> : <Navigate to='/' />
}

export default CanWatch