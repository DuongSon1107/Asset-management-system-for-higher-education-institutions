import { Card, CardContent, CardHeader, Grid, Tab, Tabs } from '@mui/material'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '@/store'
import { getListRole } from '@/store/reducers/role'
import { getListAccount } from '@/store/reducers/account'
import { getListPermission } from '@/store/reducers/permission'
import { Role } from '@/api/types'
import { CustomTabPanel } from './CustomTabPanel'

export default function Page() {
  const dispatch = useDispatch<AppDispatch>()
  const role = useSelector((store: RootState) => store.role.roles)
  const [tab, setTab] = React.useState<number>(0)
  useEffect(() => {
    dispatch(getListRole())
    dispatch(getListAccount({}))
    dispatch(getListPermission())
  }, [dispatch])
  const handleChangeTab = (event: React.SyntheticEvent, newValue: number) => {
    setTab(newValue)
  }

  return (
    <Grid container spacing={6}>
      <Grid item xs={12} xl={3} sm={3} lg={3}>
        <Card variant='outlined' sx={{ height: '100%' }}>
          <CardHeader title='Danh sách vai trò' />
          <CardContent sx={{ borderColor: 'red' }}>
            <Tabs
              orientation='vertical' // Đặt orientation thành "vertical"
              variant='standard' // Chọn variant "scrollable" để xử lý trường hợp nhiều tab
              value={tab}
              onChange={handleChangeTab}
            >
              {role.map((role: Role, index: number) => (
                <Tab id={role.name} key={index} label={role.name} sx={{ m: 5 }} />
              ))}
            </Tabs>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} xl={9} sm={9} lg={9}>
        <Card variant='outlined' sx={{ height: '100%' }}>
          <CardHeader title='Các quyền'></CardHeader>
          <CardContent>
            {role.map((role: Role, index: number) => (
              <CustomTabPanel tab={tab} value={index} key={index} role={role} />
            ))}
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  )
}
