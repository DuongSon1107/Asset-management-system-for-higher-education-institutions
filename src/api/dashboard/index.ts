import axiosClient from '../axiosClient'

const dashboardApi = {
  getTakeoutHistory: async () => {
    const response = await axiosClient.get(`/api/dashboard/takeout/history`)

    return response.data
  },

  getTakeoutHistoryCurrentYear: async () => {
    const response = await axiosClient.get(`/api/dashboard/takeout/historycurrentyear`)

    return response.data
  },

  getHistoryTakeoutByDay: async (date: string) => {
    const response = await axiosClient.get(`/api/dashboard/takeout/historybyday`+ `?` +  (date ? `date=${date}` : ``))

    return response.data
    
  }
}

export default dashboardApi
