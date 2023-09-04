import React from 'react'
import { Button } from 'primereact/button'
import { Dialog } from 'primereact/dialog'
import { FileUpload, FileUploadHandlerEvent } from 'primereact/fileupload'
import { Toast } from 'primereact/toast'

interface Props {
  visible: boolean,
  data: any,
  onHide: (data?: any) => void
}

const VerFactura = ({ visible, data, onHide }: Props) => {
  const [transUser, setTransUser] = React.useState('')
  const [transReceptor, setTransReceptor] = React.useState('')
  const [quantity, setQuantity] = React.useState(0)
  const [time, setTime] = React.useState('')
  const [date, setDate] = React.useState('')
  const toast = React.useRef<any>(null)

  React.useEffect(() => {
    if (data !== null ) {
      const timeDate = data.date.split(' ')
      setTransUser(data.trans_user)
      setTransReceptor(data.trans_receptor)
      setQuantity(data.quantity)
      setTime(timeDate[1])
      setDate(timeDate[0])
    } else {
      setTransUser('')
      setTransReceptor('')
      setQuantity(0)
      setDate('')
      setTime('')
    }
  }, [data])

  if (data === null) return null

  return (
    <>
      <Toast ref={toast} />
      <Dialog className='text-lg' header={`FACTURA ${data.id}`} visible={visible} onHide={onHide} modal>
        <div className='flex justify-between my-4'>
          <div className='mr-32'>
            <label className='font-bold'>Hora:  </label>
            <label>{time}</label>
          </div>
          <div>
            <label className='font-bold'>Fecha: </label>
            <label>{date}</label>
          </div>
        </div>
        <div className='my-4'>
          <label className='font-bold'>Emisor: </label>
          <label>{transUser}</label>
        </div>
        <div className='my-4'>
          <label className='font-bold'>Receptor: </label>
          <label>{transReceptor}</label>
        </div>
        <div className='my-4'>
          <label className='font-bold'>Cantidad: </label>
          <label>{quantity} Puntos</label>
        </div>

      </Dialog>
    </>
  )
}

export default VerFactura