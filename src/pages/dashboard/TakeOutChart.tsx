import * as React from 'react'
import { BarChart } from '@mui/x-charts/BarChart'
import { axisClasses } from '@mui/x-charts'
import { Card, CardContent, Grid, Typography } from '@mui/material'
import dashboardApi from '@/api/dashboard'
import { useEffect, useState } from 'react'

export default function TakeOutChart() {
  const [dataSet, setDataSet] = useState([])
  interface HistoryTakeoutCurrentYear {
    success: number
    fail: number
    sum: number
    year: string
  }
  const [takeoutHistoryCurrentYear, setTakeoutHistoryCurrentYear] = useState<HistoryTakeoutCurrentYear>()
  const currentDate = new Date()
  const currentYear = currentDate.getFullYear()

  useEffect(() => {
    getHistory()
  }, [])
  useEffect(() => {
    getHistoryCurrentYear()
  }, [])
  const getHistoryCurrentYear = async () => {
    const res = await dashboardApi.getTakeoutHistoryCurrentYear()

    setTakeoutHistoryCurrentYear(res)
  }

  //getHistory
  const getHistory = async () => {
    const res = await dashboardApi.getTakeoutHistory()

    setDataSet(res.historyTakeout)
  }

  const chartSetting = {
    yAxis: [
      {
        label: 'Số lượng Takeout'
      }
    ],
    height: 450,
    sx: {
      [`.${axisClasses.left} .${axisClasses.label}`]: {
        transform: 'translate(-20px, 0)'
      }
    }
  }

  const valueFormatter = (value: number) => `${value}`

  return (
    <Card sx={{ height: '100%', width: '100%' }}>
      <CardContent>
        <Grid container spacing={2} rowGap={4}>
          <Grid item xs={12}>
            <Typography variant='h3'>Thống kê số liệu Takeout năm {currentYear}</Typography>
          </Grid>
          <Grid item container spacing={2}>
            <Grid item xs={9}>
              <Card>
                <CardContent>
                  {dataSet && dataSet.length !== 0 ? (
                    <BarChart
                      dataset={dataSet}
                      xAxis={[
                        { scaleType: 'band', dataKey: 'month', label: `Biểu đồ Takeout trong năm ${currentYear}` }
                      ]}
                      series={[
                        { dataKey: 'takeoutSuccess', label: 'Thành công', valueFormatter, color: '#02b2af' },
                        { dataKey: 'takeoutFail', label: 'Bị hủy', valueFormatter, color: '#F08080' }
                      ]}
                      {...chartSetting}
                      sx={{ margin: 0, padding: 0, border: 'none', boxShadow: 'none' }}
                    ></BarChart>
                  ) : null}
                  </CardContent>
                </Card>
            </Grid>
            <Grid item xs={3} container direction='column' spacing={2}>
              <Grid item xs={4}>
                <Card sx={{ height: '100%' }}>
                  <CardContent
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      backgroundColor: '#b800d8',
                      height: '100%',
                    }}
                  >
                    <Typography fontSize={18} color={'#FFFFFF'}>Số lượng Takeout</Typography>
                    <Typography fontSize={36} color={'#FFFFFF'}>{takeoutHistoryCurrentYear?.sum}</Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={4}>
                <Card sx={{ height: '100%' }}>
                  <CardContent
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      backgroundColor: '#F08080',
                      height: '100%'
                    }}
                  >
                    <Typography fontSize={18} color={'#FFFFFF'}>Số lượng Takeout bị hủy</Typography>
                    <Typography fontSize={36} color={'#FFFFFF'}>{takeoutHistoryCurrentYear?.fail}</Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={4}>
                <Card sx={{ height: '100%' }}>
                  <CardContent
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      backgroundColor: '#02b2af',
                      height: '100%'
                    }}
                  >
                    <Typography fontSize={18} color={'#FFFFFF'}>Số lượng Takeout thành công</Typography>
                    <Typography fontSize={36} color={'#FFFFFF'}>{takeoutHistoryCurrentYear?.success}</Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  )
}
