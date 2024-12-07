import { LoginParams } from '@/context/types'
import axiosClient from '../axiosClient'

const authApi = {
  login: async (data: LoginParams) => {
    const response = await axiosClient.post('/api/auth/login', data)

    return response
  },
  logout: async () => {
    const response = await axiosClient.post('/api/auth/logout')

    return response
  },
  auth: async () => {
    const response = await axiosClient.get('/api/auth/me')

    return response
  }
}

export default authApi
