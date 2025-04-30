import { type ApiBase } from '@/models/api-base'
import { type GENDER, type ROLE } from '@/utils'

export interface User extends ApiBase {
  id: string
  name: string
  lastName: string
  email: string
  rol: ROLE
  gender: GENDER
  isSuspended: boolean
}
