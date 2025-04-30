import { Route, Routes } from 'react-router-dom'
import { lazy } from 'react'
import { PrivateAllRoutes } from '@routes/utils/routes.utils'
import { SidebarProvider } from '@/context/siderbarContext'
import { HeaderProvider } from '@/context/headerContext'

const Layout = lazy(() => import('@/layout/index'))

const Private = () => {
  return (
    <Routes>
      <Route element={
        <SidebarProvider>
          <HeaderProvider>
              <Layout />
          </HeaderProvider>
        </SidebarProvider>
      }>
        {
          PrivateAllRoutes.map(({ element, path, permissions }, index) => {
            if (permissions?.length === 0) {
              return (
                <Route key={index} path={path} element={element} />
              )
            } else {
              return undefined
            }
          })
        }
      </Route >
    </Routes >
  )
}

export default Private
