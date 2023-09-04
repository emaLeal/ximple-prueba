import { Button } from 'primereact/button'
import { Column } from 'primereact/column'
import { DataTable } from 'primereact/datatable'
import React, { useEffect, useState } from 'react'
import { FilterOperator, FilterMatchMode } from 'primereact/api'
import verify from '../../helpers/refresh'
import { useAuthStore } from '../../store/useAuthStore'
import { useGlobalStore } from '../../store/useDashboardStore'
import ActualizarRolDialog from './Actualizar-Rol'
import { UserService } from '../../services/users.service'
import { InputText } from 'primereact/inputtext'

const Users = (): React.ReactElement => {
  const setTitle = useGlobalStore(state => state.setTitle)
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(false)
  const [user, setUser] = useState<any>({})
  const [visible, setVisible] = useState(false)
  const [data, setData] = useState<any>(null)
  const [filterUser, setFilterUser] = useState('')
  const [filters, setFilters] = useState<{
    username: {
      operator: any,
      constraints: any
    },
    global: {
      value: any,
      matchMode: any
    }
  }>({
    username: {
      operator: FilterOperator.AND, constraints: [{ value: '', matchMode: FilterMatchMode.CONTAINS }]
    },
    global: { value: null, matchMode: FilterMatchMode.CONTAINS }
  })
  const userService = new UserService()
  const error = () => verify()

  const onChangeFilter = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    const _filter = { ...filters }
    _filter.global.value = value
    setFilters(_filter)
    setFilterUser(value)
  }

  const ActionBody = (rowData: any) => {
    return (
      <React.Fragment>
        <Button onClick={() => onHide(rowData)} className='p-button p-button-text p-button-rounded p-button-warning' icon='pi pi-pencil' tooltip='Editar rol usuario' />
      </React.Fragment>
    )
  }


  const renderHeader = () => {
    return (
      <div className="flex justify-content-between">
        <Button type="button" icon="pi pi-filter-slash" onClick={() => {
          setFilterUser('')
          const _filter = { ...filters }
          _filter.global.value = ''
          setFilters(_filter) 
          }} />
        <span className="p-input-icon-left">
          <i className="pi pi-search" />
          <InputText value={filterUser} onChange={onChangeFilter} placeholder="Buscar Usuario" />
        </span>
      </div>
    );
  };

  const getAll = () => userService.getAll().then(res => {
    setUsers(res.data)
  }).catch(e => {
    if (e.response.status === 401) error()
  })

  const onHide = (data: any) => {
    setData(data)
    setVisible(!visible)
    getAll()
  }

  useEffect(() => {
    setTitle('Usuarios')
    setLoading(true)
    getAll()
    setLoading(false)
  }, [])

  return (
    <>
      <ActualizarRolDialog visible={visible} data={data} onHide={onHide} />
      <div style={{ marginLeft: '20%', marginRight: '20%', marginTop: '2%' }}>
        <DataTable value={users} selection={user} header={renderHeader} filters={filters} globalFilterFields={['username']} emptyMessage="No hay usuarios encontradosq." onSelectionChange={(e) => setUser(e.value)} loading={loading}
          dataKey="id" paginator rows={5} rowsPerPageOptions={[5, 10, 25]}
          paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
          currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} Roles"
          responsiveLayout="scroll">
          <Column field='username' sortable header='Nombre de Usuario'></Column>
          <Column field='first_name' sortable header='Nombres'></Column>
          <Column field='last_name' sortable header='Apellidos'></Column>
          <Column field='email' sortable header='Correo'></Column>
          <Column header='Acciones' body={ActionBody}></Column>
        </DataTable>
      </div>
    </>

  )
}

export default Users