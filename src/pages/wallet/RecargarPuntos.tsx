import { Button } from 'primereact/button'
import { Dialog } from 'primereact/dialog'
import { InputText } from 'primereact/inputtext'
import React, { useEffect, useState } from 'react'
import verify from '../../helpers/refresh'
import { useAuthStore } from '../../store/useAuthStore'
import { useGlobalStore } from '../../store/useDashboardStore'
import { ProfileService } from '../../services/profile.service'

interface Props {
  visible: boolean,
  onHide: (data?: any) => void,
  data: any
}

const RecargarPuntos = ({ visible, onHide, data }: Props) => {
  const [money, setMoney] = useState<any>(0)
  const [user, setUser] = useState(data.user_id)
  const profileService = new ProfileService()
  const authStore = useAuthStore()
  const globalStore = useGlobalStore()
  const error = () => verify()


  const chargeWallet = (e: React.FormEvent) => {
    e.preventDefault()
    profileService.updateWallet(user, {
      user,
      money
    }).then(res => {
      console.log('Success' + res)
    }).catch(e => {
      if (e.response.status === 401) error()
    })
    onHide({ user_id: 0, money: 0 })
  }

  useEffect(() => {
    console.log(user)
    setMoney(0)
    setUser(data.user_id)
  }, [data])

  useEffect(() => {
    setUser(data.user_id)
  }, [])

  return (
    <>
      <Dialog header='RECARGAR BILLETERAS' visible={visible} onHide={() => onHide({ user_id: 0, money: 0 })} modal dismissableMask>
        <form className='shadow-md rounded px-8 pt-2 pb-2 mb-2' onSubmit={chargeWallet}>
          <div className="p-field mb-2">
            <span className='p-float-label'>
              <InputText id='money' type={'number'} value={money} onChange={(e) => setMoney(Number(e.target.value))} />
              <label htmlFor='money'>Ingresa cuantos puntos quieres añadir</label>
            </span>
          </div>
          <div className="flex justify-end">
            <Button icon='pi pi-dollar' type='submit' tooltip='Recargar puntos' className='p-button-rounded p-button-success p-button-text' disabled={money === 0} />
          </div>
        </form>
      </Dialog>
    </>
  )
}

export default RecargarPuntos