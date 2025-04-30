import { type Page } from '@/modules/projects/models/page.model'
import { Rnd } from 'react-rnd'
import { cn } from '@/lib/utils'
import { type ComponentItem } from './page'
import { useState } from 'react'
import { useComponentContext } from '@/context/ComponentContext'
import { getSocket } from '@/lib/socket'
import throttle from 'lodash.throttle'
const FRAME_W = 1537 // 👈 tu viewport base
const FRAME_H = 729

interface PageFrameProps {
  page: Page // Página que se está renderizando
  selected: boolean // Si la página está seleccionada
  onClick: () => void // Función para manejar el clic en la página
  setSelectedComponent: (component: ComponentItem | null) => void // Función para seleccionar un componente
  updateComponent: (
    pageIndex: number,
    compIndex: number,
    updated: ComponentItem
  ) => void
  handleDeleteComponent: (id: string) => void // Función para eliminar un componente
  onDrop: (e: React.DragEvent<HTMLDivElement>, id: string, scale: number) => void // Función para manejar el evento de soltar un componente
  onDragOver: (e: React.DragEvent<HTMLDivElement>) => void // Función para manejar el evento de arrastrar un componente
  scale: number
  currentPageId: string
  pageIndex: number
  currentProjectId: string
}
export default function PageFrame({
  page,
  selected,
  onClick,
  setSelectedComponent,
  updateComponent,
  handleDeleteComponent,
  onDrop,
  onDragOver,
  scale,
  currentPageId,
  pageIndex,
  currentProjectId
}: PageFrameProps) {
  let isDragging = false
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [openDialogs, setOpenDialogs] = useState<Record<string, boolean>>({})
  const toggleSidebar = () => { setIsSidebarOpen(prev => !prev) }
  const [openRowMenu, setOpenRowMenu] = useState<number | null>(null)
  const [formValues, setFormValues] = useState<Record<string, string>>({})
  const [, setEditRowIndex] = useState<number | null>(null)
  const [confirmDeleteRowIndex, setConfirmDeleteRowIndex] = useState<number | null>(null)
  const { setSelectedPage } = useComponentContext()
  const socket = getSocket()

  // 🔸 throttled → 1 frame cada 50 ms ( ≈ 20 fps )
  const emitMove = throttle((comp, x, y) => {
    socket?.emit('component_moving', {
      project_id: currentProjectId,
      page_id: page.id,
      component: { id: comp.id, x, y, width: comp.width, height: comp.height },
      origin: socket?.id
    })
  }, 50) // ⇠ ajusta a 30-60 ms si ves lag

  const emitResize = throttle((comp, w, h, x, y) => {
    socket?.emit('component_resizing', {
      project_id: currentProjectId,
      page_id: page.id,
      component: { id: comp.id, width: w, height: h, x, y },
      origin: socket?.id
    })
  }, 50)
  return (
    <div
      style={{ width: FRAME_W, height: FRAME_H }}
      className={cn(
        'relative shadow-lg border overflow-hidden bg-[#D9D9D9]',
        selected ? 'ring-2 ring-blue-500' : 'border-gray-400'
      )}
      onClick={(e) => {
        e.stopPropagation() // ⚡ Evitamos que el click se propague innecesariamente
        if (page.id !== currentPageId) {
          onClick() // 👉 sigue llamando tu función original (activar esta página)
        } else {
          setSelectedComponent(null) // 👉 deselecciona cualquier componente
          setSelectedPage(page) // 👉 selecciona esta página
        }
      }}
      onDrop={(e) => {
        e.preventDefault() // Evita el comportamiento predeterminado
        onDrop(e, page.id, scale) // Llama a la función pasada como prop con el id de la página
      }}
      onDragOver={(e) => {
        e.preventDefault() // Permite que el elemento sea soltado
        onDragOver(e) // Llama a la función pasada como prop
      }}
      onPointerDownCapture={() => {
        if (page.id !== currentPageId) { // aún no es la página activa
          onClick() // 1️⃣ selecciona la página
          /* Al detener la propagación evitamos que el hijo (<Rnd>) procese el
             evento y arranque un drag indebido                            */
        }
      }}
    >
      {/* Renderizar los componentes de la página */}
      {page.components.map((comp, index) => (
        <Rnd
          key={comp.id}
          size={{ width: comp.width, height: comp.height }}
          position={{ x: comp.x, y: comp.y }}
          scale={scale}
          disableDragging={page.id !== currentPageId}
          enableResizing={page.id === currentPageId}
          onClick={() => {
            if (page.id !== currentPageId) return
            if (!isDragging && page.id === currentPageId) { // Validar que la página sea la actual
              setSelectedPage(null)
              setSelectedComponent(comp)
            }
          }}
          onDrag={(_e, d) => {
            if (page.id !== currentPageId) return
            emitMove(comp, d.x, d.y) // 👈 envía frame
          }}
          onResize={(_e, _direction, ref, _delta, position) => {
            emitResize(
              comp,
              parseInt(ref.style.width),
              parseInt(ref.style.height),
              position.x,
              position.y
            )
          }}
          onDragStart={(e) => {
            if (page.id !== currentPageId) {
              e.preventDefault()
              return false
            }
            isDragging = true
          }}
          onDragStop={(_e, d) => {
            isDragging = false
            updateComponent(pageIndex, index, { ...comp, x: d.x, y: d.y })
            const socket = getSocket()
            socket?.emit('component_updated', {
              project_id: currentProjectId, // El id del proyecto activo
              page_id: page.id,
              component: {
                ...comp,
                x: d.x,
                y: d.y,
                width: comp.width,
                height: comp.height
              }
            })
          }}
          onResizeStop={(_e, _direction, ref, _delta, position) => {
            updateComponent(
              pageIndex,
              index, {
                ...comp,
                width: parseInt(ref.style.width),
                height: parseInt(ref.style.height),
                x: position.x,
                y: position.y
              })
            const socket = getSocket()
            socket?.emit('component_updated', {
              project_id: currentProjectId, // El id del proyecto activo
              page_id: page.id,
              component: {
                ...comp,
                x: position.x,
                y: position.y,
                width: parseInt(ref.style.width),
                height: parseInt(ref.style.height)
              }
            })
          }}
          bounds="parent"
        >
          <div className="h-full w-full relative">
            {/* Botón de eliminar */}
            {selected && (
              <button
                onClick={() => { handleDeleteComponent(comp.id) }}
                className="absolute top-0 right-0 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-bl hover:bg-red-600 z-10"
                title="Eliminar componente"
              >
                ×
              </button>
            )}

            {/* Contenido del componente */}
            {
            (() => {
              switch (comp.type) {
                case 'button':
                  return (
                    <button
                      className={cn(comp.styles)}
                      style={{
                        backgroundColor: comp.backgroundColor ?? '#2563eb',
                        borderRadius: comp.borderRadius ?? '0.375rem'
                      }}
                    >
                      {comp.label}
                    </button>
                  )
                case 'input':
                  return (
                    <input
                      className={cn(comp.styles)}
                      style={{
                        borderRadius: comp.borderRadius ?? '0.375rem'
                      }}
                      placeholder={comp.placeholder ?? ''}
                    />
                  )
                case 'sidebar':
                  // eslint-disable-next-line no-case-declarations
                  const titleIcon = comp.titleIcon ?? 'star' // icono del título
                  // eslint-disable-next-line no-case-declarations
                  const mainColor = comp.mainColor ?? '#a855f7' // color total (color principal)
                  // eslint-disable-next-line no-case-declarations
                  const asideBg = comp.asideBg ?? '#ffffff' // fondo del aside
                  return (
                    <div className="h-full w-full bg-white overflow-y-auto rounded shadow">
                      <aside className={cn(
                        'h-full flex flex-col border-r transition-all duration-300 ease-in-out',
                        isSidebarOpen ? 'w-64' : 'w-16'
                      )}
                      style={{ backgroundColor: asideBg, height: comp.height }}
                      >
                        {/* 🔼 Header */}
                        <div className="flex items-center justify-between px-4 py-3 border-b">
                          <div className="flex items-center gap-2">
                          <i className={`fa fa-${titleIcon} text-xl`} style={{ color: mainColor }}></i>
                            {isSidebarOpen && (
                              <h1 className="text-lg font-bold text-black truncate">
                                {comp.title || 'UI SKETCH'}
                              </h1>
                            )}
                          </div>

                          <button
                            onClick={toggleSidebar}
                            className="p-1 rounded hover:bg-gray-100 transition"
                            style={{ color: mainColor }}
                            title="Abrir/Cerrar menú"
                          >
                            <i className={`fa ${isSidebarOpen ? 'fa-angle-double-left' : 'fa-bars'} text-lg`}></i>
                          </button>
                        </div>

                        {/* 📌 Secciones */}
                        <nav className="flex-1 overflow-y-auto p-4 text-black  space-y-2 text-sm">
                          {comp.sections.map((sec, idx) => (
                            <a
                              key={idx}
                              // href={sec.route}
                              className={cn(
                                'flex items-center gap-2 px-3 py-2 rounded-md hover:bg-gray-100 transition',
                                comp.select === idx && 'font-semibold'
                              )}
                              style={{
                                backgroundColor: comp.select === idx ? `${mainColor}20` : undefined, // Le bajamos la opacidad
                                color: comp.select === idx ? mainColor : undefined
                              }}
                            >
                              <i className={`fa fa-${sec.icon} text-base`}></i>
                              {isSidebarOpen && sec.label}
                            </a>
                          ))}
                        </nav>

                        {/* ⚙️ Footer */}
                        <div className="p-4 border-t">
                          <button
                            className="w-full flex items-center justify-center gap-2 py-2 rounded hover:opacity-90"
                            style={{ backgroundColor: mainColor, color: 'white' }}
                          >
                            <i className="fa fa-gear"></i>
                            {isSidebarOpen && 'Configuración'}
                          </button>
                        </div>
                      </aside>
                    </div>
                  )
                case 'datatable':
                  return (
                      <div className="overflow-x-auto rounded-lg border border-gray-200 h-full shadow-sm"
                          style={{ backgroundColor: comp.backgroundColor }}
                      >
                        <table className="min-w-full divide-y divide-gray-200  text-sm text-left text-gray-800"
                        >
                          <thead className="bg-gray-100  text-xs font-semibold uppercase text-gray-600 ">
                            <tr>
                              {comp.headers.map((header, idx) => (
                                <th key={idx} className="px-4 py-3">{header}</th>
                              ))}
                              <th className="px-4 py-3 text-right">...</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-200">
                            {comp.rows.map((row, rIdx) => (
                              <tr key={rIdx} className="hover:bg-gray-50  transition">
                                {row.map((cell, cIdx) => (
                                  <td key={cIdx} className="px-4 py-3">{cell}</td>
                                ))}
                                <td className="relative px-4 py-3 text-right">
                                    <button
                                      className="text-gray-500 hover:text-gray-700"
                                      onClick={() => {
                                        setOpenRowMenu(openRowMenu === rIdx ? null : rIdx)
                                      }}
                                    >
                                      <i className="fa fa-ellipsis-v"></i>
                                    </button>

                                    {openRowMenu === rIdx && (
                                      <div className="absolute right-0 mt-2 w-32 bg-white border border-gray-200 rounded-md shadow-lg z-50">
                                        <button
                                          className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                                          onClick={() => {
                                            setOpenRowMenu(null)
                                          }}
                                        >
                                          Editar
                                        </button>
                                        <button
                                          className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-100"
                                          onClick={() => {
                                            const rows = [...comp.rows]
                                            rows.splice(rIdx, 1)
                                            updateComponent(pageIndex, index, { ...comp, rows })
                                            setOpenRowMenu(null)
                                          }}
                                        >
                                          Eliminar
                                        </button>
                                      </div>
                                    )}
                                  </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                  )
                case 'listar':
                  return (
                    <div
                      className="flex flex-col w-full gap-4 overflow-hidden"
                      style={{ backgroundColor: 'transparent', height: comp.height }}
                    >
                        {/* Encabezado: Label + Search + Button */}
                        <div className="flex justify-between items-center">
                          {/* Label */}
                          <span className={cn(comp.label.styles)}>
                            {comp.label.text}
                          </span>

                          <div className="flex gap-2 items-center">
                            {/* Search */}
                            <input
                              className={cn(comp.search.styles)}
                              style={{ height: '40px' }}
                              placeholder={comp.search.placeholder}
                            />
                            {/* Botón */}
                            <button
                              className={cn(comp.button.styles)}
                              style={{
                                backgroundColor: comp.button.backgroundColor ?? '#2563eb',
                                borderRadius: comp.button.borderRadius ?? '0.375rem',
                                height: '40px'
                              }}
                              onClick={() => {
                                setOpenDialogs(prev => ({ ...prev, [comp.id]: true }))
                              }}
                            >
                              {comp.button.label}
                            </button>
                          </div>
                        </div>

                        {/* DataTable */}
                        <div className="overflow-x-auto rounded-lg  h-full shadow-sm">
                          <table className="min-w-full divide-y divide-gray-200 text-sm text-left text-gray-800">
                            <thead className="bg-gray-100 text-xs font-semibold uppercase text-gray-600">
                              <tr>
                                {comp.dataTable.headers.map((header, idx) => (
                                  <th key={idx} className="px-4 py-3">{header}</th>
                                ))}
                                <th className="px-4 py-3 text-right">...</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200"
                              style={{ backgroundColor: comp.dataTable.backgroundColor }}
                            >
                              {comp.dataTable.rows.map((row, rIdx) => (
                                <tr key={rIdx} className="hover:bg-gray-50 transition">
                                  {row.map((cell, cIdx) => (
                                    <td key={cIdx} className="px-4 py-3">{cell}</td>
                                  ))}
                                  <td className="relative px-4 py-3 text-right">
                                    <button
                                      className="text-gray-500 hover:text-gray-700"
                                      onClick={() => {
                                        setOpenRowMenu(openRowMenu === rIdx ? null : rIdx)
                                      }}
                                    >
                                      <i className="fa fa-ellipsis-v"></i>
                                    </button>

                                    {openRowMenu === rIdx && (
                                      <div className="absolute right-0 mt-2 w-32 bg-white border border-gray-200 rounded-md shadow-lg z-50">
                                        <button
                                          className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                                          onClick={() => {
                                            const fields = comp.dialog.fields
                                            const row = comp.dataTable.rows[rIdx]
                                            const formData: Record<string, any> = {}
                                            fields.forEach((field, idx) => {
                                              formData[field.label] = row[idx]
                                            })
                                            setFormValues(formData)
                                            setEditRowIndex(rIdx)
                                            setOpenDialogs(prev => ({ ...prev, [comp.id]: true }))
                                            setOpenRowMenu(null)
                                          }}
                                        >
                                          Editar
                                        </button>
                                        <button
                                          className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-100"
                                          onClick={() => {
                                            setConfirmDeleteRowIndex(rIdx)
                                            setOpenRowMenu(null)
                                          }}
                                        >
                                          Eliminar
                                        </button>
                                      </div>
                                    )}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>

                        {/* Pagination */}
                        <div className="flex justify-end">
                        <div className="flex items-center justify-end space-x-2 text-sm text-black">
                          <button className="px-3 py-1 rounded hover:bg-gray-100 transition"
                           style={{ backgroundColor: comp.dataTable.backgroundColor }}
                          >
                            &lt; Previous
                          </button>

                          {[1, 2, 3].map((num) => (
                            <button
                              key={num}
                              className={cn(
                                'px-3 py-1 rounded',
                                comp.pagination.currentPage === num
                                  ? 'bg-white ring-2 ring-gray-300'
                                  : 'hover:bg-gray-100'
                              )}
                              onClick={() => {
                                setSelectedComponent({
                                  ...comp,
                                  pagination: {
                                    ...comp.pagination,
                                    currentPage: num
                                  }
                                })
                              }
                              }
                            >
                              {num}
                            </button>
                          ))}

                          <span className="px-2">…</span>

                          <button className="px-3 py-1 rounded hover:bg-gray-100 transition"
                          style={{ backgroundColor: comp.dataTable.backgroundColor }}
                          >
                            Next &gt;
                          </button>
                        </div>
                        </div>
                      </div>
                  )
                case 'header':
                  return (
                      <div
                        className={cn(comp.styles)}
                        style={{
                          backgroundColor: comp.backgroundColor ?? '#ffffff',
                          position: 'absolute',
                          width: '100%',
                          height: '100%',
                          padding: '1rem'
                        }}
                      >
                        {/* Breadcrumb */}
                        <div className="flex items-center space-x-2 text-sm">
                          {comp.sections.map((section, idx) => (
                            <div key={idx} className="flex items-center">
                              <a
                                href={section.route}
                                className="hover:underline"
                                style={{
                                  color: idx === comp.sections.length - 1 ? (comp.activeColor ?? '#3b82f6') : '#6b7280',
                                  fontWeight: idx === comp.sections.length - 1 ? 'bold' : 'normal'
                                }}
                              >
                                {section.label}
                              </a>
                              {idx < comp.sections.length - 1 && <span className="mx-2 text-gray-500">{'>'}</span>}
                            </div>
                          ))}
                        </div>

                        {/* Botones a la derecha */}
                        <div className="flex items-center space-x-4 ml-auto">
                          {comp.buttons.map((btn, idx) => (
                            <button key={idx} className="relative w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center hover:bg-slate-100">
                              <i className={`fa fa-${btn.icon} text-black`}></i>
                            </button>
                          ))}
                        </div>
                      </div>
                  )
                case 'select':
                  return (
                      <select
                        className={cn(comp.styles)}
                        value={comp.value}
                        onChange={(e) => {
                          const updated = { ...comp, value: e.target.value }
                          setSelectedComponent(updated)
                        }}
                      >
                        {comp.options.map((opt, i) => (
                          <option key={i} value={opt}>{opt}</option>
                        ))}
                      </select>
                  )
                case 'checklist':
                  return (
                      <div
                        className={cn(comp.styles)}
                        style={{
                          width: '100%',
                          height: '100%'
                        }}
                      >
                        {comp.title && (
                          <h3 className="font-semibold text-lg mb-2">{comp.title}</h3>
                        )}
                        <ul className="space-y-1">
                          {comp.items.map((item, idx) => (
                            <li key={idx} className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                checked={item.checked}
                                onChange={(e) => {
                                  const updatedItems = [...comp.items]
                                  updatedItems[idx].checked = e.target.checked
                                  setSelectedComponent({ ...comp, items: updatedItems })
                                }}
                              />
                              <span className={item.checked ? 'line-through text-gray-500' : ''}>
                                {item.label}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                  )
                case 'radiobutton':
                  return (
                      <div className={cn(comp.styles)}>
                        {comp.options.map((opt, idx) => (
                          <div key={idx} className="flex items-center gap-2">
                            <input
                              type="radio"
                              name={comp.name}
                              value={opt}
                              checked={comp.selected === opt}
                              onChange={() => {
                                const updated = { ...comp, selected: opt }
                                setSelectedComponent(updated)
                              }}
                            />
                            <label>{opt}</label>
                          </div>
                        ))}
                      </div>
                  )

                case 'login':
                  return (
                      <div
                        key={comp.id}
                        className={cn(comp.styles)}
                        style={{
                          position: 'absolute',
                          width: '100%',
                          height: '100%'
                        }}
                      >
                        {/* Card que envuelve todo */}
                        <div
                          className={cn(comp.card.styles)}
                          style={{
                            backgroundColor: comp.card.backgroundColor ?? '#ffffff',
                            borderRadius: comp.card.borderRadius ?? '0.5rem',
                            boxShadow: comp.card.shadow ? '0 2px 8px rgba(0,0,0,0.1)' : undefined,
                            width: '100%',
                            height: '100%',
                            padding: comp.card.padding ?? '1.5rem',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                        >
                          {/* Title */}
                          <h1 className={cn(comp.title.styles)}>
                            {comp.title.text}
                          </h1>

                          {/* Subtitle */}
                          <p className={cn(comp.subtitle.styles)}>
                            {comp.subtitle.text}
                          </p>

                          {/* Email Input */}
                          <input
                            className={cn(comp.emailInput.styles)}
                            style={{ width: '100%' }}
                            type="email"
                            placeholder={comp.emailInput.placeholder ?? 'Email'}
                            value={comp.emailInput.value ?? ''}
                            readOnly
                          />

                          {/* Password Input */}
                          <input
                            className={cn(comp.passwordInput.styles)}
                            style={{ width: '100%' }}
                            type="password"
                            placeholder="Password"
                            value={comp.passwordInput.value ?? ''}
                            readOnly
                          />

                          {/* Botón de Login */}
                          <button
                            className={cn(comp.loginButton.styles)}
                            style={{ backgroundColor: comp.loginButton.backgroundColor ?? '#000000', borderRadius: comp.loginButton.borderRadius ?? '0.375rem' }}
                          >
                            {comp.loginButton.label}
                          </button>

                          {/* Botón de Google */}
                          <button
                            className={cn(comp.googleButton.styles)}
                            style={{
                              backgroundColor: comp.googleButton.backgroundColor ?? '#ffffff',
                              borderRadius: comp.googleButton.borderRadius ?? '0.375rem',
                              border: '1px solid #e5e7eb' // borde grisecito
                            }}
                          >
                            {comp.googleButton.label}
                          </button>

                          {/* Link de signup */}
                          <p className={cn(comp.signupLink.styles)}>
                            {comp.signupLink.text}
                          </p>
                        </div>
                      </div>
                  )

                default:
                  return <div>Componente no soportado</div>
              }
            })()
          }

          </div>
        </Rnd>
      ))}
      {confirmDeleteRowIndex !== null && (
        <div className="absolute inset-0 z-[9999] flex items-center justify-center bg-black/40">
          <div className="bg-white p-6 rounded-lg shadow-lg w-[400px] space-y-4">
            <h2 className="text-xl font-semibold text-black mb-4">¿Estás seguro de eliminar esta fila?</h2>
            <div className="flex justify-end gap-2">
              <button
                className="px-4 py-2 rounded border border-gray-300 text-gray-600 hover:bg-gray-100"
                onClick={() => { setConfirmDeleteRowIndex(null) }}
              >
                Cancelar
              </button>
              <button
                className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
                onClick={() => {
                  const comp = page.components.find(c => c.type === 'listar')
                  if (!comp || comp.type !== 'listar') return
                  const rows = [...comp.dataTable.rows]
                  rows.splice(confirmDeleteRowIndex, 1)
                  updateComponent(pageIndex, page.components.findIndex(c => c.id === comp.id), {
                    ...comp,
                    dataTable: {
                      ...comp.dataTable,
                      rows
                    }
                  })
                  setConfirmDeleteRowIndex(null)
                }}
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
      {Object.entries(openDialogs).map(([compId, isOpen]) => {
        const comp = page.components.find(c => c.id === compId && c.type === 'listar')
        if (!isOpen || !comp || comp.type !== 'listar' || page.id !== currentPageId) return null
        // ⬆️ Aquí la diferencia principal: page.id === currentPageId
        // solo renderiza el Dialog si pertenece a la página activa

        return (
         <div
           key={compId}
           className="absolute inset-0 z-[9999] flex items-center justify-center bg-black/40"
         >
          <div className="bg-white  rounded-lg shadow-lg w-[500px] max-w-full p-6 space-y-4">
            <h2 className="text-xl text-black font-semibold mb-2">{comp.dialog.title}</h2>

            {comp.dialog.fields.map((field, idx) => (
              <div key={idx} className="flex flex-col space-y-1">
                <label className="text-sm font-medium text-gray-700">{field.label}</label>

                {field.type.type === 'input' && (
                  <input
                    className="border border-gray-300 rounded px-3 py-1 text-sm bg-white text-black"
                    placeholder={field.type.placeholder}
                    value={formValues[field.label] ?? ''}
                    onChange={(e) => {
                      const updatedFields = [...comp.dialog.fields]
                      setFormValues(prev => ({ // <- actualizamos el estado local
                        ...prev,
                        [field.label]: e.target.value
                      }))
                      updatedFields[idx].type.value = e.target.value
                      updateComponent(pageIndex, page.components.findIndex(c => c.id === comp.id), {
                        ...comp,
                        dialog: {
                          ...comp.dialog,
                          fields: updatedFields
                        }
                      })
                    }}
                  />
                )}

                {field.type.type === 'select' && (
                  <select
                    className="border border-gray-300 rounded px-3 py-1 text-sm"
                    value={formValues[field.label] ?? ''}
                    onChange={(e) => {
                      setFormValues(prev => ({
                        ...prev,
                        [field.label]: e.target.value
                      }))
                      const updatedFields = [...comp.dialog.fields]
                      updatedFields[idx].type.value = e.target.value
                      updateComponent(pageIndex, page.components.findIndex(c => c.id === comp.id), {
                        ...comp,
                        dialog: {
                          ...comp.dialog,
                          fields: updatedFields
                        }
                      })
                    }}
                  >
                    {field.type.options.map((option, optionIdx) => (
                      <option key={optionIdx} value={option}>{option}</option>
                    ))}
                  </select>
                )}
              </div>
            ))}

            <div className="flex justify-end gap-2 pt-4">
              <button
                onClick={() => {
                  setOpenDialogs(prev => ({ ...prev, [compId]: false }))
                }}
                className="px-4 py-2 rounded border border-gray-300 text-gray-600 hover:bg-gray-100"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  const newRow = comp.dialog.fields.map((field) => formValues[field.label] ?? '')

                  const updatedRows = [...comp.dataTable.rows, newRow]

                  updateComponent(
                    pageIndex,
                    page.components.findIndex(c => c.id === compId),
                    {
                      ...comp,
                      dataTable: {
                        ...comp.dataTable,
                        rows: updatedRows
                      },
                      dialog: {
                        ...comp.dialog,
                        fields: comp.dialog.fields.map(field => ({ ...field, value: '' }))
                      }
                    }
                  )

                  setOpenDialogs(prev => ({ ...prev, [compId]: false }))
                  setFormValues({}) // ✅ Limpiamos los valores temporales
                }}
                className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
              >
                Guardar
              </button>
            </div>
          </div>
        </div>
        )
      })}

    </div>
  )
}
