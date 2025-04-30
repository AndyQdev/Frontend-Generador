import { type ApiBase } from '@/models/api-base'

export interface Branch extends ApiBase {
  name: string
  address: string
  phone?: string
  email?: string
  is_suspended: boolean
}

export interface BranchData {
  countData: number
  data: Branch[]
}

export interface CreateBranch extends Omit<Branch, 'id' | 'is_suspended' | 'createdAt' | 'updatedAt'> { }
