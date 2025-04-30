import { useEffect, useState } from 'react'
import { Rnd } from 'react-rnd'
import { Plus } from 'lucide-react'
import { useComponentContext } from '@/context/ComponentContext'

interface ComponentItem {
  id: string
  type: string
  label: string
  x: number
  y: number
  width: number
  height: number
  backgroundColor?: string
  borderRadius?: string
  placeholder?: string
}

interface Page {
  id: string
  name: string
  components: ComponentItem[]
}

export default function Editor() {
  const [pages, setPages] = useState<Page[]>([
    { id: '1', name: 'Página 1', components: [] }
  ])
  const [currentPageIndex, setCurrentPageIndex] = useState(0)
  const { setSelectedComponent, selectedComponent } = useComponentContext()
  // 🔁 Sincroniza cada vez que selectedComponent cambie
  useEffect(() => {
    if (!selectedComponent) return

    const updatedPages = [...pages]
    const currentComponents = updatedPages[currentPageIndex].components
    const index = currentComponents.findIndex((c) => c.id === selectedComponent.id)

    if (index !== -1) {
      currentComponents[index] = selectedComponent
      setPages(updatedPages)
    }
  }, [selectedComponent])
  const currentPage = pages[currentPageIndex]

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    const type = e.dataTransfer.getData('component/type')

    const newComponent: ComponentItem = {
      id: Date.now().toString(),
      type,
      label: type === 'button' ? 'Botón' : 'Input',
      x: e.clientX - 300,
      y: e.clientY - 50,
      width: 200,
      height: 50
    }

    const updatedPages = [...pages]
    updatedPages[currentPageIndex].components.push(newComponent)
    setPages(updatedPages)
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
  }

  const updateComponent = (index: number, updated: ComponentItem) => {
    const updatedPages = [...pages]
    updatedPages[currentPageIndex].components[index] = updated
    setPages(updatedPages)
  }

  const handleAddPage = () => {
    const newPage: Page = {
      id: Date.now().toString(),
      name: `Página ${pages.length + 1}`,
      components: []
    }
    setPages([...pages, newPage])
    setCurrentPageIndex(pages.length) // Cambiar a la nueva
  }
  const [selectedComponentId, setSelectedComponentId] = useState<string | null>(null)
  const handleDeleteComponent = (id: string) => {
    const updatedPages = [...pages]
    updatedPages[currentPageIndex].components = updatedPages[currentPageIndex].components.filter(
      (c) => c.id !== id
    )
    setPages(updatedPages)
    setSelectedComponentId(null)
  }

  return (
    <div className="flex flex-col h-screen">
      {/* Lienzo */}
      <div
        className="flex-1 relative bg-white"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        {currentPage.components.map((comp, index) => (
          <Rnd
          key={comp.id}
          size={{ width: comp.width, height: comp.height }}
          position={{ x: comp.x, y: comp.y }}
          // onClick={() => { setSelectedComponentId(comp.id) }}
          onClick={() => { setSelectedComponent(comp) }}
          onDragStop={(e, d) => {
            updateComponent(index, { ...comp, x: d.x, y: d.y })
          }}
          onResizeStop={(e, direction, ref, delta, position) => {
            updateComponent(index, {
              ...comp,
              // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
              width: parseInt(ref.style.width),
              // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
              height: parseInt(ref.style.height),
              x: position.x,
              y: position.y
            })
          }}
          bounds="parent"
        >
          <div className="h-full w-full p-2 bg-gray-200 rounded shadow relative">
            {/* Botón de eliminar */}
            {selectedComponent?.id === comp.id && (
              <button
                onClick={() => { handleDeleteComponent(comp.id) }}
                className="absolute top-0 right-0 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-bl hover:bg-red-600 z-10"
                title="Eliminar componente"
              >
                ×
              </button>
            )}

            {/* Contenido del componente */}
            {comp.type === 'button'
              ? (
                <button
                  className="text-white w-full h-full"
                  style={{
                    backgroundColor: comp.backgroundColor || '#2563eb',
                    borderRadius: comp.borderRadius || '0.375rem'
                  }}
                >
                  {comp.label}
                </button>
                )
              : (
                <input
                  className="w-full h-full p-1 border border-gray-400"
                  style={{
                    borderRadius: comp.borderRadius || '0.375rem'
                  }}
                  placeholder={comp.placeholder || ''}
                />
                )}
          </div>
        </Rnd>
        ))}
      </div>

      {/* Navegación de páginas */}
      <div className="bg-gray-100 border-t flex items-center px-4 py-2 gap-2">
        {pages.map((page, index) => (
          <button
            key={page.id}
            onClick={() => { setCurrentPageIndex(index) }}
            className={`px-4 py-1 rounded border text-sm transition-all
              ${index === currentPageIndex
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-200 border-gray-300'}`}
          >
            {page.name}
          </button>
        ))}
        <button
          onClick={handleAddPage}
          className="ml-2 p-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-full"
          title="Agregar nueva página"
        >
          <Plus size={16} />
        </button>
      </div>
    </div>
  )
}
