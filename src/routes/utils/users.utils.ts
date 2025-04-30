import { createElement, lazy } from 'react'
import { PrivateRoutes, type Route } from '@/models/routes.model'
import { type PERMISSION } from '@/modules/auth/utils/permissions.constants'

// const ProfilePage = lazy(() => import('@/modules/users/pages/profile'))
// const ProfileForm = lazy(() => import('@/modules/users/pages/profile/components/profile-form'))
const ProjectPage = lazy(() => import('@/modules/projects/pages/index'))
// const UserFormPage = lazy(() => import('@modules/users/pages/users/components/user-form'))
const ColaboradorPage = lazy(() => import('@/modules/projects/colaborador/index'))
const AreaPage = lazy(() => import('@/modules/area_job/pages/page'))
// const PermissionsPage = lazy(() => import('@/modules/auth/pages/permissions'))
// const PermissionsFormPage = lazy(() => import('@/modules/auth/pages/permissions/components/permissions-form'))

export const userRoutes: Route[] = [
  // {
  //   path: PrivateRoutes.PROFILE,
  //   element: createElement(ProfilePage),
  //   permissions: [] as PERMISSION[]
  // },
  // {
  //   path: PrivateRoutes.PROFILE_UPDATE,
  //   element: createElement(ProfileForm, { buttonText: 'Actualizar', title: 'Actualizar su Cuenta' }),
  //   permissions: [] as PERMISSION[]
  // },
  {
    path: PrivateRoutes.PROJECTS,
    element: createElement(ProjectPage),
    // permissions: [PERMISSION.USER, PERMISSION.USER_SHOW]
    permissions: [] as PERMISSION[]

  },
  // {
  //   path: PrivateRoutes.USER_CREAR,
  //   element: createElement(UserFormPage, { buttonText: 'Guardar Usuario', title: 'Crear Usuario' }),
  //   permissions: [PERMISSION.USER]
  // },
  // {
  //   path: PrivateRoutes.USER_EDIT,
  //   element: createElement(UserFormPage, { buttonText: 'Editar Usuario', title: 'Actualizar Usuario' }),
  //   permissions: [PERMISSION.USER]
  // },
  {
    path: PrivateRoutes.COLABOLADOR,
    element: createElement(ColaboradorPage),
    // permissions: [PERMISSION.ROLE, PERMISSION.ROLE_SHOW]
    permissions: [] as PERMISSION[]
  },
  // {
  //   path: PrivateRoutes.ROLE_FORM,
  //   element: createElement(RolesFormPage, { title: 'Crear Rol', buttonText: 'Guardar Rol' }),
  //   permissions: [PERMISSION.ROLE]
  // },
  // {
  //   path: PrivateRoutes.ROLE_EDIT,
  //   element: createElement(RolesFormPage, { title: 'Actualizar Rol', buttonText: 'Guardar Rol' }),
  //   permissions: [PERMISSION.ROLE]
  // },
  {
    path: PrivateRoutes.AREA,
    element: createElement(AreaPage),
    permissions: [] as PERMISSION[]
  }
  // {
  //   path: PrivateRoutes.PERMISSIONS_CREATE,
  //   element: createElement(PermissionsFormPage, { title: 'Crear Permiso', buttonText: 'Guardar Permiso' }),
  //   permissions: [PERMISSION.PERMISSION]
  // },
  // {
  //   path: PrivateRoutes.PERMISSIONS_EDIT,
  //   element: createElement(PermissionsFormPage, { title: 'Actualizar Permiso', buttonText: 'Guardar Permiso' }),
  //   permissions: [PERMISSION.PERMISSION]
  // }
]
