import { type ApiBase } from '@/models/api-base'
import { type Page } from './page.model'
// import { type Role } from '@/modules/auth/models/role.model'
// import { type Branch } from '@/modules/company/models/branch.model'
// import { type GENDER } from '@/utils'

export interface Project extends ApiBase {
  name: string
  descripcion: string
  status: string
  create_date: Date
  pages: Page[]
  last_modified: Date
}

export interface CreateProject extends Partial<Omit<Project, 'status' | 'create_date' | 'pages'>> {
  colaboradorId: number[]
}

export interface UpdateProject extends ApiBase {
  name: string
  descripcion: string
  status: string
  create_date: Date
  pages: Page[]
  last_modified: Date
}
