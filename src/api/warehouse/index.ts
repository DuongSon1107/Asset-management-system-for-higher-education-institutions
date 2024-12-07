import axiosClient from '../axiosClient'
import { Warehouse, getListParams, getParams } from '../types'

const warehouseApi = {
  create: async (data: Warehouse) => {
    const response = await axiosClient.post(`/api/warehouse`, data)

    return response
  },
  get: async ({ id, query }: getParams) => {
    const response = await axiosClient.get(`/api/warehouse/${id}` + '?' + (query ? `&query=${query}` : ``))

    return response
  },
  getList: async ({ limit, offset, order, search, arrange, query }: getListParams) => {
    const response = await axiosClient.get(
      `/api/warehouse` +
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
  update: async (id: string, data: Warehouse) => {
    const response = await axiosClient.put(`/api/warehouse/${id}`, data)

    return response
  },
  delete: async (id: string) => {
    const response = await axiosClient.delete(`/api/warehouse/${id}`)

    return response
  }
}

export default warehouseApi
