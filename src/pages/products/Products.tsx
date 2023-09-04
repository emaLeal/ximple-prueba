import { Button } from 'primereact/button'
import { Column } from 'primereact/column'
import { DataTable } from 'primereact/datatable'
import { FileUpload } from 'primereact/fileupload'
import { Toast } from 'primereact/toast'
import { useEffect, useRef, useState } from 'react'
import verify from '../../helpers/refresh'
import { useAuthStore } from '../../store/useAuthStore'
import { useGlobalStore } from '../../store/useDashboardStore'
import { ProductsService } from '../../services/products.service'
import { read, utils } from 'xlsx'
import { confirmDialog } from 'primereact/confirmdialog'
import CrearActualizarProduct from './CrearActualizarProduct'
import { FilterMatchMode, FilterOperator } from 'primereact/api'
import { InputText } from 'primereact/inputtext'
import ExcelFormat from './ExcelFormat'
import environment from '../../environment/environment'
import { Product } from '../../types/product'
import { EmpriseService } from '../../services/emprise.service'
import { useNavigate } from 'react-router'

const Products = () => {
  const setTitle = useGlobalStore(state => state.setTitle)
  const user = useGlobalStore(state => state.profile.id)
  const [products, setProducts] = useState([])
  const [product, setProduct] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState<any>(null)
  const [formatVisible, setFormatVisible] = useState(false)
  const [visible, setVisible] = useState(false)
  const [filterProduct, setFilterProduct] = useState('')
  const nav = useNavigate()
  const [id, setId] = useState(0)
  const empriseService = new EmpriseService()
  const [filters, setFilters] = useState<{
    name: {
      operator: any,
      constraints: any
    },
    global: {
      value: any,
      matchMode: any
    }
  }>({
    name: {
      operator: FilterOperator.AND, constraints: [{ value: '', matchMode: FilterMatchMode.CONTAINS }]
    },
    global: { value: null, matchMode: FilterMatchMode.CONTAINS }
  })
  const globalLogout = useGlobalStore().logout
  const toast = useRef<any>(null)
  const productService = new ProductsService()

  const error = () => verify()

  const getAll = () =>  empriseService.getEmprise(user).then(res => {
    productService.getAll(res.data.id).then(resp => {
      setProducts(resp.data)
    })
  }).catch(e => {
    if (e.response.status === 401) error()
  })

  const onHideFormat = () => setFormatVisible(!formatVisible)

  const onChangeFilter = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    const _filter = { ...filters }
    _filter.global.value = value
    setFilters(_filter)
    setFilterProduct(value)
  }

  useEffect(() => {
    empriseService.getEmprise(user).then(res => {
        setId(res.data.id)
        productService.getAll(res.data.id).then(resp => {

          setProducts(resp.data)
        })
    }).catch((e: any) => {
      if (e.response.status === 401) verify()
      if (e.response.status === 404) {

        nav('/empresa')
        
      }
    })
    setLoading(true)
    getAll()
    setLoading(false)
  }, [])

  const onUpload = ({ files }: any) => {
    const [file] = files
    console.log(file)
    const reader = new FileReader()
    reader.onload = (e) => {
      const bsrt = e.target!.result
      const wb = read(bsrt, { type: 'binary' })
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];
      const data = utils.sheet_to_json(ws);
      const products: Product[] = []
      /* Update state */
      data.forEach((row: any) => {
        const dataEl: Product = {
          name: row.nombre,
          price: row.precio,
          quantity: row.cantidad,
          emprise: id,
        }
        products.push(dataEl)
      })
      productService.postMany(products).then(res => {
        toast.current.show({ severity: 'success', summary: 'Productos subidos', detail: 'Se han subido los productos correctamente', life: 3000 });
        getAll()

      }).catch(e => {
        if (e.response.status === 401) error()
        if (e.response.status === 500) {
          toast.current.show({severity: 'error', summary: 'Formato Incorrecto', detail: 'El formato del excel es incorrecto', life: 3000})
        }
      })
    }
    reader.readAsBinaryString(file);

  }

  const Header = () => {
    return (
      <>
       <div className="flex justify-content-between">
         <div className='flex justify-beetween'>
          <FileUpload mode="basic" auto={true} customUpload={true} name="demo[]" accept='.xlsx' maxFileSize={1000000} uploadHandler={onUpload}  chooseLabel='Sube Productos' />
          <Button icon='pi pi-info' className='ml-1 h-12' tooltip='Formato Excel' onClick={onHideFormat} />
        </div>  
        <Button type="button" icon="pi pi-filter-slash" onClick={() => {
          setFilterProduct('')
          const _filter = { ...filters }
          _filter.global.value = ''
          setFilters(_filter) 
          }} />
        <span className="p-input-icon-left">
          <i className="pi pi-search" />
          <InputText value={filterProduct} onChange={onChangeFilter} placeholder="Buscar Producto" />
        </span>
      </div>
      </>
    )
  }

  const ImgBody = (rowData: any) => {
    return (
      <div className=''>
        <img src={`${environment.baseUrl}/${rowData.img}`} width='100px' />
      </div>
    )
  }

  const deleteProduct = (id: number) => {
    confirmDialog({
      message: 'Quiere borrar este producto?',
      header: 'Borrar Producto',
      accept: () => {
        productService.deleteProduct(id).then(res => {
          if (res.status === 204) {
            console.log('Producto Borrado')
            getAll()
            toast.current.show({ severity: 'success', summary: 'Producto Eliminado', detail: 'Se ha eliminado el producto', life: 3000 });

          }
        }).catch(e => {
          if (e.response.status === 401) error()
        })
      }
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
          <Button className='p-button p-button-warning p-button-rounded p-button-text' icon='pi pi-pencil' onClick={() => onHide(rowData) } />
          <Button className='p-button p-button-danger p-button-rounded p-button-text' icon='pi pi-trash' onClick={() => deleteProduct(rowData.id)} />
        </div>
      </>
    )
  }


  useEffect(() => {
    setTitle('Productos')
  }, [])

  return (
    <>
      <Toast ref={toast} />
      <ExcelFormat visible={formatVisible} onHide={onHideFormat} />
      <CrearActualizarProduct visible={visible} onHide={onHide} data={data} />
      <div style={{ marginLeft: '20%', marginRight: '20%', marginTop: '4%' }}>
        <div style={{ position: 'relative' }}>
          <Button icon='pi pi-plus' onClick={() => onHide(null)} className="p-button-text p-button-success" tooltip="Crear nuevo Rol" iconPos="right" style={{ position: 'absolute', right: 0, bottom: 5 }}></Button>
        </div>
        <DataTable value={products} filters={filters} globalFilterFields={['name']} emptyMessage='No hay productos encontrados' header={Header} selection={product} onSelectionChange={(e) => setProduct(e.value)} loading={loading}
          dataKey="id" paginator rows={5} rowsPerPageOptions={[5, 10, 25]}
          paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
          currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} Roles"
          responsiveLayout="scroll">
          <Column field='name' sortable header='Nombre' />
          <Column field='img' header='Imagen' body={ImgBody} />
          <Column field='price' sortable header='Precio' />
          <Column field='quantity' header='Cantidad' />
          <Column header='Acciones' body={Acciones} />
        </DataTable>
      </div>
    </>
  )
}

export default Products