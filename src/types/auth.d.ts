export interface LoginForm {
  email: string,
  password: string
}

export interface User {
  email: string,
  username: string,
  first_name: string,
  last_name: string,
  birth_date?: string,
  document_type?: string,
  document_id?: string,
  password: string,
  re_password: string,
  code: string,
  referal: string | null
}

export interface profile {
  username: string,
  email: string,
  username: string,
  first_name: string,
  last_name: string,
  id: number,
  referal: string,
}