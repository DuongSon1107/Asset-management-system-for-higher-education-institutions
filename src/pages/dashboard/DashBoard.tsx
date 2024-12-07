import { Box } from '@mui/system'
import React, { useEffect, useState } from 'react'
import { Card, CardContent, Grid, Typography } from '@mui/material'
import TakeOutChart from './TakeOutChart'
import ScannerChart from './ScannerChart'
import SpeVerhicleChart from './SpeVerhicleChart'
import dashboardApi from '@/api/dashboard'
import dayjs, { Dayjs } from 'dayjs'
import { format } from 'date-fns'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'

interface HistoryByDay {
  find: number
  scanning: number
  tranfer: number
  success: number
  fail: number
  sum: number
  day: string
}

function DashBoard() {
  const current = format(new Date(), 'MM/dd/yyyy')
  const [currentTakeoutHistory, setCurrentTakeoutHistory] = useState<HistoryByDay>()
  const [selectedDate, setSelectedDate] = React.useState<Dayjs | null>(dayjs(current))

  useEffect(() => {
    const formatDateToString = selectedDate?.format('MM/DD/YYYY')
    formatDateToString ? getHistoryByDay(formatDateToString) : getHistoryByDay(current)
  }, [selectedDate, current])

  const getHistoryByDay = async (date: string) => {
    const res = await dashboardApi.getHistoryTakeoutByDay(date)

    setCurrentTakeoutHistory(res)
  }

  return (
    <Box>
      <Grid container spacing={2} rowGap={4} sx={{ width: '1000px' }}>
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Grid container spacing={2} rowGap={4}>
                <Grid item xs={10}>
                  <Typography variant='h3'>
                    Thống kê số liệu Takeout ngày {selectedDate?.format('DD/MM/YYYY')}
                  </Typography>
                </Grid>
                <Grid item xs={2}>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      defaultValue={selectedDate}
                      format='DD/MM/YYYY'
                      onChange={date => {
                        setSelectedDate(date)
                      }}
                      sx={{ width: '100%' }}
                    />
                  </LocalizationProvider>
                </Grid>
                <Grid item xs={2}>
                  <Card>
                    <CardContent
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        backgroundColor: '#b800d8'
                      }}
                    >
                      <Typography fontSize={36} color={'#FFFFFF'}>
                        {currentTakeoutHistory?.sum}
                      </Typography>
                      <Typography fontSize={18} color={'#FFFFFF'}>
                        Số lượng
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={2}>
                  <Card>
                    <CardContent
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        backgroundColor: '#FF9933'
                      }}
                    >
                      <Typography fontSize={36} color={'#FFFFFF'}>
                        {currentTakeoutHistory?.find}
                      </Typography>
                      <Typography fontSize={18} color={'#FFFFFF'}>
                        Đang tìm xe
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={2}>
                  <Card>
                    <CardContent
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        backgroundColor: '#00BB00'
                      }}
                    >
                      <Typography fontSize={36} color={'#FFFFFF'}>
                        {currentTakeoutHistory?.scanning}
                      </Typography>
                      <Typography fontSize={18} color={'#FFFFFF'}>
                        Đang quét
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={2}>
                  <Card>
                    <CardContent
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        backgroundColor: '#2e96ff'
                      }}
                    >
                      <Typography fontSize={36} color={'#FFFFFF'}>
                        {currentTakeoutHistory?.tranfer}
                      </Typography>
                      <Typography fontSize={18} color={'#FFFFFF'}>
                        Đang vận chuyển
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={2}>
                  <Card>
                    <CardContent
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        backgroundColor: '#02b2af'
                      }}
                    >
                      <Typography fontSize={36} color={'#FFFFFF'}>
                        {currentTakeoutHistory?.success}
                      </Typography>
                      <Typography fontSize={18} color={'#FFFFFF'}>
                        Thành công
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={2}>
                  <Card>
                    <CardContent
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        backgroundColor: '#F08080'
                      }}
                    >
                      <Typography fontSize={36} color={'#FFFFFF'}>
                        {currentTakeoutHistory?.fail}
                      </Typography>
                      <Typography fontSize={18} color={'#FFFFFF'}>
                        Bị hủy
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <TakeOutChart />
        </Grid>

        <Grid item xs={6}>
          <ScannerChart />
        </Grid>
        <Grid item xs={6}>
          <SpeVerhicleChart />
        </Grid>
      </Grid>
    </Box>
  )
}

export default DashBoard
