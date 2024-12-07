import authApi from '@/api/auth'
import { Password } from '@/api/types'
import { AppDispatch } from '@/store'
import { updatePassword } from '@/store/reducers/user'
import { yupResolver } from '@hookform/resolvers/yup'
import {
  Slide,
  Dialog,
  DialogTitle,
  Divider,
  DialogContent,
  TextField,
  InputAdornment,
  IconButton,
  DialogActions,
  Button
} from '@mui/material'
import { TransitionProps } from '@mui/material/transitions'
import { Box, Stack } from '@mui/system'
import React, { Dispatch, SetStateAction, useCallback, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { useDispatch } from 'react-redux'
import VisibilityIcon from '@mui/icons-material/Visibility'
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff'
import * as Yup from 'yup'
import { encrypt } from './footer/EncryptHandler'

export interface Props {
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

export const ChangePasswordDialog = ({ setOpen, open }: Props) => {
  const dispatch = useDispatch<AppDispatch>()
  useEffect(() => {
    authApi.auth().then(async res => {
      setId(res.data.account.id)
    })
  }, [])
  const [id, setId] = useState<string>()
  const validationSchema = Yup.object().shape({
    oldPassword: Yup.string().required('Vui lòng nhập mật khẩu'),
    newPassword: Yup.string().required('Vui lòng nhập mật khẩu mới'),
    confirmPassword: Yup.string().required('Vui lòng xác nhận mật khẩu!')
  })

  const formOptions = { resolver: yupResolver(validationSchema) }
  const { register, handleSubmit, formState, getValues, reset } = useForm(formOptions)
  const { errors } = formState
  const [eye, setEye] = React.useState<boolean>(false)
  const handleEyeClick = useCallback(() => setEye(!eye), [eye])

  const handleClose = useCallback(() => {
    setOpen(false)
  }, [setOpen])

  const onSubmit = useCallback(async () => {
    if (getValues('newPassword') == getValues('confirmPassword')) {
      const oldPassword = encrypt(getValues('oldPassword'))
      const newPassword = encrypt(getValues('newPassword'))
      const res = await dispatch(
        updatePassword({ id: id as string, password: { oldPassword, newPassword } as Password })
      )
      if (res.meta.requestStatus === 'fulfilled') {
        handleClose()
        toast.success('Chỉnh sửa thành công!')
      } else {
        toast.error('Mật khẩu cũ sai!')
      }
    } else {
      toast.error('Mật khẩu không khớp!')
    }
  }, [dispatch, getValues, handleClose, id])

  return (
    <Dialog onClose={handleClose} open={open} maxWidth={'md'} TransitionComponent={Transition} fullWidth>
      <DialogTitle variant='h4'> Thay đổi mật khẩu</DialogTitle>
      <Divider variant='middle' />
      <DialogContent>
        <Box
          component='form'
          sx={{
            '& .MuiTextField-root': { m: 5, width: '100%' },
            p: 2
          }}
          onSubmit={handleSubmit(onSubmit)}
        >
          <Stack alignItems={'center'}>
            <TextField
              {...register('oldPassword')}
              name='oldPassword'
              id='oldPassword'
              type={'password'}
              label='Mật khẩu cũ'
              variant='filled'
              error={errors.oldPassword && true}
              helperText={errors.oldPassword?.message?.toString()}
            />
            <TextField
              {...register('newPassword')}
              name='newPassword'
              id='newPassword'
              type={eye ? 'text' : 'password'}
              label='Mật khẩu mới'
              variant='filled'
              error={errors.newPassword && true}
              helperText={errors.newPassword?.message?.toString()}
              InputProps={{
                endAdornment: (
                  <InputAdornment position='end'>
                    <IconButton onClick={handleEyeClick}>{eye ? <VisibilityIcon /> : <VisibilityOffIcon />}</IconButton>
                  </InputAdornment>
                )
              }}
            />
            <TextField
              {...register('confirmPassword')}
              name='confirmPassword'
              id='confirmPassword'
              type={'password'}
              label='Nhập lại mật khẩu'
              variant='filled'
              error={errors.confirmPassword && true}
              helperText={errors.confirmPassword?.message?.toString()}
            />
          </Stack>
          <DialogActions>
            <Button onClick={handleClose} color='error' variant='outlined'>
              Hủy
            </Button>
            <Button type='submit' color='success' variant='contained'>
              Thay đổi
            </Button>
          </DialogActions>
        </Box>
      </DialogContent>
    </Dialog>
  )
}
