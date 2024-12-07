import roleApi from '@/api/role'
import { Role } from '@/api/types'
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { AxiosError } from 'axios'
import toast from 'react-hot-toast'

interface updateParams {
  id: string
  role: Role
}

export const getListRole = createAsyncThunk('appRole/getList', async () => {
  const response = await roleApi.getList()

  return response.data
})

export const getRole = createAsyncThunk('appRole/get', async (id: string) => {
  const response = await roleApi.get(id)

  return response.data
})

export const updateRole = createAsyncThunk('appRole/update', async ({ id, role }: updateParams) => {
  try {
    const response = await roleApi.update(id, role)
    if (response.status === 200) {
      toast.success('Chỉnh sửa vai trò thành công!')
    }

    return response.data
  } catch (error) {
    const err = error as AxiosError
    if (err.response?.status === 404) {
      toast.error('Chỉnh sửa vai trò thất bại!\nThiếu dữ liệu')
    } else {
      toast.error('Chỉnh sửa vai trò thất bại!')
    }
  }
})

export const appRoleSlice = createSlice({
  name: 'appRole',
  initialState: {
    roles: [] as Role[],
    amount: 0
  },
  reducers: {},
  extraReducers: builder => {
    builder.addCase(getListRole.fulfilled, (state, action) => {
      state.roles = action.payload.roles
      state.amount = action.payload.amount
    })
  }
})

export default appRoleSlice.reducer
