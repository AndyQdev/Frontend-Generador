// Canvas.tsx
import { useRef, useState, useCallback } from 'react'
import { TransformWrapper, TransformComponent, type ReactZoomPanPinchRef } from 'react-zoom-pan-pinch'
import PageFrame from './PageFrame' // tu frame con Rnd dentro
import Toolbar from './Toolbar' // barra inferior
import { type Page } from '@/modules/projects/models/page.model'
import { type ComponentItem } from './page'

interface CanvasProps {
  pages: Page[] // Lista de páginas
  current: Page | null
  onSelectPage: (id: string | null) => void // acepta null
  setSelectedComponent: (component: ComponentItem | null) => void // Función para seleccionar un componente
  updateComponent: (
    pageIndex: number,
    compIndex: number,
    updated: ComponentItem
  ) => void
  handleDeleteComponent: (id: string) => void // Función para eliminar un componente
  onDrop: (e: React.DragEvent<HTMLDivElement>, id: string, scale: number) => void // Función para manejar el evento de soltar un componente
  onDragOver: (e: React.DragEvent<HTMLDivElement>) => void // Función para manejar el evento de arrastrar un componente
  onSubmit: () => void // Función para guardar
  handleExport: () => void // Función para exportar
  setOpenDlg: (open: boolean) => void
  currentProjectId: string
}

export default function Canvas({
  pages,
  current,
  onSelectPage,
  setSelectedComponent,
  updateComponent,
  handleDeleteComponent,
  onDragOver,
  onDrop,
  onSubmit,
  handleExport,
  setOpenDlg,
  currentProjectId
}: CanvasProps) {
  const [mode, setMode] = useState<'select' | 'hand'>('select')
  const wrapperRef = useRef<HTMLDivElement>(null)
  const api = useRef<ReactZoomPanPinchRef | null>(null)
  /* ——— Zoom con Ctrl + wheel ——— */
  const handleWheel = useCallback(
    (e: React.WheelEvent) => {
      const { deltaY, ctrlKey } = e

      // ---------------  ZOOM  Ctrl + Wheel ---------------
      if (ctrlKey) {
        e.preventDefault()
        // deltaY negativo -> zoom‑in, positivo -> zoom‑out
        if (deltaY < 0) api.current?.zoomIn()
        else api.current?.zoomOut()
        return
      }

      // ---------------  SCROLL VERTICAL normal -----------
      if (wrapperRef.current) {
        wrapperRef.current.scrollBy({
          top: deltaY,
          behavior: 'auto'
        })
      }
    },
    [] // <- pásale la ref que te llega en el render‑prop
  )

  return (
    <div className="w-full h-full bg-neutral-900 relative">
      <TransformWrapper
        onInit={(ref) => { api.current = ref }}
        minScale={0.5}
        maxScale={2}
        initialScale={1}
        onZoomStart={() => { // 🔑 se dispara cuando empieza el zoom
          setSelectedComponent(null) // limpias componente seleccionado
          onSelectPage(null) // “ninguna página seleccionada”
        }}
        /*  ⬇️  La librería ya NO intercepta la rueda */
        wheel={{ // la rueda solo actúa con Ctrl
          step: 30,
          activationKeys: ['Control']
        }}
        panning={{ disabled: mode !== 'hand', velocityDisabled: true }}
        doubleClick={{ disabled: true }}
      >
        {/* {({ setTransform, bg-neutral-900 zoomIn, zoomOut, resetTransform, ...rest }) => ( */}
        {({ zoomIn, zoomOut, resetTransform, instance }) => {
          const scale = instance.transformState.scale
          const deselect = () => {
            setSelectedComponent(null)
            onSelectPage(null)
          }

          const zoomInWrapped = () => { deselect(); zoomIn() }
          const zoomOutWrapped = () => { deselect(); zoomOut() }
          const resetWrapped = () => { deselect(); resetTransform() }
          return (
            <div className="w-full h-full bg-[#f4f4f5] dark:bg-[#2c2c2c] relative overflow-hidden">
              <div
                ref={wrapperRef}
                onWheel={handleWheel}
                className={
                  'w-full h-full overflow-auto scrollbar-hide ' +
                  (mode === 'hand' ? 'cursor-grab' : 'cursor-default')
                }
                style={{
                  scrollbarWidth: 'none', // Firefox
                  msOverflowStyle: 'none' // IE 10+
                }}
              >
                <TransformComponent wrapperStyle={{ width: '100%' }}>
                  {/* ------------- FRAMES ------------- */}
                  <div className="flex flex-col gap-16 items-center py-16">
                  {pages
                    ?.filter(Boolean) // 🔥 Filtra páginas nulas o inválidas
                    .map((p, pageIdx) => (
                        <PageFrame
                          key={p.id}
                          currentProjectId={currentProjectId}
                          page={p}
                          pageIndex={pageIdx}
                          selected={!!(current && p.id === current.id)}
                          onClick={() => { onSelectPage(p.id) }}
                          setSelectedComponent={(component) => {
                            // Validar si el componente pertenece a la página actual
                            if (current !== null && current.components.some((c) => c.id === component?.id)) {
                              setSelectedComponent(component)
                            } else {
                              console.warn('El componente no pertenece a la página actual.')
                            }
                          }}
                          updateComponent={updateComponent}
                          handleDeleteComponent={handleDeleteComponent}
                          onDragOver={onDragOver}
                          onDrop={(e) => { onDrop(e, p.id, scale) }}
                          scale={scale} // Pasa la escala actual al frame
                          currentPageId={current?.id ?? ''} // Pasa el id de la página actual o una cadena vacía si es null
                        />
                    ))}
                  </div>
                </TransformComponent>
              </div>

              {/* ------------- TOOLBAR ------------- */}
              <Toolbar
                zoom={Math.round(instance.transformState.scale * 100)}
                mode={mode}
                setMode={setMode}
                zoomIn={zoomInWrapped}
                zoomOut={zoomOutWrapped}
                reset={resetWrapped}
                onSubmit={onSubmit} // Pasa la función para guardar
                handleExport={handleExport} // Pasa la función para exportar
                setOpenDlg={setOpenDlg}
              />
            </div>
          )
        }}
      </TransformWrapper>
    </div>
  )
}
