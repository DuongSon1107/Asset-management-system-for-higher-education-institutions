import {
  ROLE,
  STATE,
  STATE_MAINTAIN,
  TYPE_MACHINE,
  TYPE_WAREHOUSE,
  STATUS_TRANSFER,
  STATUS_TRANSFERDETAIL,
  IMPORT_SCAN,
  STATE_MAINTENANCE,
  TYPE_PERMISSION,
  PAGE_PERMISSION
} from '@/api/enum'

type Account = {
  id: string
  firstName: string
  lastName: string
  displayName: string
  birthday: number
  phone: string
  email: string
  role: ROLE
  deliveryId: string | null
  warehouse: Warehouse
  warehouseId: string | null
  password: string
  rfid: string | null
  token: string | null
  state: STATE | string
  option: string | null
  createdAt: number
  updatedAt: number
}
type Password = {
  oldPassword: string
  newPassword: string
}
type Profile = {
  id: string
  firstName: string
  lastName: string
  displayName: string
  birthday: Date
  phone: string
  email: string
  role: ROLE
  deliveryId: string | null
  warehouse: Warehouse
  warehouseId: string | null
  token: string | null
  state: STATE
  option: string | null
  createdAt: number
  updatedAt: number
}
type Category = {
  id: string
  parentId: string | null
  name: string
  color: string
  description: string
  state: STATE
  option: string | null
  createdAt: number
  updatedAt: number
}

type Delivery = {
  id: string
  name: string
  carNumber: string
  rfid: Rfid[]
  option: string | null
  createdAt: number
  updatedAt: number
  state: STATE_MAINTAIN
}

type Machine = {
  id: string
  name: string
  type: TYPE_MACHINE
  warehouse: Warehouse
  ipAddress: string
  model: string
  warehouseId: string
  location: string
  state: STATE_MAINTAIN
  option: string | null
  createdAt: number
  updatedAt: number
}

type Permission = {
  id: string
  name: string
  type: TYPE_PERMISSION
  page: PAGE_PERMISSION
  description: string
  option: string | null
  state: STATE
}

type Maintenance = {
  id: string
  startDate: number
  finishDate: number
  description: string
  state: STATE_MAINTENANCE
  createdAt: number
  updatedAt: number
}

type Rfid = {
  [x: string]: string
  code: string
  rfid: string
}

type Product = {
  id: string
  name: string
  rfid: Rfid[]
  category: Category
  categoryId: string
  storageWarehouseId: string
  deliveryWarehouseId: string
  currentWarehouseId: string
  storageWarehouse: Warehouse
  deliveryWarehouse: Warehouse
  currentWarehouse: Warehouse
  maintenance: Maintenance
  maintainNext: number
  nextDate: number
  state: STATE_MAINTAIN
  option: string | null
  createdAt: number
  updatedAt: number
}

interface maintainProductParams {
  id?: string
  description: string
  startDate: number
  finishDate?: number | null
  state?: STATE_MAINTENANCE
  option?: string
  createdAt?: number
  updatedAt?: number
}

type Role = {
  id: string
  name: string
  type: ROLE
  description: string
  option: string | null
  state: STATE
  listPermission: Permission[]
}

type TransferProduct = {
  id: string
  scanId?: string | null
  productId: string | null
  product: Product
  categoryId: string | null
  category: Category
  description: string
  status: STATUS_TRANSFERDETAIL
  state: STATE
  option: string
  machineId?: string | null
  machine?: Machine
  import?: IMPORT_SCAN
}

type Takeout = {
  id: string
  title: string | null
  deliveryId: string | null
  delivery: Delivery | null
  accountId: string
  account: Account
  fromWarehouseId: string
  fromWarehouse: Warehouse
  toWarehouseId: string
  toWarehouse: Warehouse
  machineId: string | null
  machine: Machine
  transferDate: number
  status: STATUS_TRANSFER
  state: STATE
  listProduct: TransferProduct[]
  option: string | null
  createdAt: number
  updatedAt: number
}

type Warehouse = {
  id: string
  name: string
  address: string
  type: TYPE_WAREHOUSE
  description: string
  state: STATE
  option: string
  createdAt: number
  updatedAt: number
}

type Maker = {
  id: string
  name: string
  address: string
  type: TYPE_WAREHOUSE
  description: string
  state: STATE
  option: string
  createdAt: number
  updatedAt: number
}

interface getParams {
  query?: string
  id: string
}
interface getListParams {
  limit?: number
  offset?: number
  order?: string
  search?: string
  arrange?: string
  query?: string
}

export type {
  Account,
  Category,
  Delivery,
  Machine,
  Password,
  Maintenance,
  Profile,
  Product,
  Rfid,
  Role,
  Takeout,
  TransferProduct,
  Warehouse,
  Maker,
  getListParams,
  getParams,
  maintainProductParams,
  Permission
}
