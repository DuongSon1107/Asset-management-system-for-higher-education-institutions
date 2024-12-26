enum ROLE {
  ADMIN = 'ADMIN',
  WAREHOUSE = 'WAREHOUSE',
  DELIVERY = 'DELIVERY',
  MAKER = 'MAKER',
  STAFF = 'STAFF'
}
enum STATE {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE'
}
enum STATE_MAINTENANCE {
  DOING = 'DOING',
  COMPLETED = 'COMPLETED'
}
enum STATE_MAINTAIN {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  MAINTAIN = 'MAINTAIN'
}
enum TYPE_MACHINE {
  FIXED = 'FIXED',
  MOVING = 'MOVING'
}
enum TYPE_WAREHOUSE {
  MAKER = 'MAKER',
  HONDA = 'HONDA',
  OTHER = 'OTHER'
}
enum STATUS_TRANSFER {
  FIND = 'FIND',
  SCANNING = 'SCANNING',
  TRANSFER = 'TRANSFER',
  SUCCESS = 'SUCCESS'
}
enum STATUS_TRANSFERDETAIL {
  CANCEL = 'CANCEL',
  SOLVE = 'SOLVE',
  TRANSPORT = 'TRANSPORT',
  SUCCESS = 'SUCCESS'
}
enum IMPORT_SCAN {
  SCAN = 'SCAN',
  ENTER = 'ENTER'
}

enum TYPE_PERMISSION {
  CREATE = 'CREATE',
  READ = 'READ',
  UPDATE = 'UPDATE',
  DELETE = 'DELETE',
  MANAGE = 'MANAGE'
}

enum PAGE_PERMISSION {
  TAKEOUT = 'takeout-page',
  MACHINE = 'machine-page',
  PRODUCT = 'product-page',
  WAREHOUSE = 'warehouse-page',
  DELIVERY = 'delivery-page',
  HISTORY = 'history-page',
  MAKER = 'maker-page',
  CATEGORY = 'category-page'
}

enum MAINTAIN_TIME {
  DAY_15 = 86400000 * 15,
  DAY_30 = 86400000 * 30,
  DAY_60 = 86400000 * 60,
  DAY_90 = 86400000 * 90
}

export {
  ROLE,
  STATE,
  STATE_MAINTAIN,
  STATE_MAINTENANCE,
  TYPE_MACHINE,
  TYPE_WAREHOUSE,
  STATUS_TRANSFER,
  STATUS_TRANSFERDETAIL,
  IMPORT_SCAN,
  TYPE_PERMISSION,
  PAGE_PERMISSION,
  MAINTAIN_TIME
}