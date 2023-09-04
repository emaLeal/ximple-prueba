import { Button } from 'primereact/button'
import { useForm } from 'react-hook-form'
import './Login.css'
import { AuthService } from '../../services/auth.service'
import { Link } from 'react-router-dom'
import { RegisterFormRender } from './RegisterFormRender'
import CryptoJS from 'crypto-js'
import { useNavigate, useParams } from 'react-router'
import { RelationsService } from '../../services/relations.service'
import { useEffect } from 'react'
import { User } from '../../types/auth'
import environment from '../../environment/environment'

const initialForm: User = {
  email: '',
  username: '',
  first_name: '',
  last_name: '',
  password: '',
  re_password: '',
  code: '',
  referal: ''
}

const Register = () => {
  const authService = new AuthService()
  const relationService = new RelationsService()
  const { control, formState: { errors }, handleSubmit, reset } = useForm({ defaultValues: initialForm });
  const { link } = useParams()
  const nav = useNavigate()

  useEffect(() => {
    if (link) {
      authService.verifyUser(link!).then(_res => console.log('User exists')).catch(err => {
        if (err.response.status === 404) {
          alert('Usuario no existe')
          nav('/registro')
        }
      })
    }
  }, [link])

  const onSubmit = (data: User) => {
    if (data.password === data.re_password) {
      data.code = String(CryptoJS.DES.encrypt(data.username, environment.encryptPassword))
      data.code = data.code.replace('/', '')
      data.referal = link ? link : null

      authService.register(data).then(res => {
        if (res.status === 400) {
          alert('Numero de Documento ya Existe')
        }
        if (res.status === 201) {
          alert('Usuario Creado Correctamente, por favor proceda a activar su cuenta dirigiendose al correo enviado en su email')
          const data = {
            team_member: '',
            code: ''
          }
          data.team_member = res.data.id
          if (!link) {
            data.code = ''
          } else {
            data.code = link
          }
          relationService.createRelation(data).then(res => console.log('Relation Created'))
        }
      })
    }
    reset()
  }
  return (
    <div className="flex justify-end mt-2">
      <div className="form-demo">
        <div className="card">
          <span>Registro</span>
          <form onSubmit={handleSubmit(onSubmit)} className='p-fluid'>
            <RegisterFormRender errors={errors} control={control} />
            <Button type="submit" label="Registrate" className="mt-2 p-button p-button-rounded p-button-text" />
            <h4>¿Ya tienes una cuenta? <Link to={'/'}>Inicia Sesion aqui</Link></h4>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Register