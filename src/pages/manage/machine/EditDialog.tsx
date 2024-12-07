import {
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Dialog,
  IconButton,
  MenuItem,
  Typography,
  CardHeader,
  Stack
} from '@mui/material'
import { Box } from '@mui/system'
import CloseIcon from '@mui/icons-material/Close'
import React, { Dispatch, SetStateAction, useCallback, useEffect, useState } from 'react'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import { useSelector, useDispatch } from 'react-redux'
import { AppDispatch, RootState } from '@/store'
import * as Yup from 'yup'
import { STATE_MAINTAIN, TYPE_MACHINE } from '@/api/enum'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from 'react-hook-form'
import { Machine, Warehouse } from '@/api/types'
import { getListWarehouse } from '@/store/reducers/warehouse'
import { updateMachine } from '@/store/reducers/machine'
import { SnackbarAlert } from '@/pages/SnackbarAkert'

interface Props {
  id: string
  handleUpdate: () => void
  open: boolean
  setOpen: Dispatch<SetStateAction<boolean>>
}
export const EditDialog = ({ id, handleUpdate, setOpen, open }: Props) => {
  const dispatch = useDispatch<AppDispatch>()
  const validationSchema = Yup.object().shape({
    name: Yup.string().required('Tên không được để trống !'),
    type: Yup.string().required('Loại không được để trống !'),
    warehouseId: Yup.string().required('Kho không được để trống !'),
    ipAddress: Yup.string(),
    model: Yup.string(),
    state: Yup.string().required('Trạng thái không được để trống !'),
    location: Yup.string().required('Vị trí không được để trống !')
  })
  const formOptions = { resolver: yupResolver(validationSchema) }
  const { register, handleSubmit, formState, getValues } = useForm(formOptions)
  const { errors } = formState
  const [alert, setAlert] = useState<boolean>(false)

  const onSubmit = useCallback(async () => {
    const res = await dispatch(updateMachine({ id: id, machine: getValues() as Machine }))
    switch (res.meta.requestStatus) {
      case 'fulfilled':
        handleUpdate()
      case 'rejected':
        setAlert(true)
    }
  }, [dispatch, getValues, handleUpdate, id])

  const machines = useSelector((store: RootState) => store.machine.machines).find((item: Machine) => item.id == id)
  const warehouses = useSelector((store: RootState) => store.warehouse.warehouses)

  const handleClose = useCallback(() => {
    setOpen(false)
  }, [setOpen])

  useEffect(() => {
    dispatch(getListWarehouse({ query: JSON.stringify({ state: [STATE_MAINTAIN.ACTIVE] }) }))
  }, [dispatch])

  return (
    <Dialog open={open} maxWidth='md'>
      <DialogTitle>
        <CardHeader
          sx={{ p: 0 }}
          title={<Typography variant='h3'>{'Thông tin máy quét'}</Typography>}
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
              defaultValue={machines?.name}
              helperText={errors.name?.message?.toString()}
              error={errors.name && true}
              sx={{ width: '45%' }}
            />
            <TextField
              {...register('type')}
              select
              label='Loại'
              variant='outlined'
              name='type'
              defaultValue={machines?.type}
              helperText={errors.type?.message?.toString()}
              error={errors.type && true}
              sx={{ width: '45%' }}
            >
              <MenuItem key={TYPE_MACHINE.MOVING} value={TYPE_MACHINE.MOVING}>
                Di động
              </MenuItem>
              <MenuItem key={TYPE_MACHINE.FIXED} value={TYPE_MACHINE.FIXED}>
                Cố định
              </MenuItem>
            </TextField>
            <TextField
              {...register('warehouseId')}
              select
              label='Kho'
              name='warehouseId'
              variant='outlined'
              defaultValue={machines?.warehouse?.id}
              helperText={errors.warehouseId?.message?.toString()}
              error={errors.warehouseId && true}
              sx={{ width: '45%' }}
            >
              {warehouses.map((items: Warehouse) => (
                <MenuItem key={items.id} value={items.id}>
                  {items.name}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              {...register('state')}
              label='Trạng thái'
              select
              variant='outlined'
              name='state'
              defaultValue={machines?.state}
              helperText={errors.state?.message?.toString()}
              error={errors.state && true}
              sx={{ width: '45%' }}
            >
              <MenuItem key={STATE_MAINTAIN.ACTIVE} value={STATE_MAINTAIN.ACTIVE}>
                Đang hoạt động
              </MenuItem>
              <MenuItem key={STATE_MAINTAIN.INACTIVE} value={STATE_MAINTAIN.INACTIVE}>
                Không hoạt động
              </MenuItem>
              <MenuItem key={STATE_MAINTAIN.MAINTAIN} value={STATE_MAINTAIN.MAINTAIN}>
                Bảo trì
              </MenuItem>
            </TextField>
            <TextField
              {...register('ipAddress')}
              label='IP'
              variant='outlined'
              name='ipAddress'
              defaultValue={machines?.ipAddress}
              helperText={errors.ipAddress?.message?.toString()}
              error={errors.ipAddress && true}
              sx={{ width: '95%' }}
            />
            <TextField
              {...register('model')}
              label='Model'
              variant='outlined'
              name='model'
              defaultValue={machines?.model}
              helperText={errors.model?.message?.toString()}
              error={errors.model && true}
              sx={{ width: '95%' }}
            />
            <TextField
              {...register('location')}
              label='Vị trí'
              variant='outlined'
              name='location'
              defaultValue={machines?.location}
              multiline
              helperText={errors.location?.message?.toString()}
              error={errors.location && true}
              rows={3}
              sx={{ width: '95%' }}
            />
          </Stack>
          <DialogActions sx={{ p: 5 }}>
            <Button variant='outlined' color='error' onClick={handleClose}>
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
