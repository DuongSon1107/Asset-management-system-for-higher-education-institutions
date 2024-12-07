import axiosClient from '../axiosClient'
import { Account, getListParams, getParams } from '../types'

const accountApi = {
  create: async (data: Account) => {
    const response = await axiosClient.post(`/api/account`, data)

    return response
  },
  get: async ({ id, query }: getParams) => {
    const response = await axiosClient.get(`/api/account/${id}` + '?' + (query ? `&query=${query}` : ``))

    return response
  },
  getList: async ({ limit, offset, order, search, arrange, query }: getListParams) => {
    const response = await axiosClient.get(
      `/api/account` +
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
  update: async (id: string, data: Account) => {
    const response = await axiosClient.put(`/api/account/${id}`, data)

    return response
  },
  delete: async (id: string) => {
    const response = await axiosClient.delete(`/api/account/${id}`)

    return response
  }
}

export default accountApi
