import {
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Dialog,
  IconButton,
  Card,
  CardHeader,
  Typography
} from '@mui/material'
import { Stack } from '@mui/system'
import CloseIcon from '@mui/icons-material/Close'
import React, { Dispatch, SetStateAction, useCallback } from 'react'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import { useSelector } from 'react-redux'
import { ROLE, STATE } from '@/api/enum'
import Account from '@/pages/system/account/index.page'
import { RootState } from '@/store'
import { Maker } from '@/api/types'

interface Props {
  id: string
  open: boolean
  setOpen: Dispatch<SetStateAction<boolean>>
  handleDetail: () => void
}
export const DetailDialog = ({ id, setOpen, open, handleDetail }: Props) => {
  const maker = useSelector((store: RootState) => store.maker.makers).find((items: Maker) => items.id == id)

  const handleClose = useCallback(() => {
    setOpen(false)
    handleDetail()
  }, [handleDetail, setOpen])

  return (
    <Dialog open={open} maxWidth={'lg'} sx={{ overflow: 'auto' }}>
      <DialogTitle>
        <CardHeader
          sx={{ p: 0 }}
          title={<Typography variant='h3'>{'Thông tin Maker'}</Typography>}
          action={
            <IconButton aria-label='close' onClick={handleClose}>
              <CloseIcon fontSize='inherit' />
            </IconButton>
          }
        />
      </DialogTitle>
      <Divider variant='middle' />
      <DialogContent>
        <Stack direction='row' justifyContent='space-evenly' columnGap={10}>
          <Card sx={{ display: 'flex', flexDirection: 'column', width: '30%' }} variant='outlined'>
            <CardHeader title={<Typography variant='h5'>{'Thông tin Maker'}</Typography>} sx={{ pb: 0 }} />
            <Divider variant='middle' />
            <Stack
              direction='row'
              justifyContent='space-evenly'
              flexWrap={'wrap'}
              alignItems='center'
              mt={3}
              rowGap={10}
            >
              <TextField
                sx={{ width: '90%' }}
                label='Tên'
                variant='outlined'
                name='name'
                defaultValue={maker?.name}
                InputProps={{
                  readOnly: true
                }}
              />
              <TextField
                sx={{ width: '90%' }}
                label='Trạng thái'
                variant='outlined'
                name='state'
                defaultValue={maker?.state == STATE.ACTIVE ? 'Đang hoạt động' : 'Không hoạt động'}
                InputProps={{
                  readOnly: true
                }}
              />
              <TextField
                sx={{ width: '90%' }}
                label='Địa chỉ'
                name='warehouseId'
                variant='outlined'
                multiline
                rows={2}
                defaultValue={maker?.address}
                InputProps={{
                  readOnly: true
                }}
              />

              <TextField
                sx={{ width: '90%', mb: 5 }}
                label='Mô tả'
                name='description'
                variant='outlined'
                multiline
                rows={2}
                defaultValue={maker?.description}
                InputProps={{
                  readOnly: true
                }}
              />
            </Stack>
          </Card>
          <Card sx={{ display: 'flex', flexDirection: 'column', width: '70%' }} variant='outlined'>
            <Account
              role={ROLE.MAKER}
              id={id}
              breadcrumb={false}
              header='Danh sách tài khoản quản lý Maker'
              pageSize={3}
              addActive={maker?.state == STATE.INACTIVE ? false : true}
            />
          </Card>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button variant='outlined' onClick={handleClose} color='error'>
          Đóng
        </Button>
      </DialogActions>
    </Dialog>
  )
}
