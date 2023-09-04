import { useEffect, useState } from "react"
import verify from "../../helpers/refresh"
import { useAuthStore } from "../../store/useAuthStore"
import { useGlobalStore } from "../../store/useDashboardStore"
import { AuthService } from "../../services/auth.service"
import { RolesService } from "../../services/roles.service"
import { Tag } from 'primereact/tag'
import { Rating } from 'primereact/rating'
import { Button } from 'primereact/button'
import { ProductsService } from "../../services/products.service"
import { DataView } from 'primereact/dataview'
import { Accordion, AccordionTab } from 'primereact/accordion';
import { InputText } from "primereact/inputtext"
import { Image } from 'primereact/image'
import { CategoriesService } from "../../services/categories.service"
import { ListBox } from "primereact/listbox"
import environment from "../../environment/environment"
import { Product } from "../../types/product"

const Dashboard = () => {
  const setTitle = useGlobalStore(state => state.setTitle)
  const authStore = useAuthStore()
  const globalStore = useGlobalStore()
  const authService = new AuthService()
  const rolService = new RolesService()
  const productService = new ProductsService()
  const categoriesService = new CategoriesService()
  const [products, setProducts] = useState<Product[]>([])
  const [showP, setShowP] = useState(true)
  const [categories, setCategories] = useState<any[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [layout, setLayout] = useState<'grid' | 'list'>('grid')
  const error = () => verify()

  useEffect(() => {
    setTitle('Dashboard')
    authService.getProfile().then(res => {
      authStore.setRol(res.data.rol)
      globalStore.setProfile({
        id: res.data.id,
        username: res.data.username,
        last_name: res.data.last_name,
        first_name: res.data.first_name,
        email: res.data.email,
        referal: res.data.referal
      })

    categoriesService.getAll().then(res => {
      setCategories(res.data)
    })      
      

    }).catch(e => {
      if (e.response.status === 401) error()
    })
  }, [])

  useEffect(() => {
    if (authStore.rol != 0) rolService.getOneRol(authStore.rol).then(res => {
      globalStore.setCreate(res.data.can_create)
      globalStore.setDownload(res.data.can_download)
      globalStore.setEdit(res.data.can_edit)
      globalStore.setWatch(res.data.can_watch)
    })
    setLoading(true)
    getAll()
    setLoading(false)
  }, [authStore.rol])

  useEffect(() => {
    _paginator()
  }, [products])

  const getAll = () => {
    productService.getAllShow().then(res => {
      setProducts(res.data)
    }).catch(e => {
      if (e.response.status === 401) error()
    })
  }

  const getSeverity = (product: Product) => {
    const q = product.quantity
    if (q! === 0) return 'danger'
    if (q! <= 50) return 'warning'
    if (q! === 300 || q! > 300) return 'success'
  };

  const getStatus = (product: Product) => {
    if (getSeverity(product) === 'success') return 'HAY STOCK'
    if (getSeverity(product) === 'warning') return 'STOCK BAJO'
    if (getSeverity(product) === 'danger') return 'NO HAY STOCK'
  }

  const itemTemplate = (product: Product) => {
    return (
      <div className="col-12">
      <div className="flex flex-column xl:flex-row xl:align-items-start p-4 gap-4 w-full ">
          <Image className="w-9 sm:w-16rem xl:w-10rem shadow-2 block xl:block mx-auto border-round" src={`${environment.baseUrl}/${product.img}`} alt={product.name} preview />
          <div className="flex flex-column sm:flex-row justify-content-between align-items-center xl:align-items-start flex-1 gap-4">
              <div className="flex flex-column align-items-center sm:align-items-start gap-3">
                  <div className="text-2xl font-bold text-900 underline">{product.name}</div>
                  <Rating value={5} readOnly cancel={false}></Rating>
                  <div className="flex align-items-center gap-3">
                      <span className="flex align-items-center gap-2">
                          <i className="pi pi-tag"></i>
                          <span className="font-semibold">{'HOLA'}</span>
                      </span>
                      <Tag value={getStatus(product)} severity={getSeverity(product)}></Tag>
                  </div>
              </div>
              <div className="flex sm:flex-column align-items-center sm:align-items-end gap-3 sm:gap-2">
                  <span className="text-2xl font-semibold">${product.price}</span>
                  <Button icon="pi pi-eye" className="p-button-rounded" disabled={getStatus(product) === 'NO HAY STOCK'}></Button>
              </div>
          </div>
      </div>
  </div>
    );
  };


  const _paginator = () => {
    if (products.length <= 6) return setShowP(false)

    return setShowP(true) 
  }

  return (
    <>
      {products.length != 0 ? (
        <div className="flex">
          <div className="w-3">
            <div className="mb-2">
              <InputText placeholder="Busca un producto" />
            </div>
            <div className="mb2 mr-2">
              <Accordion activeIndex={0}>
                <AccordionTab header='Categorias'>
                  <ListBox options={categories} optionLabel='description' optionValue="id" />
                </AccordionTab>
              </Accordion>
            </div>
          </div>
          <div className="class w-full">
            <DataView value={products} layout={layout} itemTemplate={itemTemplate} paginator={showP} rows={6} loading={loading} />
          </div>
        </div>

      ) : (
        <div className="flex justify-center align-center">
          <span className="text-3xl font-bold">NO HAY PRODUCTOS DISPONIBLES</span>
        </div>
      )
      }


    </>
  )
}

export default Dashboard