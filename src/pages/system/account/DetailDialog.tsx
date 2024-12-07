import {
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Dialog,
  Stack,
  CardHeader,
  Typography,
  IconButton,
  CircularProgress,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select
} from '@mui/material'
import { Box } from '@mui/system'
import CloseIcon from '@mui/icons-material/Close'
import React, { Dispatch, SetStateAction, useCallback } from 'react'

import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import { useSelector } from 'react-redux'
import { ROLE, STATE } from '@/api/enum'
import { RootState } from '@/store'
import { Account, Maker, Warehouse } from '@/api/types'
import maker from '@/api/maker'
import role from '@/api/role'
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import dayjs from 'dayjs'
import { register } from 'module'

interface Props {
  id: string
  open: boolean
  setOpen: Dispatch<SetStateAction<boolean>>
}
export const DetailDialog = ({ id, setOpen, open }: Props) => {
  const accounts = useSelector((store: RootState) => store.account.accounts).find((item: Account) => item.id == id)
  const handleClose = useCallback(() => {
    setOpen(false)
  }, [setOpen])

  return (
    <Dialog open={open} maxWidth={'md'} fullWidth>
      <DialogTitle>
        <CardHeader
          sx={{ p: 0 }}
          title={<Typography variant='h3'>{'Thông tin tài khoản'}</Typography>}
          action={
            <IconButton aria-label='close' onClick={handleClose}>
              <CloseIcon fontSize='inherit' />
            </IconButton>
          }
        />
      </DialogTitle>
      <Divider variant='middle' />
      <DialogContent>
        <Box component='form'>
          <Grid container spacing={20} padding={10} paddingBottom={5}>
            <Grid item xs={12} sm={6} xl={7} md={6}>
              <Stack spacing={5} direction='row' sx={{ marginBottom: 10 }}>
                <TextField
                  name='lastName'
                  type='text'
                  id='lastName'
                  label='Họ và tên đệm'
                  variant='standard'
                  color='secondary'
                  defaultValue={accounts?.lastName}
                  InputLabelProps={{ style: { color: '#000000' } }}
                  fullWidth
                  InputProps={{
                    readOnly: true
                  }}
                />
                <TextField
                  name='firstName'
                  type='text'
                  id='firstName'
                  label='Tên'
                  variant='standard'
                  defaultValue={accounts?.firstName}
                  color='secondary'
                  InputLabelProps={{ style: { color: '#000000' } }}
                  fullWidth
                  InputProps={{
                    readOnly: true
                  }}
                />
              </Stack>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label='Ngày sinh'
                  format='DD/MM/YYYY'
                  defaultValue={dayjs(new Date(accounts ? accounts?.birthday : ''))}
                  sx={{ mb: 10 }}
                  slotProps={{
                    textField: {
                      name: 'birthday',
                      fullWidth: true,
                      InputProps: {
                        endAdornment: null, // Remove the DatePicker icon
                        readOnly: true
                      },
                      variant: 'standard',
                      InputLabelProps: { style: { color: '#000000' } },
                      color: 'secondary'
                    }
                  }}
                />
              </LocalizationProvider>
              <TextField
                name='phone'
                fullWidth
                id='phone'
                type='text'
                sx={{ mb: 10 }}
                label='Số điện thoại'
                variant='standard'
                InputLabelProps={{ style: { color: '#000000' } }}
                color='secondary'
                inputProps={{ maxLength: 10 }}
                defaultValue={accounts?.phone}
                InputProps={{
                  readOnly: true
                }}
              />
              <TextField
                name='email'
                id='email'
                sx={{ mb: 10 }}
                fullWidth
                type='text'
                defaultValue={accounts?.email}
                label='Email'
                color='secondary'
                InputLabelProps={{ style: { color: '#000000' } }}
                variant='standard'
                InputProps={{
                  readOnly: true
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6} xl={5} md={6}>
              <Stack spacing={0} direction='column'>
                <TextField
                  label='Vai trò'
                  name='role'
                  sx={{ mb: 10 }}
                  id='role'
                  defaultValue={
                    accounts?.role == ROLE.ADMIN
                      ? 'Quản trị viên'
                      : accounts?.role == ROLE.MAKER
                      ? 'Maker'
                      : accounts?.role == ROLE.WAREHOUSE
                      ? 'Quản lý kho'
                      : 'Nhân viên'
                  }
                  color='secondary'
                  variant='standard'
                  InputProps={{
                    readOnly: true
                  }}
                />

                {accounts?.role === ROLE.MAKER || accounts?.role === ROLE.WAREHOUSE ? (
                  <TextField
                    label='Kho'
                    name='warehouseId'
                    InputProps={{
                      readOnly: true
                    }}
                    sx={{ mb: 10 }}
                    id='warehouseId'
                    defaultValue={accounts?.warehouse ? accounts.warehouse?.name : ''}
                    InputLabelProps={{ style: { color: '#000000' } }}
                    variant='standard'
                    color='secondary'
                  />
                ) : (
                  ''
                )}

                <TextField
                  name='state'
                  sx={{ mb: 10 }}
                  color='secondary'
                  InputLabelProps={{ style: { color: '#000000' } }}
                  label='Trạng thái'
                  defaultValue={accounts?.state == STATE.ACTIVE ? 'Đang hoạt động' : 'Không hoạt động'}
                  variant='standard'
                />
              </Stack>
            </Grid>
          </Grid>
        </Box>
      </DialogContent>
      <Divider variant='middle' />

      <DialogActions sx={{ pt: 5 }}>
        <Button variant='outlined' onClick={handleClose} color='error'>
          Đóng
        </Button>
      </DialogActions>
    </Dialog>
  )
}
