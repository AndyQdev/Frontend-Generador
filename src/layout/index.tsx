import { Outlet, useLocation } from 'react-router-dom'

import Header from './components/header'
import MainPage from './components/main-page'
import Aside from './components/aside'
import { useSidebar } from '@/context/siderbarContext'
import { Toaster } from '@/components/ui/sonner'
import RightSidebar from './components/right-sidebar'

const Layout = () => {
  const { isContract } = useSidebar()
  const location = useLocation()

  // Detecta si estás en la ruta de `page.tsx`
  const isCanvasRoute = location.pathname.includes('/area-trabajo')
  console.log(isCanvasRoute)
  return (
    <div className={`${isContract ? 'md:grid-cols-[84px_1fr] lg:grid-cols-[84px_1fr] xl:grid-cols-[84px_1fr]' : 'md:grid-cols-[260px_1fr] lg:grid-cols-[260px_1fr] xl:grid-cols-[260px_1fr]'} flex flex-col min-h-[100dvh] w-full bg-light-bg-primary dark:bg-dark-background-primary overflow-y-auto relative md:grid`}>
      <Aside />
      <div className={`max-h-[100dvh] overflow-hidden ${isCanvasRoute ? 'h-full' : ''}`}>
        <Header />
        <div
          className={`flex flex-row w-full ${
            isCanvasRoute ? 'h-full' : 'h-[calc(100dvh-56px)] lg:h-[calc(100dvh-60px)]'
          } relative overflow-y-auto bg-light-bg-main dark:bg-dark-background-primary`}
        >
          {/* <Aside /> bg-light-bg-main */}
          <MainPage>
            <Outlet />
          </MainPage>
          {isCanvasRoute && (
            <RightSidebar />
          )}
          <Toaster richColors />
        </div>
      </div>
    </div>
  )
}

export default Layout
