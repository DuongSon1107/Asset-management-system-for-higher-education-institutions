import { Maker, getListParams, getParams } from '@/api/types'
import makerApi from '@/api/maker'
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

interface updateParams {
  id: string
  maker: Maker
}

export const getListMaker = createAsyncThunk('appMaker/getList', async (params: getListParams) => {
  const response = await makerApi.getList(params)

  return response.data
})

export const getMaker = createAsyncThunk('appMaker/get', async (params: getParams) => {
  const response = await makerApi.get(params)

  return response.data
})

export const createMaker = createAsyncThunk('appMaker/create', async (maker: Maker) => {
  const response = await makerApi.create(maker)

  return response.data
})

export const updateMaker = createAsyncThunk('appMaker/update', async ({ id, maker }: updateParams) => {
  const response = await makerApi.update(id, maker)

  return response.data
})

export const deleteMaker = createAsyncThunk('appMaker/delete', async (id: string) => {
  const response = await makerApi.delete(id)

  return response.data
})

export const appMakerSlice = createSlice({
  name: 'appMaker',
  initialState: {
    makers: [] as Maker[],
    amount: 0
  },
  reducers: {},
  extraReducers: builder => {
    builder.addCase(getListMaker.fulfilled, (state, action) => {
      state.makers = action.payload.makers
      state.amount = action.payload.amount
    })
  }
})

export default appMakerSlice.reducer
