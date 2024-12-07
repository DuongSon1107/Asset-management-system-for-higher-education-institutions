import {
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Dialog,
  IconButton,
  MenuItem,
  InputAdornment,
  CardHeader,
  Typography,
  CircularProgress,
  Grid,
  FormControl,
  InputLabel,
  Select,
  Tooltip
} from '@mui/material'
import PasswordIcon from '@mui/icons-material/Password'
import { Box, Stack } from '@mui/system'
import CloseIcon from '@mui/icons-material/Close'
import React, { Dispatch, SetStateAction, useCallback, useEffect, useState } from 'react'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import { useDispatch, useSelector } from 'react-redux'
import VisibilityIcon from '@mui/icons-material/Visibility'
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff'
import { useForm } from 'react-hook-form'
import { ROLE, STATE } from '@/api/enum'
import { Account, Maker, Warehouse } from '@/api/types'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { getListWarehouse } from '@/store/reducers/warehouse'
import { getListMaker } from '@/store/reducers/maker'
import { AppDispatch, RootState } from '@/store'
import { updateAccount } from '@/store/reducers/account'
import { SnackbarAlert } from '@/pages/SnackbarAkert'
import RestartAltIcon from '@mui/icons-material/RestartAlt'
import { encrypt } from '@/@core/layouts/components/shared-components/footer/EncryptHandler'
import { generatePassword } from '@/pages/generatePassword'
import dayjs from 'dayjs'

interface Props {
  id: string
  handleUpdate: () => void
  open: boolean
  setOpen: Dispatch<SetStateAction<boolean>>
}
export const EditDialog = ({ id, setOpen, handleUpdate, open }: Props) => {
  const dispatch = useDispatch<AppDispatch>()

  const warehouses = useSelector((store: RootState) => store.warehouse.warehouses)
  const accounts = useSelector((store: RootState) => store.account.accounts).find((item: Account) => item.id === id)
  const maker = useSelector((store: RootState) => store.maker.makers)

  const [alert, setAlert] = useState<boolean>(false)

  const { register, handleSubmit, formState, getValues, setValue, clearErrors, resetField } = useForm<Account>({
    defaultValues: {
      firstName: accounts?.firstName,
      lastName: accounts?.lastName,
      phone: accounts?.phone,
      email: accounts?.email,
      birthday: accounts?.birthday,
      role: accounts?.role,
      warehouseId: accounts?.warehouseId,
      state: accounts?.state,
      password: ''
    }
  })
  const { errors } = formState

  const [loading, setLoading] = useState(false)

  const onSubmit = useCallback(async () => {
    // setValue('password', await bcrypt.hash(getValues('password'), 10))
    const hash = encrypt(getValues('password'))
    setValue('password', hash)
    const res = await dispatch(updateAccount({ id: id, account: getValues() as Account }))
    switch (res.meta.requestStatus) {
      case 'fulfilled':
        handleUpdate()
      case 'rejected':
        setAlert(true)
    }
  }, [dispatch, getValues, handleUpdate, id, setValue])

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
    // setValue('birthday', accounts.birthday)
  }, [dispatch, setValue])

  const [eye, setEye] = React.useState<boolean>(false)
  const [resetPass, setResetPass] = React.useState<boolean>(false)

  const [role, setRole] = React.useState<ROLE | undefined>(accounts?.role)

  const handleEyeClick = useCallback(() => setEye(!eye), [eye])
  const handleClose = useCallback(() => {
    setOpen(false)
  }, [setOpen])

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
  console.log(accounts?.role)

  return (
    <Dialog open={open} maxWidth={'md'} fullWidth>
      <DialogTitle>
        <CardHeader
          sx={{ p: 0 }}
          title={<Typography variant='h3'>{'Chỉnh sửa tài khoản'}</Typography>}
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
                    label='Ngày sinh'
                    onChange={(newValue: any) => setValue('birthday', new Date(newValue).getTime())}
                    onSelectedSectionsChange={() => clearErrors('birthday')}
                    format='DD/MM/YYYY'
                    defaultValue={dayjs(new Date(accounts ? accounts?.birthday : ''))}
                    slotProps={{
                      textField: {
                        ...register('birthday', { required: 'Yêu cầu ngày sinh !' }),
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
                      defaultValue={accounts?.role}
                      color='secondary'
                      // inputProps={{ ...register('role', { required: 'Yêu cầu vai trò!' }) }}
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
                      defaultValue={accounts?.warehouseId}
                      InputLabelProps={{ style: { color: '#000000' } }}
                      variant='standard'
                      focused
                      color='secondary'
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
                      defaultValue={accounts?.warehouseId}
                      InputLabelProps={{ style: { color: '#000000' } }}
                      variant='standard'
                      focused
                      color='secondary'
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
                    defaultValue={accounts?.state}
                    variant='standard'
                    focused
                    onChange={() => clearErrors('state')}
                    error={!!errors.state}
                    helperText={errors.state?.message?.toString()}
                  >
                    <MenuItem value={STATE.ACTIVE}>Đang hoạt động</MenuItem>
                    <MenuItem value={STATE.INACTIVE}>Không hoạt động</MenuItem>
                  </TextField>

                  {resetPass ? (
                    <FormControl>
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
                      <Button
                        variant='tonal'
                        onClick={() => {
                          setResetPass(false), setValue('password', '')
                        }}
                      >
                        {' '}
                        Hủy
                      </Button>
                    </FormControl>
                  ) : (
                    <FormControl variant='standard' focused>
                      {/* <InputLabel id='role' style={{ color: '#000000' }}>
                        Mật khẩu
                      </InputLabel> */}
                      <Button
                        variant='tonal'
                        onClick={() => {
                          setResetPass(true)
                        }}
                      >
                        {' '}
                        Khôi phục mật khẩu
                        <RestartAltIcon />
                      </Button>
                    </FormControl>
                  )}
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
        <SnackbarAlert open={alert} message={'Thông tin nhập vào đã tồn tại !'} setOpen={setAlert} severity='error' />
      )}
    </Dialog>
  )
}
