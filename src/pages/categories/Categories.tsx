import { useEffect, useRef, useState } from "react"
import { useAuthStore } from "../../store/useAuthStore"
import { useGlobalStore } from "../../store/useDashboardStore"
import { Toast } from 'primereact/toast'
import { Button } from "primereact/button"
import { DataTable } from "primereact/datatable"
import { Column } from "primereact/column"
import { CategoriesService } from "../../services/categories.service"
import verify from "../../helpers/refresh"
import CrearActualizarCategoria from "./CrearActualizarCategoria"

const Categories = () => {
  const authStore = useAuthStore()
  const globalStore = useGlobalStore()
  const toast = useRef<any>(null)
  const [categories, setCategories] = useState([])
  const [categorie, setCategorie] = useState<any>({})
  const [loading, setLoading] = useState(false)
  const [visible, setVisible] = useState(false)
  const [data, setData] = useState<any>(null)
  const categoriesService = new CategoriesService()

  const error = () => verify()

  const getAll = () => {
    categoriesService.getAll().then(res => {
      setCategories(res.data)
    }).catch(e => {
      if (e.response.status === 401) error()
    })
  }

  const onHide = (data?: any) => {
    if (data) {
      setData(data)
    } else {
      setData(null)
    }
    setVisible(!visible)
    getAll()
  }

  const Acciones = (rowData: any) => {
    return (
      <>
        <div>
          <Button className='p-button p-button-warning p-button-rounded p-button-text' icon='pi pi-pencil' onClick={() => onHide(rowData)} />
        </div>
      </>
    )
  }
  
  useEffect(() => {
    globalStore.setTitle('Categorias')
    setLoading(true)
    getAll()
    setLoading(false)
  }, [])

  return (
    <>
      <Toast ref={toast} />
      <CrearActualizarCategoria visible={visible} data={data} onHide={onHide} />
      <div style={{ marginLeft: '20%', marginRight: '20%', marginTop: '2%' }}>
        <div style={{ position: 'relative' }}>
          <Button onClick={() => onHide(null)} icon='pi pi-plus' className="p-button-text p-button-success" tooltip="Crear nuevo Rol" iconPos="right" style={{ position: 'absolute', right: 0, bottom: 5 }}></Button>
        </div>
        <DataTable value={categories} selection={categorie} onSelectionChange={(e) => setCategorie(e.value)} loading={loading}
          dataKey="id" paginator rows={5} rowsPerPageOptions={[5, 10, 25]}
          paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
          currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} Roles"
          responsiveLayout="scroll">
          <Column field='description' sortable header='Nombre' />
          <Column header='Acciones' body={Acciones} />
        </DataTable>
      </div>
    </>
  )
  
}

export default Categories