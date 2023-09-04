import { InputText } from 'primereact/inputtext'
import { Password } from 'primereact/password'
import { classNames } from 'primereact/utils'
import { Controller } from 'react-hook-form'
import { Divider } from 'primereact/divider'
import './Login.css'
import React from 'react'

interface Props {
  errors: any,
  control: any
}

export const RegisterFormRender = ({ errors, control }: Props) => {
  const getEmailError = () => errors.email && <small className='p-error'>{errors.email.message}</small>
  const getPasswordError = () => errors.password && <small className='p-error'>{errors.password.message}</small>

  const passwordHeader = <h6>Ingresa una contraseña</h6>;
  const passwordFooter = (
    <React.Fragment>
      <Divider />
      <p className="mt-2">Suggestions</p>
      <ul className="pl-2 ml-2 mt-0" style={{ lineHeight: '1.5' }}>
        <li>Al menos una letra minuscula</li>
        <li>Al menos una letra mayuscula</li>
        <li>Al menos un caracter numerico</li>
        <li>Minimo 8 caracteres</li>
      </ul>
    </React.Fragment>
  );

  return (
    <>
      <div className="field">
        <span className="p-float-label p-input-icon-right">
          <Controller name="first_name" control={control}
            rules={{ required: 'El nombre es obligatorio' }}
            render={({ field, fieldState }) => (
              <InputText id={field.name} {...field} className={classNames({ 'p-invalid': fieldState.error })} />
            )} />
          <label htmlFor="first_name" className={classNames({ 'p-error': !!errors.first_name })}>Nombres*</label>
        </span>
      </div>
      <div className="field">
        <span className="p-float-label p-input-icon-right">
          <Controller name="last_name" control={control}
            rules={{ required: 'El apellido es obligatorio' }}
            render={({ field, fieldState }) => (
              <InputText id={field.name} {...field} className={classNames({ 'p-invalid': fieldState.error })} />
            )} />
          <label htmlFor="last_name" className={classNames({ 'p-error': !!errors.last_name })}>Apellidos*</label>
        </span>
      </div>
      <div className="field">
        <span className="p-float-label p-input-icon-right">
          <i className='pi pi-user'></i>
          <Controller name="username" control={control}
            rules={{ required: 'El Usuario es obligatorio' }}
            render={({ field, fieldState }) => (
              <InputText id={field.name} {...field} className={classNames({ 'p-invalid': fieldState.error })} />
            )} />
          <label htmlFor="username" className={classNames({ 'p-error': !!errors.username })}>Usuario*</label>
        </span>
      </div>
      <div className="field">
        <span className="p-float-label p-input-icon-right">
          <i className="pi pi-envelope" />
          <Controller name="email" control={control}
            rules={{ required: 'El correo es obligatorio.', pattern: { value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i, message: 'Direccion de correo incorrecta. E.g. example@email.com' } }}
            render={({ field, fieldState }) => (
              <InputText id={field.name} {...field} className={classNames({ 'p-invalid': fieldState.error })} />
            )} />
          <label htmlFor="email" className={classNames({ 'p-error': !!errors.email })}>Correo Electronico*</label>
          {getEmailError()}
        </span>
      </div>
      <div className="field">
        <span className="p-float-label">
          <Controller name="password" control={control} rules={{ required: 'La contraseña es Obligatoria.' }} render={({ field, fieldState }) => (
            <Password id={field.name} {...field} toggleMask className={classNames({ 'p-invalid': fieldState.error })} header={passwordHeader} footer={passwordFooter} />
          )} />
          <label htmlFor="password" className={classNames({ 'p-error': errors.password })}>Contraseña*</label>
          {getPasswordError()}
        </span>
      </div>
      <div className="field">
        <span className="p-float-label">
          <Controller name="re_password" control={control} rules={{ required: 'La contraseña es obligatoria.' }} render={({ field, fieldState }) => (
            <Password id={field.name} {...field} toggleMask className={classNames({ 'p-invalid': fieldState.error })} />
          )} />
          <label htmlFor="re_password" className={classNames({ 'p-error': errors.password })}>Repetir Contraseña*</label>
          {getPasswordError()}
        </span>
      </div>
    </>
  )
}