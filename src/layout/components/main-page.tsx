import Loading from '@/components/shared/loading'
import { type ChildrenProps } from '@/models'
import { Suspense } from 'react'
import { useLocation } from 'react-router-dom'

function MainPage({ children }: ChildrenProps) {
  const location = useLocation()
  const isCanvasRoute = location.pathname.includes('/area-trabajo')
  return (
    <div className={`${isCanvasRoute ? 'w-full h-full overflow-hidden' : 'w-full h-full bg-background-lila dark:bg-dark-background-secondary overflow-x-hidden overflow-y-auto relative'}`}>
      <main className={`${isCanvasRoute ? 'h-full' : 'min-h-[calc(100dvh-56px)] lg:min-h-[calc(100dvh-60px)] p-4 lg:p-6 max-w-screen-xl mx-auto relative w-full'}`}>
        <Suspense
          fallback={
            <div className={isCanvasRoute ? '' : 'grid place-content-center place-items-center min-h-[calc(100dvh-55px-54px)] lg:min-h-[calc(100dvh-63px-54px)] text-action text-light-action dark:text-dark-action'}>
              <Loading />
            </div>
          }
        >
          {children}
        </Suspense>
      </main>
    </div>
  )
}

export default MainPage
