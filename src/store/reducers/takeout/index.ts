import takeoutApi from '@/api/takeout'
import { Takeout, getListParams, getParams } from '@/api/types'
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { AxiosError } from 'axios'
import toast from 'react-hot-toast'

interface updateParams {
  id: string
  takeout: Takeout
}

export const getListTakeout = createAsyncThunk('appTakeout/getList', async (params: getListParams) => {
  const response = await takeoutApi.getList(params)

  return response.data
})

export const getTakeout = createAsyncThunk('appTakeout/get', async (params: getParams) => {
  const response = await takeoutApi.get(params)

  return response.data
})

export const createTakeout = createAsyncThunk('appTakeout/create', async (takeout: Takeout) => {
  try {
    const response = await takeoutApi.create(takeout)
    if (response.status === 200) {
      toast.success('Thêm takeout thành công!')
    }

    return response.data
  } catch (error) {
    const err = error as AxiosError
    if (err.response?.status === 404) {
      toast.error('Thêm takeout thất bại!\nThiếu dữ liệu')
    } else {
      toast.error('Thêm takeout thất bại!')
    }
  }
})

export const updateTakeout = createAsyncThunk('appTakeout/update', async ({ id, takeout }: updateParams) => {
  try {
    const response = await takeoutApi.update(id, takeout)
    if (response.status === 200) {
      toast.success('Chỉnh sửa takeout thành công!')
    }

    return response.data
  } catch (error) {
    const err = error as AxiosError
    if (err.response?.status === 404) {
      toast.error('Chỉnh sửa takeout thất bại!\nThiếu dữ liệu')
    } else {
      toast.error('Chỉnh sửa takeout thất bại!')
    }
  }
})

export const deleteTakeout = createAsyncThunk('appTakeout', async (id: string) => {
  try {
    const response = await takeoutApi.delete(id)
    if (response.status === 200) {
      toast.success('Xoá takeout thành công!')
    }

    return response.data
  } catch (error) {
    const err = error as AxiosError
    if (err.response?.status === 404) {
      toast.error('Xoá takeout thất bại!')
    } else {
      toast.error('Xoá takeout thất bại!')
    }
  }
})

export const appTakeoutSlice = createSlice({
  name: 'appTakeout',
  initialState: {
    takeouts: [] as Takeout[],
    amount: 0
  },
  reducers: {},
  extraReducers: builder => {
    builder.addCase(getListTakeout.fulfilled, (state, action) => {
      state.takeouts = action.payload.takeouts
      state.amount = action.payload.amount
    })
  }
})

export default appTakeoutSlice.reducer
