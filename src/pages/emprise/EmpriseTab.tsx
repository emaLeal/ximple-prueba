import { Button } from 'primereact/button';
import { FileUpload, FileUploadHandlerEvent } from 'primereact/fileupload'
import { InputText } from 'primereact/inputtext'
import { confirmDialog } from 'primereact/confirmdialog';
import { InputTextarea } from 'primereact/inputtextarea';
import React, { FormEvent, useEffect, useRef, useState } from 'react'
import { EmpriseService } from '../../services/emprise.service';
import verify from '../../helpers/refresh';
import { useGlobalStore } from '../../store/useDashboardStore';
import { Toast } from 'primereact/toast';

const EmpriseTab = () => {
  const [name, setName] = useState('')
  const [file, setFile] = useState<any>('')
  const [img, setImg] = useState<any>('http://localhost:8000/media/emprise/default.png')
  const [biography, setBiography] = useState('')
  const empriseService = new EmpriseService()
  const toast = useRef<any>(null)
  const globalStore = useGlobalStore()
  const [empriseExist, setEmpriseExist] = useState<any>(false)
  const [id, setId] = useState<any>(null)
 
  const imgUploader = async (e: FileUploadHandlerEvent) => {

    const file: File | any = e.files[0]

    const reader = new FileReader()
    const blob = await fetch(file.objectURL).then((r) => r.blob()); //blob:url
    
      reader.readAsDataURL(blob);

      reader.onloadend = () =>  {
        const base64data = reader.result;
        setImg(base64data)
        setFile(base64data)

    };
  }

  useEffect(() => {
    empriseService.getEmprise(globalStore.profile.id).then(res => {
      setEmpriseExist(true)
      setId(res.data.id)
      setName(res.data.name)
      setBiography(res.data.biography)
      setImg(`http://localhost:8000/${res.data.img}`)
    })
  }, [])

  const crearEmpresa = (e: FormEvent) => {
    e.preventDefault()
    const today = new Date()
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    const yyyy = today.getFullYear();

    const created_date = yyyy + '-' + mm + '-' + dd;
    
    const body = {
      name,
      biography,
      img: file,
      created_date 
    }
    confirmDialog({
      message: 'Quieres crear esta empresa?',
      header: 'Crear Empresa',
      accept: async () => {
        try {
          const res = await empriseService.createEmprise(body)

          if (res.status === 201) {
            location.reload()
          }
        } catch (e: any) {
          if (e.response.status === 401) verify()
        }
      }
    })
  }

  const actualizarEmpresa = (e: FormEvent) => {
    e.preventDefault()

    const body = {
      name,
      biography,
      img: file,
    }

    confirmDialog({
      message: 'Quieres actualizar esta Empresa?',
      header: 'ACtualizar Empresa',
      accept: async () => {
        try {
          const res = await empriseService.updateEmprise(body, id)

          if (res.status === 204) {
            toast.current.show({ severity: 'success', summary: 'Empresa Actualizada', detail: 'Se ha actualizado la empresa', life: 3000 });
          }
        } catch (e: any) {
          if (e.response.status === 401) verify()
        }
      }
    })
  }

  return (
    <>
      <Toast ref={toast} />
      <form onSubmit={empriseExist ? actualizarEmpresa : crearEmpresa}>
        <div className="field ml-6 mt-2">
          { empriseExist ? (<Button type='submit' label='Actualizar Empresa' tooltip='Actualizar Empresa' className='p-button p-button-info' />) : ( <Button type='submit' label='Crear Empresa' tooltip='Crear Empresa' className='p-button p-button-success'  />) }
        </div>
        <div className='columns-2 mt-10 ml-6'>
          <div className='field '>
            <span className="p-float-label">
              <InputText className='w-full h-16' value={name} onChange={(e) => setName(e.target.value)} name='name' id='name' />
              <label htmlFor='name'>Nombre de la Empresa</label>
            </span>
          </div>
          <div className="field">
            <span className="p-float-label">
              <InputTextarea className='w-full h-16' value={biography} onChange={(e) => setBiography(e.target.value)} name='biography' id='biography' rows={5} cols={30} />              
              <label htmlFor='biography'>Descripción de la Empresa</label>
            </span>
          </div>

        </div>
        <div className="columns-1 mt-10 ml-6">
          <div className="field ">
            <FileUpload mode='advanced' uploadLabel='Subir Imagen' cancelLabel='Cancelar' multiple={false} accept='image' chooseLabel='Elegir imagen' customUpload={true} uploadHandler={imgUploader} />
          </div>
          <div className="flex field p-4 bg-slate-950 w-1/2 justify-center mx-auto">
            <img src={img}  />
          </div>
        </div>
      </form>
    </>
  )
}

export default EmpriseTab