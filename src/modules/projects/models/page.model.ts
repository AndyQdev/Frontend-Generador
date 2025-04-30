import { type ApiBase } from '@/models/api-base'
import { type ComponentItem } from '@/modules/area_job/pages/page'
// import { type Role } from '@/modules/auth/models/role.model'
// import { type Branch } from '@/modules/company/models/branch.model'
// import { type GENDER } from '@/utils'

export interface Page extends ApiBase {
  name: string
  order?: number
  background_color?: string
  grid_enabled?: boolean
  device_mode?: string
  components: ComponentItem[]
}

// export interface CreateProject extends Partial<Omit<Project, 'status' | 'create_date' | 'pages'>> {}

// export interface UpdateUser extends CreateProject { }
