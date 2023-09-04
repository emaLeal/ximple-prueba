import React, { useEffect, useRef, useState } from 'react'
import { EmpriseService } from '../../services/emprise.service'
import { useGlobalStore } from '../../store/useDashboardStore'
import { TabMenu } from 'primereact/tabmenu'
import { Toast } from 'primereact/toast'
import { Outlet, useNavigate } from 'react-router'
import verify from '../../helpers/refresh'

const Emprise = (): JSX.Element => {
  const nav = useNavigate()
  const toast = useRef<any>(null)

  const items = [
    { label: 'Empresa', icon: 'pi pi-building', command: () => nav('/empresa') },
    {
      label: 'Productos',icon: 'pi pi-box', command: () => nav('/products')}
  ]

  return (
    <>
      <Toast ref={toast} />
      <TabMenu model={items} />
      <Outlet />
    </>
  )
}

export default Emprise