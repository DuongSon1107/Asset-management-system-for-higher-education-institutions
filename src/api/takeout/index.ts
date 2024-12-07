import axiosClient from '../axiosClient'
import { Takeout, getListParams, getParams } from '../types'

const takeoutApi = {
  create: async (data: Takeout) => {
    const response = await axiosClient.post(`/api/takeout`, data)

    return response
  },
  get: async ({ id, query }: getParams) => {
    const response = await axiosClient.get(`/api/takeout/${id}` + '?' + (query ? `&query=${query}` : ``))

    return response
  },
  getList: async ({ limit, offset, order, search, arrange, query }: getListParams) => {
    const response = await axiosClient.get(
      `/api/takeout` +
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
  update: async (id: string, data: Takeout) => {
    const response = await axiosClient.put(`/api/takeout/${id}`, data)

    return response
  },
  delete: async (id: string) => {
    const response = await axiosClient.delete(`/api/takeout/${id}`)

    return response
  }
}

export default takeoutApi
