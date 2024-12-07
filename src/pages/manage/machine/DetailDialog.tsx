import {
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Dialog,
  IconButton,
  CardHeader,
  Typography,
  Stack
} from '@mui/material'
import { Box } from '@mui/system'
import CloseIcon from '@mui/icons-material/Close'
import React, { Dispatch, SetStateAction, useCallback } from 'react'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import { useSelector } from 'react-redux'
import { STATE_MAINTAIN, TYPE_MACHINE } from '@/api/enum'
import { RootState } from '@/store'
import { Machine } from '@/api/types'

interface Props {
  id: string
  open: boolean
  setOpen: Dispatch<SetStateAction<boolean>>
}
export const DetailDialog = ({ id, setOpen, open }: Props) => {
  const machines = useSelector((store: RootState) => store.machine.machines).find((item: Machine) => item.id == id)
  const handleClose = useCallback(() => {
    setOpen(false)
  }, [setOpen])

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
            label='Tên'
            variant='outlined'
            name='name'
            defaultValue={machines?.name}
            sx={{ width: '45%' }}
            InputProps={{
              readOnly: true
            }}
          />
          <TextField
            label='Loại'
            variant='outlined'
            name='type'
            defaultValue={machines?.type == TYPE_MACHINE.MOVING ? 'Di động' : 'Cố định'}
            sx={{ width: '45%' }}
            InputProps={{
              readOnly: true
            }}
          />
          <TextField
            label='Kho'
            name='warehouseId'
            variant='outlined'
            defaultValue={machines?.warehouse?.name}
            sx={{ width: '45%' }}
            InputProps={{
              readOnly: true
            }}
          />
          <TextField
            label='Trạng thái'
            variant='outlined'
            name='state'
            defaultValue={
              machines?.state == STATE_MAINTAIN.ACTIVE
                ? 'Đang hoạt động'
                : machines?.state == STATE_MAINTAIN.INACTIVE
                ? 'Không hoạt động'
                : 'Bảo trì'
            }
            sx={{ width: '45%' }}
            InputProps={{
              readOnly: true
            }}
          />
          <TextField
            label='IP'
            variant='outlined'
            name='ipAddress'
            defaultValue={machines?.ipAddress}
            sx={{ width: '95%' }}
            InputProps={{
              readOnly: true
            }}
          />
          <TextField
            label='Model'
            variant='outlined'
            name='model'
            defaultValue={machines?.model}
            sx={{ width: '95%' }}
            InputProps={{
              readOnly: true
            }}
          />
          <TextField
            label='Vị trí'
            variant='outlined'
            name='location'
            defaultValue={machines?.location}
            sx={{ width: '95%' }}
            InputProps={{
              readOnly: true
            }}
            multiline
            rows={2}
          />
        </Stack>
        <DialogActions sx={{ pt: 5 }}>
          <Button variant='outlined' onClick={handleClose} color='error'>
            Đóng
          </Button>
        </DialogActions>
      </DialogContent>
    </Dialog>
  )
}
