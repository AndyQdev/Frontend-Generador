import { type PERMISSION } from '@/modules/auth/utils/permissions.constants'
import { useAuth } from './useAuth'
import { authStatus } from '@/utils'

export const useAuthorization = () => {
  const { status } = useAuth()

  const verifyPermission = (p0: PERMISSION[]) => {
    console.log(p0)
    if (status === authStatus.authenticated) {
      return true
    } else {
      return false
    }
  }

  return { verifyPermission }
}
