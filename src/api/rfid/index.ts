import axiosClient from '../axiosClient'

const rfidApi = {
  create: async (rfid: string) => {
    const params = {
      rfid: rfid
    }
    const response = await axiosClient.post(`/api/rfid`, params)

    return response
  }
}

export default rfidApi
