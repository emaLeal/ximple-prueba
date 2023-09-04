import { useEffect, useState } from 'react'
import { useParams } from 'react-router'
import { AuthService } from '../../services/auth.service'

const Activate = () => {
  const { uid, token } = useParams()
  const [activated, setActivated] = useState(false)
  const authService = new AuthService()

  useEffect(() => {
    setActivated(false)
    authService.activate(uid!, token!).then(res => {
      if (res.status === 204) {
        setActivated(true)
      }
    })
  }, [])

  return (
    <div>
      {activated && <p>Usuario Activado Correctamente</p>}
    </div>
  )
}

export default Activate