import { Button } from 'primereact/button'
import { Dialog } from 'primereact/dialog'
import { InputText } from 'primereact/inputtext'
import { Checkbox } from 'primereact/checkbox'
import { Toast } from 'primereact/toast'
import { useEffect, useRef, useState } from 'react'
import verify from '../../helpers/refresh'
import { useAuthStore } from '../../store/useAuthStore'
import { RolesService } from '../../services/roles.service'
import { useGlobalStore } from '../../store/useDashboardStore'
import { RolType } from '../../types/rol'

interface Props {
  onHide: (data?: any) => void,
  visible: boolean,
  data?: any
}

const CrearActualizarRol = ({ onHide, visible, data }: Props) => {
  const setRefresh = useAuthStore(state => state.setRefresh)
  const refresh = useAuthStore.getState().refresh
  const [nombre, setNombre] = useState('')
  const [canWatch, setWatch] = useState(false)
  const [canDownload, setDownload] = useState(false)
  const [canEdit, setEdit] = useState(false)
  const [canCreate, setCreate] = useState(false)
  const logout = useAuthStore.getState().logout
  const setToken = useAuthStore(state => state.setToken)
  const toast = useRef<any>(null);
  const globalLogout = useGlobalStore().logout
  const rolService = new RolesService()
  const error = () =>  verify()

  useEffect(() => {
    if (data != null) {
      setNombre(data.description)
      setWatch(data.can_watch)
      setEdit(data.can_edit)
      setCreate(data.can_create)
      setDownload(data.can_download)
    } else {
      setNombre('')
      setWatch(false)
      setDownload(false)
      setCreate(false)
      setEdit(false)
    }
  }, [data])

  const postRol = (e: React.FormEvent) => {
    e.preventDefault()
    const newRol: RolType = {
      description: nombre,
      can_create: canCreate,
      can_download: canDownload,
      can_edit: canEdit,
      can_watch: canWatch
    }
    rolService.createRol(newRol).then(res => {
      if (res.status === 201) {
        onHide(null)
        toast.current.show({ severity: 'success', summary: 'Rol Creado', detail: 'Se ha creado correctamente el rol', life: 3000 });
      }
    }).catch(e => {
      if (e.response.status === 401) {
       error()
      }
    })
  }

  const updateRol = (e: React.FormEvent) => {
    e.preventDefault()
    const updateRol: RolType = {
      description: nombre,
      can_create: canCreate,
      can_download: canDownload,
      can_edit: canEdit,
      can_watch: canWatch
    }

    rolService.updateRol(data.id, updateRol).then(res => {
      if (res.status === 200) {
        console.log(res)
        onHide(null)
        toast.current.show({ severity: 'success', summary: 'Rol Actualizado', detail: 'Se ha actualizado correctamente el rol', life: 3000 });
      }
    }).catch(e => {
      if (e.response.status === 401) {
        error()
      }
    })
  }

  return (
    <>
      <Toast ref={toast} />
      <Dialog header='CREAR ROL' visible={visible} onHide={onHide} modal>
        <p></p>
        <form onSubmit={data === null ? postRol : updateRol} className='shadow-md rounded px-8 pt-2 pb-2 mb-2'>
          <div className="p-field mb-4">
            <span className="p-float-label">
              <InputText id='rol' name="rol" value={nombre} onChange={(e) => setNombre(e.target.value)} className='shadow appearance-none border rounded w-72 py-3 px-3 leading-tight focus:outline-none focus:shadow-outline'/>
              <label htmlFor="rol">Ingresa el nombre del Rol</label>
            </span>
          </div>
          <p></p>
          <div className="p-field-checkbox mb-4">
            <Checkbox id='watch' checked={canWatch} onChange={(e) => setWatch(e.checked!)} className='in-range:border-green-500' />
            <label htmlFor='watch' className='p-checkbox-label'>Puede leer</label>
          </div>
          <p></p>
          <div className="p-field-checkbox mb-4">
            <Checkbox id='edit' checked={canEdit} onChange={(e) => setEdit(e.checked!)} className='in-range:border-green-500' />
            <label htmlFor='edit' className='p-checkbox-label'>Puede editar</label>
          </div>
          <p></p>
          <div className="p-field-checkbox mb-4">
            <Checkbox id='create' checked={canCreate} onChange={(e) => setCreate(e.checked!)} className='in-range:border-green-500' />
            <label htmlFor='create' className='p-checkbox-label'>Puede crear</label>
          </div>
          <p></p>
          <div className="p-field-checkbox mb-4 ">
            <Checkbox id='download' checked={canDownload} onChange={(e) => setDownload(e.checked!)} className='in-range:border-green-500' />
            <label htmlFor='download' className='p-checkbox-label'>Puede descargar</label>
          </div>
          <p></p>
          <div className='flex justify-end'>
            {data === null && <Button icon='pi pi-plus' type='submit' className='p-button-rounded p-button-success' />}
            {data != null && <Button icon='pi pi-pencil' type='submit' className='p-button-rounded p-button-warning' />}
          </div>
        </form>


      </Dialog>
    </>

  )
}

export default CrearActualizarRol