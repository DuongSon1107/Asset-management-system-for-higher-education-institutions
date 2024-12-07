import axios, { AxiosResponse, InternalAxiosRequestConfig } from 'axios' // { InternalAxiosRequestConfig }

const axiosClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
  headers: {
    'content-type': 'application/json'
  }
})

axiosClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const accessToken = localStorage.getItem('accessToken')
  if (accessToken) {
    config.headers.Authorization = `${accessToken}`
  }

  return config
})

axiosClient.interceptors.response.use(async (response: AxiosResponse) => {
  if (response.data.message === 'Refresh token successfully') {
    await localStorage.setItem('accessToken', response.headers['authorization'])
    const res = await axiosClient.request(response.config)

    return res
  } else {
    return response
  }
})

export default axiosClient
