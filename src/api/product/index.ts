import axiosClient from '../axiosClient'
import { Product, getListParams, getParams, maintainProductParams } from '../types'

const productApi = {
  create: async (data: Product) => {
    const response = await axiosClient.post(`/api/product`, data)

    return response
  },
  get: async ({ id, query }: getParams) => {
    const response = await axiosClient.get(`/api/product/${id}` + '?' + (query ? `&query=${query}` : ``))

    return response
  },
  getList: async ({ limit, offset, order, search, arrange, query }: getListParams) => {
    const response = await axiosClient.get(
      `/api/product` +
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
  update: async (id: string, data: Product) => {
    const response = await axiosClient.put(`/api/product/${id}`, data)

    return response
  },
  delete: async (id: string) => {
    const response = await axiosClient.delete(`/api/product/${id}`)

    return response
  },
  maintain: async ({ id, description, startDate, finishDate }: maintainProductParams) => {
    const params = {
      startDate: startDate,
      finishDate: finishDate,
      description: description
    }
    const response = await axiosClient.post(`/api/product/maintain/${id}`, params)

    return response
  },
  historyMaintain: async (id: string) => {
    const response = await axiosClient.get(`/api/product/maintain/history/${id}`)

    return response
  },
  updateMaintain: async (params: maintainProductParams[]) => {
    const response = await axiosClient.post(`/api/product/maintain/update`, params)

    return response
  },
  deleteMaintain: async (id: string) => {
    const response = await axiosClient.delete(`/api/product/maintain/delete/${id}`)

    return response
  }
}

export default productApi
