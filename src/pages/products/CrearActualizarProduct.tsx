import { Button } from 'primereact/button'
import { Dialog } from 'primereact/dialog'
import { FileUpload, FileUploadHandlerEvent } from 'primereact/fileupload'
import { InputText } from 'primereact/inputtext'
import { Toast } from 'primereact/toast'
import  { FormEvent, useEffect, useRef, useState } from 'react'
import verify from '../../helpers/refresh'
import { useAuthStore } from '../../store/useAuthStore'
import { useGlobalStore } from '../../store/useDashboardStore'
import { ProductsService } from '../../services/products.service'
import { EmpriseService } from '../../services/emprise.service'

interface Props {
  onHide: (data?: any) => void,
  visible: boolean,
  data?: any
}

const opcions = [
  {
    name: 'MOSTRAR',
    value: true
  },
  {
    name: 'NO MOSTRAR',
    value: false
  }
]

const CrearActualizarProduct = ({ onHide, visible, data }: Props) => {
  const globalStore = useGlobalStore()
  const toast = useRef<any>(null);
  const [nombre, setNombre] = useState('')
  const [precio, setPrecio] = useState<string | number | undefined | any>('')
  const [cantidad, setCantidad] = useState<string | number | any>('')
  const [img, setImg] = useState<any>(null)
  const [imgUrl, setImgUrl] = useState('')
  const productService = new ProductsService()
  const empriseService = new EmpriseService()
  const [empId, setEmpId] = useState(0)
  const error = () => verify()


  useEffect(() => {
    if (data != null) {
      setNombre(data.name)
      setPrecio(data.price)
      setCantidad(data.quantity)
      setImgUrl(`http://localhost:8000${data.img}`)
      setImg(data.img)
    } else {
      setNombre('')
      setPrecio(0)
      setCantidad(0)
      setImg('')
    }
  }, [data])

  useEffect(() => {
    empriseService.getEmprise(globalStore.profile.id).then(res => {
      setEmpId(res.data.id)
    }) 
  }, [])

  const postProduct = (e: FormEvent) => {
    e.preventDefault()
    const data = {
      name: nombre,
      price: Number(precio),
      quantity: Number(cantidad),
      img,
      emprise: empId
    }

    productService.postOne(data).then(res => {
      console.log(res)
      onHide(null)
      toast.current.show({ severity: 'success', summary: 'Producto creado', detail: 'Se ha creado el producto correctamente', life: 3000 });
    }).catch(e => {
      if (e.response.status === 401) error()
    })
  }

  const updateProduct = (e: FormEvent) => {
    e.preventDefault()
    const id = data.id
    const dataUp = {
      name: nombre,
      price: Number(precio),
      quantity: Number(cantidad),
      img,
      emprise: empId
    }

    productService.updateProduct(id, dataUp).then(res => {
      console.log(res)
      onHide(null)
      toast.current.show({ severity: 'success', summary: 'Producto Actualizado', detail: 'Se ha Actualizado el producto correctamente', life: 3000 });
    }).catch(e => {
      if (e.response.status === 401) error()
    })
  }

  const imgUploader = async (e: FileUploadHandlerEvent) => {
    const file: File | any = e.files[0]

    const reader = new FileReader()
    const blob = await fetch(file.objectURL).then((r) => r.blob()); //blob:url
    
      reader.readAsDataURL(blob);

      reader.onloadend = () =>  {
        const base64data = reader.result;
        setImg(base64data)
    };
   
    setImgUrl(file.objectURL)
  }

  return (
    <>
      <Toast ref={toast} />
      <Dialog header='CREAR PRODUCTO' visible={visible} onHide={onHide} modal dismissableMask>
        <p></p>
        <form className='shadow-md rounded px-8 pt-2 pb-2 mb-4' onSubmit={data === null ? postProduct : updateProduct} encType="multipart/form-data">
          <div className="p-field mb-4">
            <span className="p-float-label">
              <InputText id='nombre' name="nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} className="shadow appearance-none border rounded w-full py-3 px-3 leading-tight focus:outline-none focus:shadow-outline" />
              <label htmlFor="nombre">Ingresa el nombre del Producto</label>
            </span>
          </div>
          <div className="p-field mb-4">
            <span className="p-float-label">
              <InputText id='precio' type='number' name='precio' value={precio} onChange={(e) => setPrecio(Number(e.target.value))} className="shadow appearance-none border rounded w-full py-3 px-3 leading-tight focus:outline-none focus:shadow-outline"/>
              <label htmlFor='precio'>Ingrese el precio</label>
            </span>
          </div>
          <div className="p-field mb-4">
            <span className="p-float-label">
              <InputText id='cantidad' type='number' name='cantidad' value={cantidad} onChange={(e) => setCantidad(Number(e.target.value))} className="shadow appearance-none border rounded w-full py-3 px-3 leading-tight focus:outline-none focus:shadow-outline" />
              <label htmlFor='cantidad'>Ingrese cuanta cantidad tiene</label>
            </span>
          </div>
          <div className='p-field mb-4'>
            <FileUpload mode='advanced' multiple={false} accept='image' chooseLabel='Elegir imagen' uploadLabel='Subir imagen' cancelLabel='Cancelar' customUpload={true} uploadHandler={imgUploader}/>
          </div>
          <div className='mb-4'>
            <img style={{display: 'block', margin: 'auto'}} src={`${imgUrl}`} width={400} />
          </div>
          <div className='flex justify-end'>
            {data === null && <Button icon='pi pi-plus' type='submit' tooltip='Crear Producto' className='p-button-rounded p-button-success' />}
            {data != null && <Button icon='pi pi-pencil' type='submit' tooltip='Editar Producto' className='p-button-rounded p-button-warning' />}
          </div>
        </form>
      </Dialog>
    </>
  )
}

export default CrearActualizarProduct