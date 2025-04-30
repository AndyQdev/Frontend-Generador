import { PERMISSION } from '@/modules/auth/utils/permissions.constants'
import { Folder, LayoutDashboard, UsersIcon } from 'lucide-react'
import { createElement } from 'react'

export interface MenuHeaderRoute {
  path?: string
  label: string
  icon?: JSX.Element
  children?: MenuHeaderRoute[]
  permissions?: PERMISSION[]
}

export const MenuSideBar: MenuHeaderRoute[] = [
  {
    label: 'Gestionar Proyectos',
    icon: createElement(LayoutDashboard, { width: 20, height: 20 }),
    path: '/proyectos',
    permissions: [PERMISSION.USER, PERMISSION.USER_SHOW, PERMISSION.ROLE, PERMISSION.ROLE_SHOW, PERMISSION.PERMISSION, PERMISSION.PERMISSION_SHOW],
    children: [
      {
        path: '/proyectos',
        label: 'Mis proyectos',
        icon: createElement(Folder, { width: 20, height: 20 }),
        permissions: [PERMISSION.USER, PERMISSION.USER_SHOW]
      },
      // {
      //   path: '/usuarios/roles',
      //   label: 'Roles',
      //   icon: createElement(UserIcon, { width: 20, height: 20 }),
      //   permissions: [PERMISSION.ROLE, PERMISSION.ROLE_SHOW]
      // },
      {
        path: '/colaboradores',
        label: 'Colaboradores',
        icon: createElement(UsersIcon, { width: 20, height: 20 }),
        permissions: [PERMISSION.PERMISSION, PERMISSION.PERMISSION_SHOW]
      }
      // {
      //   path: '/usuarios/auditoria',
      //   label: 'Auditoria',
      //   icon: createElement(FileSliders, { width: 20, height: 20 }),
      //   permissions: [PERMISSION.PERMISSION, PERMISSION.PERMISSION_SHOW]
      // }
    ]
  }
  // {
  //   label: 'Administración',
  //   icon: createElement(HousePlus, { width: 20, height: 20 }),
  //   path: '/administracion',
  //   permissions: [PERMISSION.COMPANY, PERMISSION.BRANCH, PERMISSION.BRANCH_SHOW, PERMISSION.BINNACLE],
  //   children: [
  //     {
  //       path: PrivateRoutes.COMPANY,
  //       label: 'Hospitales',
  //       icon: createElement(Hospital, { width: 20, height: 20 }),
  //       permissions: [PERMISSION.COMPANY]
  //     },
  //     {
  //       path: PrivateRoutes.BRANCH,
  //       label: 'Pagos',
  //       icon: createElement(DollarSign, { width: 20, height: 20 }),
  //       permissions: [PERMISSION.BRANCH, PERMISSION.BRANCH_SHOW]
  //     },
  //     {
  //       path: PrivateRoutes.BINACLE,
  //       label: 'Bitácora',
  //       icon: createElement(ScrollTextIcon, { width: 20, height: 20 }),
  //       permissions: [PERMISSION.BINNACLE]
  //     },
  //     {
  //       path: PrivateRoutes.BINACLE,
  //       label: 'Empleados',
  //       icon: createElement(UserCog, { width: 20, height: 20 }),
  //       permissions: [PERMISSION.BINNACLE]
  //     }
  //   ]
  // }
  // {
  //   label: 'Pacientes',
  //   icon: createElement(UsersRound, { width: 20, height: 20 }),
  //   path: '/pacientes',
  //   permissions: [PERMISSION.COMPANY, PERMISSION.BRANCH, PERMISSION.BRANCH_SHOW, PERMISSION.BINNACLE],
  //   children: [
  //     {
  //       path: PrivateRoutes.COMPANY,
  //       label: 'Historial médico',
  //       icon: createElement(ScrollTextIcon, { width: 20, height: 20 }),
  //       permissions: [PERMISSION.COMPANY]
  //     },
  //     {
  //       path: PrivateRoutes.BRANCH,
  //       label: 'Citas',
  //       icon: createElement(FilePen, { width: 20, height: 20 }),
  //       permissions: [PERMISSION.BRANCH, PERMISSION.BRANCH_SHOW]
  //     },
  //     {
  //       path: PrivateRoutes.BINACLE,
  //       label: 'Recestas y medicamentos',
  //       icon: createElement(Syringe, { width: 20, height: 20 }),
  //       permissions: [PERMISSION.BINNACLE]
  //     },
  //     {
  //       path: PrivateRoutes.BINACLE,
  //       label: 'Pagos y transacciones',
  //       icon: createElement(Handshake, { width: 20, height: 20 }),
  //       permissions: [PERMISSION.BINNACLE]
  //     }
  //   ]
  // },
  // {
  //   label: 'Inventario',
  //   icon: createElement(PackageIcon, { width: 20, height: 20 }),
  //   path: '/productos',
  //   permissions: [PERMISSION.PRODUCT, PERMISSION.PRODUCT_SHOW, PERMISSION.FUEL, PERMISSION.FUEL_SHOW, PERMISSION.CATEGORY, PERMISSION.CATEGORY_SHOW, PERMISSION.GROUP, PERMISSION.GROUP_SHOW, PERMISSION.PRODUCT_OUTPUT, PERMISSION.PRODUCT_OUTPUT_SHOW],
  //   children: [
  //     {
  //       path: PrivateRoutes.PRODUCT,
  //       label: 'Productos',
  //       icon: createElement(FuelIcon, { width: 20, height: 20 }),
  //       permissions: [PERMISSION.PRODUCT, PERMISSION.PRODUCT_SHOW]
  //     },
  //     {
  //       path: PrivateRoutes.FUEL,
  //       label: 'Combustibles',
  //       icon: createElement(FlameIcon, { width: 20, height: 20 }),
  //       permissions: [PERMISSION.FUEL, PERMISSION.FUEL_SHOW]
  //     },
  //     {
  //       path: PrivateRoutes.GROUP,
  //       label: 'Grupos y categorias',
  //       icon: createElement(UsersIcon, { width: 20, height: 20 }),
  //       permissions: [PERMISSION.GROUP, PERMISSION.GROUP_SHOW]
  //     },
  //     {
  //       path: PrivateRoutes.OUPUT_PRODUCT,
  //       label: 'Salida de productos',
  //       icon: createElement(LogOut, { width: 20, height: 20 }),
  //       permissions: [PERMISSION.PRODUCT_OUTPUT, PERMISSION.PRODUCT_OUTPUT_SHOW]
  //     }
  //   ]
  // },
  // {
  //   label: 'Compras',
  //   icon: createElement(ShoppingCart, { width: 20, height: 20 }),
  //   path: '/proveedores',
  //   permissions: [PERMISSION.PURCHASE_ORDER, PERMISSION.PURCHASE_ORDER_SHOW, PERMISSION.BUY_NOTE, PERMISSION.BUY_NOTE_SHOW],
  //   children: [
  //     {
  //       path: PrivateRoutes.PROVIDER,
  //       label: 'Proveedores',
  //       icon: createElement(Truck, { width: 20, height: 20 }),
  //       permissions: [PERMISSION.PROVIDER, PERMISSION.PROVIDER_SHOW]
  //     },
  //     {
  //       path: PrivateRoutes.PURCHASE_ORDER,
  //       label: 'Ordenes de compra',
  //       icon: createElement(FileText, { width: 20, height: 20 }),
  //       permissions: [PERMISSION.PURCHASE_ORDER, PERMISSION.PURCHASE_ORDER_SHOW]
  //     },
  //     {
  //       path: PrivateRoutes.BUY,
  //       label: 'Compras',
  //       icon: createElement(ShoppingCart, { width: 20, height: 20 }),
  //       permissions: [PERMISSION.BUY_NOTE, PERMISSION.BUY_NOTE_SHOW]
  //     }
  //   ]
  // },
  // {
  //   label: 'Ventas',
  //   icon: createElement(DollarSignIcon, { width: 20, height: 20 }),
  //   path: '/ventas',
  //   permissions: [PERMISSION.DISCOUNT, PERMISSION.DISCOUNT_SHOW, PERMISSION.SALE_NOTE, PERMISSION.SALE_NOTE_SHOW, PERMISSION.DISPENSER, PERMISSION.DISPENSER_SHOW],
  //   children: [
  //     {
  //       path: PrivateRoutes.DiSPENSER,
  //       label: 'Dispensador',
  //       icon: createElement(Box, { width: 20, height: 20 }),
  //       permissions: [PERMISSION.DISPENSER, PERMISSION.DISPENSER_SHOW]
  //     },
  //     {
  //       path: PrivateRoutes.DISCOUNT,
  //       label: 'Descuentos',
  //       icon: createElement(Tag, { width: 20, height: 20 }),
  //       permissions: [PERMISSION.DISCOUNT, PERMISSION.DISCOUNT_SHOW]
  //     },
  //     {
  //       path: PrivateRoutes.SALES,
  //       label: 'Ventas',
  //       icon: createElement(ShoppingCart, { width: 20, height: 20 }),
  //       permissions: [PERMISSION.SALE_NOTE, PERMISSION.SALE_NOTE_SHOW]
  //     }
  //   ]
  // }
]
