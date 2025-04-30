import useSWRMutation from 'swr/mutation'
import { checkToken, userLogin, useRegister } from '../services/login.service'
import { type ResponseError } from '@/utils/response-error.utils'
import { type AuthRegister, type AuthLogin } from '../models/login.model'
import { API_BASEURL, ENDPOINTS } from '@/utils'

const useAuthLogin = () => {
  const { trigger, isMutating, error } = useSWRMutation<any, ResponseError, string, AuthLogin>(API_BASEURL + ENDPOINTS.AUTH + '/login', userLogin)
  return { authLogin: trigger, isLoggingIn: isMutating, errorLogin: error }
}

const useCheckToken = () => {
  const { trigger, isMutating, error } = useSWRMutation<any, ResponseError, string, { token: string }>(API_BASEURL + ENDPOINTS.AUTH + '/check-token', checkToken)
  return { checkToken: trigger, isChekingToken: isMutating, errorToken: error }
}

const useAuthRegister = () => {
  const { trigger, isMutating, error } = useSWRMutation<any, ResponseError, string, AuthRegister>(API_BASEURL + ENDPOINTS.AUTH + '/register', useRegister)
  return { authRegister: trigger, isLoggingIn: isMutating, errorRegister: error }
}
export { useAuthLogin, useCheckToken, useAuthRegister }
