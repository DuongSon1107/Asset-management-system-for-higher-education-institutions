import { Card, Grid } from '@mui/material'
import TableHeader from './TableHeader'
import { useEffect, useState } from 'react'

import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '@/store'
import { useAuth } from '@/hooks/useAuth'
import { ROLE, STATE } from '@/api/enum'
import { getListMaker } from '@/store/reducers/maker'

// import { DataGrid } from '@mui/x-data-grid'
// import { useDispatch } from 'react-redux'
// import { AppDispatch, RootState } from '@/store'
// import { useSelector } from 'react-redux'

export default function Page() {
  const [searchValue, setSearchValue] = useState<string>('')
  const { user } = useAuth()
  const query =
    user?.role == ROLE.ADMIN
      ? JSON.stringify({
          state: [STATE.ACTIVE, STATE.INACTIVE]
        })
      : JSON.stringify({
          state: [STATE.ACTIVE]
        })
  const dispatch = useDispatch<AppDispatch>()
  const store = useSelector((state: RootState) => state.maker)

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    dispatch(getListMaker({ query: query }))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch])

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    console.log(store)
  })

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card>
          <TableHeader value={searchValue} handleFilter={setSearchValue} />
          {/* <DataGrid autoHeight rows={} /> */}
        </Card>
      </Grid>
    </Grid>
  )
}
Page.acl = {
  action: 'manage',
  subject: 'history-page'
}
