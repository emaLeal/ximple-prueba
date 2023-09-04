import { Dialog } from 'primereact/dialog'
import React from 'react'

interface Props {
  visible: boolean,
  onHide: (data?: any) => void
}

const ExcelFormat = ({ visible, onHide }: Props) => {
  return (
    <div>
      <Dialog header='FORMATO DE EXCEL' visible={visible} onHide={onHide} dismissableMask >
        <p>
          Para recargar puntos a ciertos usuarios tienes que subir un excel con este formato:
        </p>
        <img src='../../../src/assets/walletExcel.png' className='m-4 mx-auto w-8' />
        <p>
          Una fila llamada usuario(Tiene que ser el usuario original sin fallos ortograficos) <br />
          Una fila llamada Puntos, donde se busca añadir una cantidad de puntos a cada usuario <br />
        </p>
      </Dialog>
    </div>
  )
}

export default ExcelFormat