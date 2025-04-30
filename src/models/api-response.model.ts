export interface ApiResponse<T = unknown> {
  statusCode?: number
  message?: string | string[]
  error?: string
  data?: T
  countData?: number
}
