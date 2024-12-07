import { Delivery, getListParams, getParams } from '@/api/types'
import deliveryApi from '@/api/delivery'
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import toast from 'react-hot-toast'
import { AxiosError } from 'axios'

interface updateParams {
  id: string
  delivery: Delivery
}

export const getListDelivery = createAsyncThunk('appDelivery/getList', async (params: getListParams) => {
  try {
    const response = await deliveryApi.getList(params)

    return response.data
  } catch (error) {
    toast.error('Lấy danh sách Xe chở hàng thất bại!')
  }
})

export const getDelivery = createAsyncThunk('appDelivery/get', async (params: getParams) => {
  try {
    const response = await deliveryApi.get(params)

    return response.data
  } catch (error) {
    toast.error('Lấy thông tin Xe chở hàng thất bại!')
  }
})

export const createDelivery = createAsyncThunk('appDelivery/create', async (delivery: Delivery) => {
  try {
    const response = await deliveryApi.create(delivery)
    if (response.status === 200) {
      toast.success('Thêm Xe chở hàng thành công!')
    }

    return response.data
  } catch (error) {
    const err = error as AxiosError
    if (err.response?.status === 422) {
      toast.error('Thêm Xe chở hàng thất bại!\nThiếu dữ liệu')
    } else {
      toast.error('Thêm Xe chở hàng thất bại!')
    }
  }
})

export const updateDelivery = createAsyncThunk('appDelivery/update', async ({ id, delivery }: updateParams) => {
  try {
    const response = await deliveryApi.update(id, delivery)

    if (response.status === 200) {
      toast.success('Chỉnh sửa Xe chở hàng thành công!')
    }

    return response.data
  } catch (error) {
    const err = error as AxiosError
    if (err.response?.status === 422) {
      toast.error('Chỉnh sửa Xe chở hàng thất bại!\nThiếu dữ liệu')
    } else {
      toast.error('Chỉnh sửa Xe chở hàng thất bại!')
    }
  }
})

export const deleteDelivery = createAsyncThunk('appDelivery/delete', async (id: string) => {
  try {
    const response = await deliveryApi.delete(id)
    if (response.status === 200) {
      toast.success('Xoá Xe chở hàng thành công!')
    }

    return response.data
  } catch (error) {
    toast.error('Xoá Xe chở hàng thất bại!')
  }
})

export const appDeliverySlice = createSlice({
  name: 'appDelivery',
  initialState: {
    deliveries: [] as Delivery[],
    amount: 0
  },
  reducers: {},
  extraReducers: builder => {
    builder.addCase(getListDelivery.fulfilled, (state, action) => {
      state.deliveries = action.payload.deliveries
      state.amount = action.payload.amount
    })
  }
})

export default appDeliverySlice.reducer
