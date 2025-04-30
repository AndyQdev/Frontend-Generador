import * as React from 'react'
import {
  type ColumnDef,
  type SortingState,
  type VisibilityState,
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  flexRender,
  type Column
} from '@tanstack/react-table'
import { Button } from '@components/ui/button'
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuCheckboxItem, DropdownMenuItem } from '@components/ui/dropdown-menu'
import { Input } from '@components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@components/ui/table'
import { ArrowUpDown, Ellipsis, Filter } from 'lucide-react'

function getNestedValue(obj: unknown, path: string) {
  return path.split('.').reduce((acc, part) => acc && (acc as Record<string, unknown>)[part], obj)
}

interface ColumnConfig<TData> {
  id: string
  headerName: string
  isImage?: boolean
  accessor?: (row: TData) => unknown
  cell?: (info: { row: TData }) => JSX.Element | string
}

interface DataTableProps<TData> {
  data: TData[]
  columns: Array<ColumnConfig<TData>>
  options: {
    sorting?: {
      enableSorting?: boolean
    }
    pagination?: {
      enablePagination?: boolean
      limit?: number
      offset?: number
      next?: () => void
      previous?: () => void
    }
    filtering?: {
      enableFiltering?: boolean
      columns?: string[]
    }
    actions?: {
      enable?: boolean
      items: Array<{ label: string, onClick: (row: TData) => void }>
    }
    enableSelection?: boolean
    hiding?: {
      enableHiding?: boolean
      columns?: string[]
    }
    search?: {
      enableSearch?: boolean
      attribute?: string
    }
    export?: {
      enableExport?: boolean
    }
  }
  showPaginationControls?: boolean
}

export function DataTable<TData>({
  data,
  columns,
  options,
  showPaginationControls = true

}: DataTableProps<TData>) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})

  const columnDefs: Array<ColumnDef<TData>> = React.useMemo(() => {
    return columns.map((columnitem) => {
      const baseColumnDef: ColumnDef<TData> = {
        id: columnitem.id,
        accessorFn: (row) => getNestedValue(row, columnitem.id), // Acceder a propiedades anidadas
        header: columnitem.headerName,
        cell: (info) => {
          // Usa la función `cell` definida en la configuración de la columna
          if (columnitem.cell) {
            return columnitem.cell({ row: info.row.original })
          }
          // Valor por defecto
          return info.getValue()
          // return flexRender(info.getValue() as string | number | boolean | null | undefined, info);
        }
      }

      // Sorting
      if (options.sorting?.enableSorting) {
        baseColumnDef.header = ({ column }: { column: Column<TData, unknown> }) => (
          <Button
            variant="ghost"
            onClick={() => { column.toggleSorting(column.getIsSorted() === 'asc') }
            }
            className="flex items-center gap-1"
          >
            {columnitem.headerName} <ArrowUpDown size={16} />
          </Button>
        )
      }

      return baseColumnDef
    })
  }, [columns, options])

  const table = useReactTable({
    data,
    columns: columnDefs,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: options.pagination?.enablePagination
      ? getPaginationRowModel()
      : undefined,
    getSortedRowModel: options.sorting?.enableSorting
      ? getSortedRowModel()
      : undefined,
    getFilteredRowModel: options.filtering?.enableFiltering
      ? getFilteredRowModel()
      : undefined,
    state: {
      sorting,
      columnVisibility // Incorporar el estado de visibilidad de columnas
    },
    onColumnVisibilityChange: setColumnVisibility,
    manualPagination: options.pagination?.enablePagination,
    pageCount: Math.ceil(data.length / (options.pagination?.limit || 10))
  })

  // Deshabilitar el botón si no se puede avanzar o retroceder
  const canNextPage = table.getCanNextPage()
  const canPreviousPage = table.getCanPreviousPage()

  return (
    <div className="w-full">
      {options.search?.enableSearch && (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-4 space-y-2 sm:space-y-0 sm:space-x-4">
          <Input
            placeholder={`Buscar por ${options.search.attribute}...`}
            onChange={(event) => {
              const value = event.target.value
              if (options?.search?.attribute && table.getColumn(options.search.attribute)) {
                table.getColumn(options?.search?.attribute)?.setFilterValue(value)
              }
            }}
            className="max-w-sm"
          />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size='icon' className="ml-auto sm:ml-0">
                <Filter size={16} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {table.getAllColumns().map((column) => (
                <DropdownMenuCheckboxItem
                  key={column.id}
                  checked={column.getIsVisible()}
                  onCheckedChange={(value) => { column.toggleVisibility(!!value) }}
                  className="capitalize"
                >
                  {columns.find((c) => c.id === column.id)?.headerName}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}

      <div className="rounded-md border">
        <Table className='bg-white dark:bg-dark-bg-primary text-center'>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody className=''>
            {table.getRowModel().rows?.length
              ? (
                  table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="p-0">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                  {options.actions?.enable && (
                    <TableCell className=''>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost">
                            <Ellipsis size={16} />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-light-bg-primary dark:bg-dark-bg-primary">
                          {options.actions.items.map((action, index) => (
                            <DropdownMenuItem
                              key={index}
                              onClick={() => { action.onClick(row.original) }}
                              className="hover:bg-light-action-hover/25 cursor-pointer"
                            >
                              {action.label}
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  )}
                </TableRow>
                  ))
                )
              : (
              <TableRow>
                <TableCell colSpan={columns.length} className="text-center">
                  No hay datos para mostrar
                </TableCell>
              </TableRow>
                )}
          </TableBody>
        </Table>
      </div>

      {options.pagination?.enablePagination && showPaginationControls && (
  <div className="flex items-center justify-end space-x-2 py-4">
    <Button
      variant="outline"
      onClick={() => {
        table.previousPage()
        options.pagination?.previous?.()
      }}
      disabled={!canPreviousPage}
    >
      Ant
    </Button>
    <Button
      variant="outline"
      onClick={() => {
        table.nextPage()
        options.pagination?.next?.()
      }}
      disabled={!canNextPage}
    >
      Sig
    </Button>
  </div>
      )}

    </div>
  )
}
