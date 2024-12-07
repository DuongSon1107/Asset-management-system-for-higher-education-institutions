import React, { Dispatch, SetStateAction, useCallback, useEffect, useState } from 'react'
import {
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Dialog,
  IconButton,
  MenuItem,
  Button,
  Divider,
  InputAdornment,
  CardHeader,
  Typography,
  Stack,
  Grid,
  Tooltip,
  CircularProgress,
  Select,
  InputLabel,
  FormControl
} from '@mui/material'
import { Box } from '@mui/system'
import { AppDispatch, RootState } from '@/store'
import CloseIcon from '@mui/icons-material/Close'
import { useDispatch, useSelector } from 'react-redux'
import VisibilityIcon from '@mui/icons-material/Visibility'
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff'
import { useForm } from 'react-hook-form'
import { ROLE, STATE } from '@/api/enum'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { Account, Maker, Warehouse } from '@/api/types'
import { getListWarehouse } from '@/store/reducers/warehouse'
import { getListMaker } from '@/store/reducers/maker'
import { createAccount } from '@/store/reducers/account'
import { SnackbarAlert } from '@/pages/SnackbarAkert'
import { encrypt } from '@/@core/layouts/components/shared-components/footer/EncryptHandler'
import PasswordIcon from '@mui/icons-material/Password'
import { generatePassword } from '@/pages/generatePassword'

interface Props {
  handleCreate: () => void
  open: boolean
  setOpen: Dispatch<SetStateAction<boolean>>
  roleAccount?: ROLE
  storeId?: string
}
export const AddDialog = ({ handleCreate, setOpen, roleAccount, storeId, open }: Props) => {
  const dispatch = useDispatch<AppDispatch>()

  const warehouses = useSelector((store: RootState) => store.warehouse.warehouses)
  const maker = useSelector((store: RootState) => store.maker.makers)
  const [role, setRole] = React.useState<ROLE | undefined>(roleAccount)
  const { register, handleSubmit, formState, getValues, setValue, clearErrors, resetField } = useForm<Account>({
    defaultValues: {
      firstName: '',
      lastName: '',
      phone: '',
      email: '',
      birthday: undefined,
      role: undefined,
      warehouseId: '',
      state: '',
      password: ''
    }
  })
  const { errors } = formState
  const [loading, setLoading] = useState(false)
  const [alert, setAlert] = useState<boolean>(false)
  const onSubmit = useCallback(async () => {
    setLoading(true)
    const hash = encrypt(getValues('password'))
    setValue('password', hash)
    const res = await dispatch(createAccount(getValues() as Account))
    switch (res.meta.requestStatus) {
      case 'fulfilled':
        handleCreate()
      case 'rejected':
        setAlert(true)
        resetField('password')
        setLoading(false)
    }
  }, [dispatch, getValues, handleCreate, resetField, setValue])

  const [eye, setEye] = React.useState<boolean>(false)
  const ITEM_HEIGHT = 48
  const ITEM_PADDING_TOP = 8
  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: 250
      }
    }
  }

  const handleEyeClick = useCallback(() => setEye(!eye), [eye])
  const handleClose = useCallback(() => {
    setOpen(false)
  }, [setOpen])

  useEffect(() => {
    dispatch(
      getListWarehouse({
        query: JSON.stringify({
          state: [STATE.ACTIVE]
        })
      })
    )
    dispatch(
      getListMaker({
        query: JSON.stringify({
          state: [STATE.ACTIVE]
        })
      })
    )
  }, [dispatch])

  return (
    <Dialog open={open} maxWidth={'md'} fullWidth>
      <DialogTitle>
        <CardHeader
          sx={{ p: 0 }}
          title={<Typography variant='h3'>{'Thêm tài khoản'}</Typography>}
          action={
            <IconButton aria-label='close' onClick={handleClose}>
              <CloseIcon fontSize='inherit' />
            </IconButton>
          }
        />
      </DialogTitle>
      <Divider variant='middle' />
      <DialogContent>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 300 }}>
            <CircularProgress />
          </Box>
        ) : (
          <Box component='form' onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={20} padding={10} paddingBottom={5}>
              <Grid item xs={12} sm={6} xl={7} md={6}>
                <Stack spacing={5} direction='row' sx={{ marginBottom: 10 }}>
                  <TextField
                    {...register('lastName', { required: 'Yêu cầu họ và tên đệm!' })}
                    name='lastName'
                    type='text'
                    id='lastName'
                    label='Họ và tên đệm'
                    variant='standard'
                    focused
                    color='secondary'
                    InputLabelProps={{ style: { color: '#000000' } }}
                    onChange={() => clearErrors('lastName')}
                    fullWidth
                    error={!!errors.lastName}
                    helperText={errors.lastName?.message?.toString()}
                  />
                  <TextField
                    {...register('firstName', { required: 'Yêu cầu tên!' })}
                    name='firstName'
                    type='text'
                    id='firstName'
                    label='Tên'
                    variant='standard'
                    focused
                    color='secondary'
                    onChange={() => clearErrors('firstName')}
                    InputLabelProps={{ style: { color: '#000000' } }}
                    fullWidth
                    error={!!errors.firstName}
                    helperText={errors.firstName?.message?.toString()}
                  />
                </Stack>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    {...register('birthday', { required: 'Yêu cầu ngày sinh !' })}
                    label='Ngày sinh'
                    onChange={(newValue: any) => setValue('birthday', new Date(newValue).getTime())}
                    onSelectedSectionsChange={() => clearErrors('birthday')}
                    format='DD/MM/YYYY'
                    slotProps={{
                      textField: {
                        name: 'birthday',
                        fullWidth: true,
                        variant: 'standard',
                        InputLabelProps: { style: { color: '#000000' } },
                        focused: true,
                        color: 'secondary',
                        onChange: () => clearErrors('birthday'),
                        error: !!errors.birthday,
                        helperText: errors.birthday?.message?.toString()
                      }
                    }}
                    sx={{ mb: 10 }}
                  />
                </LocalizationProvider>
                <TextField
                  {...register('phone', {
                    required: 'Yêu cầu số điện thoại!',
                    pattern: {
                      value: /^\d{10}$/,
                      message: 'Số điện thoại không hợp lệ'
                    }
                  })}
                  name='phone'
                  fullWidth
                  id='phone'
                  type='text'
                  sx={{ mb: 10 }}
                  onChange={() => clearErrors('phone')}
                  label='Số điện thoại'
                  variant='standard'
                  focused
                  InputLabelProps={{ style: { color: '#000000' } }}
                  color='secondary'
                  inputProps={{ maxLength: 10 }}
                  error={!!errors.phone}
                  helperText={errors.phone?.message?.toString()}
                />
                <TextField
                  {...register('email', {
                    required: 'Yêu cầu email !',
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: 'Email không đúng định dạng !'
                    }
                  })}
                  name='email'
                  id='email'
                  sx={{ mb: 10 }}
                  fullWidth
                  type='text'
                  onChange={() => clearErrors('email')}
                  label='Email'
                  color='secondary'
                  InputLabelProps={{ style: { color: '#000000' } }}
                  variant='standard'
                  focused
                  error={!!errors.email}
                  helperText={errors.email?.message?.toString()}
                />
              </Grid>
              <Grid item xs={12} sm={6} xl={5} md={6}>
                <Stack spacing={0} direction='column'>
                  <FormControl variant='standard' focused>
                    <InputLabel id='role' style={{ color: '#000000' }}>
                      Vai trò
                    </InputLabel>
                    <Select
                      {...register('role', { required: 'Yêu cầu vai trò!' })}
                      name='role'
                      sx={{ mb: 10 }}
                      id='role'
                      color='secondary'
                      variant='standard'
                      onChange={(e: any) => {
                        clearErrors('role')
                        if (e.target.value !== role) setValue('warehouseId', '')
                        setRole(e.target.value)
                      }}
                      error={!!errors.role}
                    >
                      <MenuItem value={ROLE.ADMIN}>Admin</MenuItem>
                      <MenuItem value={ROLE.MAKER}>Nhà sản xuất</MenuItem>
                      <MenuItem value={ROLE.WAREHOUSE}>Quản lí kho</MenuItem>
                      <MenuItem value={ROLE.STAFF}>Nhân viên</MenuItem>
                    </Select>
                  </FormControl>
                  {role !== ROLE.MAKER ? (
                    ''
                  ) : (
                    <TextField
                      {...register('warehouseId', { required: 'Yêu cầu Maker !' })}
                      name='warehouseId'
                      sx={{ mb: 10 }}
                      id='warehouseId'
                      label='Kho'
                      select
                      InputLabelProps={{ style: { color: '#000000' } }}
                      variant='standard'
                      focused
                      color='secondary'
                      defaultValue={storeId}
                      error={!!errors.warehouseId}
                      helperText={errors.warehouseId?.message?.toString()}
                      SelectProps={{ MenuProps: MenuProps }}
                    >
                      {maker.map((item: Maker) => (
                        <MenuItem key={item.id} value={item.id}>
                          {item.name}
                        </MenuItem>
                      ))}
                    </TextField>
                  )}
                  {role !== ROLE.WAREHOUSE ? (
                    ''
                  ) : (
                    <TextField
                      {...register('warehouseId', { required: 'Yêu cầu kho !' })}
                      name='warehouseId'
                      sx={{ mb: 10 }}
                      id='warehouseId'
                      label='Kho'
                      select
                      InputLabelProps={{ style: { color: '#000000' } }}
                      variant='standard'
                      focused
                      color='secondary'
                      defaultValue={storeId}
                      error={!!errors.warehouseId}
                      helperText={errors.warehouseId?.message?.toString()}
                      SelectProps={{ MenuProps: MenuProps }}
                    >
                      {warehouses.map((item: Warehouse) => (
                        <MenuItem key={item.id} value={item.id}>
                          {item.name}
                        </MenuItem>
                      ))}
                    </TextField>
                  )}
                  <TextField
                    {...register('state', { required: 'Yêu cầu trạng thái !' })}
                    name='state'
                    sx={{ mb: 10 }}
                    select
                    color='secondary'
                    InputLabelProps={{ style: { color: '#000000' } }}
                    label='Trạng thái'
                    variant='standard'
                    focused
                    onChange={() => clearErrors('state')}
                    error={!!errors.state}
                    helperText={errors.state?.message?.toString()}
                  >
                    <MenuItem value={STATE.ACTIVE}>Đang hoạt động</MenuItem>
                    <MenuItem value={STATE.INACTIVE}>Không hoạt động</MenuItem>
                  </TextField>
                  <TextField
                    {...register('password', { required: 'Yêu cầu mật khẩu !' })}
                    name='password'
                    id='password'
                    sx={{ mb: 10 }}
                    type={eye ? 'text' : 'password'}
                    label='Mật khẩu'
                    color='secondary'
                    InputLabelProps={{ style: { color: '#000000' } }}
                    variant='standard'
                    focused
                    onChange={() => clearErrors('password')}
                    error={!!errors.password}
                    helperText={errors.password?.message?.toString()}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position='start'>
                          <Tooltip title='Mật khẩu ngẫu nhiên'>
                            <IconButton
                              onClick={() => {
                                setValue('password', generatePassword()), clearErrors('password')
                              }}
                            >
                              <PasswordIcon />{' '}
                            </IconButton>
                          </Tooltip>
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position='end'>
                          <IconButton onClick={handleEyeClick}>
                            {eye ? <VisibilityIcon /> : <VisibilityOffIcon />}
                          </IconButton>
                        </InputAdornment>
                      )
                    }}
                  />
                </Stack>
              </Grid>
            </Grid>
            <Divider variant='middle' />
            <DialogActions sx={{ pt: 5 }}>
              <Button variant='outlined' color='error' onClick={handleClose}>
                Đóng
              </Button>
              <Button variant='contained' color='success' type='submit'>
                Xác nhận
              </Button>
            </DialogActions>
          </Box>
        )}
      </DialogContent>
      {alert && (
        <SnackbarAlert
          open={alert}
          message={'Thông tin đã tồn tại, không thể tạo tài khoản !'}
          setOpen={setAlert}
          severity='error'
        />
      )}
    </Dialog>
  )
}
