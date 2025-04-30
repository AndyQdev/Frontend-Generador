import { X, ChevronsUpDownIcon, CheckCheckIcon } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

import { useState } from 'react'
import { type User } from '@/modules/projects/models/user.model'

interface Props {
  users: User[]
  value: string[]
  onChange: (value: string[]) => void
}

export default function MultiSelectUser({ users, value, onChange }: Props) {
  const [open, setOpen] = useState(false)

  const handleToggle = (userId: string) => {
    if (value.includes(userId)) {
      onChange(value.filter(id => id !== userId))
    } else {
      onChange([...value, userId])
    }
  }

  return (
    <div className="flex flex-col gap-2">
      {/* Etiquetas seleccionadas */}
      <div className="flex flex-wrap gap-2">
        {value.map(id => {
          const user = users.find(u => u.id === id)
          if (!user) return null
          return (
            <Badge key={id} variant="secondary" className="flex items-center gap-1">
              {user.name}
              <button onClick={() => { handleToggle(id) }}>
                <X className="w-3 h-3 ml-1" />
              </button>
            </Badge>
          )
        })}
      </div>

      {/* Selector */}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            className={cn(
              'justify-between font-normal w-full',
              value.length === 0 && 'text-muted-foreground'
            )}
          >
            Seleccionar colaboradores
            <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="p-0">
          <Command>
            <CommandInput placeholder="Buscar colaborador..." />
            <CommandList>
              <CommandEmpty>No encontrado</CommandEmpty>
              <CommandGroup>
                {users.map(user => (
                  <CommandItem
                    key={user.id}
                    value={user.name}
                    // Usamos onMouseDown en lugar de onSelect
                    onMouseDown={(e) => {
                      e.preventDefault() // Evita que el input tome el foco
                      e.stopPropagation() // Evita que se cierre el popover sin ejecutar tu lógica
                      handleToggle(user.id)
                    }}
                    >
                    <CheckCheckIcon
                        className={cn(
                          'mr-2 h-4 w-4',
                          value.includes(user.id) ? 'opacity-100' : 'opacity-0'
                        )}
                    />
                    {user.name}
                    </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  )
}
