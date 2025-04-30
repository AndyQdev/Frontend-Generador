import useSWRMutation from 'swr/mutation'
import useSWR from 'swr'
import { type ApiResponse } from '../models'
import { buildUrl } from '@/utils'
import { type ResponseError } from '@/utils/response-error.utils'
import { createResource, createResourceWithImage, deleteResource, getAllResource, getResource, updateResource } from '@/services/crud.service'
import { filterStateDefault, useFilterData } from './useFilterData'

interface ParamResurce {
  endpoint: string
  id?: string
  query?: string
  isImage?: boolean
}

const useCreateResource = <TData>({ endpoint, query, isImage, id }: ParamResurce) => {
  const url = buildUrl({ endpoint, query, id })
  const { trigger, isMutating, error } = useSWRMutation<Promise<void>, ResponseError, string, TData>(
    url, query ? getResource : isImage ? createResourceWithImage : createResource
  )

  return { createResource: trigger, isMutating, error }
}
const useGetResource = <TData>({ endpoint, id, query }: ParamResurce) => {
  const url = buildUrl({ endpoint, id, query })
  const { data, isLoading, error, isValidating, mutate } = useSWR<TData, ResponseError>(url, getResource)
  return { resource: data, isLoading, error, isValidating, mutate }
}

const useGetAllResource = <T>({ endpoint }: ParamResurce) => {
  const { changeOrder, filterOptions, newPage, prevPage, queryParams, search, setFilterOptions, setOffset } = useFilterData(filterStateDefault)
  const url = buildUrl({ endpoint, query: queryParams })
  const { data, error, isLoading, mutate } = useSWR<ApiResponse, ResponseError>(url, getAllResource)
  return { allResource: data?.data as T[], countData: data?.countData ?? 0, error, isLoading, mutate, changeOrder, filterOptions, newPage, prevPage, search, setFilterOptions, setOffset }
}

const useUpdateResource = <TData>(endpoint: string, id?: string) => {
  const url = buildUrl({ endpoint, id })
  const { trigger, isMutating, error } =
    useSWRMutation<Promise<void>, ResponseError, string, TData>(url, updateResource)
  return { updateResource: trigger, isMutating, error }
}

const useDeleteResource = (endpoint: string) => {
  const url = buildUrl({ endpoint })
  const { trigger, error, isMutating } =
    useSWRMutation<Promise<void>, ResponseError, string, string>(url, deleteResource)
  return { deleteResource: trigger, error, isMutating }
}

export { useCreateResource, useGetAllResource, useGetResource, useUpdateResource, useDeleteResource }
