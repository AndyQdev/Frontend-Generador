import { Button } from '@components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@components/ui/form'
import { Input } from '@components/ui/input'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
// import { ENDPOINTS} from '@utils/index'
import { AlertDialogCancel, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@components/ui/alert-dialog'
import { type Dispatch, type SetStateAction } from 'react'
import { Popover, PopoverContent, PopoverTrigger } from '@radix-ui/react-popover'
import { cn } from '@/lib/utils'
import { useCreateResource, useGetAllResource } from '@/hooks/useApiResource'
import { type CreateColaborador, type User } from '../models/user.model'
import { ENDPOINTS } from '@/utils'
import { CheckCheckIcon, ChevronsUpDownIcon, X } from 'lucide-react'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command'
import { Badge } from '@/components/ui/badge'
import { type Project } from '../models/project.model'
import { toast } from 'sonner'
import { type KeyedMutator } from 'swr'

const formSchema = z.object({
  name: z.string({ required_error: 'El nombre es requerido' })
    .min(3, 'El nombre debe tener al menos 3 caracteres')
    .max(100, 'El nombre debe tener menos de 100 caracteres'),
  email: z.string({ required_error: 'El correo es requerido' })
    .min(3, 'El correo debe tener al menos 3 caracteres')
    .max(100, 'El correo debe tener menos de 100 caracteres'),
  password: z.string({ required_error: 'La contraseña es requerido' })
    .min(3, 'La contraseña debe tener al menos 3 caracteres')
    .max(100, 'La contraseña debe tener menos de 100 caracteres'),
  telefono: z.string({ required_error: 'El teléfono es requerido' })
    .min(3, 'El teléfono debe tener al menos 3 caracteres')
    .max(100, 'El teléfono debe tener menos de 100 caracteres'),
  proyectos_ids: z
    .array(z.number())
    .optional()
    .default([])
})

interface IUserFormProps {
  setOpenModal?: Dispatch<SetStateAction<boolean>>
  mutate: KeyedMutator<User>
}

const UserFormDialog = ({ setOpenModal, mutate }: IUserFormProps) => {
  // const { createResource: createUser } = useCreateResource<CreateUser>({ endpoint: ENDPOINTS.USERS })
  // const { allResource: allRoles } = useGetAllResource<Role>({ endpoint: ENDPOINTS.ROLE })
  // const { allResource: branches } = useGetAllResource<Branch>({ endpoint: ENDPOINTS.BRANCH })
  const { createResource: createColaborador } = useCreateResource<CreateColaborador>({
    endpoint: ENDPOINTS.COLABORADOR
  })
  // const { mutate } = useGetAllResource<ApiResponse>({ endpoint: ENDPOINTS. });

  const { allResource: projects } = useGetAllResource<Project>({ endpoint: ENDPOINTS.PROJECTS })
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: '',
      name: '',
      email: '',
      telefono: '',
      proyectos_ids: []
    }
  })

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    console.log(data)
    toast.promise(createColaborador(data), {
      loading: 'Creando Colaborador...',
      success: () => {
        if (mutate) {
          void mutate() // Forzar actualización de la lista de usuarios
        }
        setOpenModal?.(false)
        return 'Colaborador creado exitosamente'
      },
      error: 'Error al crear el colaborador'
    })
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
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Correo Electrónico</FormLabel>
                    <FormControl>
                      <Input type='email' placeholder="Ingresa un correo electrónico" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contraseña</FormLabel>
                    <FormControl>
                      <Input type='password' placeholder="Ingresa tu contraseña" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="telefono"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Teléfono</FormLabel>
                    <FormControl>
                      <Input type='number' placeholder="Ingresa tu teléfono" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="proyectos_ids" // este es un array
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
                      <FormLabel>Proyectos (Opcional)</FormLabel>
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
                                  : 'Seleccionar proyectos'
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
                              <CommandInput placeholder="Buscar proyecto..." />
                              <CommandList>
                                <CommandEmpty>No encontrado</CommandEmpty>
                                <CommandGroup>
                                  {projects?.map((col) => {
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
                              const col = projects?.find((c) => Number(c.id) === id)
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
              Crear Usuario
            </Button>
          </AlertDialogFooter>
        </form>
      </Form>
    </section>
  )
}

export default UserFormDialog
