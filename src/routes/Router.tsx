import { BrowserRouter, Routes, Route } from 'react-router-dom'
import CanCreate from '../PermissionsComponents/CanCreate'
import ProtectedRoute from '../components/ProtectedRoute'
import Layout from '../Layout/Layout'
import Activate from '../pages/auth/Activate'
import Login from '../pages/auth/Login'
import Register from '../pages/auth/Register'
import Dashboard from '../pages/dashboard/Dashboard'
import Roles from '../pages/roles/Roles'
import Users from '../pages/users/Users'
import { useAuthStore } from '../store/useAuthStore'
import Profile from '../pages/profile/Profile'
import CanWatch from '../PermissionsComponents/CanWatch'
import Products from '../pages/products/Products'
import Categories from '../pages/categories/Categories'
import { Wallet } from '../pages/wallet/Wallet'
import Historial from '../pages/historial/Historial'
import Emprise from '../pages/emprise/Emprise'
import EmpriseTab from '../pages/emprise/EmpriseTab'

const Router = () => {
  const isAuth = useAuthStore(state => state.isAuth)

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/login' element={<Login />} />
        <Route path='/registro' element={<Register />} />
        <Route path='/registro/:link' element={<Register />} />
        <Route path='/activate/:uid/:token' element={<Activate />} />
        <Route element={<ProtectedRoute isAllowed={isAuth} />} >
          <Route path='/' element={<Layout />} >
            <Route path='/profile' element={<Profile />} />
            <Route index element={<Dashboard />} />
            <Route element={<CanCreate />}>
              <Route path='/roles' element={<Roles />} />
              <Route path='/users' element={<Users />} />
              <Route path='/categorias' element={<Categories />} />
              <Route path='/wallet' element={<Wallet />} />
              <Route path='/historial' element={<Historial />} />
            </Route>
            <Route element={<CanWatch />} >
              <Route element={<Emprise />} >
                <Route path='/products' element={<Products />} />
                <Route path='/empresa' element={<EmpriseTab />} />
              </Route>
            </Route>
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default Router