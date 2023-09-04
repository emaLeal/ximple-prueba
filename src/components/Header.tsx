import { Button } from 'primereact/button'
import { confirmDialog } from 'primereact/confirmdialog'
import { Menu } from 'primereact/menu'
import React, { CSSProperties, useRef } from 'react'
import { useNavigate } from 'react-router'
import { useAuthStore } from '../store/useAuthStore'
import { useGlobalStore } from '../store/useDashboardStore'
import Navbar from './Navbar'

interface Props {
  title?: string
}

const style: CSSProperties | any = {
  panel: {
    display: 'flex',
    width: '100%'
  },
  navbar: {
    width: 60
  },
  pannelTitle: {
    fontSize: 30,
    fontWeight: '600',
  },
  alignRight: {
    position: 'absolute',
    right: '2%'
  }
}

const Header = ({ title = 'Dashboard' }: Props) => {
  const nav = useNavigate()
  const logout = useAuthStore(state => state.logout)
  const globalLogout = useGlobalStore().logout
  const menu = useRef<any>(false)


  const items = [
    {
      label: 'Ajustes',
      icon: 'pi pi-fw pi-wrench',
    },
    {
      label: 'Perfil',
      icon: 'pi pi-fw pi-users',
      command: () => {
        nav('/profile')
      }
    },
    {
      label: 'Tu empresa',
      icon: 'pi pi-building',
      command: () => {
        nav('/empresa')
      }
    },
    {
      label: 'Cerrar sesion',
      icon: 'pi pi-fw pi-power-off',
      command: () => {
        confirmDialog({
          message: 'Quieres cerrar sesion?',
          acceptLabel: 'Cerrar sesion',
          rejectLabel: 'Cancelar',
          header: 'Cerrar sesion?',
          accept: () => {
            logout()
            globalLogout()
            nav('/login')
          }
        })
      }
    }
  ];

  return (
    <div style={style.panel}>
      <div style={style.navbar}>
        <Navbar />
      </div>
      <div style={style.pannelTitle}>
        <span>{title}</span>
      </div>
      <div style={style.alignRight}>
        <Button className="p-button-raised p-button-rounded p-button-success p-button-text" icon='pi pi-user' iconPos='right' onClick={(event) => menu.current.toggle(event)}></Button>
        <Menu model={items} ref={menu} popup />
      </div>
    </div>
  )
}

export default Header