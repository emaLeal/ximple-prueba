import { Button } from 'primereact/button'
import { useForm } from 'react-hook-form'
import './Login.css'
import { AuthService } from '../../services/auth.service'
import { useAuthStore } from '../../store/useAuthStore'
import { useNavigate } from 'react-router-dom'
import { Link } from 'react-router-dom'
import LoginFormRender from './LoginFormRender'
import { LoginForm } from '../../types/auth'


const initialForm: LoginForm = {
  email: '',
  password: ''
}

const Login = () => {
  const setToken = useAuthStore(state => state.setToken)
  const setRefresh = useAuthStore(state => state.setRefresh)
  const navigate = useNavigate()
  const loginService = new AuthService()
  const { control, formState: { errors }, handleSubmit, reset } = useForm({ defaultValues: initialForm });

  const onSubmit = async (data: LoginForm) => {
    const res = await loginService.login(data)

    if (res.status === 200) {
      setToken(res.data.access)
      setRefresh(res.data.refresh)
      navigate('/')
    } else {
      console.log(res.status, res.statusText)
    }
    reset()
  }

  return (
    <div className="flex justify-content-center">
      <div className="form-demo">
        <div className="card">
          <form onSubmit={handleSubmit(onSubmit)} className='p-fluid' method='post'>
            <LoginFormRender control={control} errors={errors} />
            <Button type="submit" label="Iniciar Secion" className="mt-2 p-button p-button-rounded p-button-text" />
            <h4>¿No tienes una cuenta? <Link to={'/registro'}>Registrate aqui</Link></h4>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Login