import { PrivateRoutes, type Route } from '@/models/routes.model'
import { type PERMISSION } from '@/modules/auth/utils/permissions.constants'
import { createElement, lazy } from 'react'
import { userRoutes } from './users.utils'
export enum PublicRoutes {
  LANDING = '/',
  LOGIN = '/login',
  REGISTER = '/register'
}

// export enum PrivateRoutes {
//   DASHBOARD = '/dashboard',
//   USER = '/user',
//   TASK = '/task',
//   TASK_ID = '/task/:id',
// }

// const UserPage = lazy(() => import('@/pages/user'))
const DashboardPage = lazy(() => import('@/pages/dashboard'))
const NotFound = lazy(() => import('@/components/not-found'))
const SettingPage = lazy(() => import('@/modules/settings/pages/setting/index'))
export const PrivateAllRoutes: Route[] = [
  {
    path: '/*',
    element: createElement(NotFound),
    permissions: [] as PERMISSION[]
  },
  {
    path: PrivateRoutes.DASHBOARD,
    element: createElement(DashboardPage),
    permissions: [] as PERMISSION[]
  },
  {
    path: PrivateRoutes.SETTINGS,
    element: createElement(SettingPage),
    permissions: [] as PERMISSION[]
  },
  ...userRoutes
  // ...companyRoutes,
  // ...inventoryRoutes,
  // ...buyRoutes,
  // ...salesRoutes
]
