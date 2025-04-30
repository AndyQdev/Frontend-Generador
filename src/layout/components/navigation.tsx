import { Link, useLocation, useParams } from 'react-router-dom'
import { type MenuHeaderRoute, MenuSideBar } from '@/utils/sidebar.utils'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger
} from '@components/ui/collapsible'
import { CalendarClock, ChevronRightIcon, PenTool, SettingsIcon } from 'lucide-react'
import { useSidebar } from '@/context/siderbarContext'
import { useEffect, useState } from 'react'
import { PrivateRoutes } from '@/models/routes.model'
import { useAuthorization } from '@/hooks/useAuthorization'
import { useAuth } from '@/hooks'
import { authStatus, ENDPOINTS } from '@/utils'
import Loading from '@/components/shared/loading'
import { ScrollArea } from '@radix-ui/react-scroll-area'
import { type Project } from '@/modules/projects/models/project.model'
import { useGetAllResource } from '@/hooks/useApiResource'
import { groupProjectsByDate } from '@/utils/groupProjectsByDate'

function Navigation() {
  const {
    isContract, selectedMenu, toggleContract, handleActivateMenu, handleSelectedMenu
  } = useSidebar()
  const { verifyPermission } = useAuthorization()
  const location = useLocation()
  const { id } = useParams()
  const { status } = useAuth()
  const { allResource: projects } = useGetAllResource<Project>({ endpoint: ENDPOINTS.PROJECTS })
  const groupedProjects = groupProjectsByDate(projects ?? [])
  let subscribe = true
  useEffect(() => {
    if (subscribe) {
      let currentPathToSelectMenu = location.pathname
      if (currentPathToSelectMenu.includes('crear')) {
        currentPathToSelectMenu = currentPathToSelectMenu.split('/crear')[0]
      }
      if (id) {
        currentPathToSelectMenu = currentPathToSelectMenu.split(`/${id}`)[0]
      }
      handleSelectedMenu && handleSelectedMenu(currentPathToSelectMenu)
    }
    return () => {
      subscribe = false
    }
  }, [location.pathname])
  const [isUsuariosOpen, setIsUsuariosOpen] = useState(false)
  return (
    <nav className="flex flex-col h-full w-full overflow-hidden justify-between">
      <div className="flex-1 overflow-y-auto">
        <section className='flex flex-col w-full gap-1 items-start p-4 overflow-y-auto relative overflow-x-hidden'>
          <Link to={PrivateRoutes.AREA} className={`${selectedMenu === PrivateRoutes.AREA ? 'text-light-text-primary dark:text-dark-text-primary hover:bg-light-border dark:bg-dark-border font-semibold' : 'text-light-text-secondary dark:text-dark-text-secondary'} h-10 flex items-center gap-3 rounded-md py-2 transition-all w-full hover:bg-light-border hover:dark:bg-dark-border text-base font-normal`}>
            <PenTool width={22} height={22} />
            <span className={isContract ? 'hidden' : ''}>Espacio De Trabajo</span>
          </Link>
          {status === authStatus.authenticated
            ? MenuSideBar.map((item: MenuHeaderRoute, index) => {
              const user = JSON.parse(localStorage.getItem('user') ?? '{}')
              const isAdmin = user?.rol === 'admin'
              if (item.label === 'Gestionar Proyectos' && !isAdmin) {
                return null // No renderiza si el usuario no es admin
              }
              if (item.children && verifyPermission(item.permissions!)) {
                return (
                  <Collapsible key={index} open={isUsuariosOpen} onOpenChange={setIsUsuariosOpen} className='w-full'>
                    <CollapsibleTrigger
                      className='w-full group'
                      onClick={() => {
                        handleActivateMenu(item.label)
                        isContract && toggleContract()
                      }}
                      title={item.label}
                    >
                      <div
                        className={`${isUsuariosOpen
                          ? 'text-light-secondary  dark:text-dark-text-primary font-semibold bg-light-primary '
                          : 'text-black dark:text-light-secondary'}
                        ${isContract && isUsuariosOpen ? 'hover:bg-light-primary/90 dark:bg-dark-border' : ''}
                        h-10 flex items-center justify-between gap-3 rounded-md pl-1 pr-2 py-2 transition-all w-full ${isUsuariosOpen ? 'hover:bg-light-primary' : 'hover:bg-accent'} hover:dark:bg-dark-border text-base font-normal`}
                      >
                        <div className='flex items-center gap-3 w-full overflow-hidden [&>svg]:shrink-0'>
                          {item.icon}
                          <span className={`${isContract ? 'hidden' : ''} overflow-hidden text-ellipsis whitespace-nowrap`}>{item.label}</span>
                        </div>
                        <ChevronRightIcon className={`${isContract ? 'hidden' : ''} group-aria-expanded:rotate-90 transition-transform shrink-0`} />
                      </div>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <div className="flex flex-col pl-5 relative w-full">
                        {item.children.map((child, index) => {
                          if (verifyPermission(child.permissions!)) {
                            return (
                              <Link
                                key={index}
                                to={child.path!}
                                className={`${selectedMenu === child.path ? 'dark:bg-[#374151] text-light-primary dark:text-light-bg-secondary font-semibold' : 'text-light-text-secondary dark:text-dark-text-secondary'} h-10 flex items-center gap-3 rounded-lg px-3 py-2 mt-1 transition-all hover:bg-light-primary/5 hover:dark:bg-dark-border text-base font-normal w-full`}
                              >
                                {child.icon}
                                <span className={`${isContract ? 'hidden' : ''} overflow-hidden text-ellipsis whitespace-nowrap`}>{child.label}</span>
                              </Link>
                            )
                          } else {
                            return null
                          }
                        })}
                        <hr className={`absolute left-3 h-full border-r border-dashed ${selectedMenu.includes('') ? 'border-light-primary' : 'border-dark-text-secondary'}`} />
                      </div>
                    </CollapsibleContent>
                  </Collapsible>)
              } else {
                if (verifyPermission(item.permissions!)) {
                  return (
                    <Link
                      key={index}
                      to={item.path!}
                      className={`${selectedMenu === PrivateRoutes.DASHBOARD ? 'text-light-text-primary dark:text-dark-text-primary hover:bg-light-border dark:bg-dark-border font-semibold' : 'text-light-text-secondary dark:text-dark-text-secondary'} h-10 flex items-center gap-3 rounded-md px-4 py-2 mb-1 transition-all w-full hover:bg-light-border hover:dark:bg-dark-border text-base font-normal`}
                    >
                      {item.icon}
                      <span className={isContract ? 'hidden' : ''}>{item.label}</span>
                    </Link>)
                } else {
                  return null
                }
              }
            }
            )
            : <div className="grid place-content-center place-items-center w-full py-2"><Loading /></div>}

        </section>
        <div className="mt-2 px-3 overflow-y-auto">
          <h3 className="text-xs uppercase font-semibold text-gray-500 dark:text-gray-400 px-1 mb-2">
            <CalendarClock className="inline-block mr-1" size={14} />
            Proyectos Recientes
          </h3>
          <ScrollArea className="max-h-full pr-2">
            {Object.entries(groupedProjects).map(([group, items]) => (
              <div key={group} className="mb-4">
                <div className="text-[16px] font-medium text-muted-foreground mb-1">{group}</div>
                {items.map((proj) => (
                  <Link
                    to={`/area-trabajo/${proj.id}`}
                    key={proj.id}
                    className="block text-[16px] text-ellipsis whitespace-nowrap overflow-hidden px-2 py-1 rounded hover:bg-muted transition-all text-foreground"
                  >
                    {proj.name}
                  </Link>
                ))}
              </div>
            ))}
          </ScrollArea>
        </div>
      </div>
        <section className='border-t p-4 justify-end'>
          <Link
            to={PrivateRoutes.SETTINGS}
            className={`${selectedMenu === PrivateRoutes.SETTINGS ? 'text-light-bg-primary bg-light-primary  dark:text-primary hover:bg-border dark:bg-dark-border font-semibold' : 'text-black dark:text-white font-semibold'} h-10 text-white bg-light-primary hover:bg-light-primary/90 flex items-center gap-3 rounded-md px-4 py-2 transition-all w-full hover:dark:bg-dark-border text-base font-normal`}
          >
            <SettingsIcon width={22} height={22} />
            <span className={isContract ? 'hidden' : ''}>Configuración</span>
          </Link>
        </section>

    </nav>
  )
}

export default Navigation
