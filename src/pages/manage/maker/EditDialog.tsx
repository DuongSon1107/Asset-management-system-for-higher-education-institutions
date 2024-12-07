import {
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Dialog,
  IconButton,
  MenuItem,
  CardHeader,
  Typography,
  Stack
} from '@mui/material'
import { Box } from '@mui/system'
import CloseIcon from '@mui/icons-material/Close'
import React, { Dispatch, SetStateAction, useCallback, useState } from 'react'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import { useDispatch, useSelector } from 'react-redux'
import * as Yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { STATE } from '@/api/enum'
import { useForm } from 'react-hook-form'
import { Maker } from '@/api/types'
import { updateMaker } from '@/store/reducers/maker'
import { SnackbarAlert } from '@/pages/SnackbarAkert'
import { AppDispatch, RootState } from '@/store'

interface Props {
  id: string
  handleUpdate: () => void
  open: boolean
  setOpen: Dispatch<SetStateAction<boolean>>
}
export const EditDialog = ({ id, setOpen, handleUpdate, open }: Props) => {
  const dispatch = useDispatch<AppDispatch>()

  const maker = useSelector((store: RootState) => store.maker.makers).find((item: Maker) => item.id == id)
  const validationSchema = Yup.object().shape({
    name: Yup.string().required('Tên maker không được để trống !'),
    state: Yup.string().required('Trạng thái không được để trống !'),
    address: Yup.string().required('Địa chỉ không được để trống !'),
    description: Yup.string().required('Mô tả không được để trống !')
  })
  const formOptions = { resolver: yupResolver(validationSchema) }
  const { register, handleSubmit, formState, getValues } = useForm(formOptions)
  const { errors } = formState
  const [alert, setAlert] = useState<boolean>(false)

  const handleClose = useCallback(() => {
    setOpen(false)
  }, [setOpen])
  const onSubmit = useCallback(async () => {
    const res = await dispatch(updateMaker({ id: id, maker: getValues() as Maker }))
    switch (res.meta.requestStatus) {
      case 'fulfilled':
        handleUpdate()
      case 'rejected':
        setAlert(true)
    }
  }, [dispatch, getValues, handleUpdate, id])

  return (
    <Dialog open={open} maxWidth='md'>
      <DialogTitle>
        <CardHeader
          sx={{ p: 0 }}
          title={<Typography variant='h3'>{'Chỉnh sửa Maker'}</Typography>}
          action={
            <IconButton aria-label='close' onClick={handleClose}>
              <CloseIcon fontSize='inherit' />
            </IconButton>
          }
        />
      </DialogTitle>
      <Divider variant='middle' />
      <DialogContent>
        <Box component='form' onSubmit={handleSubmit(onSubmit)}>
          <Stack
            direction='row'
            flexWrap='wrap'
            columnGap={10}
            rowGap={5}
            alignItems='flex-start'
            useFlexGap
            justifyContent='center'
          >
            <TextField
              {...register('name')}
              label='Tên'
              variant='outlined'
              name='name'
              id='name'
              sx={{ width: '45%' }}
              defaultValue={maker?.name}
              error={errors.name && true}
              helperText={errors.name?.message?.toString()}
            />
            <TextField
              {...register('state')}
              label='Trạng thái'
              select
              variant='outlined'
              sx={{ width: '45%' }}
              name='state'
              defaultValue={maker?.state}
              error={errors.state && true}
              helperText={errors.state?.message?.toString()}
            >
              <MenuItem key={STATE.ACTIVE} value={STATE.ACTIVE}>
                Đang hoạt động
              </MenuItem>
              <MenuItem key={STATE.INACTIVE} value={STATE.INACTIVE}>
                Không hoạt động
              </MenuItem>
            </TextField>
            <TextField
              {...register('description')}
              label='Mô tả'
              variant='outlined'
              sx={{ width: '95%' }}
              name='description'
              multiline
              rows={3}
              defaultValue={maker?.description}
              error={errors.description && true}
              helperText={errors.description?.message?.toString()}
            />
            <TextField
              {...register('address')}
              label='Địa chỉ'
              variant='outlined'
              sx={{ width: '95%' }}
              name='address'
              multiline
              rows={3}
              fullWidth={true}
              defaultValue={maker?.address}
              error={errors.address && true}
              helperText={errors.address?.message?.toString()}
            />
          </Stack>
          <DialogActions sx={{ pt: 5 }}>
            <Button variant='outlined' onClick={handleClose} color='error'>
              Đóng
            </Button>
            <Button variant='contained' type='submit' color='success'>
              Xác nhận
            </Button>
          </DialogActions>
        </Box>
      </DialogContent>
      {alert && (
        <SnackbarAlert open={alert} message={'Tồn tại thông tin nhập vào !'} setOpen={setAlert} severity='error' />
      )}
    </Dialog>
  )
}
