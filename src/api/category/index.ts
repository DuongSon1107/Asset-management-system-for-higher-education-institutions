import axiosClient from '../axiosClient'
import { Category, getListParams, getParams } from '../types'

const categoryApi = {
  create: async (data: Category) => {
    const response = await axiosClient.post(`/api/category`, data)

    return response
  },
  get: async ({ id, query }: getParams) => {
    const response = await axiosClient.get(`/api/category/${id}` + '?' + (query ? `&query=${query}` : ``))

    return response
  },
  getList: async ({ limit, offset, order, search, arrange, query }: getListParams) => {
    const response = await axiosClient.get(
      `/api/category` +
        `?` +
        (limit ? `limit=${limit}` : ``) +
        (offset ? `&offset=${offset}` : ``) +
        (order ? `&order=${order}` : ``) +
        (arrange ? `&arrange=${arrange}` : ``) +
        (search ? `&search=${search}` : ``) +
        (query ? `&query=${query}` : ``)
    )

    return response
  },
  update: async (id: string, data: Category) => {
    const response = await axiosClient.put(`/api/category/${id}`, data)

    return response
  },
  delete: async (id: string) => {
    const response = await axiosClient.delete(`/api/category/${id}`)

    return response
  }
}

export default categoryApi
