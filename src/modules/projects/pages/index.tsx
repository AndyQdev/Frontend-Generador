import { useNavigate } from 'react-router-dom'
import { ChevronLeftIcon, File, ListFilter, Plus } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { PrivateRoutes } from '@/models/routes.model'

import { useHeader } from '@/hooks'
import { DataTable } from '@/components/ui/DataTable'
import { useState } from 'react'
import { useGetAllResource } from '@/hooks/useApiResource'
import { type Project } from '../../projects/models/project.model'
import { ENDPOINTS } from '@/utils'
import { AlertDialog, AlertDialogContent, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import UserFormDialog from './project-form'
import { Badge } from '@/components/ui/badge'

const ProjectPage = (): JSX.Element => {
  useHeader([
    { label: 'Espacio de Trabajo', path: PrivateRoutes.AREA },
    { label: 'Proyectos' }
  ])
  const navigate = useNavigate()
  const [openModal, setOpenModal] = useState(false)
  const { allResource: projects, mutate } = useGetAllResource<Project>({ endpoint: ENDPOINTS.PROJECTS })

  return (
    <section className='grid gap-0 w-full'>
      <div className="inline-flex items-center flex-wrap gap-2">
        <Button
          type="button"
          onClick={() => { navigate(-1) }}
          variant="outline"
          size="icon"
          className="h-8 w-8"
        >
          <ChevronLeftIcon className="h-4 w-4" />
          <span className="sr-only">Volver</span>
        </Button>
        <h2 className='px-2 font-semibold text-lg'>Todos los Proyectos</h2>
        <DropdownMenu>
          <DropdownMenuTrigger asChild className='ml-auto'>
            <Button variant="outline" size="sm" className="h-8 gap-1"><ListFilter className="h-3.5 w-3.5" /></Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Filtrar por</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuCheckboxItem checked>Active</DropdownMenuCheckboxItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <Button size="sm" variant="outline" className="h-8 gap-1"><File className="h-3.5 w-3.5" /></Button>
        <AlertDialog open={openModal} onOpenChange={(open) => { setOpenModal(open) }}>
          <AlertDialogTrigger asChild>
            <Button size="sm" className="h-8 gap-1">
              <Plus className="h-5 w-5" />
              <span className="sr-only lg:not-sr-only sm:whitespace-nowrap">Agregar</span>
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <UserFormDialog mutate={mutate} setOpenModal={setOpenModal} />
          </AlertDialogContent>
        </AlertDialog>
      </div>
      <div className='overflow-x-auto px-1'>
        <DataTable
          data={projects ?? []}
          columns={[
            { id: 'id', headerName: 'Id' },
            { id: 'name', headerName: 'Nombre' },
            {
              id: 'descripcion',
              headerName: 'Descripción',
              cell: ({ row }) => {
                const desc = row.descripcion
                const corta = desc.length > 50 ? desc.slice(0, 50) + '...' : desc
                return <span title={desc}>{corta}</span>
              }
            },
            {
              id: 'create_date',
              headerName: 'Fecha de creación',
              cell: ({ row }) => {
                const fecha = new Date(row.create_date)
                const formateada = fecha.toLocaleDateString('es-BO', {
                  year: 'numeric',
                  month: 'short',
                  day: '2-digit'
                })
                return <span>{formateada}</span>
              }
            },
            // { id: 'role.name', headerName: 'Rol' },
            // { id: 'branch.name', headerName: 'Sucursal' }
            {
              id: 'status',
              headerName: 'Estado',
              cell: ({ row }) => {
                const status = row.status
                let variant: 'default' | 'secondary' | 'destructive' = 'default'

                if (status === 'Finalizado') variant = 'secondary'
                else if (status === 'Inactivo') variant = 'destructive'

                return (
                  <Badge variant={variant}>
                    {status}
                  </Badge>
                )
              }
            }
          ]}
          options={{
            sorting: {
              enableSorting: true
            },
            pagination: {
              enablePagination: true,
              limit: 15,
              next: () => {
                console.log('Siguiente página')
              },
              previous: () => {
                console.log('Página anterior')
              }
            },
            filtering: {
              enableFiltering: true,
              columns: ['email', 'status']
            },
            actions: {
              enable: true,
              items: [
                { label: 'Editar', onClick: () => { } },
                { label: 'Ver Proyecto', onClick: () => { } }
              ]
            },
            hiding: {
              enableHiding: true,
              columns: ['amount']
            },
            enableSelection: true,
            search: {
              enableSearch: true,
              attribute: 'name'
            }
          }}
        />
      </div>
    </section>
  )
}

export default ProjectPage
