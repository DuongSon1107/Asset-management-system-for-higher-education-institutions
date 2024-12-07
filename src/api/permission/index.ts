import axiosClient from '../axiosClient'

const permissionApi = {
  getList: async () => {
    const response = await axiosClient.get(`/api/permission`)

    return response
  }
}

export default permissionApi
