import { type ApiBase } from '@/models/api-base'
import { type Project } from './project.model'

export interface User extends ApiBase {
  name: string
  telefono: string
  email: string
  colaboradores: Colaborador[]
}

export interface Colaborador extends ApiBase {
  name: string
  telefono: string
  email: string
  proyectos: Project[]
}

export interface CreateColaborador {
  name: string
  telefono: string
  email: string
  password: string
  proyectos_ids: number[]
}
