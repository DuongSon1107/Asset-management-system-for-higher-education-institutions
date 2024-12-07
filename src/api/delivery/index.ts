import axiosClient from '../axiosClient'
import { Delivery, getListParams, getParams } from '../types'

const deliveryApi = {
  create: async (data: Delivery) => {
    const response = await axiosClient.post(`/api/delivery`, data)

    return response
  },
  get: async ({ id, query }: getParams) => {
    const response = await axiosClient.get(`/api/delivery/${id}` + '?' + (query ? `&query=${query}` : ``))

    return response
  },
  getList: async ({ limit, offset, order, search, arrange, query }: getListParams) => {
    const response = await axiosClient.get(
      `/api/delivery` +
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
  update: async (id: string, data: Delivery) => {
    const response = await axiosClient.put(`/api/delivery/${id}`, data)

    return response
  },
  delete: async (id: string) => {
    const response = await axiosClient.delete(`/api/delivery/${id}`)

    return response
  }
}

export default deliveryApi
