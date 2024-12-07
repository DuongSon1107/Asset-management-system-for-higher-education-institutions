import permissionApi from '@/api/permission'
import { Permission } from '@/api/types'
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

export const getListPermission = createAsyncThunk('appPermission/getList', async () => {
  const response = await permissionApi.getList()

  return response.data
})

export const appPermissionSlice = createSlice({
  name: 'appPermission',
  initialState: {
    permission: [] as Permission[],
    amount: 0
  },
  reducers: {},
  extraReducers(builder) {
    builder.addCase(getListPermission.fulfilled, (state, action) => {
      state.permission = action.payload.permissions
      state.amount = action.payload.amount
    })
  }
})

export default appPermissionSlice.reducer
