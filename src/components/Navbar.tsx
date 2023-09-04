import { Menu } from 'primereact/menu'
import { Button } from 'primereact/button'
import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router';
import { useAuthStore } from '../store/useAuthStore';
import { confirmDialog, ConfirmDialog } from 'primereact/confirmdialog';
import { useGlobalStore } from '../store/useDashboardStore';

const Navbar = () => {
  const menu = useRef<any>(null);
  const nav = useNavigate()
  const rol = useAuthStore(state => state.rol)
  const globalStore = useGlobalStore()

  const items = [
    { 
      label: 'Dashboard',
      icon: 'pi pi-fw pi-home',
      command: () => nav('/')
    }
  ];

  useEffect(() => {
    globalStore.canCreate && items.push({
      label: 'Roles',
      icon: 'pi pi-user-edit',
      command: () => nav('/roles')
    }, {
      label: 'Usuarios',
      icon: 'pi pi-users',
      command: () => nav('/users')
    }, {
      label: 'Categorias',
      icon: 'pi pi-tag',
      command: () => nav('/categorias')
    }, {
      label: 'Recargar Puntos',
      icon: 'pi pi-dollar',
      command: () => nav('/wallet')
    },{
      label: 'Historial',
      icon: 'pi pi-history',
      command: () => nav('/historial')
    }
    )
  })
  
  return (
    <>
      <Menu model={items} ref={menu} popup />
      <Button type="button" className='p-button-text p-button-success' iconPos='right' icon="pi pi-bars" onClick={(event) => menu.current.toggle(event)}></Button>
      <ConfirmDialog />
    </>
  )
}

export default Navbar