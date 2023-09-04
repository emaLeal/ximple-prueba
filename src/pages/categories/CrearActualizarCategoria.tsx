import { Button } from 'primereact/button'
import { Dialog } from 'primereact/dialog'
import { InputText } from 'primereact/inputtext'
import { Toast } from 'primereact/toast'
import React, { FormEvent, useEffect, useRef, useState } from 'react'
import verify from '../../helpers/refresh'
import { useAuthStore } from '../../store/useAuthStore'
import { useGlobalStore } from '../../store/useDashboardStore'
import { CategoriesService } from '../../services/categories.service'

interface Props {
  visible: boolean,
  onHide: (data?: any) => void,
  data?: any
}

const CrearActualizarCategoria = ({ visible, onHide, data }: Props) => {
  const toast = useRef<any>(null)
  const [description, setDescription] = useState('')
  const categorieService = new CategoriesService()
  const logout = useGlobalStore().logout
  const authStore = useAuthStore()
  const error = () => verify()

  const postProduct = (e: FormEvent) =>  {
    e.preventDefault()
    categorieService.post(description).then(res => {
      if (res.status === 201) {
        onHide(null)
        toast.current.show({ severity: 'success', summary: 'Categoria creada', detail: 'Se ha creado la categoria correctamente', life: 3000 });
      }
    }).catch(e => {
      if (e.response.status === 401) error()
    })
  }

  useEffect(() => {
    if (!data) {
      setDescription('')
    } else {
      setDescription(data.description)
    }
  }, [data])

  const updateProduct = (e: FormEvent) => {
    e.preventDefault()
    const id = data.id
    categorieService.put(id, description).then(res => {
      onHide(null)
      toast.current.show({ severity: 'success', summary: 'Categoria Actualizada', detail: 'Se ha actualizado la categoria correctamente', life: 3000 });
    }).catch(e => {
      if (e.response.status === 401) error()
    })
  }

  return (
    <>
      <Toast ref={toast} />
      <Dialog header='CREAR CATEGORIA ' visible={visible} onHide={onHide} modal>
        <p></p>
        <form className='shadow-md rounded px-8 pt-6 pb-2 mb-2' onSubmit={data === null ? postProduct : updateProduct} encType="multipart/form-data">
          <div className="p-field mb-4">
            <span className="p-float-label">
              <InputText id='description'  name="description" value={description} onChange={(e) => setDescription(e.target.value)} className="shadow appearance-none border rounded w-72 py-3 px-3 leading-tight focus:outline-none focus:shadow-outline" />
              <label htmlFor="description">Ingresa el nombre de la Categoria</label>
            </span>
          </div>
          <div className='flex justify-end mt-4'>
            {data === null && <Button icon='pi pi-plus' type='submit' tooltip='Crear Categoria' className='p-button-rounded p-button-success' />}
            {data != null && <Button icon='pi pi-pencil' type='submit' tooltip='Editar Categoria' className='p-button-rounded p-button-warning' />}
          </div>
        </form>
      </Dialog>
    </>
  )
}

export default CrearActualizarCategoria