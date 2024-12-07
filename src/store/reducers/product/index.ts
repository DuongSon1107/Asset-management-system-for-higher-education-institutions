import { Product, getListParams, getParams, maintainProductParams } from '@/api/types'
import productApi from '@/api/product'
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import toast from 'react-hot-toast'
import { AxiosError } from 'axios'

interface updateParams {
  id: string
  product: Product
}

export const getListProduct = createAsyncThunk('appProduct/getList', async (params: getListParams) => {
  try {
    const response = await productApi.getList(params)

    return response.data
  } catch (error) {
    toast.error('Lấy danh sách XCD thất bại!')
  }
})

export const getProduct = createAsyncThunk('appProduct/get', async (params: getParams) => {
  try {
    const response = await productApi.get(params)

    return response.data
  } catch (error) {
    toast.error('Lấy thông tin XCD thất bại!')
  }
})

export const createProduct = createAsyncThunk('appProduct/create', async (product: Product) => {
  try {
    const response = await productApi.create(product)
    if (response.status === 200) {
      toast.success('Thêm XCD thành công!')
    }

    return response.data
  } catch (error) {
    const err = error as AxiosError
    if (err.response?.status === 422) {
      toast.error('Thêm XCD thất bại!\nThiếu dữ liệu')
    } else {
      toast.error('Thêm XCD thất bại!')
    }
  }
})

export const updateProduct = createAsyncThunk('appProduct/update', async ({ id, product }: updateParams) => {
  try {
    const response = await productApi.update(id, product)

    if (response.status === 200) {
      toast.success('Chỉnh sửa XCD thành công!')
    }

    return response.data
  } catch (error) {
    const err = error as AxiosError
    if (err.response?.status === 422) {
      toast.error('Chỉnh sửa XCD thất bại!\nThiếu dữ liệu')
    } else {
      toast.error('Chỉnh sửa XCD thất bại!')
    }
  }
})

export const deleteProduct = createAsyncThunk('appProduct/delete', async (id: string) => {
  try {
    const response = await productApi.delete(id)
    if (response.status === 200) {
      toast.success('Xoá XCD thành công!')
    }

    return response.data
  } catch (error) {
    toast.error('Xoá XCD thất bại!')
  }
})

export const maintainProduct = createAsyncThunk('appProduct/maintain', async (params: maintainProductParams) => {
  try {
    const response = await productApi.maintain(params)

    if (response.status === 200) {
      toast.success('Bảo trì XCD thành công!')
    }

    return response.data
  } catch (error) {
    const err = error as AxiosError
    if (err.response?.status === 422) {
      toast.error('Bảo trì XCD thất bại!\nThiếu dữ liệu')
    } else {
      if (err.response?.status === 409) {
        toast.error('Bảo trì XCD thất bại!\nTrạng thái không đúng')
      } else {
        toast.error('Bảo trì XCD thất bại!')
      }
    }
  }
})

export const historyMaintainProduct = createAsyncThunk('appProduct/maintain/history', async (id: string) => {
  try {
    const response = await productApi.historyMaintain(id)

    return response.data
  } catch (error) {
    toast.error('Lấy lịch sử bảo trì XCD thất bại!')
  }
})

export const updateMaintainProduct = createAsyncThunk(
  'appProduct/maintain/update',
  async (params: maintainProductParams[]) => {
    try {
      const response = await productApi.updateMaintain(params)
      if (response.status === 200) {
        toast.success('Chỉnh sửa lịch sử XCD thành công!')
      }

      return response.data
    } catch (error) {
      const err = error as AxiosError
      if (err.response?.status === 422) {
        toast.error('Chỉnh sửa lịch sử XCD thất bại!\nThiếu dữ liệu')
      } else {
        toast.error('Chỉnh sửa lịch sử XCD thất bại!')
      }
    }
  }
)

export const deleteMaintainProduct = createAsyncThunk(`appProduct/maintain/delete`, async (id: string) => {
  try {
    const response = await productApi.deleteMaintain(id)
    if (response.status === 200) {
      toast.success('Xoá lịch sử XCD thành công!')
    }

    return response.data
  } catch (error) {
    toast.error('Xoá lịch sử XCD thất bại!')
  }
})

export const appProductSlice = createSlice({
  name: 'appProduct',
  initialState: {
    products: [] as Product[],
    amount: 0,
    loading: false
  },
  reducers: {
    isLoading: state => {
      state.loading = true
    }
  },
  extraReducers: builder => {
    builder.addCase(getListProduct.pending, state => {
      state.loading = true
    })
    builder.addCase(getListProduct.fulfilled, (state, action) => {
      state.products = action.payload.products
      state.amount = action.payload.amount
      state.loading = false
    })
  }
})
export const { isLoading } = appProductSlice.actions
export default appProductSlice.reducer
