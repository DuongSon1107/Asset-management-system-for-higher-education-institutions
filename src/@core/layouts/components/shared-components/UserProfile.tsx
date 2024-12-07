import { Account } from '@/api/types'
import {
  Box,
  Button,
  CardActions,
  CardHeader,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  Slide,
  Stack,
  TextField
} from '@mui/material'
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import dayjs, { Dayjs } from 'dayjs'
import React, { Dispatch, SetStateAction, useCallback, useEffect, useState } from 'react'
import EditIcon from '@mui/icons-material/Edit'
import { useDispatch } from 'react-redux'
import { AppDispatch, RootState } from '@/store'
import { TransitionProps } from '@mui/material/transitions'
import { getProfile, updateProfile } from '@/store/reducers/user'
import { useSelector } from 'react-redux'

interface Props {
  open: boolean
  setOpen: Dispatch<SetStateAction<boolean>>
}

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction='down' ref={ref} {...props} />
})

export const UserProfile = ({ open, setOpen }: Props) => {
  const dispatch = useDispatch<AppDispatch>()
  const data = useSelector((root: RootState) => root.user.user)
  const fetchAccount = useCallback(() => {
    setLoading(true)
    dispatch(getProfile()).then(() => {
      setLoading(false), setBirthdayjs(dayjs(new Date(data.birthday)))
    })
  }, [data.birthday, dispatch])
  useEffect(() => {
    fetchAccount()
  }, [dispatch, fetchAccount])
  const [editable, setEditable] = useState<boolean>(false)
  const [loading, setLoading] = useState(false)
  const [firstName, setFirstName] = useState<string>(data.firstName)
  const [lastName, setLastName] = useState<string>(data.lastName)
  const [birthday, setBirthday] = useState<number>()
  const [birthdayjs, setBirthdayjs] = useState<Dayjs | null>()

  const handleSaveEdit = useCallback(() => {
    fetchAccount()
    setEditable(false)
  }, [fetchAccount])
  const onSubmit = useCallback(async () => {
    const res = await dispatch(
      updateProfile({
        id: data ? data.id : '',
        profile: { firstName: firstName, lastName: lastName, birthday: birthday } as unknown as Account
      })
    )
    if (res.meta.requestStatus === 'fulfilled') {
      handleSaveEdit()
    } else {
      console.log('first')
    }
  }, [birthday, data, dispatch, firstName, handleSaveEdit, lastName])
  const handleClose = useCallback(() => {
    setOpen(false)
  }, [setOpen])

  const handleEditClick = useCallback(() => {
    setFirstName(data.firstName)
    setLastName(data.lastName)
    setBirthday(data.birthday)
    setBirthdayjs(dayjs(new Date(data.birthday)))
    setEditable(true)
  }, [data.birthday, data.firstName, data.lastName])

  const handleCancelEdit = () => {
    setFirstName(data.firstName)
    setLastName(data.lastName)
    setBirthdayjs(dayjs(new Date(data.birthday)))
    setEditable(false)
  }

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth={'xl'}
      fullWidth
      sx={{ overflow: 'visible' }}
      TransitionComponent={Transition}
    >
      <DialogTitle variant='h4'>Hồ sơ tài khoản</DialogTitle>
      {(loading && birthday == undefined ? true : false) ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 300 }}>
          <CircularProgress />
        </Box>
      ) : (
        <DialogContent>
          <Box component={'form'}>
            <Grid container>
              <Grid item xs={4} sm={4} xl={4} md={4}>
                <Stack
                  flexDirection={'column'}
                  ml={10}
                  mb={5}
                  sx={{
                    '& .MuiTextField-root': { mt: 5, width: '70%' }
                  }}
                >
                  <TextField
                    variant='standard'
                    label={'Tên'}
                    InputProps={{ readOnly: true }}
                    value={data?.displayName}
                  />
                  <TextField variant='standard' label={'Vai trò'} InputProps={{ readOnly: true }} value={data?.role} />
                  {data?.warehouse ? (
                    <TextField
                      variant='standard'
                      label={'Kho'}
                      InputProps={{ readOnly: true }}
                      value={data?.warehouse}
                    />
                  ) : (
                    ''
                  )}
                  <TextField variant='standard' label={'Email'} InputProps={{ readOnly: true }} value={data?.email} />
                  <TextField
                    variant='standard'
                    label={'Số điện thoại'}
                    InputProps={{ readOnly: true }}
                    value={data?.phone}
                  />
                </Stack>
              </Grid>
              <Grid item xs={8} sm={8} xl={8} md={8}>
                <CardHeader
                  title={'Thông tin cá nhân'}
                  action={
                    <Button variant={!editable ? 'outlined' : 'contained'} onClick={handleEditClick} color='primary'>
                      Chỉnh sửa
                      <IconButton>
                        <EditIcon />
                      </IconButton>
                    </Button>
                  }
                />
                <Stack
                  flexDirection={'row'}
                  ml={10}
                  mb={5}
                  sx={{
                    '& .MuiTextField-root': { mt: 5, width: '70%', padding: '5px' }
                  }}
                >
                  <TextField
                    name='lastName'
                    type='text'
                    id='lastName'
                    value={lastName || lastName == '' ? lastName : data?.lastName}
                    label='Họ và tên đệm'
                    variant='outlined'
                    required
                    InputProps={{ readOnly: !editable }}
                    onChange={(newValue: any) => setLastName(newValue.target.value)}
                  />
                  <TextField
                    name='firstName'
                    type='text'
                    id='firstName'
                    label='Tên'
                    value={firstName || firstName == '' ? firstName : data?.firstName}
                    variant='outlined'
                    InputProps={{ readOnly: !editable }}
                    required
                    onChange={(newValue: any) => setFirstName(newValue.target.value)}
                  />
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    {editable ? (
                      <DatePicker
                        label='Ngày sinh'
                        value={birthdayjs}
                        format='DD/MM/YYYY'
                        readOnly={!editable}
                        onChange={(newValue: any) => {
                          setBirthdayjs(newValue)
                          setBirthday(new Date(newValue).getTime())
                        }}
                      />
                    ) : (
                      <DatePicker
                        format='DD/MM/YYYY'
                        label='Ngày sinh'
                        value={birthdayjs}
                        readOnly={true}
                        slotProps={{
                          textField: {
                            name: 'birthday',
                            id: 'birthday',
                            defaultValue: { birthdayjs },
                            InputProps: {
                              endAdornment: null // Remove the DatePicker icon
                            }
                          }
                        }}
                      ></DatePicker>
                    )}
                  </LocalizationProvider>
                </Stack>
                <CardActions>
                  {editable ? (
                    <>
                      <Button variant='contained' color='error' onClick={handleCancelEdit}>
                        Hủy
                      </Button>
                      <Button variant='contained' color='success' onClick={onSubmit}>
                        Lưu
                      </Button>
                    </>
                  ) : (
                    ''
                  )}
                </CardActions>
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
      )}
    </Dialog>
  )
}
