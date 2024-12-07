// ** Type import
import { HorizontalNavItemsType } from '@/@core/layouts/types'

const navigation = (): HorizontalNavItemsType => [
  {
    title: 'Dashboard',
    path: '/dashboard',
    icon: 'material-symbols:dashboard-outline'
  },
  {
    title: 'Quản lý',
    icon: 'eos-icons:file-system-outlined',
    children: [
      {
        title: 'Takeout',
        subject: 'takeout-page',
        icon: 'solar:bill-list-linear',
        path: '/manage/takeout'
      },
      {
        title: 'Máy quét',
        subject: 'machine-page',
        icon: 'material-symbols:scanner',
        path: '/manage/machine'
      },
      {
        title: 'Xe chuyên dụng',
        subject: 'product-page',
        icon: 'tabler:trolley',
        path: '/manage/product'
      },
      {
        title: 'Kho',
        subject: 'warehouse-page',
        icon: 'ic:outline-warehouse',
        path: '/manage/warehouse'
      },
      {
        title: 'Maker',
        subject: 'maker-page',
        icon: 'material-symbols:factory-outline',
        path: '/manage/maker'
      },
      {
        title: 'Xe chở hàng',
        subject: 'delivery-page',
        icon: 'iconamoon:delivery-fast-bold',
        path: '/manage/delivery'
      },
      {
        title: 'Lịch sử',
        subject: 'history-page',
        icon: 'material-symbols:history',
        path: '/manage/history'
      }
    ]
  },
  {
    title: 'Hệ thống',
    icon: 'fluent-mdl2:file-system',
    children: [
      {
        title: 'Loại xe',
        subject: 'category-page',
        icon: 'carbon:category',
        path: '/system/category'
      },
      {
        title: 'Tài khoản',
        subject: 'account-page',
        icon: 'mdi:account-outline',
        path: '/system/account'
      },
      {
        title: 'Phân quyền',
        subject: 'role-page',
        icon: 'ic:baseline-category',
        path: '/system/role'
      },
      {
        title: 'Cài đặt',
        subject: 'setting-page',
        icon: 'uiw:setting-o',
        path: '/system/setting'
      }
    ]
  }
]

export default navigation
