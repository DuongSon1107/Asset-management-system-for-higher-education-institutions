import * as React from 'react'
import { DefaultizedPieValueType } from '@mui/x-charts'
import { PieChart, pieArcLabelClasses } from '@mui/x-charts/PieChart'
import { useAuth } from '@/hooks/useAuth'
import { ROLE, STATE_MAINTAIN } from '@/api/enum'
import { useDispatch } from 'react-redux'
import { AppDispatch } from '@/store'
import { useEffect, useState } from 'react'
import { getListMachine } from '@/store/reducers/machine'
import { Card, CardContent, CardHeader } from '@mui/material'
import MachineApi from '@/api/machine'

export default function ScannerChart() {
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

  const [countMachineActive, setCountMachineActive] = useState<number>(0)
  const [countMachineInActive, setCountMachineInActive] = useState<number>(0)
  const [countMachineMaintain, setCountMachineMaintain] = useState<number>(0)

  useEffect(() => {
    dispatch(
      getListMachine({
        query: query
      })
    )

    //Lay so luong may quet dang hoat dong
    const getActiveMachineAmount =async () => {
      const res = await MachineApi.getList({query: JSON.stringify({state: [STATE_MAINTAIN.ACTIVE]})})
      setCountMachineActive(res.data.amount)
    }
    getActiveMachineAmount()

    //Lay so luong product khong hoat dong
    const getInActiveMachineAmount =async () => {
      const res = await MachineApi.getList({query: JSON.stringify({state: [STATE_MAINTAIN.INACTIVE]})})
      setCountMachineInActive(res.data.amount)
    }
    getInActiveMachineAmount()

    //Lay so luong product 
    const getMaintainMachineAmount =async () => {
      const res = await MachineApi.getList({query: JSON.stringify({state: [STATE_MAINTAIN.MAINTAIN]})})
      setCountMachineMaintain(res.data.amount)
    }
    getMaintainMachineAmount()
    

  }, [dispatch, query])

  const data = [
    { id: 0, value: countMachineActive, label: 'Đang họat động' },
    { id: 1, value: countMachineMaintain, label: 'Đang bảo trì' },
    { id: 2, value: countMachineInActive, label: 'Không hoạt động ' }
  ]

  const TOTAL = data.map(item => item.value).reduce((a, b) => a + b, 0)

  const getArcLabel = (params: DefaultizedPieValueType) => {
    const percent = params.value / TOTAL

    return `${(percent * 100).toFixed(0)}%`
  }

  return (
    <Card>
    <CardHeader title='Thống kê số liệu máy quét' />
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
          arcLabelMinAngle: 25, 
        }
      ]}
      />
    </CardContent>
  </Card>
  )
}
