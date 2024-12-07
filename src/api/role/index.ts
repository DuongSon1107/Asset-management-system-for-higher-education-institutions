import axiosClient from '../axiosClient'
import { Role } from '../types'

const roleApi = {
  get: async (id: string) => {
    const response = await axiosClient.get(`/api/role/${id}`)

    return response
  },
  getList: async () => {
    const response = await axiosClient.get(`/api/role`)

    return response
  },
  update: async (id: string, data: Role) => {
    const response = await axiosClient.put(`/api/role/${id}`, data)

    return response
  }
}

export default roleApi
