import { Button } from '@components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@components/ui/form'
import { Input } from '@components/ui/input'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
// import { ENDPOINTS} from '@utils/index'
import { AlertDialogCancel, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@components/ui/alert-dialog'
import { type Dispatch, type SetStateAction } from 'react'
import { type ApiResponse } from '@models/index'
import { Popover, PopoverContent, PopoverTrigger } from '@radix-ui/react-popover'
import { cn } from '@/lib/utils'
import { useGetResource } from '@/hooks/useApiResource'
import { type User } from '../models/user.model'
import { ENDPOINTS } from '@/utils'
import { CheckCheckIcon, ChevronsUpDownIcon, X } from 'lucide-react'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command'
import { Textarea } from '@/components/ui/textarea'
// import MultiSelectUser from './components/multiSelectUser'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import { type KeyedMutator } from 'swr'
import { PrivateRoutes } from '@/models/routes.model'
import { useNavigate } from 'react-router-dom'
// import { useCreateResource } from '@/hooks/useApiResource'
// import { CreateUser } from '../../models/user.model'

const formSchema = z.object({
  name: z.string({ required_error: 'El nombre es requerido' })
    .min(3, 'El nombre debe tener al menos 3 caracteres')
    .max(100, 'El nombre debe tener menos de 100 caracteres'),
  descripcion: z.string({ required_error: 'El nombre es requerido' })
    .min(3, 'El nombre debe tener al menos 3 caracteres')
    .max(100, 'El nombre debe tener menos de 100 caracteres'),
  colaboradorId: z
    .array(z.number())
    .optional()
    .default([]),
  archivoXml: z.any().optional(),
  imagenBoceto: z.any().optional()
})

interface IUserFormProps {
  setOpenModal?: Dispatch<SetStateAction<boolean>>
  mutate: KeyedMutator<ApiResponse>
}

const UserFormDialog = ({ setOpenModal }: IUserFormProps) => {
  // const { createResource: createUser } = useCreateResource<CreateUser>({ endpoint: ENDPOINTS.USERS })
  // const { allResource: allRoles } = useGetAllResource<Role>({ endpoint: ENDPOINTS.ROLE })
  // const { allResource: branches } = useGetAllResource<Branch>({ endpoint: ENDPOINTS.BRANCH })
  const userStorage = JSON.parse(localStorage.getItem('user') ?? '{}')
  const { resource: user } = useGetResource<User>({ endpoint: ENDPOINTS.USER, id: userStorage.id })

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      descripcion: '',
      colaboradorId: [],
      archivoXml: undefined,
      imagenBoceto: undefined //  🆕
    }
  })
  const navigate = useNavigate()
  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      const formData = new FormData()
      formData.append('name', data.name)
      formData.append('descripcion', data.descripcion)
      if (data.colaboradorId && data.colaboradorId.length > 0) {
        formData.append('colaboradorId', data.colaboradorId.join(',')) // enviamos como string separado
      }
      if (data.archivoXml?.[0]) { // Porque Input file devuelve array de files
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        formData.append('archivo_xml', data.archivoXml[0])
      }
      if (data.imagenBoceto?.[0]) { // 🆕
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        formData.append('imagen_boceto', data.imagenBoceto[0])
      }
      const response = await fetch(`${import.meta.env.VITE_API_URL}${ENDPOINTS.PROJECTS}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}` // token si es necesario
        },
        body: formData
      })

      if (!response.ok) {
        throw new Error('Error al crear proyecto')
      }

      toast.success('Proyecto creado exitosamente')
      setTimeout(() => {
        navigate(`${PrivateRoutes.AREA}`, { replace: true })
      }, 1000)
      setOpenModal?.(false)
    } catch (error) {
      console.error(error)
      toast.error('Error al crear proyecto')
    }
  }

  return (
    <section className="gap-4 lg:gap-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="mx-auto w-full flex flex-col gap-4 lg:gap-6">
          <AlertDialogHeader>
            <AlertDialogTitle>Crear Proyecto</AlertDialogTitle>
          </AlertDialogHeader>
          <div className="grid gap-4 lg:gap-6">
            {/* Datos Personales */}
            <div className="flex flex-col gap-4 lg:gap-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre</FormLabel>
                    <FormControl>
                      <Input placeholder="Ingresa el nombre del usuario" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="colaboradorId" // este es un array
                render={({ field, fieldState }) => {
                  const selectedIds = field.value ?? [] // array de strings
                  // Función para agregar o quitar un ID
                  const toggleId = (id: string) => {
                    if (selectedIds.includes(Number(id))) {
                      field.onChange(selectedIds.filter((item) => item !== Number(id)))
                    } else {
                      field.onChange([...selectedIds, id])
                    }
                  }

                  return (
                    <FormItem>
                      <FormLabel>Colaboradores (Opcional)</FormLabel>
                        {/* Popover para elegir múltiples colaboradores */}
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant="outline"
                                role="combobox"
                                className={cn(
                                  'justify-between font-normal w-full',
                                  selectedIds.length === 0 && 'text-muted-foreground'
                                )}
                              >
                                {selectedIds.length > 0
                                  ? `Has seleccionado ${selectedIds.length} colaboradores`
                                  : 'Seleccionar colaboradores'
                                }
                                <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent
                            align="start"
                            sideOffset={4}
                            // Ajusta el sideOffset si quieres más/menos separación vertical
                            className="w-[--radix-popover-trigger-width] z-50 border border-border bg-card p-2 rounded-md shadow-md"
                          >
                            <Command>
                              <CommandInput placeholder="Buscar colaborador..." />
                              <CommandList>
                                <CommandEmpty>No encontrado</CommandEmpty>
                                <CommandGroup>
                                  {user?.colaboradores?.map((col) => {
                                    const isSelected = selectedIds.includes(Number(col.id))
                                    return (
                                      <CommandItem
                                        key={col.id}
                                        value={col.name}
                                        onMouseDown={(e) => {
                                          e.preventDefault()
                                          e.stopPropagation()
                                          toggleId(col.id)
                                        }}
                                        className='cursor-pointer hover:bg-accent bg-white dark:bg-dark-bg-primary dark:hover:bg-accent'
                                      >
                                        <CheckCheckIcon
                                          className={cn(
                                            'mr-2 h-4 w-4',
                                            isSelected ? 'opacity-100' : 'opacity-0'
                                          )}
                                        />
                                        {col.name}
                                      </CommandItem>
                                    )
                                  })}
                                </CommandGroup>
                              </CommandList>
                            </Command>
                          </PopoverContent>
                        </Popover>

                        {/* Etiquetas con la lista de seleccionados */}
                        {selectedIds.length > 0 && (
                          <div className="mt-2 flex flex-wrap gap-2">
                            {selectedIds.map((id) => {
                              const col = user?.colaboradores?.find((c) => Number(c.id) === Number(id))
                              if (!col) return null
                              return (
                                <Badge
                                  key={id}
                                  variant="secondary"
                                  className="flex items-center gap-1"
                                >
                                  {col.name}
                                  <button
                                    onClick={(e) => {
                                      e.preventDefault()
                                      e.stopPropagation()
                                      toggleId(id.toString())
                                    }}
                                  >
                                    <X className="w-3 h-3" />
                                  </button>
                                </Badge>
                              )
                            })}
                          </div>
                        )}
                      {/* <FormMessage /> */}
                      {fieldState.error?.message && (
                        <p className="text-red-500 text-sm mt-1">
                          {fieldState.error.message}
                        </p>
                      )}
                    </FormItem>
                  )
                }}
              />

              <FormField
                control={form.control}
                name="descripcion"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Descripcion</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Ingresa una descripción" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="archivoXml"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Archivo UML (Opcional)</FormLabel>
                    <FormControl>
                      <Input
                        type="file"
                        accept=".xml,.xmi"
                        onChange={(e) => {
                          field.onChange(e.target.files) // 👈 importantísimo: pasar el archivo al hook
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
              control={form.control}
              name="imagenBoceto"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Boceto (PNG, JPG …) – opcional</FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(e) => { field.onChange(e.target.files) }} // ⬅️ muy importante
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            </div>

          </div>

          {/* Footer */}
          <AlertDialogFooter className="flex items-center justify-center gap-2">
            <AlertDialogCancel asChild>
              <Button variant="outline" size="sm" onClick={() => setOpenModal?.(false)}>
                Cancelar
              </Button>
            </AlertDialogCancel>
            <Button type="submit" size="sm">
              Crear Proyecto
            </Button>
          </AlertDialogFooter>
        </form>
      </Form>
    </section>
  )
}

export default UserFormDialog
