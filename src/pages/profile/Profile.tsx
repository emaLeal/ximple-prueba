import { Button } from 'primereact/button'
import { Card } from 'primereact/card'
import { ListBox } from 'primereact/listbox'
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import verify from '../../helpers/refresh'
import { useAuthStore } from '../../store/useAuthStore'
import { useGlobalStore } from '../../store/useDashboardStore'
import { AuthService } from '../../services/auth.service'
import { RolesService } from '../../services/roles.service'
import { ProfileService } from '../../services/profile.service'

const Profile = () => {
  const [code, setCode] = useState('')
  const [referal, setReferal] = useState('')
  const [invitUser, setInvitUser] = useState('')
  const [invitedUsers, setInvitedUsers] = useState<any[]>([])
  const [selectedUser, setSelectedUser] = useState({})
  const [money, setMoney] = useState(0)
  const authStore = useAuthStore()
  const globalStore = useGlobalStore()
  const authService = new AuthService()
  const profileService = new ProfileService()
  const error = () => verify()

  useEffect(() => {
    globalStore.setTitle('Perfil')
    setCode(globalStore.profile.username)
    setReferal(globalStore.profile.referal)
    profileService.getWallet(globalStore.profile.id).then(res => {
      setMoney(res.data.money)
    }).catch(e => {
      if (e.response.status === 404) {
        const data = {
          user: globalStore.profile.id,
          money: 0
        }
        profileService.createWallet(data).then(res => {
          profileService.getWallet(globalStore.profile.id).then(res => {
            setMoney(res.data.money)
          })
        }).catch(e => {
          if (e.response.status === 401) error()
        })
      }
      if (e.response.status === 401) error()
    })
  }, [])

  useEffect(() => {
    code && authService.getReferalUsers(code).then(res => {
      setInvitedUsers(res.data)
    }).catch(e => {
      if (e.response.status === 401) error()
    })
  }, [code])

  useEffect(() => {
    referal && authService.verifyUser(referal).then(res => setInvitUser(res.data.username))
      .catch(e => {
        if (e.response.status === 401) error()
      })
  }, [referal])

  const invitation = `/registro/${code}`

  const header1 = <div className='bg-violet-600 p-2 text-black text-left font-bold'>
    <span>USUARIOS INVITADOS</span><i className="pi pi-users"></i>
  </div>

  const header2 = <div className='bg-sky-400 p-2 text-black text-left font-bold'>
    <span>FUISTE INVITADO POR</span><i className="pi pi-user"></i>
  </div>

  const header3 = <div className='bg-lime-400 p-2 text-black text-left font-bold'>
    <span>LINK DE INVITACION</span><i className="pi pi-link"></i>
  </div>

  const headerMoney = <div className='bg-emerald-400 p-2 text-black text-left font-bold'>
    <span>TUS PUNTOS</span><i className="pi pi-dollar"></i>
  </div>

  return (
    <>
      <div className='mb-3 mx-12'>
        <Card header={headerMoney} className='h-full' >
          <span>{money}</span>
        </Card>
      </div>
      <div className='flex justify-around w-screen'>
        <div className='w-2/5 mx-2 text-right'>
          <Card header={header1} className='h-full'>
            <span className='font-bold'>{invitedUsers.length}</span>
          </Card>
        </div>

        {invitUser && <div className='w-2/5 mx-2 text-right'>
          <Card header={header2} className='h-full' >
            <span className='font-bold'>{invitUser}</span>
          </Card>
        </div>}

        <div className='w-2/5 mx-2 text-right'>
          <Card header={header3} className='h-full'>
            <Button className='p-button p-button-rounded p-button-text' tooltip='Copiar link' icon='pi pi-book' onClick={() => navigator.clipboard.writeText(`http://localhost:5173${invitation}`)} /> <Link to={invitation} className='text-xl font-bold' target='_blank'>http://localhost:5173{invitation}</Link>
          </Card>
        </div>
      </div>
      {invitedUsers.length > 0 &&
        <div>
          <span>Estos son los usuarios que invitaste</span>
          <ListBox optionLabel="username" optionValue="email" value={selectedUser} options={invitedUsers} onChange={(e) => setSelectedUser(e.value)} />
        </div>}

    </>
  )
}

export default Profile