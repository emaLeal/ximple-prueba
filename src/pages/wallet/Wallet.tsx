import { Button } from 'primereact/button'
import { Column } from 'primereact/column'
import { DataTable } from 'primereact/datatable'
import { FileUpload } from 'primereact/fileupload'
import { Toast } from 'primereact/toast'
import React, { useEffect, useRef, useState } from 'react'
import { read, utils } from 'xlsx'
import verify from '../../helpers/refresh'
import { useAuthStore } from '../../store/useAuthStore'
import { useGlobalStore } from '../../store/useDashboardStore'
import { ProfileService } from '../../services/profile.service'
import ExcelFormat from './ExcelFormat'
import RecargarPuntos from './RecargarPuntos'

export const Wallet = () => {
  const [wallets, setWallets] = useState([])
  const [wallet, setWallet] = useState<any>({})
  const [formatVisible, setFormatVisible] = useState(false)
  const [loading, setLoading] = useState(false)
  const [visible, setVisible] = useState(false)
  const [data, setData] = useState<any>({user_id: 0, money: 0})
  const toast = useRef<any>(null)
  const authStore = useAuthStore()
  const globalStore = useGlobalStore()
  const profileService = new ProfileService()
  const error = () => verify()

  useEffect(() => {
    setLoading(true)
    globalStore.setTitle('Recargar Puntos')
    getAll()
    setLoading(false)
  }, [])

  const onHide = (data?: any) => {
    setData({user_id: data.id, money: 0})
    setVisible(!visible)
    getAll()
  }

  const getAll = () => {
    profileService.getWallets().then(res => {
      setWallets(res.data)
    }).catch(e => {
      if (e.response.status === 401) error()
    })
  }

  const onHideFormat = () => setFormatVisible(!formatVisible)

  const uploadHandler = ({ files }: any) => {
    const [file] = files
    console.log(file)
    const reader = new FileReader()
    reader.onload = (e) => {
      const bsrt = e.target!.result
      const wb = read(bsrt, { type: 'binary' })
      const wsname = wb.SheetNames[0]
      const ws = wb.Sheets[wsname]
      const data = utils.sheet_to_json(ws)
      const walletsData: any[] = []
      let userId: any = []
      data.forEach((row: any) => {
        userId = wallets.filter((w: any) => {
          if (w.username === row.usuario) return w
        })
        console.log(userId[0].id)
        const pushData = {
          user_id: userId[0].id,
          money: row.puntos
        }
        walletsData.push(pushData)
      })

      profileService.chargeWallet(walletsData).then(res => {
        toast.current.show({ severity: 'success', summary: 'Puntos Recargados', detail: 'Se han recargado los puntos', life: 3000 });
        getAll()
      }).catch(e => {
        if (e.response.status === 401) error()
        if (e.response.status === 500) {
          toast.current.show({severity: 'error', summary: 'Formato Incorrecto', detail: 'El formato del excel es incorrecto', life: 3000})
        }
      })
    }

    reader.readAsBinaryString(file)
  } 
  
  const renderHeader = () => {
    return (
      <div className='flex'>
        <FileUpload mode='basic' auto={true} customUpload={true} name='reload'accept='.xlsx' maxFileSize={10000000} uploadHandler={uploadHandler} chooseLabel='Cargar Puntos' />
        <Button icon='pi pi-info' className='ml-1 h-12' tooltip='Formato de Excel' onClick={onHideFormat} />
      </div>
    )
  }

  const ActionBody = (rowData: any) => {
    return (
      <div>
        <Button className='p-button p-button-success p-button-rounded p-button-text' icon='pi pi-dollar' tooltip='Recargar Puntos' onClick={() => onHide(rowData)} />
      </div>
    )
  }

  return (
    <div style={{ marginLeft: '20%', marginRight: '20%', marginTop: '2%' }}>
    <Toast ref={toast} />
    <RecargarPuntos visible={visible} onHide={onHide} data={data} />
    <ExcelFormat visible={formatVisible} onHide={onHideFormat} />
    <DataTable value={wallets} selection={wallet} header={renderHeader} globalFilterFields={['username']} emptyMessage="No hay usuarios encontradosq." onSelectionChange={(e) => setWallet(e.value)} loading={loading}
      dataKey="id" paginator rows={5} rowsPerPageOptions={[5, 10, 25]}
      paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
      currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} Roles"
      responsiveLayout="scroll">
      <Column field='username' sortable header='Nombre de Usuario'></Column>
      <Column field='email' sortable header='Correo'></Column>
      <Column field='money' sortable header='Puntos'></Column>
      <Column header='Acciones' body={ActionBody}></Column>
    </DataTable>
  </div>
  )
}
