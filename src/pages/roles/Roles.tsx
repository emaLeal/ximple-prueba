import { Button } from "primereact/button"
import { ListBox } from "primereact/listbox"
import { DataTable } from 'primereact/datatable'
import React, { useEffect, useState } from "react"
import verify from "../../helpers/refresh"
import { useAuthStore } from "../../store/useAuthStore"
import { useGlobalStore } from "../../store/useDashboardStore"
import CrearActualizarRol from "./Crear-Actualizar-Rol"
import { RolesService } from "../../services/roles.service"
import { Column } from "primereact/column"

const Roles = () => {
  const setTitle = useGlobalStore(state => state.setTitle)

  const [roles, setRoles] = useState([])
  const [loading, setLoading] = useState(false)
  const [rol, setRol] = useState<any>({})
  const [visible, setVisible] = useState(false)
  const [data, setData] = useState<any>(null)
  const rolService = new RolesService()
  const error = () => verify()

  const getAll = () => rolService.getAllRoles().then(res => {
    setRoles(res.data)
  }).catch(e => {
    if (e.response.status === 401) error()
  })

  useEffect(() => {
    setLoading(true)
    setTitle('Roles')
    getAll()
    setLoading(false)
  }, [])

  const onHide = (data?: any) => {
    if (data) {
      setData(data)
    } else {
      setData(null)
    }
    setVisible(!visible)
    getAll()
  }

  const actionBodyTemplate = (rowData: any) => {
    return (
      <React.Fragment>
        <Button icon="pi pi-pencil" className="p-button-rounded p-button-warning p-button-text p-mr-2" tooltip="Editar Rol" onClick={() => onHide(rowData)} />
      </React.Fragment>
    );
  }

  return (
    <>
      <CrearActualizarRol onHide={onHide} visible={visible} data={data} />

      <div style={{ marginLeft: '20%', marginRight: '20%', marginTop: '2%' }}>
        <div style={{ position: 'relative' }}>
          <Button icon='pi pi-plus' className="p-button-text p-button-success" tooltip="Crear nuevo Rol" onClick={() => onHide(null)} iconPos="right" style={{ position: 'absolute', right: 0, bottom: 5 }}></Button>
        </div>
        <DataTable value={roles} selection={rol} onSelectionChange={(e) => setRol(e.value)} loading={loading}
          dataKey="id" paginator rows={5} rowsPerPageOptions={[5, 10, 25]}
          paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
          currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} Roles"
          responsiveLayout="scroll">
          <Column field='description' sortable header='Nombre'></Column>
          <Column header='Acciones' body={actionBodyTemplate}>
          </Column>
        </DataTable>
      </div>
    </>
  )
}

export default Roles