import * as React from 'react'
import { PieChart, pieArcLabelClasses } from '@mui/x-charts/PieChart'
import { DefaultizedPieValueType } from '@mui/x-charts'
import { useAuth } from '@/hooks/useAuth'
import { ROLE, STATE_MAINTAIN } from '@/api/enum'
import { useDispatch } from 'react-redux'
import { AppDispatch} from '@/store'
import { useCallback, useEffect, useState } from 'react'
import { getListProduct } from '@/store/reducers/product'
import { Card, CardContent, CardHeader } from '@mui/material'
import productApi from '@/api/product'

export default function SpeVerhicleChart() {
  const { user } = useAuth()
  const query =
    user?.role == ROLE.ADMIN
      ? JSON.stringify({
          state: [STATE_MAINTAIN.ACTIVE, STATE_MAINTAIN.INACTIVE, STATE_MAINTAIN.MAINTAIN]
        })
      : JSON.stringify({
          state: [STATE_MAINTAIN.ACTIVE, STATE_MAINTAIN.MAINTAIN]
        })
  const dispatch = useDispatch<AppDispatch>()

  const fetchProduct = useCallback(() => {
    dispatch(
      getListProduct({
        query: query
      })
    )
  }, [dispatch, query])

  useEffect(() => {
    fetchProduct()

    //Lay so luong product dang hoat dong
    const getActiveProductAmount =async () => {
      const res = await productApi.getList({query: JSON.stringify({state: [STATE_MAINTAIN.ACTIVE]})})
      setCountProductActive(res.data.amount)
    }
    getActiveProductAmount()

    //Lay so luong product khong hoat dong
    const getInActiveProductAmount =async () => {
      const res = await productApi.getList({query: JSON.stringify({state: [STATE_MAINTAIN.INACTIVE]})})
      setCountProductInActive(res.data.amount)
    }
    getInActiveProductAmount()

    //Lay so luong product 
    const getMaintainProductAmount =async () => {
      const res = await productApi.getList({query: JSON.stringify({state: [STATE_MAINTAIN.MAINTAIN]})})
      setCountProductMaintain(res.data.amount)
    }
    getMaintainProductAmount()
    

  }, [fetchProduct])

  //const product = useSelector((store: RootState) => store.product)
  const [countProductActive, setCountProductActive] = useState<number>(0)
  const [countProductInActive, setCountProductInActive] = useState<number>(0)
  const [countProductMaintain, setCountProductMaintain] = useState<number>(0)

  const data = [
    { id: 0, value: countProductActive, label: 'Đang họat động' },
    { id: 1, value: countProductMaintain, label: 'Đang bảo trì' },
    { id: 2, value: countProductInActive, label: 'Không hoạt động ' }
  ]

  const TOTAL = data.map(item => item.value).reduce((a, b) => a + b, 0)

  const getArcLabel = (params: DefaultizedPieValueType) => {
    const percent = params.value / TOTAL

    return `${(percent * 100).toFixed(0)}%`
  }

  return (
    <Card>
      <CardHeader title='Thống kê số liệu xe chuyên dụng' />
      <CardContent sx={{height: 250}}>
        <PieChart
          sx={{
            margin: 0,
            padding: 0,
            border: 'none',
            [`& .${pieArcLabelClasses.root}`]: {
              fill: 'white',
              fontSize: 14
            }
          }}
          series={[
            {
              data,
              arcLabel: getArcLabel,
              arcLabelMinAngle: 25
            }
          ]}
        />
      </CardContent>
    </Card>
  )
}
