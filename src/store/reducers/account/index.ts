import { Account, getListParams, getParams } from '@/api/types'
import accountApi from '@/api/account'
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

interface updateParams {
  id: string
  account: Account
}

export const getListAccount = createAsyncThunk('appAccount/getList', async (params: getListParams) => {
  const response = await accountApi.getList(params)

  return response.data
})

export const getAccount = createAsyncThunk('appAccount/get', async (params: getParams) => {
  const response = await accountApi.get(params)

  return response.data
})

export const createAccount = createAsyncThunk('appAccount/create', async (account: Account) => {
  const response = await accountApi.create(account)

  return response.data
})

export const updateAccount = createAsyncThunk('appAccount/update', async ({ id, account }: updateParams) => {
  const response = await accountApi.update(id, account)

  return response.data
})

export const deleteAccount = createAsyncThunk('appAccount/delete', async (id: string) => {
  const response = await accountApi.delete(id)

  return response.data
})

export const appAccountSlice = createSlice({
  name: 'appAccount',
  initialState: {
    accounts: [] as Account[],
    amount: 0
  },
  reducers: {},
  extraReducers: builder => {
    builder.addCase(getListAccount.fulfilled, (state, action) => {
      state.accounts = action.payload.accounts
      state.amount = action.payload.amount
    })
  }
})

export default appAccountSlice.reducer
