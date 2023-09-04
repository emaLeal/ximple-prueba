import { Outlet } from 'react-router'
import Header from '../components/Header'
import {  useGlobalStore } from '../store/useDashboardStore'

const Layout = () => {
  const title = useGlobalStore(state => state.title)

  return (
    <>
      <Header title={title} />
      <div style={{ paddingTop: '2%' }}>
        <Outlet/>
      </div>
    </>


  )
}

export default Layout