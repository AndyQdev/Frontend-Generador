// src/components/right-sidebar.tsx
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger
} from '@/components/ui/collapsible'
import {
  Boxes,
  ChevronRightIcon,
  FileInputIcon,
  HousePlug,
  SquareMousePointerIcon
} from 'lucide-react'
import { useComponentContext } from '@/context/ComponentContext'
// import { useSidebar } from '@/context/siderbarContext'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { useGetResource } from '@/hooks/useApiResource'
import { type Project } from '@/modules/projects/models/project.model'
import { ENDPOINTS } from '@/utils'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'

export default function RightSidebar() {
  const { selectedComponent, setSelectedComponent } = useComponentContext()
  const [isIconPickerOpen, setIsIconPickerOpen] = useState(false)
  const [currentIconIndex, setCurrentIconIndex] = useState<number | null>(null)
  const [isHeaderButtonIconPickerOpen, setIsHeaderButtonIconPickerOpen] = useState(false)
  const [editingHeaderButtonIndex, setEditingHeaderButtonIndex] = useState<number | null>(null)

  const iconList = [
    'home', 'user', 'gear', 'star', 'folder', 'chart-line', 'cog', 'edit', 'trash', 'plus',
    'book', 'calendar', 'camera', 'cloud', 'download', 'envelope', 'file', 'heart', 'lock', 'music'
  ]
  const { resource: project } = useGetResource<Project>({ endpoint: ENDPOINTS.ULTIMO_PROJECT })

  //   const { isContract, toggleContract } = useSidebar()
  function openIconPicker(index: number) {
    setCurrentIconIndex(index)
    setIsIconPickerOpen(true)
  }
  const [isTitleIconPickerOpen, setIsTitleIconPickerOpen] = useState(false)

  function openTitleIconPicker() {
    setIsTitleIconPickerOpen(true)
  }

  function selectTitleIcon(iconName: string) {
    if (selectedComponent?.type === 'sidebar') {
      setSelectedComponent({
        ...selectedComponent,
        titleIcon: iconName
      })
    }
    setIsTitleIconPickerOpen(false)
  }
  function selectIcon(iconName: string) {
    if (selectedComponent?.type === 'sidebar' && currentIconIndex !== null) {
      const updatedSections = [...selectedComponent.sections]
      updatedSections[currentIconIndex].icon = iconName
      setSelectedComponent({
        ...selectedComponent,
        sections: updatedSections
      })
    }
    setIsIconPickerOpen(false)
  }

  function addNewSection() {
    if (selectedComponent?.type === 'sidebar') {
      const updatedSections = [
        ...selectedComponent.sections,
        { icon: 'star', label: 'Nueva Sección', route: '/' }
      ]
      setSelectedComponent({
        ...selectedComponent,
        sections: updatedSections
      })
    }
  }
  const [isComponentsOpen, setIsComponentsOpen] = useState(true)
  const [isHerramientaOpen, setIsHerramientaOpen] = useState(true)
  const [openEditor, setOpenEditor] = useState(false)
  const { selectedPage, setSelectedPage, updatePage } = useComponentContext()
  // console.log('Pagina seleccionada: ', selectedPage)
  // console.log('Componente seleccionado:', selectedComponent)
  return (
      <aside className="hidden lg:flex flex-col dark:bg-[#111827] w-[270px] h-[100dvh] border-l bg-background p-4 overflow-hidden">
        {/* ----------- Componentes ----------- */}
        <Collapsible className="w-full" open={isComponentsOpen} onOpenChange={setIsComponentsOpen}>
          <CollapsibleTrigger className="w-full group">
            <div className="flex items-center justify-between w-full px-2 py-2 rounded-md bg-muted hover:bg-muted/80">
              <div className="flex items-center gap-2 text-sm font-medium">
                <Boxes size={18} /> Componentes
              </div>
              <ChevronRightIcon className="group-aria-expanded:rotate-90 transition-transform" />
            </div>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <div className="grid grid-cols-2 gap-3 py-4">
              {/* Botón */}
              <div
                className="flex items-center gap-2 px-3 py-2 rounded border border-blue-500 bg-blue-50 text-blue-800 cursor-move"
                draggable
                onDragStart={(e) => { e.dataTransfer.setData('component/type', 'button') }}
              >
                <SquareMousePointerIcon size={16} />
                <span className="text-sm">Botón</span>
              </div>
              {/* Input */}
              <div
                className="flex items-center gap-2 px-3 py-2 rounded border border-green-500 bg-green-50 text-green-800 cursor-move"
                draggable
                onDragStart={(e) => { e.dataTransfer.setData('component/type', 'input') }}
              >
                <FileInputIcon size={16} />
                <span className="text-sm">Input</span>
              </div>
              {/* Sidebar */}
              <div
                className="flex items-center gap-2 px-3 py-2 rounded border border-purple-500 bg-purple-50 text-purple-800 cursor-move"
                draggable
                onDragStart={(e) => {
                  e.dataTransfer.setData('component/type', 'sidebar')
                }}
              >
                <SquareMousePointerIcon size={16} />
                <span className="text-sm">Sidebar</span>
              </div>
              <div
                className="flex items-center gap-2 px-3 py-2 rounded border border-indigo-500 bg-indigo-50 text-indigo-800 cursor-move"
                draggable
                onDragStart={(e) => {
                  e.dataTransfer.setData('component/type', 'datatable')
                }}
              >
                <FileInputIcon size={16} />
                <span className="text-sm">Table</span>
              </div>
            </div>
            {/* Listar */}
            <div
              className="flex items-center gap-2 px-3 py-2 rounded border border-pink-500 bg-pink-50 text-pink-800 cursor-move"
              draggable
              onDragStart={(e) => {
                e.dataTransfer.setData('component/type', 'listar')
              }}
            >
              <SquareMousePointerIcon size={16} />
              <span className="text-sm">CRUD</span>
            </div>
              {/* Header */}
            <div
              className="flex items-center gap-2 px-3 py-2 rounded border border-yellow-500 bg-yellow-50 text-yellow-800 cursor-move"
              draggable
              onDragStart={(e) => {
                e.dataTransfer.setData('component/type', 'header')
              }}
            >
              <SquareMousePointerIcon size={16} />
              <span className="text-sm">Header</span>
            </div>
              {/* Login */}
            <div
              className="flex items-center gap-2 px-3 py-2 rounded border border-yellow-500 bg-yellow-50 text-yellow-800 cursor-move"
              draggable
              onDragStart={(e) => {
                e.dataTransfer.setData('component/type', 'login')
              }}
            >
              <SquareMousePointerIcon size={16} />
              <span className="text-sm">Login</span>
            </div>
          </CollapsibleContent>
        </Collapsible>

        {/* ----------- Herramientas ----------- */}
        {selectedComponent && (
          <Collapsible className="w-full mt-6 mb-6" open={isHerramientaOpen} onOpenChange={setIsHerramientaOpen}>
            <CollapsibleTrigger className="w-full group">
              <div className="flex items-center justify-between w-full px-2 py-2 rounded-md bg-muted hover:bg-muted/80">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <HousePlug size={18} /> Herramientas
                </div>
                <ChevronRightIcon className="group-aria-expanded:rotate-90 transition-transform" />
              </div>
            </CollapsibleTrigger>
            <CollapsibleContent
              className="
                data-[state=open]:overflow-y-auto
                data-[state=open]:max-h-[calc(100dvh-220px)]
                pr-1
              "
            >
              <div className="flex flex-col w-full">
              {selectedPage && (
                  <div className="space-y-4">
                    <h3 className="text-sm font-semibold text-primary">Configuración de Página</h3>

                    {/* Nombre */}
                    <div className="flex items-center justify-between gap-2">
                      <label className="text-gray-600 dark:text-gray-300 w-28">Nombre:</label>
                      <input
                        value={selectedPage.name}
                        onChange={(e) => {
                          const updatedPage = { ...selectedPage, name: e.target.value }
                          setSelectedPage(updatedPage)
                          updatePage(updatedPage) // función para actualizar en el array de pages
                        }}
                        className="flex-1 border border-gray-300 rounded px-2 py-1 text-sm"
                      />
                    </div>

                    {/* Color de fondo */}
                    <div className="flex items-center justify-between gap-2">
                      <label className="text-gray-600 dark:text-gray-300 w-28">Color fondo:</label>
                      <input
                        type="color"
                        value={selectedPage.background_color ?? '#ffffff'}
                        onChange={(e) => {
                          const updatedPage = { ...selectedPage, background_color: e.target.value }
                          setSelectedPage(updatedPage)
                          updatePage(updatedPage)
                        }}
                        className="w-10 h-6 rounded border border-gray-300"
                      />
                    </div>

                    {/* Orden */}
                    <div className="flex items-center justify-between gap-2">
                      <label className="text-gray-600 dark:text-gray-300 w-28">Orden:</label>
                      <input
                        type="number"
                        min={0}
                        value={selectedPage.order ?? 0}
                        onChange={(e) => {
                          const updatedPage = { ...selectedPage, order: parseInt(e.target.value) }
                          setSelectedPage(updatedPage)
                          updatePage(updatedPage)
                        }}
                        className="flex-1 border border-gray-300 rounded px-2 py-1 text-sm"
                      />
                    </div>
                  </div>
              )}
                  <div className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2 mt-3">
                    Editando: <span className="capitalize text-primary">{selectedComponent.type}</span>
                    </div>

                    {/* Para Button */}
                    {selectedComponent.type === 'button' && (
                    <div className="space-y-3">
                        {/* Texto */}
                        <div className="flex items-center justify-between gap-2">
                        <label className="text-gray-600 dark:text-gray-300 w-28">Texto:</label>
                        <input
                            value={selectedComponent.label}
                            onChange={(e) => { setSelectedComponent({ ...selectedComponent, label: e.target.value }) }}
                            className="flex-1 border border-gray-300 dark:border-gray-600 rounded px-2 py-1 text-sm"
                        />
                        </div>

                        {/* Color de fondo */}
                        <div className="flex items-center justify-between gap-2">
                        <label className="text-gray-600 dark:text-gray-300 w-28">Color fondo:</label>
                        <input
                            type="color"
                            value={selectedComponent.backgroundColor ?? '#2563eb'}
                            onChange={(e) => { setSelectedComponent({ ...selectedComponent, backgroundColor: e.target.value }) }}
                            className="w-10 h-6 rounded border border-gray-300 dark:border-gray-600"
                        />
                        </div>

                        {/* Border radius */}
                        <div className="flex items-center justify-between gap-2">
                        <label className="text-gray-600 dark:text-gray-300 w-28">Bordes:</label>
                        <input
                            type="number"
                            min={0}
                            value={parseInt(selectedComponent.borderRadius ?? '6')}
                            onChange={(e) => {
                              const radius = `${e.target.value}px`
                              setSelectedComponent({ ...selectedComponent, borderRadius: radius })
                            }}
                            className="flex-1 border border-gray-300 dark:border-gray-600 rounded px-2 py-1 text-sm"
                        />
                        </div>
                    </div>
                    )}

                    {/* Para Input */}
                    {selectedComponent.type === 'input' && (
                    <div className="space-y-3">
                        {/* Placeholder */}
                        <div className="flex items-center justify-between gap-2">
                        <label className="text-gray-600 dark:text-gray-300 w-28">Placeholder:</label>
                        <input
                            value={selectedComponent.placeholder ?? ''}
                            onChange={(e) => { setSelectedComponent({ ...selectedComponent, placeholder: e.target.value }) }}
                            className="flex-1 border border-gray-300 dark:border-gray-600 rounded px-2 py-1 text-sm w-full"
                        />
                        </div>

                        {/* Border radius */}
                        <div className="flex items-center justify-between gap-2">
                        <label className="text-gray-600 dark:text-gray-300 w-28">Bordes:</label>
                        <input
                            type="number"
                            min={0}
                            value={parseInt(selectedComponent.borderRadius ?? '6')}
                            onChange={(e) => {
                              const radius = `${e.target.value}px`
                              setSelectedComponent({ ...selectedComponent, borderRadius: radius })
                            }}
                            className="flex-1 border border-gray-300 dark:border-gray-600 rounded px-2 py-1 text-sm"
                        />
                        </div>
                    </div>
                    )}
                    {selectedComponent.type === 'sidebar' && (
                      <div className="space-y-3">
                        <div className="grid grid-cols-2 gap-2 items-center text-xs font-semibold text-gray-600 dark:text-gray-300">
                          <span>Icono</span>
                          <span>Título</span>
                        </div>
                        <div className="grid grid-cols-2 gap-2 items-center mt-2">
                          {/* Selector de icono */}
                            <button
                              onClick={openTitleIconPicker}
                              className="border rounded flex items-center justify-center mr-6 bg-gray-50 hover:bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600"
                            >
                              <i className={`fa fa-${selectedComponent.titleIcon ?? 'star'} text-lg`}></i>
                            </button>

                          {/* Input para label */}
                            <input
                              value={selectedComponent.title}
                              onChange={(e) => { setSelectedComponent({ ...selectedComponent, title: e.target.value }) }}
                              className="flex-1 border border-gray-300 w-full dark:border-gray-600 rounded px-2 py-1 text-sm"
                            />
                        </div>

                        {/* Color total (mainColor) */}
                        <div className="flex items-center justify-between gap-2">
                          <label className="text-gray-600 dark:text-gray-300 w-28">Color total:</label>
                          <input
                            type="color"
                            value={selectedComponent.mainColor ?? '#a855f7'}
                            onChange={(e) => { setSelectedComponent({ ...selectedComponent, mainColor: e.target.value }) }}
                            className="w-10 h-6 rounded border border-gray-300 dark:border-gray-600"
                          />
                        </div>

                        {/* Color fondo aside */}
                        <div className="flex items-center justify-between gap-2">
                          <label className="text-gray-600 dark:text-gray-300 w-28">Fondo aside:</label>
                          <input
                            type="color"
                            value={selectedComponent.asideBg ?? '#ffffff'}
                            onChange={(e) => { setSelectedComponent({ ...selectedComponent, asideBg: e.target.value }) }}
                            className="w-10 h-6 rounded border border-gray-300 dark:border-gray-600"
                          />
                        </div>
                        {/* Select de sección activa */}
                        <div className="mt-4 space-y-1">
                          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            Sección activa:
                          </label>
                          <select
                            value={selectedComponent.select ?? 0}
                            onChange={(e) => {
                              const selectedIndex = parseInt(e.target.value)
                              setSelectedComponent({ ...selectedComponent, select: selectedIndex })
                            }}
                            className="w-full border border-gray-300 dark:border-gray-600 rounded px-2 py-1 text-sm"
                          >
                            {selectedComponent.sections.map((sec, idx) => (
                              <option key={idx} value={idx}>
                                {sec.label || `Sección ${idx + 1}`}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className="grid grid-cols-3 gap-2 items-center text-xs font-semibold text-gray-600 dark:text-gray-300">
                          <span>Icono</span>
                          <span>Label</span>
                          <span>Ruta</span>
                        </div>

                        {selectedComponent.sections.map((sec, idx) => (
                          <div key={idx} className="grid grid-cols-3 gap-2 items-center mt-2">
                            {/* Selector de icono */}
                            <button
                              onClick={() => { openIconPicker(idx) }}
                              className="border rounded flex items-center justify-center bg-gray-50 hover:bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600"
                            >
                              <i className={`fa fa-${sec.icon} text-lg`}></i>
                            </button>

                            {/* Input para label */}
                            <input
                              value={sec.label}
                              onChange={(e) => {
                                const updated = [...selectedComponent.sections]
                                updated[idx].label = e.target.value
                                setSelectedComponent({ ...selectedComponent, sections: updated })
                              }}
                              className="border border-gray-300 dark:border-gray-600 rounded px-2 py-1 text-sm"
                            />

                            {/* Selector de página */}
                            <select
                              value={sec.route}
                              onChange={(e) => {
                                const updated = [...selectedComponent.sections]
                                updated[idx].route = e.target.value
                                setSelectedComponent({ ...selectedComponent, sections: updated })
                              }}
                              className="border border-gray-300 dark:border-gray-600 rounded px-2 py-1 text-sm"
                            >
                              <option value="">—</option>
                              {/** Muestra las páginas del proyecto */}
                              {Array.isArray(project?.pages) &&
                                project.pages.map((page: any) => (
                                  <option key={page.id} value={page.id}>
                                    {page.name}
                                  </option>
                                ))}
                            </select>
                          </div>
                        ))}
                        <div className="flex justify-center mt-4">
                          <Button
                            onClick={addNewSection}
                            className="text-sm px-4 py-2 rounded w-full transition"
                          >
                            + Agregar sección
                          </Button>
                        </div>
                        <div className='h-52'>
                        </div>

                      </div>
                    )}
                    {selectedComponent.type === 'login' && (
                      <div className="space-y-6">

                        {/* Card Settings */}
                        <div className="space-y-3 border-b pb-4">
                          <h3 className="text-sm font-semibold text-primary mb-2">Card</h3>

                          {/* Background color */}
                          <div className="flex items-center justify-between gap-2">
                            <label className="text-gray-600 dark:text-gray-300 w-28">Color fondo:</label>
                            <input
                              type="color"
                              value={selectedComponent.card.backgroundColor ?? '#ffffff'}
                              onChange={(e) => {
                                setSelectedComponent({
                                  ...selectedComponent,
                                  card: { ...selectedComponent.card, backgroundColor: e.target.value }
                                })
                              }}
                              className="w-10 h-6 rounded border border-gray-300 dark:border-gray-600"
                            />
                          </div>

                          {/* Radio bordes */}
                          <div className="flex items-center justify-between gap-2">
                            <label className="text-gray-600 dark:text-gray-300 w-28">Radio bordes:</label>
                            <input
                              type="number"
                              min={0}
                              value={parseInt(selectedComponent.card.borderRadius?.replace('px', '') ?? '8')}
                              onChange={(e) => {
                                setSelectedComponent({
                                  ...selectedComponent,
                                  card: { ...selectedComponent.card, borderRadius: `${e.target.value}px` }
                                })
                              }}
                              className="flex-1 border border-gray-300 dark:border-gray-600 rounded px-2 py-1 text-sm"
                            />
                          </div>
                        </div>

                        {/* Title */}
                        <div className="space-y-3 border-b pb-4">
                          <h3 className="text-sm font-semibold text-primary mb-2">Título</h3>
                          <div className="flex items-center justify-between gap-2">
                            <label className="text-gray-600 dark:text-gray-300 w-28">Texto:</label>
                            <input
                              value={selectedComponent.title.text}
                              onChange={(e) => {
                                setSelectedComponent({
                                  ...selectedComponent,
                                  title: { ...selectedComponent.title, text: e.target.value }
                                })
                              }}
                              className="flex-1 border border-gray-300 dark:border-gray-600 rounded px-2 py-1 text-sm"
                            />
                          </div>
                        </div>

                        {/* Subtitle */}
                        <div className="space-y-3 border-b pb-4">
                          <h3 className="text-sm font-semibold text-primary mb-2">Subtítulo</h3>
                          <div className="flex items-center justify-between gap-2">
                            <label className="text-gray-600 dark:text-gray-300 w-28">Texto:</label>
                            <input
                              value={selectedComponent.subtitle.text}
                              onChange={(e) => {
                                setSelectedComponent({
                                  ...selectedComponent,
                                  subtitle: { ...selectedComponent.subtitle, text: e.target.value }
                                })
                              }}
                              className="flex-1 border border-gray-300 dark:border-gray-600 rounded px-2 py-1 text-sm"
                            />
                          </div>
                        </div>
                        {/* Botones Settings */}
                        <div className="space-y-4 border-b pb-4">
                          <h3 className="text-sm font-semibold text-primary mb-2">Botones</h3>

                          <div className="grid grid-cols-2 gap-2 items-center text-xs font-semibold text-gray-600 dark:text-gray-300">
                            <span>Texto</span>
                            <span>Ruta</span>
                          </div>

                          {/* Login Button */}
                          <div className="space-y-2">
                            <div className="grid grid-cols-2 gap-2">
                              <input
                                value={selectedComponent.loginButton.label}
                                onChange={(e) => {
                                  setSelectedComponent({
                                    ...selectedComponent,
                                    loginButton: { ...selectedComponent.loginButton, label: e.target.value }
                                  })
                                }}
                                className="border border-gray-300 dark:border-gray-600 rounded px-2 py-1 text-sm"
                              />
                              <select
                                value={selectedComponent.loginButton.route ?? ''}
                                onChange={(e) => {
                                  setSelectedComponent({
                                    ...selectedComponent,
                                    loginButton: { ...selectedComponent.loginButton, route: e.target.value }
                                  })
                                }}
                                className="border border-gray-300 dark:border-gray-600 rounded px-2 py-1 text-sm"
                              >
                                <option value="">—</option>
                                {Array.isArray(project?.pages) && project.pages.map((page: any) => (
                                  <option key={page.id} value={page.id}>
                                    {page.name}
                                  </option>
                                ))}
                              </select>
                            </div>

                            {/* Color fondo */}
                            <div className="flex items-center justify-between gap-2">
                              <label className="text-gray-600 dark:text-gray-300 text-xs w-28">Color fondo:</label>
                              <input
                                type="color"
                                value={selectedComponent.loginButton.backgroundColor ?? '#2563eb'}
                                onChange={(e) => {
                                  setSelectedComponent({
                                    ...selectedComponent,
                                    loginButton: { ...selectedComponent.loginButton, backgroundColor: e.target.value }
                                  })
                                }}
                                className="w-10 h-6 rounded border border-gray-300 dark:border-gray-600"
                              />
                            </div>
                          </div>

                          {/* Google Button */}
                          <div className="space-y-2 mt-4">
                            <div className="grid grid-cols-2 gap-2">
                              <input
                                value={selectedComponent.googleButton.label}
                                onChange={(e) => {
                                  setSelectedComponent({
                                    ...selectedComponent,
                                    googleButton: { ...selectedComponent.googleButton, label: e.target.value }
                                  })
                                }}
                                className="border border-gray-300 dark:border-gray-600 rounded px-2 py-1 text-sm"
                              />
                              <select
                                value={selectedComponent.googleButton.route ?? ''}
                                onChange={(e) => {
                                  setSelectedComponent({
                                    ...selectedComponent,
                                    googleButton: { ...selectedComponent.googleButton, route: e.target.value }
                                  })
                                }}
                                className="border border-gray-300 dark:border-gray-600 rounded px-2 py-1 text-sm"
                              >
                                <option value="">—</option>
                                {Array.isArray(project?.pages) && project.pages.map((page: any) => (
                                  <option key={page.id} value={page.id}>
                                    {page.name}
                                  </option>
                                ))}
                              </select>
                            </div>

                            {/* Color fondo */}
                            <div className="flex items-center justify-between gap-2">
                              <label className="text-gray-600 dark:text-gray-300 text-xs w-28">Color fondo:</label>
                              <input
                                type="color"
                                value={selectedComponent.googleButton.backgroundColor ?? '#ea4335'}
                                onChange={(e) => {
                                  setSelectedComponent({
                                    ...selectedComponent,
                                    googleButton: { ...selectedComponent.googleButton, backgroundColor: e.target.value }
                                  })
                                }}
                                className="w-10 h-6 rounded border border-gray-300 dark:border-gray-600"
                              />
                            </div>
                          </div>

                          {/* SignUp Button */}
                          <div className="space-y-2 mt-4">
                            <div className="grid grid-cols-2 gap-2">
                              <input
                                value={selectedComponent.signupLink.text}
                                onChange={(e) => {
                                  setSelectedComponent({
                                    ...selectedComponent,
                                    signupLink: { ...selectedComponent.signupLink, text: e.target.value }
                                  })
                                }}
                                className="border border-gray-300 dark:border-gray-600 rounded px-2 py-1 text-sm"
                              />
                              <select
                                value={selectedComponent.signupLink.route ?? ''}
                                onChange={(e) => {
                                  setSelectedComponent({
                                    ...selectedComponent,
                                    signupLink: { ...selectedComponent.signupLink, route: e.target.value }
                                  })
                                }}
                                className="border border-gray-300 dark:border-gray-600 rounded px-2 py-1 text-sm"
                              >
                                <option value="">—</option>
                                {Array.isArray(project?.pages) && project.pages.map((page: any) => (
                                  <option key={page.id} value={page.id}>
                                    {page.name}
                                  </option>
                                ))}
                              </select>
                            </div>

                            {/* Color fondo */}
                            <div className="flex items-center justify-between gap-2">
                              <label className="text-gray-600 dark:text-gray-300 text-xs w-28">Color fondo:</label>
                              <input
                                type="color"
                                value={selectedComponent.signupLink.backgroundColor ?? '#10b981'}
                                onChange={(e) => {
                                  setSelectedComponent({
                                    ...selectedComponent,
                                    signupLink: { ...selectedComponent.signupLink, backgroundColor: e.target.value }
                                  })
                                }}
                                className="w-10 h-6 rounded border border-gray-300 dark:border-gray-600"
                              />
                            </div>
                          </div>

                        </div>

                        {/* Inputs Settings */}
                        <div className="space-y-4">
                          <h3 className="text-sm font-semibold text-primary mb-2">Inputs</h3>

                          {/* Input Email */}
                          <div className="space-y-2">
                            <label className="text-gray-600 dark:text-gray-300 text-xs">Placeholder Email</label>
                            <input
                              value={selectedComponent.emailInput.placeholder}
                              onChange={(e) => {
                                setSelectedComponent({
                                  ...selectedComponent,
                                  emailInput: { ...selectedComponent.emailInput, placeholder: e.target.value }
                                })
                              }}
                              className="border border-gray-300 dark:border-gray-600 rounded px-2 py-1 text-sm w-full"
                            />
                          </div>

                          {/* Input Password */}
                          <div className="space-y-2 mt-2">
                            <label className="text-gray-600 dark:text-gray-300 text-xs">Placeholder Password</label>
                            <input
                              value={selectedComponent.passwordInput.placeholder}
                              onChange={(e) => {
                                setSelectedComponent({
                                  ...selectedComponent,
                                  passwordInput: { ...selectedComponent.passwordInput, placeholder: e.target.value }
                                })
                              }}
                              className="border border-gray-300 dark:border-gray-600 rounded px-2 py-1 text-sm w-full"
                            />
                          </div>
                        </div>

                      </div>
                    )}

                    {/* Para Header */}
                    {selectedComponent.type === 'header' && (
                      <div className="space-y-4">
                        {/* Background color */}
                        <div className="flex items-center justify-between gap-2">
                          <label className="text-gray-600 dark:text-gray-300 w-28">Color fondo:</label>
                          <input
                            type="color"
                            value={selectedComponent.backgroundColor ?? '#0f172a'}
                            onChange={(e) => {
                              setSelectedComponent({ ...selectedComponent, backgroundColor: e.target.value })
                            }}
                            className="w-10 h-6 rounded border border-gray-300 dark:border-gray-600"
                          />
                        </div>

                        {/* Color de sección activa */}
                        <div className="flex items-center justify-between gap-2">
                          <label className="text-gray-600 dark:text-gray-300 w-28">Color activo:</label>
                          <input
                            type="color"
                            value={selectedComponent.activeColor ?? '#3b82f6'}
                            onChange={(e) => {
                              setSelectedComponent({ ...selectedComponent, activeColor: e.target.value })
                            }}
                            className="w-10 h-6 rounded border border-gray-300 dark:border-gray-600"
                          />
                        </div>

                        {/* Secciones del breadcrumb */}
                        <div className="space-y-2">
                          <div className="grid grid-cols-2 gap-2 items-center text-xs font-semibold text-gray-600 dark:text-gray-300">
                            <span>Label</span>
                            <span>Ruta</span>
                          </div>

                          {selectedComponent.sections.map((sec, idx) => (
                            <div key={idx} className="grid grid-cols-2 gap-2 items-center">
                              <input
                                value={sec.label}
                                onChange={(e) => {
                                  const updated = [...selectedComponent.sections]
                                  updated[idx].label = e.target.value
                                  setSelectedComponent({ ...selectedComponent, sections: updated })
                                }}
                                className="border border-gray-300 dark:border-gray-600 rounded px-2 py-1 text-sm"
                              />

                              <select
                                value={sec.route}
                                onChange={(e) => {
                                  const updated = [...selectedComponent.sections]
                                  updated[idx].route = e.target.value
                                  setSelectedComponent({ ...selectedComponent, sections: updated })
                                }}
                                className="border border-gray-300 dark:border-gray-600 rounded px-2 py-1 text-sm"
                              >
                                <option value="">—</option>
                                {Array.isArray(project?.pages) &&
                                  project.pages.map((page: any) => (
                                    <option key={page.id} value={page.id}>
                                      {page.name}
                                    </option>
                                  ))}
                              </select>
                            </div>
                          ))}

                          <div className="flex justify-center mt-4">
                            <Button
                              onClick={() => {
                                const updated = [...selectedComponent.sections, { label: 'Nuevo', route: '' }]
                                setSelectedComponent({ ...selectedComponent, sections: updated })
                              }}
                              className="text-sm px-4 py-2 rounded w-full transition"
                            >
                              + Agregar sección
                            </Button>
                          </div>
                        </div>

                        {/* Botones de acción (icon buttons) */}
                        <div className="space-y-2 mt-6">
                          <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Botones (Iconos)</h4>

                          {selectedComponent.buttons.map((btn, idx) => (
                            <div key={idx} className="flex items-center gap-2">
                              <button
                                onClick={() => {
                                  setEditingHeaderButtonIndex(idx)
                                  setIsHeaderButtonIconPickerOpen(true)
                                }}
                                className="border rounded flex items-center justify-center bg-gray-50 hover:bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 w-full h-10"
                              >
                                <i className={`fa fa-${btn.icon} text-lg`}></i>
                              </button>
                            </div>
                          ))}

                          <div className="flex justify-center mt-4">
                            <Button
                              onClick={() => {
                                const updated = [...selectedComponent.buttons, { icon: 'fa-bell' }]
                                setSelectedComponent({ ...selectedComponent, buttons: updated })
                              }}
                              className="text-sm px-4 py-2 rounded w-full transition"
                            >
                              + Agregar botón
                            </Button>
                          </div>
                        </div>
                        <div className='h-52'>
                        </div>
                      </div>
                    )}

                    {selectedComponent.type === 'login' && (
                      <div className="space-y-6">

                        {/* Card Settings */}
                        <div className="space-y-3 border-b pb-4">
                          <h3 className="text-sm font-semibold text-primary mb-2">Card</h3>

                          {/* Background color */}
                          <div className="flex items-center justify-between gap-2">
                            <label className="text-gray-600 dark:text-gray-300 w-28">Color fondo:</label>
                            <input
                              type="color"
                              value={selectedComponent.card.backgroundColor ?? '#ffffff'}
                              onChange={(e) => {
                                setSelectedComponent({
                                  ...selectedComponent,
                                  card: { ...selectedComponent.card, backgroundColor: e.target.value }
                                })
                              }}
                              className="w-10 h-6 rounded border border-gray-300 dark:border-gray-600"
                            />
                          </div>

                          {/* Radio bordes */}
                          <div className="flex items-center justify-between gap-2">
                            <label className="text-gray-600 dark:text-gray-300 w-28">Radio bordes:</label>
                            <input
                              type="number"
                              min={0}
                              value={parseInt(selectedComponent.card.borderRadius?.replace('px', '') ?? '8')}
                              onChange={(e) => {
                                setSelectedComponent({
                                  ...selectedComponent,
                                  card: { ...selectedComponent.card, borderRadius: `${e.target.value}px` }
                                })
                              }}
                              className="flex-1 border border-gray-300 dark:border-gray-600 rounded px-2 py-1 text-sm"
                            />
                          </div>
                        </div>

                        {/* Title Settings */}
                        <div className="space-y-3 border-b pb-4">
                          <h3 className="text-sm font-semibold text-primary mb-2">Título</h3>

                          {/* Texto del título */}
                          <div className="flex items-center justify-between gap-2">
                            <label className="text-gray-600 dark:text-gray-300 w-28">Texto:</label>
                            <input
                              value={selectedComponent.title.text}
                              onChange={(e) => {
                                setSelectedComponent({
                                  ...selectedComponent,
                                  title: { ...selectedComponent.title, text: e.target.value }
                                })
                              }}
                              className="flex-1 border border-gray-300 dark:border-gray-600 rounded px-2 py-1 text-sm"
                            />
                          </div>
                        </div>

                        {/* Subtitle Settings */}
                        <div className="space-y-3 border-b pb-4">
                          <h3 className="text-sm font-semibold text-primary mb-2">Subtítulo</h3>

                          {/* Texto subtítulo */}
                          <div className="flex items-center justify-between gap-2">
                            <label className="text-gray-600 dark:text-gray-300 w-28">Texto:</label>
                            <input
                              value={selectedComponent.subtitle.text}
                              onChange={(e) => {
                                setSelectedComponent({
                                  ...selectedComponent,
                                  subtitle: { ...selectedComponent.subtitle, text: e.target.value }
                                })
                              }}
                              className="flex-1 border border-gray-300 dark:border-gray-600 rounded px-2 py-1 text-sm"
                            />
                          </div>
                        </div>

                        {/* Botones Settings */}
                        <div className="space-y-3">
                          <h3 className="text-sm font-semibold text-primary mb-2">Botones</h3>

                          {/* Texto Login */}
                          <div className="flex items-center justify-between gap-2">
                            <label className="text-gray-600 dark:text-gray-300 w-28">Texto Login:</label>
                            <input
                              value={selectedComponent.loginButton.label}
                              onChange={(e) => {
                                setSelectedComponent({
                                  ...selectedComponent,
                                  loginButton: { ...selectedComponent.loginButton, label: e.target.value }
                                })
                              }}
                              className="flex-1 border border-gray-300 dark:border-gray-600 rounded px-2 py-1 text-sm"
                            />
                          </div>

                          {/* Texto Google */}
                          <div className="flex items-center justify-between gap-2">
                            <label className="text-gray-600 dark:text-gray-300 w-28">Texto Google:</label>
                            <input
                              value={selectedComponent.googleButton.label}
                              onChange={(e) => {
                                setSelectedComponent({
                                  ...selectedComponent,
                                  googleButton: { ...selectedComponent.googleButton, label: e.target.value }
                                })
                              }}
                              className="flex-1 border border-gray-300 dark:border-gray-600 rounded px-2 py-1 text-sm"
                            />
                          </div>

                          {/* Texto Sign Up */}
                          <div className="flex items-center justify-between gap-2">
                            <label className="text-gray-600 dark:text-gray-300 w-28">Texto registro:</label>
                            <input
                              value={selectedComponent.signupLink.text}
                              onChange={(e) => {
                                setSelectedComponent({
                                  ...selectedComponent,
                                  signupLink: { ...selectedComponent.signupLink, text: e.target.value }
                                })
                              }}
                              className="flex-1 border border-gray-300 dark:border-gray-600 rounded px-2 py-1 text-sm"
                            />
                          </div>
                        </div>
                        <div className='h-52'>
                        </div>
                      </div>
                    )}

                    {selectedComponent?.type === 'listar' && (
                      <div className="space-y-6">
                      {/* Herramientas Básicas */}
                      <div className="space-y-3 border-b pb-4">
                        <h3 className="text-sm font-semibold text-primary mb-2">Herramientas Básicas</h3>

                        {/* Posición X */}
                        <div className="flex items-center justify-between gap-2">
                          <label className="text-gray-600 dark:text-gray-300 w-full">X:</label>
                          <input
                            type="number"
                            value={selectedComponent.x ?? 0}
                            onChange={(e) => {
                              setSelectedComponent({
                                ...selectedComponent,
                                x: parseInt(e.target.value)
                              })
                            }}
                            className="flex-1 border border-gray-300 dark:border-gray-600 rounded px-2 py-1 text-sm"
                          />
                        </div>

                        {/* Posición Y */}
                        <div className="flex items-center justify-between gap-2">
                          <label className="text-gray-600 dark:text-gray-300 w-full">Y:</label>
                          <input
                            type="number"
                            value={selectedComponent.y ?? 0}
                            onChange={(e) => {
                              setSelectedComponent({
                                ...selectedComponent,
                                y: parseInt(e.target.value)
                              })
                            }}
                            className="flex-1 border border-gray-300 dark:border-gray-600 rounded px-2 py-1 text-sm"
                          />
                        </div>

                        {/* Ancho (Width) */}
                        <div className="flex items-center justify-between gap-2">
                          <label className="text-gray-600 dark:text-gray-300 w-full">Ancho:</label>
                          <input
                            type="number"
                            value={selectedComponent.width ?? 300}
                            onChange={(e) => {
                              setSelectedComponent({
                                ...selectedComponent,
                                width: parseInt(e.target.value)
                              })
                            }}
                            className="flex-1 border border-gray-300 dark:border-gray-600 rounded px-2 py-1 text-sm"
                          />
                        </div>

                        {/* Alto (Height) */}
                        <div className="flex items-center justify-between gap-2">
                          <label className="text-gray-600 dark:text-gray-300 w-full">Alto:</label>
                          <input
                            type="number"
                            value={selectedComponent.height ?? 150}
                            onChange={(e) => {
                              setSelectedComponent({
                                ...selectedComponent,
                                height: parseInt(e.target.value)
                              })
                            }}
                            className="flex-1 border border-gray-300 dark:border-gray-600 rounded px-2 py-1 text-sm"
                          />
                        </div>
                      </div>
                        {/* Herramientas de Button */}
                        <div className="space-y-3 border-b pb-4">
                          <h3 className="text-sm font-semibold text-primary mb-2">Herramientas de Botón</h3>

                          {/* Texto del botón */}
                          <div className="flex items-center justify-between gap-2">
                            <label className="text-gray-600 dark:text-gray-300 w-28">Texto:</label>
                            <input
                              value={selectedComponent.button.label}
                              onChange={(e) => {
                                setSelectedComponent({
                                  ...selectedComponent,
                                  button: { ...selectedComponent.button, label: e.target.value }
                                })
                              }}
                              className="flex-1 border border-gray-300 dark:border-gray-600 rounded px-2 py-1 text-sm"
                            />
                          </div>

                          {/* Color fondo del botón */}
                          <div className="flex items-center justify-between gap-2">
                            <label className="text-gray-600 dark:text-gray-300 w-28">Color fondo:</label>
                            <input
                              type="color"
                              value={selectedComponent.button.backgroundColor ?? '#2563eb'}
                              onChange={(e) => {
                                setSelectedComponent({
                                  ...selectedComponent,
                                  button: { ...selectedComponent.button, backgroundColor: e.target.value }
                                })
                              }}
                              className="w-10 h-6 rounded border border-gray-300 dark:border-gray-600"
                            />
                          </div>

                          {/* Bordes */}
                          <div className="flex items-center justify-between gap-2">
                            <label className="text-gray-600 dark:text-gray-300 w-28">Bordes:</label>
                            <input
                              type="number"
                              min={0}
                              value={parseInt(selectedComponent.button.borderRadius ?? '6')}
                              onChange={(e) => {
                                const radius = `${e.target.value}px`
                                setSelectedComponent({
                                  ...selectedComponent,
                                  button: { ...selectedComponent.button, borderRadius: radius }
                                })
                              }}
                              className="flex-1 border border-gray-300 dark:border-gray-600 rounded px-2 py-1 text-sm"
                            />
                          </div>
                        </div>
                        {/* Herramientas de Label (Título) */}
                        <div className="space-y-3 border-b pb-4">
                          <h3 className="text-sm font-semibold text-primary mb-2">Herramientas de Título</h3>

                          {/* Texto del título */}
                          <div className="flex items-center justify-between gap-2">
                            <label className="text-gray-600 dark:text-gray-300 w-full">Título:</label>
                            <input
                              value={selectedComponent.label.text}
                              onChange={(e) => {
                                setSelectedComponent({
                                  ...selectedComponent,
                                  label: { ...selectedComponent.label, text: e.target.value }
                                })
                              }}
                              className="flex-1 border border-gray-300 dark:border-gray-600 rounded px-2 py-1 text-sm"
                            />
                          </div>
                        </div>
                        {/* Herramientas de DataTable */}
                        <div className="space-y-3 border-b pb-4">
                          <h3 className="text-sm font-semibold text-primary mb-2">Herramientas de DataTable</h3>

                          {/* Color fondo tabla */}
                          <div className="flex items-center justify-between gap-2">
                            <label className="text-gray-600 dark:text-gray-300 w-28">Fondo tabla:</label>
                            <input
                              type="color"
                              value={selectedComponent.dataTable.backgroundColor ?? '#ffffff'}
                              onChange={(e) => {
                                setSelectedComponent({
                                  ...selectedComponent,
                                  dataTable: { ...selectedComponent.dataTable, backgroundColor: e.target.value }
                                })
                              }}
                              className="w-10 h-6 rounded border border-gray-300 dark:border-gray-600"
                            />
                          </div>

                          {/* Editor columnas y filas */}
                          <button
                            onClick={() => { setOpenEditor(true) }}
                            className="w-full px-4 py-2 text-sm rounded bg-indigo-600 text-white hover:bg-indigo-700"
                          >
                            Editar columnas y filas
                          </button>

                          {/* Dialogo Editor DataTable */}
                          <Dialog open={openEditor} onOpenChange={setOpenEditor}>
                            <DialogContent>
                              <DialogTitle>Editor de DataTable</DialogTitle>

                              <div className="space-y-4">
                                {/* Cabeceras */}
                                <div>
                                  <label className="block text-sm font-medium">Cabeceras:</label>
                                  {selectedComponent.dataTable.headers.map((h, idx) => (
                                    <div key={idx} className="flex gap-2 items-center mt-1">
                                      <input
                                        value={h}
                                        onChange={(e) => {
                                          const headers = [...selectedComponent.dataTable.headers]
                                          headers[idx] = e.target.value
                                          setSelectedComponent({
                                            ...selectedComponent,
                                            dataTable: { ...selectedComponent.dataTable, headers }
                                          })
                                        }}
                                        className="flex-1 border px-2 py-1 rounded text-sm"
                                      />
                                      <button
                                        onClick={() => {
                                          const headers = [...selectedComponent.dataTable.headers]
                                          headers.splice(idx, 1)
                                          const rows = selectedComponent.dataTable.rows.map(row => {
                                            const newRow = [...row]
                                            newRow.splice(idx, 1)
                                            return newRow
                                          })
                                          setSelectedComponent({
                                            ...selectedComponent,
                                            dataTable: { ...selectedComponent.dataTable, headers, rows }
                                          })
                                        }}
                                        className="text-red-600 hover:text-red-800"
                                        title="Eliminar columna"
                                      >
                                        ✖
                                      </button>
                                    </div>
                                  ))}
                                  <button
                                    onClick={() => {
                                      setSelectedComponent({
                                        ...selectedComponent,
                                        dataTable: {
                                          ...selectedComponent.dataTable,
                                          headers: [...selectedComponent.dataTable.headers, 'Nueva columna'],
                                          rows: selectedComponent.dataTable.rows.map(row => [...row, ''])
                                        }
                                      })
                                    }}
                                    className="text-sm text-blue-600 hover:underline mt-2"
                                  >
                                    + Agregar columna
                                  </button>
                                </div>

                                {/* Filas */}
                                <div>
                                  <label className="block text-sm font-medium mt-4">Filas:</label>
                                  {selectedComponent.dataTable.rows.map((row, rIdx) => (
                                    <div key={rIdx} className="grid grid-cols-[1fr_auto] gap-2 mb-2">
                                      <div className="grid grid-cols-3 gap-2">
                                        {row.map((cell, cIdx) => (
                                          <input
                                            key={cIdx}
                                            value={cell}
                                            onChange={(e) => {
                                              const rows = [...selectedComponent.dataTable.rows]
                                              rows[rIdx][cIdx] = e.target.value
                                              setSelectedComponent({
                                                ...selectedComponent,
                                                dataTable: { ...selectedComponent.dataTable, rows }
                                              })
                                            }}
                                            className="border px-2 py-1 text-sm rounded"
                                          />
                                        ))}
                                      </div>
                                      <button
                                        onClick={() => {
                                          const rows = [...selectedComponent.dataTable.rows]
                                          rows.splice(rIdx, 1)
                                          setSelectedComponent({
                                            ...selectedComponent,
                                            dataTable: { ...selectedComponent.dataTable, rows }
                                          })
                                        }}
                                        className="text-red-600 hover:text-red-800 self-start"
                                        title="Eliminar fila"
                                      >
                                        ✖
                                      </button>
                                    </div>
                                  ))}
                                  <button
                                    onClick={() => {
                                      setSelectedComponent({
                                        ...selectedComponent,
                                        dataTable: {
                                          ...selectedComponent.dataTable,
                                          rows: [...selectedComponent.dataTable.rows, selectedComponent.dataTable.headers.map(() => '')]
                                        }
                                      })
                                    }}
                                    className="text-sm text-blue-600 hover:underline"
                                  >
                                    + Agregar fila
                                  </button>
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>
                        </div>

                        {/* Herramientas de Search */}
                        <div className="space-y-3 border-b pb-4">
                          <h3 className="text-sm font-semibold text-primary mb-2">Herramientas de Buscador</h3>

                          <div className="flex items-center justify-between gap-2">
                            <label className="text-gray-600 dark:text-gray-300 w-28">Placeholder:</label>
                            <input
                              value={selectedComponent.search.placeholder}
                              onChange={(e) => {
                                setSelectedComponent({
                                  ...selectedComponent,
                                  search: { ...selectedComponent.search, placeholder: e.target.value }
                                })
                              }}
                              className="flex-1 border border-gray-300 dark:border-gray-600 rounded px-2 py-1 text-sm"
                            />
                          </div>
                        </div>

                        {/* Herramientas de Paginación */}
                        <div className="space-y-3">
                          <h3 className="text-sm font-semibold text-primary mb-2">Herramientas de Paginación</h3>

                          <div className="flex items-center justify-between gap-2">
                            <label className="text-gray-600 dark:text-gray-300 w-28">Páginas:</label>
                            <input
                              type="number"
                              min={1}
                              value={selectedComponent.pagination.totalPages}
                              onChange={(e) => {
                                setSelectedComponent({
                                  ...selectedComponent,
                                  pagination: { ...selectedComponent.pagination, totalPages: parseInt(e.target.value) }
                                })
                              }}
                              className="flex-1 border border-gray-300 dark:border-gray-600 rounded px-2 py-1 text-sm"
                            />
                          </div>
                        </div>
                        {/* Herramientas de Dialog */}
                        <div className="space-y-3 border-b pb-4">
                          <h3 className="text-sm font-semibold text-primary mb-2">Herramientas de Dialog</h3>

                          {selectedComponent.dialog.fields.map((field, idx) => (
                            <div key={idx} className="border p-3 rounded-md space-y-2 relative bg-gray-50 dark:bg-gray-800">

                              {/* Botón eliminar campo */}
                              <button
                                onClick={() => {
                                  const fields = [...selectedComponent.dialog.fields]
                                  fields.splice(idx, 1)
                                  setSelectedComponent({
                                    ...selectedComponent,
                                    dialog: { ...selectedComponent.dialog, fields }
                                  })
                                }}
                                className="absolute top-2 right-2 text-red-600 hover:text-red-800"
                                title="Eliminar campo"
                              >
                                ✖
                              </button>

                              {/* Editar label */}
                              <div className="flex flex-col gap-1">
                                <label className="text-gray-600 dark:text-gray-300 w-24">Label:</label>
                                <input
                                  value={field.label}
                                  onChange={(e) => {
                                    const fields = [...selectedComponent.dialog.fields]
                                    fields[idx].label = e.target.value
                                    setSelectedComponent({
                                      ...selectedComponent,
                                      dialog: { ...selectedComponent.dialog, fields }
                                    })
                                  }}
                                  className="flex-1 border border-gray-300 dark:border-gray-600 rounded px-2 py-1 text-sm"
                                />
                              </div>

                              {/* Mostrar opciones según tipo de campo */}
                              {field.type.type === 'input' && (
                                <>
                                  {/* Placeholder input */}
                                  <div className="flex flex-col gap-1">
                                    <label className="text-gray-600 dark:text-gray-300 w-24">Placeholder:</label>
                                    <input
                                      value={field.type.placeholder ?? ''}
                                      onChange={(e) => {
                                        const fields = [...selectedComponent.dialog.fields]
                                        if (fields[idx].type.type === 'input') { // Verifica que sea de tipo 'input'
                                          (fields[idx].type).placeholder = e.target.value
                                          setSelectedComponent({
                                            ...selectedComponent,
                                            dialog: { ...selectedComponent.dialog, fields }
                                          })
                                        }
                                      }}
                                      className="flex-1 border border-gray-300 dark:border-gray-600 rounded px-2 py-1 text-sm"
                                    />
                                  </div>
                                </>
                              )}

                              {field.type.type === 'select' && (
                                <>
                                  {/* Opciones del select */}
                                  <div className="space-y-2">
                                    <label className="text-gray-600 dark:text-gray-300">Opciones:</label>
                                    {field.type.options.map((option, optIdx) => (
                                      <div key={optIdx} className="flex items-center gap-2">
                                        <input
                                          value={option}
                                          onChange={(e) => {
                                            const fields = [...selectedComponent.dialog.fields]
                                            if (fields[idx].type.type === 'select') { // Verifica que sea de tipo 'select'
                                              (fields[idx].type).options[optIdx] = e.target.value
                                              setSelectedComponent({
                                                ...selectedComponent,
                                                dialog: { ...selectedComponent.dialog, fields }
                                              })
                                            }
                                          }}
                                          className="flex-1 border border-gray-300 dark:border-gray-600 rounded px-2 py-1 text-sm"
                                        />
                                        <button
                                          onClick={() => {
                                            const fields = [...selectedComponent.dialog.fields]
                                            if (fields[idx].type.type === 'select') { // Verifica que sea de tipo 'select'
                                              (fields[idx].type).options.splice(optIdx, 1)
                                              setSelectedComponent({
                                                ...selectedComponent,
                                                dialog: { ...selectedComponent.dialog, fields }
                                              })
                                            }
                                          }}
                                          className="text-red-600 hover:text-red-800"
                                          title="Eliminar opción"
                                        >
                                          ✖
                                        </button>
                                      </div>
                                    ))}
                                    <button
                                      onClick={() => {
                                        const fields = [...selectedComponent.dialog.fields]
                                        if (fields[idx].type.type === 'select') { // Verifica que sea de tipo 'select'
                                          (fields[idx].type).options.push('Nueva opción')
                                          setSelectedComponent({
                                            ...selectedComponent,
                                            dialog: { ...selectedComponent.dialog, fields }
                                          })
                                        }
                                      }}
                                      className="text-sm text-blue-600 hover:underline"
                                    >
                                      + Agregar opción
                                    </button>
                                  </div>
                                </>
                              )}
                            </div>
                          ))}

                          {/* Botones para agregar nuevo Input o Select */}
                          <div className="flex gap-2 pt-2">
                            <button
                              onClick={() => {
                                setSelectedComponent({
                                  ...selectedComponent,
                                  dialog: {
                                    ...selectedComponent.dialog,
                                    fields: [
                                      ...selectedComponent.dialog.fields,
                                      {
                                        label: 'Nuevo Input',
                                        type: {
                                          id: `${Date.now()}-input`,
                                          type: 'input',
                                          x: 0,
                                          y: 0,
                                          width: 300,
                                          height: 40,
                                          styles: 'border border-gray-300 rounded px-2 py-1',
                                          placeholder: 'Ingrese texto',
                                          value: ''
                                        }
                                      }
                                    ]
                                  }
                                })
                              }}
                              className="flex-1 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 text-sm"
                            >
                              + Input
                            </button>

                            <button
                              onClick={() => {
                                setSelectedComponent({
                                  ...selectedComponent,
                                  dialog: {
                                    ...selectedComponent.dialog,
                                    fields: [
                                      ...selectedComponent.dialog.fields,
                                      {
                                        label: 'Nuevo Select',
                                        type: {
                                          id: `${Date.now()}-select`,
                                          type: 'select',
                                          x: 0,
                                          y: 0,
                                          width: 300,
                                          height: 40,
                                          styles: 'border border-gray-300 rounded px-2 py-1',
                                          options: ['Opción 1', 'Opción 2'],
                                          value: ''
                                        }
                                      }
                                    ]
                                  }
                                })
                              }}
                              className="flex-1 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm"
                            >
                              + Select
                            </button>
                          </div>
                        </div>
                        <div className='h-52'>
                        </div>
                      </div>
                    )}

                </div>
            </CollapsibleContent>
          </Collapsible>
        )}
        {isIconPickerOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-lg max-w-md w-full grid grid-cols-5 gap-4">
              {/* Aquí listamos los iconos disponibles */}
              {iconList.map((iconName) => (
                <button
                  key={iconName}
                  onClick={() => { selectIcon(iconName) }}
                  className="text-2xl hover:text-purple-500"
                >
                  <i className={`fa fa-${iconName}`}></i>
                </button>
              ))}
              <div className="col-span-5 flex justify-end mt-4">
                <button
                  onClick={() => { setIsIconPickerOpen(false) }}
                  className="text-sm px-3 py-1 rounded bg-red-500 text-white hover:bg-red-600"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        )}
        {isTitleIconPickerOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-lg max-w-md w-full grid grid-cols-5 gap-4">
              {iconList.map((iconName) => (
                <button
                  key={iconName}
                  onClick={() => { selectTitleIcon(iconName) }}
                  className="text-2xl hover:text-purple-500"
                >
                  <i className={`fa fa-${iconName}`}></i>
                </button>
              ))}
              <div className="col-span-5 flex justify-end mt-4">
                <button
                  onClick={() => { setIsTitleIconPickerOpen(false) }}
                  className="text-sm px-3 py-1 rounded bg-red-500 text-white hover:bg-red-600"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        )}
        {isHeaderButtonIconPickerOpen && editingHeaderButtonIndex !== null && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-lg max-w-md w-full grid grid-cols-5 gap-4">
              {iconList.map((iconName) => (
                <button
                  key={iconName}
                  onClick={() => {
                    if (selectedComponent?.type === 'header' && editingHeaderButtonIndex !== null) {
                      const updated = [...selectedComponent.buttons]
                      updated[editingHeaderButtonIndex].icon = iconName
                      setSelectedComponent({
                        ...selectedComponent,
                        buttons: updated
                      })
                      setIsHeaderButtonIconPickerOpen(false)
                      setEditingHeaderButtonIndex(null)
                    }
                  }}
                  className="text-2xl hover:text-purple-500"
                >
                  <i className={`fa fa-${iconName}`}></i>
                </button>
              ))}
              <div className="col-span-5 flex justify-end mt-4">
                <button
                  onClick={() => {
                    setIsHeaderButtonIconPickerOpen(false)
                    setEditingHeaderButtonIndex(null)
                  }}
                  className="text-sm px-3 py-1 rounded bg-red-500 text-white hover:bg-red-600"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        )}
        {selectedComponent?.type === 'datatable' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between gap-2">
              <label className="text-sm font-medium">Color de fondo:</label>
              <input
                type="color"
                value={selectedComponent.backgroundColor ?? '#ffffff'}
                onChange={(e) => {
                  setSelectedComponent({
                    ...selectedComponent,
                    backgroundColor: e.target.value
                  })
                }}
              />
            </div>

            <button
              onClick={() => { setOpenEditor(true) }}
              className="w-full px-4 py-2 text-sm rounded bg-indigo-600 text-white hover:bg-indigo-700"
            >
              Editar columnas y filas
            </button>

            <Dialog open={openEditor} onOpenChange={setOpenEditor}>
              <DialogContent>
                <DialogTitle>Editor de DataTable</DialogTitle>

                <div className="space-y-3">
                  <label className="block text-sm font-medium">Cabeceras:</label>
                  {selectedComponent.headers.map((h, idx) => (
                    <div key={idx} className="flex gap-2 items-center mb-1">
                      <input
                        className="flex-1 border px-2 py-1 text-sm rounded"
                        value={h}
                        onChange={(e) => {
                          const headers = [...selectedComponent.headers]
                          headers[idx] = e.target.value
                          setSelectedComponent({ ...selectedComponent, headers })
                        }}
                      />
                      <button
                        onClick={() => {
                          const headers = [...selectedComponent.headers]
                          headers.splice(idx, 1)
                          const rows = selectedComponent.rows.map(row => {
                            const newRow = [...row]
                            newRow.splice(idx, 1)
                            return newRow
                          })
                          setSelectedComponent({ ...selectedComponent, headers, rows })
                        }}
                        className="text-red-600 hover:text-red-800"
                        title="Eliminar columna"
                      >
                        ✖
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={() => {
                      setSelectedComponent({
                        ...selectedComponent,
                        headers: [...selectedComponent.headers, 'Nueva columna'],
                        rows: selectedComponent.rows.map(row => [...row, ''])
                      })
                    }
                    }
                    className="text-sm text-blue-600 hover:underline"
                  >
                    + Agregar columna
                  </button>

                  <label className="block text-sm font-medium mt-4">Filas:</label>
                  {selectedComponent.rows.map((row, rowIndex) => (
                    <div key={rowIndex} className="grid grid-cols-[1fr_auto] gap-2 mb-2">
                      <div className="grid grid-cols-3 gap-2">
                        {row.map((cell, colIndex) => (
                          <input
                            key={colIndex}
                            className="border px-2 py-1 text-sm rounded"
                            value={cell}
                            onChange={(e) => {
                              const rows = [...selectedComponent.rows]
                              rows[rowIndex][colIndex] = e.target.value
                              setSelectedComponent({ ...selectedComponent, rows })
                            }}
                          />
                        ))}
                      </div>
                      <button
                        onClick={() => {
                          const rows = [...selectedComponent.rows]
                          rows.splice(rowIndex, 1)
                          setSelectedComponent({ ...selectedComponent, rows })
                        }}
                        className="text-red-600 hover:text-red-800 self-start"
                        title="Eliminar fila"
                      >
                        ✖
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={() => {
                      setSelectedComponent({
                        ...selectedComponent,
                        rows: [...selectedComponent.rows, selectedComponent.headers.map(() => '')]
                      })
                    }
                    }
                    className="text-sm text-blue-600 hover:underline"
                  >
                    + Agregar fila
                  </button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        )}

      </aside>
  )
}
