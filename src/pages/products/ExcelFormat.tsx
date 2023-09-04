import { Dialog } from 'primereact/dialog'
import React from 'react'

interface Props {
  visible: boolean,
  onHide: () => void
}

const ExcelFormat = ({ visible, onHide }: Props) => {
  return (
    <Dialog header='FORMATO DE EXCEL PARA SUBIR PRODUCTOS' visible={visible} onHide={onHide} modal dismissableMask>
      <p>
        Para subir varios productos a la vez primero tendras que tener en cuenta el formato que ha de tener tu archivo Excel, y seria tal cual este:
      </p>
      <img src='../../../src/assets/productsExcel.png' className='m-2 mx-auto w-8' />
      <p>
        Una fila llamada nombre.<br />
        Una fila numerica llamada precio. <br />
        Una fila numerica llamada cantidad. <br />

        Por defecto el sistema otorga una imagen que puedes modificar.
      </p>
    </Dialog>
  )
}

export default ExcelFormat