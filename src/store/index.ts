import { configureStore } from '@reduxjs/toolkit'
import category from './reducers/category'
import machine from './reducers/machine'
import product from './reducers/product'
import role from './reducers/role'
import takeout from './reducers/takeout'
import warehouse from './reducers/warehouse'
import account from './reducers/account'
import maker from './reducers/maker'
import delivery from './reducers/delivery'
import permission from './reducers/permission'
import user from './reducers/user'

const store = configureStore({
  reducer: {
    account,
    category,
    user,
    machine,
    product,
    role,
    takeout,
    warehouse,
    maker,
    delivery,
    permission
  },
  
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export default store
