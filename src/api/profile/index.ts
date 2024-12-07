import axiosClient from '../axiosClient'
import { Account, Pas, Password } from '../types'

const profileApi = {
  get: async () => {
    const response = await axiosClient.get(`/api/profile/`)

    return response
  },

  updateProfile: async (id: string, data: Account) => {
    const response = await axiosClient.put(`/api/profile/info/${id}`, data)

    return response
  },
  updatePassword: async (id: string, data: Password) => {
    const response = await axiosClient.put(`/api/profile/password/${id}`, data)

    return response
  }
}

export default profileApi
