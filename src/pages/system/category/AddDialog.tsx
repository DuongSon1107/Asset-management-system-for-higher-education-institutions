import {
  IconButton,
  TextField,
  Button,
  CardHeader,
  Dialog,
  DialogContent,
  Stack,
  DialogTitle,
  Typography,
  Divider,
  DialogActions
} from '@mui/material'
import { Box } from '@mui/system'
import * as Yup from 'yup'
import React, { Dispatch, SetStateAction, useCallback, useState } from 'react'
import CloseIcon from '@mui/icons-material/Close'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from 'react-hook-form'
import { Category } from '@/api/types'
import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd'
import { useDispatch } from 'react-redux'
import { STATE } from '@/api/enum'
import { createCategory } from '@/store/reducers/category'
import { AppDispatch } from '@/store'
import { SnackbarAlert } from '@/pages/SnackbarAkert'

interface Props {
  handleCreate: () => void
  setOpen: Dispatch<SetStateAction<boolean>>
  parentId: string
  open: boolean
}
export const AddDialog = ({ handleCreate, setOpen, parentId, open }: Props) => {
  const dispatch = useDispatch<AppDispatch>()

  const validationSchema = Yup.object().shape({
    name: Yup.string().required('Tên không được để trống !'),
    color: Yup.string(),
    parentId: Yup.string(),
    description: Yup.string(),
    state: Yup.string()
  })
  const formOptions = { resolver: yupResolver(validationSchema) }
  const { register, handleSubmit, formState, getValues, setValue } = useForm(formOptions)
  const { errors } = formState
  const [alert, setAlert] = useState<boolean>(false)

  const onClose = useCallback(() => {
    setOpen(false)
  }, [setOpen])
  const onSubmit = useCallback(async () => {
    setValue('parentId', parentId)
    setValue('state', STATE.ACTIVE)
    const res = await dispatch(createCategory(getValues() as Category))
    switch (res.meta.requestStatus) {
      case 'fulfilled':
        handleCreate()
      case 'rejected':
        setAlert(true)
    }
  }, [dispatch, getValues, handleCreate, parentId, setValue])

  return (
    <Dialog open={open} maxWidth={'sm'} fullWidth>
      <DialogTitle>
        <CardHeader
          sx={{ p: 0 }}
          title={
            <Typography variant='h3' justifyContent={'center'}>
              <PlaylistAddIcon fontSize='inherit' />
              &nbsp; Thêm danh mục
            </Typography>
          }
          action={
            <IconButton aria-label='close' onClick={onClose}>
              <CloseIcon />
            </IconButton>
          }
        />
      </DialogTitle>
      <Divider variant='middle' />
      <DialogContent>
        <Box component='form' autoComplete='off' onSubmit={handleSubmit(onSubmit)} noValidate>
          <Stack direction='row' useFlexGap flexWrap='wrap'>
            <TextField
              {...register('name')}
              label='Tên'
              variant='outlined'
              name='name'
              fullWidth
              helperText={errors.name?.message?.toString()}
              error={errors.name && true}
              sx={{ mt: 3, width: '100%' }}
              inputProps={{ maxLength: 29 }}
            />

            <TextField
              {...register('color')}
              label='Màu'
              variant='outlined'
              name='color'
              helperText={errors.color?.message?.toString()}
              error={errors.color && true}
              sx={{ mt: 5, width: '100%' }}
            />
            <TextField
              {...register('description')}
              label='Mô tả'
              variant='outlined'
              multiline
              rows={2}
              name='description'
              helperText={errors.description?.message?.toString()}
              error={errors.description && true}
              sx={{ mt: 5, width: '100%' }}
            />
          </Stack>
          &nbsp;
          <DialogActions sx={{ p: 0 }}>
            <Button variant='outlined' color='error' onClick={onClose}>
              Đóng
            </Button>
            <Button variant='contained' color='success' type='submit'>
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
