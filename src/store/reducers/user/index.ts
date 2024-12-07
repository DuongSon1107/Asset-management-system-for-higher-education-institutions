import profileApi from '@/api/profile'
import { Account, Password } from '@/api/types'

import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { AxiosError } from 'axios'
import toast from 'react-hot-toast'

interface updateParams {
  id: string
  profile: Account
}
interface updatePassword {
  id: string
  password: Password
}

export const getProfile = createAsyncThunk('appProfile/get', async () => {
  const response = await profileApi.get()

  return response.data
})

export const updateProfile = createAsyncThunk('appProfile/updateProfile', async ({ id, profile }: updateParams) => {
  try {
    const response = await profileApi.updateProfile(id, profile)
    if (response.status === 200) {
      toast.success('Chỉnh sửa XCD thành công!')
    }

    return response.data
  } catch (error) {
    const err = error as AxiosError
    if (err.response?.status === 422) {
      toast.error('Sửa thông tin thất bại!\nThiếu dữ liệu')
    } else {
      toast.error('Sửa thông tin thất bại!')
    }
  }
})

export const updatePassword = createAsyncThunk(
  'appProfile/updatePassword',
  async ({ id, password }: updatePassword) => {
    const response = await profileApi.updatePassword(id, password)

    return response.data
  }
)

export const appProfileSlice = createSlice({
  name: 'appUser',
  initialState: {
    user: {} as Account
  },
  reducers: {},
  extraReducers: builder => {
    builder.addCase(getProfile.fulfilled, (state, action) => {
      state.user = action.payload.account
    })
  }
})

export default appProfileSlice.reducer
