import { Warehouse, getListParams, getParams } from '@/api/types'
import warehouseApi from '@/api/warehouse'
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

interface updateParams {
  id: string
  warehouse: Warehouse
}

export const getListWarehouse = createAsyncThunk('appWarehouse/getList', async (params: getListParams) => {
  const response = await warehouseApi.getList(params)

  return response.data
})

export const getWarehouse = createAsyncThunk('appWarehouse/get', async (params: getParams) => {
  const response = await warehouseApi.get(params)

  return response.data
})

export const createWarehouse = createAsyncThunk('appWarehouse/create', async (warehouse: Warehouse) => {
  const response = await warehouseApi.create(warehouse)

  return response.data
})

export const updateWarehouse = createAsyncThunk('appWarehouse/update', async ({ id, warehouse }: updateParams) => {
  const response = await warehouseApi.update(id, warehouse)

  return response.data
})

export const deleteWarehouse = createAsyncThunk('appWarehouse/delete', async (id: string) => {
  const response = await warehouseApi.delete(id)

  return response.data
})

export const appWarehouseSlice = createSlice({
  name: 'appWarehouse',
  initialState: {
    warehouses: [] as Warehouse[],
    amount: 0
  },
  reducers: {},
  extraReducers: builder => {
    builder.addCase(getListWarehouse.fulfilled, (state, action) => {
      state.warehouses = action.payload.warehouses
      state.amount = action.payload.amount
    })
  }
})

export default appWarehouseSlice.reducer
