import { Category, getListParams, getParams } from '@/api/types'
import categoryApi from '@/api/category'
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

interface updateParams {
  id: string
  category: Category
}

export const getListCategory = createAsyncThunk('appCategory/getList', async (params: getListParams) => {
  const response = await categoryApi.getList(params)

  return response.data
})

export const getCategory = createAsyncThunk('appCategory/get', async (params: getParams) => {
  const response = await categoryApi.get(params)

  return response.data
})

export const createCategory = createAsyncThunk('appCategory/create', async (category: Category) => {
  const response = await categoryApi.create(category)

  return response.data
})

export const updateCategory = createAsyncThunk('appCategory/update', async ({ id, category }: updateParams) => {
  const response = await categoryApi.update(id, category)

  return response.data
})

export const deleteCategory = createAsyncThunk('appCategory/delete', async (id: string) => {
  const response = await categoryApi.delete(id)

  return response.data
})

export const appCategorySlice = createSlice({
  name: 'appCategory',
  initialState: {
    categories: [] as Category[]
  },
  reducers: {},
  extraReducers: builder => {
    builder.addCase(getListCategory.fulfilled, (state, action) => {
      state.categories = action.payload.categories
    })
  }
})

export default appCategorySlice.reducer
