import { Dialog } from "primereact/dialog"
import { Toast } from "primereact/toast"
import { Dropdown } from 'primereact/dropdown'
import { FormEvent, useEffect, useRef, useState } from "react"
import verify from "../../helpers/refresh"
import { useAuthStore } from "../../store/useAuthStore"
import { RolesService } from "../../services/roles.service"
import { Button } from "primereact/button"
import { confirmDialog } from "primereact/confirmdialog"
import { UserService } from "../../services/users.service"
import { useGlobalStore } from "../../store/useDashboardStore"

interface Props {
  onHide: (data?: any) => void,
  visible: boolean,
  data: any
}

const ActualizarRolDialog = ({ onHide, visible, data }: Props) => {
  const refresh = useAuthStore(state => state.refresh)
  const setRefresh = useAuthStore(state => state.setRefresh)
  const setToken = useAuthStore(state => state.setToken)
  const logout = useAuthStore(state => state.logout)
  const rolService = new RolesService()
  const userService = new UserService()
  const toast = useRef<any>(null);
  const [rol, setRol] = useState<any>(null)
  const [roles, setRoles] = useState([])
  const globalLogout = useGlobalStore().logout

  const error = () => verify()

  const getRoles = () => rolService.getAllRoles().then(res => setRoles(res.data))
    .catch(e => {
      if (e.response.status === 401) error()
    })

  useEffect(() => {
    if (data != null) {
      setRol(data.rol)
    } else {
      setRol(null)
    }
    getRoles()
  }, [data])

  const updateRol = (e: FormEvent) => {
    e.preventDefault()
    confirmDialog({
      message: 'Actualizar Rol de usuario?',
      header: 'Actualizar rol',
      accept: () => {
        userService.updateRol(data.id, rol).then(res => {
          if (res.status === 200) {
            onHide(null)
            toast.current.show({ severity: 'success', summary: 'Rol de Usuario Actualizado', detail: 'Se ha actualizado correctamente el rol', life: 3000 });
          }
        }).catch(e => {
          if (e.response.status === 401) error()
        })
      }
    })
  }

  return (
    <>
      <Toast ref={toast} />
      <Dialog header='EDITAR ROL' visible={visible} onHide={onHide} modal>
        <form onSubmit={updateRol} className='shadow-md rounded px-8 pt-2 pb-2 mb-2'>
          <div className="p-field mb-2">
            <Dropdown value={rol} onChange={(e) => setRol(e.value)} options={roles} optionLabel="description"
              placeholder="Selecciona el rol para el usuario" optionValue="id" className="w-full md:w-14rem" />
          </div>
          <div className="flex justify-end">
            <Button icon='pi pi-pencil' type='submit' className='p-button-rounded p-button-warning' />
          </div>
        </form>
      </Dialog>
    </>
  )
}

export default ActualizarRolDialog