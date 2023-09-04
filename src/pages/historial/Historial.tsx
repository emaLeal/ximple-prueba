import React, { useEffect } from 'react'
import { Toast } from 'primereact/toast'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { Button } from 'primereact/button'
import { HistoryService } from '../../services/history.service'
import { useGlobalStore } from '../../store/useDashboardStore'
import verify from '../../helpers/refresh'
import VerFactura from './VerFactura'

const Historial = () => {
  const [histories, setHistories] = React.useState<any[]>([])
  const [history, setHistory] = React.useState<any>({})
  const [loading, setLoading] = React.useState(false)
  const [visible, setVisible] = React.useState(false)
  const [data, setData] = React.useState<any>(null)
  const historyService = new HistoryService()
  const globalStore = useGlobalStore()

  useEffect(() => {
    setLoading(true)
    globalStore.setTitle('Historial')
    historyService.getAll().then(res => {
      setHistories(res.data)
    }).catch(e => {
      if (e.response.status === 401) verify()
    })
    setLoading(false)
  }, [])

  const onHide = (data?: any) => {
    setVisible(!visible)
    if (data) {
      console.log(data  )
      setData(data)

    }
  }

  const Acciones = (rowData: any) => {
    return (
      <>
        <div>
          <Button className='p-button p-button-rounded p-button-text' icon='pi pi-eye' onClick={() => onHide(rowData)}/>
        </div>
      </>
    )
  }

  return (
    <>
      <VerFactura visible={visible} onHide={onHide} data={data}/>
      <div className='block mx-32 my-12'>
        <DataTable value={histories} selection={history} onSelectionChange={(e) => setHistory(e.value)} loading={loading}
          dataKey="id" paginator rows={5} rowsPerPageOptions={[5, 10, 25]}
          paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
          currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} Roles"
          responsiveLayout="scroll">
          <Column field='trans_user' header='Usuario Emisor' />
          <Column field='trans_receptor' header='Usuario Receptor' />
          <Column field='quantity' header='Cantidad' />
          <Column field='date' filter header='Fecha' />
          <Column header='Acciones' body={Acciones} />
        </DataTable>
      </div>
    </>
  )
}

export default Historial