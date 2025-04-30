import { useEffect, useMemo, useRef, useState } from 'react'
import { useComponentContext } from '@/context/ComponentContext'
import { useHeader } from '@/hooks'
import { PrivateRoutes } from '@/models/routes.model'
import { API_BASEURL, ENDPOINTS } from '@/utils'
import { useCreateResource, useGetResource, useUpdateResource } from '@/hooks/useApiResource'
import { type UpdateProject, type Project } from '@/modules/projects/models/project.model'
import { toast } from 'sonner'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { AlertDialogHeader } from '@/components/ui/alert-dialog'
import { Input } from '@/components/ui/input'
import { HexColorPicker } from 'react-colorful'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import Canvas from './Canvas'
import { useParams } from 'react-router-dom'
import { connectSocket, getSocket } from '@/lib/socket'
import throttle from 'lodash.throttle'

export interface BaseComponent {
  id: string
  x: number
  y: number
  width: number
  height: number
  styles?: string // clases tailwind que quieras aplicar
  is_locked?: boolean
  z_index?: number
  label?: string
}
export interface SidebarComponent extends BaseComponent {
  type: 'sidebar'
  title: string
  titleIcon?: string // nuevo campo para el icono del título
  mainColor?: string // nuevo campo: color principal para íconos, secciones activas, botón config
  asideBg?: string // nuevo campo: fondo total del sidebar
  sections: Array<{
    icon: string
    label: string
    route: string
  }>
  select?: number
}
// Componentes que faltan crear ---------------------------------------------------------------

export interface LabelComponent extends BaseComponent {
  backgroundColor: string
  route: string
  type: 'label'
  text: string
  fontSize?: string
}

export interface SearchComponent extends BaseComponent {
  type: 'search'
  placeholder: string
}

export interface PaginationComponent extends BaseComponent {
  type: 'pagination'
  totalPages: number
  currentPage: number
}

export interface HeaderComponent extends BaseComponent {
  type: 'header'
  backgroundColor?: string
  sections: Array<{
    label: string
    route: string
  }>
  buttons: Array<{
    icon: string
    action?: string // acción futura si quieres asociarlo
  }>
  activeColor?: string // color para la sección seleccionada (ej: azul para "Proyectos")
}

export interface SelectComponent extends BaseComponent {
  type: 'select'
  options: string[]
  value?: string
}

export interface DialogComponent extends BaseComponent {
  type: 'dialog'
  title: string
  fields: Array<{
    label: string
    type: SelectComponent | InputComponent
  }>
}
// ---------------------------------------------------------------

export interface ButtonComponent extends BaseComponent {
  type: 'button'
  label: string
  backgroundColor?: string
  borderRadius?: string
  route?: string
}

export interface InputComponent extends BaseComponent {
  type: 'input'
  placeholder?: string
  borderRadius?: string
  value?: string
}
export interface DataTableComponent extends BaseComponent {
  type: 'datatable'
  headers: string[] // Ej: ['Id', 'Nombre', 'Descripción']
  rows: string[][] // Ej: [['1', 'Proyecto X', 'Descripción...'], ...]
  backgroundColor?: string
}
export interface ListarComponent extends Omit<BaseComponent, 'label'> {
  type: 'listar'
  button: ButtonComponent
  dataTable: DataTableComponent
  label: LabelComponent
  search: SearchComponent
  pagination: PaginationComponent
  dialog: DialogComponent
}

export interface CardComponent extends BaseComponent {
  type: 'card'
  backgroundColor?: string
  borderRadius?: string
  padding?: string
  shadow?: boolean
}

export interface LoginComponent extends Omit<BaseComponent, 'label'> {
  type: 'login'
  card: CardComponent
  title: LabelComponent
  subtitle: LabelComponent
  emailInput: InputComponent
  passwordInput: InputComponent
  loginButton: ButtonComponent
  googleButton: ButtonComponent
  signupLink: LabelComponent
}
export interface ChecklistComponent extends BaseComponent {
  type: 'checklist'
  items: Array<{
    label: string
    checked: boolean
  }>
  title?: string
}
export interface RadioButtonComponent extends BaseComponent {
  type: 'radiobutton'
  options: string[]
  selected?: string
  name?: string // grupo común
}
export type ComponentItem =
  | ButtonComponent
  | InputComponent
  | SidebarComponent
  | DataTableComponent
  | LabelComponent
  | SearchComponent
  | PaginationComponent
  | ListarComponent
  | HeaderComponent
  | LoginComponent
  | SelectComponent
  | ChecklistComponent
  | RadioButtonComponent

interface Page {
  id: string
  name: string
  order?: number
  background_color?: string
  grid_enabled?: boolean
  device_mode?: string
  components: ComponentItem[]
}
interface CreatePage {
  name: string
  background_color?: string
  components: ComponentItem[]
}
export default function Editor() {
  useHeader([
    { label: 'Espacio de Trabajo', path: PrivateRoutes.AREA }
  ])
  const { areaId } = useParams()
  const [activeProject, setActiveProject] = useState<Project | undefined>(undefined)
  const { resource: project, mutate } = useGetResource<Project>({ endpoint: ENDPOINTS.ULTIMO_PROJECT })
  const { updateResource: updateProject } = useUpdateResource<UpdateProject>(ENDPOINTS.PROJECTS)
  const { resource: projectId, mutate: mutateId } = useGetResource<Project>({
    endpoint: areaId && areaId !== ':areaId' ? ENDPOINTS.PROJECTS : ENDPOINTS.ULTIMO_PROJECT, // si no es valido, no busca nada
    id: areaId && areaId !== ':areaId' ? areaId : ''
  })
  const { createResource: createPage } = useCreateResource<CreatePage>({
    endpoint: ENDPOINTS.PROJECTS + '/' + activeProject?.id + '/pages'
  })
  const [pages, setPages] = useState<Page[]>([
    { id: '1', name: 'Página 1', components: [] }
  ])
  const [currentPageIndex, setCurrentPageIndex] = useState(0)
  const { setSelectedComponent, selectedComponent, selectedPage } = useComponentContext()
  const prevPagesLen = useRef(0)
  const [openDlg, setOpenDlg] = useState(false)
  const [newName, setNewName] = useState('')
  const [newBg, setNewBg] = useState('#ffffff')
  const [creating, setCreating] = useState(false)
  const [selectedButtonId, setSelectedButtonId] = useState<string | null>(null)
  useEffect(() => {
    if (!activeProject) return
    setPages(activeProject.pages ?? [])
  }, [activeProject])
  // ➋  Observa cambios de longitud
  useEffect(() => {
    if (areaId && areaId !== ':areaId') {
      if (projectId) {
        setActiveProject(projectId)
      }
    } else {
      if (project) {
        setActiveProject(project)
      }
    }
  }, [areaId, projectId, project])
  useEffect(() => {
    if (pages.length > prevPagesLen.current) {
      // se añadió al menos 1 página → ve a la última
      setCurrentPageIndex(pages.length - 1)
    }
    prevPagesLen.current = pages.length
  }, [pages])

  useEffect(() => {
    if (!selectedPage) return

    setPages(prevPages => {
      const updatedPages = structuredClone(prevPages)
      const pageIndex = updatedPages.findIndex(p => p.id === selectedPage.id)

      if (pageIndex !== -1) {
        updatedPages[pageIndex] = selectedPage
      }

      return updatedPages
    })
  }, [selectedPage])
  function isComponentItem(obj: any): obj is ComponentItem {
    return obj && typeof obj === 'object' && 'id' in obj && 'type' in obj
  }
  useEffect(() => {
    if (activeProject?.id) {
      const token = localStorage.getItem('token') // o usa tu contexto de auth
      if (token) {
        const socket = connectSocket(token, activeProject.id)
        console.log('🔌 Conectando socket...')
        socket.on('initial_state', (snapshot) => {
          console.log('📦 Estado inicial recibido:', snapshot)
          console.log('✅ Socket conectado correctamente:', socket.id)
        })
        socket.on('disconnect', (reason) => {
          console.log('⚠️ Socket desconectado:', reason)
        })

        socket.on('connect_error', (error) => {
          console.error('❌ Error de conexión Socket:', error)
        })
        socket.on('component_created', (data) => {
          console.log('🟢 Nuevo componente:', data)
          const { page_id: pageId, component } = data

          setPages(prevPages => {
            const pagesCopy = structuredClone(prevPages)
            const page = pagesCopy.find(p => p.id === pageId)
            if (page) {
              if (isComponentItem(component)) { // Verifica que el componente sea válido
                page.components.push(component)
              } else {
                console.error('El componente recibido no es válido:', component)
              }
            }
            return pagesCopy
          })
        })

        socket.on('component_updated', (data) => {
          console.log('🟡 Componente actualizado:', data)
          const { page_id: pageId, component } = data

          setPages(prevPages => {
            const pagesCopy = structuredClone(prevPages)
            const page = pagesCopy.find(p => p.id === pageId)
            if (page) {
              const idx = page.components.findIndex(c => c.id === component.id)
              if (idx !== -1) {
                page.components[idx] = component
              }
            }
            return pagesCopy
          })
        })

        socket.on('component_deleted', (data) => {
          console.log('🔴 Componente eliminado:', data)
          const { page_id: pageId, component } = data

          setPages(prevPages => {
            const pagesCopy = structuredClone(prevPages)
            const page = pagesCopy.find(p => p.id === pageId)
            if (page) {
              page.components = page.components.filter(c => c.id !== component.id)
            }
            return pagesCopy
          })
        })
        socket.on('component_moving', ({ page_id: pageId, component, origin }) => {
          if (origin === socket.id) return // ignora tu propio drag
          setPages(pages => {
            const next = structuredClone(pages)
            const page = next.find(p => p.id === pageId)
            if (!page) return pages
            const idx = page.components.findIndex(c => c.id === component.id)
            if (idx !== -1) {
              page.components[idx].x = component.x
              page.components[idx].y = component.y
            }
            return next
          })
        })

        socket.on('component_resizing', ({ page_id: pageId, component, origin }) => {
          if (origin === socket.id) return
          setPages(pages => {
            const next = structuredClone(pages)
            const page = next.find(p => p.id === pageId)
            if (!page) return pages
            const idx = page.components.findIndex(c => c.id === component.id)
            if (idx !== -1) {
              Object.assign(page.components[idx], component)
            }
            return next
          })
        })
        socket.on('component_props_changed', ({ page_id: pageId, component, origin }) => {
          if (origin === socket.id) return // ignora tu propio eco

          setPages(prev => {
            const next = structuredClone(prev)
            const page = next.find(p => p.id === pageId)
            if (!page) return prev

            const idx = page.components.findIndex(c => c.id === component.id)
            if (idx !== -1) {
              page.components[idx] = { ...page.components[idx], ...component }
            }
            return next
          })
        })
        // socket.on('component_props_changed', (payload) => {
        //   console.log('RX props_changed: ', payload) // 👈
        // })
      }
    }
  }, [activeProject?.id])
  const onSubmit = () => {
    toast.promise(updateProject(
      {
        id: activeProject?.id ?? '',
        create_date: activeProject?.create_date ?? new Date(),
        name: activeProject?.name ?? '',
        descripcion: activeProject?.descripcion ?? '',
        status: activeProject?.status ?? 'En proceso',
        last_modified: new Date(),
        pages
      }
    ), {
      loading: 'Guardando Cambios...',
      success: () => {
        if (mutate) {
          void mutate() // solo si quieres mutar la lista general
        }
        if (mutateId) {
          void mutateId() // solo si quieres mutar el proyecto específico
        }
        return 'Cambios guardados exitosamente'
      },
      error: 'Error al guardar los cambios'
    })
  }
  const throttledEmit = useMemo(() => {
    if (!activeProject?.id) return () => {} // no hace nada aún
    return throttle((component: ComponentItem) => {
      const socket = getSocket()
      if (!socket) return
      socket.emit('component_props_changed', {
        project_id: activeProject.id, // ✅ siempre definido
        page_id: pages[currentPageIndex]?.id,
        component,
        origin: socket.id
      })
    }, 120)
  }, [activeProject?.id, currentPageIndex, pages])
  useEffect(() => {
    if (!selectedComponent) return

    // 1. actualizas el estado local (tal como ya hacías)
    const updatedPages = [...pages]
    const comps = updatedPages[currentPageIndex].components
    const idx = comps.findIndex(c => c.id === selectedComponent.id)
    if (idx !== -1) {
      comps[idx] = selectedComponent
      setPages(updatedPages)
    }

    // 2. 🔴  emite a otros usuarios (throttle)
    throttledEmit(selectedComponent)
  }, [selectedComponent])
  const handleDrop = (e: React.DragEvent<HTMLDivElement>, pageId: string, scale: number) => {
    const socket = getSocket()

    e.preventDefault()
    const type = e.dataTransfer.getData('component/type')
    const containerRect = e.currentTarget.getBoundingClientRect()
    const x = (e.clientX - containerRect.left) / scale
    const y = (e.clientY - containerRect.top) / scale
    const newComponent = (() => {
      switch (type) {
        case 'button':
          return {
            id: Date.now().toString(),
            type: 'button',
            label: 'Botón',
            x,
            y,
            width: 200,
            height: 50,
            styles: 'flex items-center bg-blue justify-center w-full h-full text-white'
          }
        case 'input':
          return {
            id: Date.now().toString(),
            type: 'input',
            placeholder: 'Escribir placeholder...',
            x,
            y,
            width: 200,
            height: 40,
            styles: 'block w-full bg-white text-black h-full p-1 '
          }
        // Aquí puedes agregar más casos para otros tipos de componentes
        case 'sidebar':
          return {
            id: Date.now().toString(),
            type: 'sidebar',
            title: 'UI SKETCH',
            x,
            y,
            width: 257,
            height: 700,
            select: 0,
            styles: 'bg-white shadow-lg p-4',
            asideBg: '#ffffff',
            mainColor: '#a855f7',
            sections: [
              { icon: 'home', label: 'Inicio', route: '' },
              { icon: 'file', label: 'Documentos', route: '' },
              { icon: 'cog', label: 'Configuración', route: '' }
            ]
          }
        case 'datatable':
          return {
            id: Date.now().toString(),
            type: 'datatable',
            x,
            y,
            width: 900,
            height: 300,
            styles: '',
            headers: ['Id', 'Nombre', 'Descripción', 'Fecha', 'Estado'],
            backgroundColor: '#ffffff',
            rows: [
              ['1', 'Proyecto Interfaces', 'Este proyecto será para construir interfaces dinámicas...', '15 abr 2025', 'En proceso']
            ]
          }
        case 'listar':
          // eslint-disable-next-line no-case-declarations
          const headers = ['Id', 'Nombre', 'Descripción', 'Fecha de creación', 'Estado']
          return {
            id: Date.now().toString(),
            type: 'listar',
            x,
            y,
            width: 1000,
            height: 500,
            styles: '',
            button: {
              id: `${Date.now()}-btn`,
              type: 'button',
              label: 'Agregar',
              x: 0,
              y: 0,
              width: 120,
              height: 40,
              styles: 'bg-blue-600 text-white px-4 py-2 rounded'
            },
            label: {
              id: `${Date.now()}-lbl`,
              type: 'label',
              text: 'Todos los Proyectos',
              x: 0,
              y: 0,
              width: 300,
              height: 30,
              styles: 'text-lg font-semibold text-black'
            },
            search: {
              id: `${Date.now()}-search`,
              type: 'search',
              placeholder: 'Buscar por nombre...',
              x: 0,
              y: 0,
              width: 250,
              height: 40,
              styles: 'border-gray-300 rounded bg-white px-3 py-1'
            },
            dataTable: {
              id: `${Date.now()}-table`,
              type: 'datatable',
              x: 0,
              y: 0,
              width: 1000,
              height: 200,
              styles: '',
              headers,
              backgroundColor: '#ffffff',
              rows: [
                ['1', 'Proyecto Interfaces', 'Este proyecto será para construir interfaces dinámicas...', '15 abr 2025', 'En proceso']
              ]
            },
            pagination: {
              id: `${Date.now()}-pg`,
              type: 'pagination',
              x: 0,
              y: 0,
              width: 300,
              height: 40,
              styles: 'text-black',
              currentPage: 1,
              totalPages: 5
            },
            dialog: {
              id: `${Date.now()}-dialog`,
              type: 'dialog',
              x: 0,
              y: 0,
              width: 400,
              height: 500,
              styles: '',
              title: 'Agregar nuevo proyecto',
              fields: headers.map((header) => ({
                label: header,
                type: {
                  id: `${Date.now()}-input-${header}`,
                  type: 'input',
                  x: 0,
                  y: 0,
                  width: 300,
                  height: 40,
                  styles: 'border border-gray-300 bg-white rounded px-2 py-1',
                  placeholder: `Ingrese ${header.toLowerCase()}`,
                  value: ''
                }
              }))
            }
          }
        case 'header':
          return {
            id: Date.now().toString(),
            type: 'header',
            x,
            y,
            width: 1200,
            height: 70,
            styles: 'flex justify-between items-center p-4 border border-gray-300',
            backgroundColor: '#ffffff', // 👈 fondo oscuro por defecto
            sections: [
              { label: 'Espacio de Trabajo', route: '' },
              { label: 'Proyectos', route: '' }
            ],
            buttons: [
              { icon: 'bell' }, // campanita
              { icon: 'user' } // usuario
            ],
            activeColor: '#3b82f6' // azulito
          }
        case 'login':
          // eslint-disable-next-line no-case-declarations
          const now = Date.now()
          return {
            id: now.toString(),
            type: 'login',
            x,
            y,
            width: 400,
            height: 400,
            styles: '',

            // Card que envuelve todo
            card: {
              id: `${now}-card`,
              type: 'card',
              x: 0,
              y: 0,
              width: 400,
              height: 600,
              styles: 'p-6 flex flex-col items-center justify-center gap-4',
              backgroundColor: '#ffffff',
              borderRadius: '0.5rem', // 8px
              padding: '1.5rem',
              shadow: true
            },

            // Título
            title: {
              id: `${now}-title`,
              type: 'label',
              x: 0,
              y: 0,
              width: 300,
              height: 30,
              text: 'Login',
              styles: 'text-2xl font-bold text-black'
            },

            // Subtítulo
            subtitle: {
              id: `${now}-subtitle`,
              type: 'label',
              x: 0,
              y: 0,
              width: 300,
              height: 20,
              text: 'Enter your email below to login to your account',
              styles: 'text-gray-500 text-sm'
            },

            // Input de email
            emailInput: {
              id: `${now}-email`,
              type: 'input',
              x: 0,
              y: 0,
              width: 300,
              height: 40,
              styles: 'border border-gray-300 bg-white rounded px-3 py-2 w-full',
              placeholder: 'm@example.com',
              borderRadius: '0.375rem',
              value: ''
            },

            // Input de contraseña
            passwordInput: {
              id: `${now}-password`,
              type: 'input',
              x: 0,
              y: 0,
              width: 300,
              height: 40,
              styles: 'border border-gray-300 bg-white rounded px-3 py-2 w-full',
              placeholder: '',
              borderRadius: '0.375rem',
              value: ''
            },

            // Botón de Login
            loginButton: {
              id: `${now}-login-button`,
              type: 'button',
              x: 0,
              y: 0,
              width: 300,
              height: 40,
              styles: 'bg-black text-white w-full py-2 rounded',
              label: 'Login',
              backgroundColor: '#000000',
              borderRadius: '0.375rem'
            },

            // Botón de Login con Google
            googleButton: {
              id: `${now}-google-button`,
              type: 'button',
              x: 0,
              y: 0,
              width: 300,
              height: 40,
              styles: 'bg-white text-black border border-gray-300 w-full py-2 rounded',
              label: 'Login with Google',
              backgroundColor: '#ffffff',
              borderRadius: '0.375rem'
            },

            // Texto de "Don't have an account? Sign up"
            signupLink: {
              id: `${now}-signup`,
              type: 'label',
              x: 0,
              y: 0,
              width: 300,
              height: 20,
              text: "Don't have an account? Sign up",
              styles: 'text-sm text-gray-600'
            }
          }
        case 'select':
          return {
            id: Date.now().toString(),
            type: 'select',
            x,
            y,
            width: 200,
            height: 40,
            styles: 'w-full p-2 border border-gray-300 bg-white rounded text-black',
            options: ['Opción 1', 'Opción 2', 'Opción 3'],
            value: 'Opción 1'
          }
        case 'checklist':
          return {
            id: Date.now().toString(),
            type: 'checklist',
            x,
            y,
            width: 300,
            height: 200,
            styles: 'p-4 bg-white rounded shadow space-y-2 text-black',
            title: 'Tareas Pendientes',
            items: [
              { label: 'Tarea 1', checked: false },
              { label: 'Tarea 2', checked: true },
              { label: 'Tarea 3', checked: false }
            ]
          }
        case 'radiobutton':
          return {
            id: Date.now().toString(),
            type: 'radiobutton',
            x,
            y,
            width: 300,
            height: 120,
            styles: 'space-y-2 p-3 bg-white rounded shadow text-black',
            options: ['Opción A', 'Opción B', 'Opción C'],
            selected: 'Opción A',
            name: `radio-group-${Date.now()}`
          }
        default:
          throw new Error(`Tipo de componente desconocido: ${type}`)
      }
    })()
    console.log('🟢 Componente creado:', newComponent)
    socket?.emit('component_created', {
      project_id: activeProject?.id,
      page_id: pageId,
      component: newComponent
    })
    const updatedPages = [...pages]
    const pageIndex = updatedPages.findIndex((p) => p.id === pageId)
    if (pageIndex !== -1) {
      if (isComponentItem(newComponent)) { // Verifica que el componente sea válido
        updatedPages[pageIndex].components.push(newComponent)
        setPages(updatedPages)
      } else {
        console.error('El componente no es válido:', newComponent)
      }
    }
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
  }

  const updateComponent = (
    pageIndex: number,
    compIndex: number,
    updated: ComponentItem
  ) => {
    setPages(prev => {
      const clone = structuredClone(prev)
      clone[pageIndex].components[compIndex] = updated
      return clone
    })
  }

  const handleCreatePage = async () => {
    if (!newName.trim()) return // nombre vacío

    setCreating(true)
    try {
      // Crear la nueva página
      // eslint-disable-next-line @typescript-eslint/no-confusing-void-expression
      const newPage: any = await createPage({
        name: newName,
        background_color: newBg,
        components: []
      })
      if (newPage !== undefined && newPage !== null) {
        // Actualizar el botón seleccionado con el ID de la nueva página
        if (selectedButtonId) {
          const updatedPages = [...pages]
          for (const page of updatedPages) {
            const button = page.components.find(
              (comp) => comp.type === 'button' && comp.id === selectedButtonId
            ) as ButtonComponent | undefined
            if (button) {
              button.route = newPage.id // Usar el ID de la página creada
              break
            }
          }
          setPages(updatedPages)
        }

        setPages([...pages, newPage]) // Agregar la nueva página a la lista de páginas
        setOpenDlg(false)
        setNewName('')
        setSelectedButtonId(null) // Limpiar selección
        toast.success('Página creada')
      }
    } catch (e) {
      toast.error('No se pudo crear la página')
    } finally {
      setCreating(false)
    }
  }

  const [, setSelectedComponentId] = useState<string | null>(null)
  const handleDeleteComponent = (id: string) => {
    const updatedPages = [...pages]
    updatedPages[currentPageIndex].components = updatedPages[currentPageIndex].components.filter(
      (c) => c.id !== id
    )
    const socket = getSocket()

    socket?.emit('component_deleted', {
      project_id: activeProject?.id,
      page_id: pages[currentPageIndex]?.id,
      component: { id }
    })
    setPages(updatedPages)
    setSelectedComponentId(null)
  }
  // Obtener todos los botones de todas las páginas
  const allButtons = pages.flatMap((page, pageIndex) =>
    page.components
      .filter((comp) => comp.type === 'button')
      .map((button) => ({
        id: button.id,
        label: button.label,
        pageIndex,
        pageName: page.name
      }))
  )

  const handleExport = async () => {
    try {
      const response = await fetch(`${API_BASEURL}${ENDPOINTS.PROJECTS}/${activeProject?.id}/download`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}` // Asegúrate de enviar el token si es necesario
        }
      })

      if (!response.ok) {
        throw new Error('Error al descargar el archivo')
      }
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'frontend-angular.zip' // Nombre del archivo descargado
      document.body.appendChild(a)
      a.click()
      a.remove()
      window.URL.revokeObjectURL(url)
      toast.success('Archivo descargado exitosamente')
    } catch (error) {
      console.error(error)
      toast.error('Error al descargar el archivo')
    }
  }
  const currentPage = pages[currentPageIndex] ?? null

  return (
    <div className="flex flex-col h-screen w-full">

    {/* ------------ Diálogo Crear página ------------- */}
    <Dialog open={openDlg} onOpenChange={setOpenDlg}>
      <DialogContent>
        <AlertDialogHeader>
          <DialogTitle>Nueva página</DialogTitle>
        </AlertDialogHeader>

        <div className="space-y-4">
          {/* Nombre */}
          <div className="space-y-1">
            <label className="text-sm font-medium">Nombre</label>
            <Input
              value={newName}
              onChange={e => { setNewName(e.target.value) }}
              placeholder="Página de inicio…"
            />
          </div>

          {/* Selector de color */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Color de fondo</label>

            {/* preview + código */}
            <div className="flex items-center gap-3">
              <span
                className="block w-8 h-8 rounded border"
                style={{ backgroundColor: newBg }}
              />
              <code className="text-sm">{newBg}</code>
            </div>

            {/* Color picker */}
            <HexColorPicker color={newBg} onChange={setNewBg} className="rounded-md shadow" />
          </div>
          {/* Selector de botón */}
          <div className="space-y-1">
            <label className="text-sm font-medium">Asociar a botón</label>
            <Select
              value={selectedButtonId ?? ''}
              onValueChange={(value) => { setSelectedButtonId(value) }}
            >
              <SelectTrigger className="w-full border border-gray-300 rounded px-2 py-1 text-sm">
                <SelectValue placeholder="Seleccionar botón..." />
              </SelectTrigger>
              <SelectContent>
                {/* <SelectItem value="">Seleccionar botón...</SelectItem> */}
                {allButtons.map((button) => (
                  <SelectItem key={button.id} value={button.id}>
                    {button.label} (Página: {button.pageName})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {/* Actions */}
          <div className="flex justify-end gap-2 pt-2">
            <button
              onClick={() => { setOpenDlg(false) }}
              className="px-3 py-1.5 text-sm rounded border hover:bg-gray-100"
            >
              Cancelar
            </button>
            <button
              disabled={creating}
              onClick={handleCreatePage}
              className="px-3 py-1.5 text-sm rounded bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
            >
              Guardar
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
      {/* Lienzo */}
      <Canvas
        pages={pages}
        current={currentPage}
        onSelectPage={(id) => {
          const index = pages.findIndex((p) => p.id === id)
          if (index !== -1) setCurrentPageIndex(index)
        }}
        currentProjectId={activeProject?.id ?? ''}
        setSelectedComponent={setSelectedComponent}
        updateComponent={updateComponent}
        handleDeleteComponent={handleDeleteComponent}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onSubmit={onSubmit}
        handleExport={handleExport}
        setOpenDlg={setOpenDlg}
      />
    </div>
  )
}
