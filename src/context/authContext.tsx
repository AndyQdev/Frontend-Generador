import { createContext, useEffect, useMemo, useState } from 'react'
import { useDispatch } from 'react-redux'

import { STORAGE_TOKEN, STORAGE_USER, authStatus, getStorage, removeStorage } from '../utils'
import { type AuthContextState } from '../models'
import { createUser, resetUser } from '@/redux/slices/user.slice'
import { type ChildrenProps } from '@/models/common.model'
import { useAuthLogin, useAuthRegister, useCheckToken } from '@/modules/auth/hooks/useAuth'
import { type AuthRegister, type AuthLogin } from '@/modules/auth/models/login.model'
export const AuthContext = createContext<AuthContextState>({} as AuthContextState)

export const AuthProvider = ({ children }: ChildrenProps) => {
  const [status, setStatus] = useState<authStatus>(authStatus.loading)
  const [error, setError] = useState<string[]>([])
  const { authLogin, isLoggingIn } = useAuthLogin()
  const { checkToken } = useCheckToken()
  const { authRegister, isLoggingIn: isRegistering } = useAuthRegister()

  const dispatch = useDispatch()

  useEffect(() => {
    if (error.length > 0) {
      const timer = setTimeout(() => {
        setError([])
      }, 5000)
      return () => { clearTimeout(timer) }
    }
  }, [error])

  let subscribe = false
  // Este useEffect se ejecuta cuando el componente AuthProvider se monta:
  useEffect(() => {
    const checkAuthStatus = async () => {
      const token = getStorage(STORAGE_TOKEN)
      if (!token) {
        setStatus(authStatus.unauthenticated)
        // setStatus(authStatus.authenticated) esto es para que no funcione el login
        dispatch(resetUser())
        removeStorage(STORAGE_USER)
        return
      }
      try {
        const responseUser = await checkToken({ token })
        dispatch(createUser(responseUser))
        setStatus(authStatus.authenticated)
      } catch (error) {
        removeStorage(STORAGE_TOKEN)
        removeStorage(STORAGE_USER)
        setStatus(authStatus.unauthenticated)
        dispatch(resetUser())
      }
    }
    if (!subscribe) {
      void checkAuthStatus()
    }
    return () => {
      subscribe = true
    }
  }, [])
  // signOut (Cerrar sesión):
  const signOut = () => {
    removeStorage(STORAGE_TOKEN)
    removeStorage(STORAGE_USER)
    dispatch(resetUser())
    setStatus(authStatus.unauthenticated)
  }
  // signWithEmailPassword (Inicio de sesión):
  const signWithEmailPassword = async (formData: AuthLogin) => {
    try {
      if (formData.password === '') throw new Error('La contraseña es requerida')
      setStatus(authStatus.loading)
      const userResponse = await authLogin(formData)
      dispatch(createUser(userResponse))
      setStatus(authStatus.authenticated)
    } catch (error: Error | any) {
      if (!error.errorInfo) {
        setError([error.message])
      } else {
        setError([error.errorInfo?.message ?? 'Servicio no disponible, intente más tarde.'])
      }
      setStatus(authStatus.unauthenticated)
    }
  }

  const registerWithEmailPassword = async (formData: AuthRegister) => {
    try {
      if (formData.password === '') throw new Error('La contraseña es requerida')
      setStatus(authStatus.loading)
      const userResponse = await authRegister(formData)
      dispatch(createUser(userResponse))
      setStatus(authStatus.authenticated)
    } catch (error: Error | any) {
      if (!error.errorInfo) {
        setError([error.message])
      } else {
        setError([error.errorInfo?.message ?? 'Servicio no disponible, intente más tarde.'])
      }
      setStatus(authStatus.unauthenticated)
    }
  }

  const value = useMemo(() => {
    // return { status, error, signOut, signWithEmailPassword, isMutating: isLoggingIn }
    return {
      status,
      error,
      signOut,
      signWithEmailPassword,
      registerWithEmailPassword, // ✅ lo agregamos aquí
      isMutating: isLoggingIn || isRegistering
    }
  }, [status, error, isLoggingIn, isRegistering])

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
