import { type ComponentItem } from '@/modules/area_job/pages/page'
import { type Page } from '@/modules/projects/models/page.model'
import { createContext, useContext, useState, type ReactNode } from 'react'

// export interface ComponentItem {
//   id: string
//   type: string
//   label: string
//   x: number
//   y: number
//   width: number
//   height: number
//   backgroundColor?: string
//   borderRadius?: string
//   placeholder?: string
// }

interface ComponentContextType {
  selectedComponent: ComponentItem | null
  setSelectedComponent: (component: ComponentItem | null) => void
  selectedPage: Page | null
  setSelectedPage: (page: Page | null) => void
  updatePage: (updatedPage: Page) => void
}

const ComponentContext = createContext<ComponentContextType | undefined>(undefined)

export const ComponentProvider = ({ children }: { children: ReactNode }) => {
  const [selectedComponent, setSelectedComponent] = useState<ComponentItem | null>(null)
  const [selectedPage, setSelectedPage] = useState<Page | null>(null)

  const updatePage = (updatedPage: Page) => {
    setSelectedPage(prev => {
      if (prev && prev.id === updatedPage.id) {
        return updatedPage
      }
      return prev
    })
  }

  return (
    <ComponentContext.Provider value={{
      selectedComponent,
      setSelectedComponent,
      selectedPage,
      setSelectedPage,
      updatePage
    }}>
      {children}
    </ComponentContext.Provider>
  )
}

export const useComponentContext = () => {
  const context = useContext(ComponentContext)
  if (!context) throw new Error('useComponentContext must be used within a ComponentProvider')
  return context
}
