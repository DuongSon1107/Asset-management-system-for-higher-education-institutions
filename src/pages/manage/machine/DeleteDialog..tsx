import CloseIcon from '@mui/icons-material/Close'
import React, { Dispatch, SetStateAction, useCallback } from 'react'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import { CardHeader, Divider, IconButton, Typography } from '@mui/material'
import { useDispatch } from 'react-redux'
import { AppDispatch } from '@/store'
import { deleteMachine } from '@/store/reducers/machine'

interface Props {
  id: string
  open: boolean
  setOpen: Dispatch<SetStateAction<boolean>>
  handleDelete: () => void
}

export const DeleteDialog = ({ setOpen, handleDelete, id, open }: Props) => {
  const dispatch = useDispatch<AppDispatch>()
  const handleClose = useCallback(() => {
    setOpen(false)
  }, [setOpen])
  const handleSubmit = useCallback(() => {
    dispatch(deleteMachine(id)).then(() => {
      handleDelete()
    })
  }, [dispatch, handleDelete, id])

  return (
    <Dialog open={open}>
      <DialogTitle>
        <CardHeader
          sx={{ p: 0 }}
          title={<Typography variant='h3'>{'Thông báo !'}</Typography>}
          action={
            <IconButton aria-label='close' onClick={handleClose}>
              <CloseIcon />
            </IconButton>
          }
        />
      </DialogTitle>
      <Divider variant='middle' />
      <DialogContent sx={{ m: 0, p: 2 }}>
        <DialogContentText>Bạn có chắc chắn muốn vô hiệu hóa máy quét này ?</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color='error' variant='outlined'>
          Hủy
        </Button>
        <Button onClick={handleSubmit} color='success' variant='contained'>
          Xác nhận
        </Button>
      </DialogActions>
    </Dialog>
  )
}
