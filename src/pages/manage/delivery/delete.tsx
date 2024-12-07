import DialogCustomized from '@/views/components/dialogs/DialogCustomized'
import { Typography } from '@mui/material'

interface Props {
  open: boolean
  handleClose: () => void
  handleConfirm: () => void
}

export default function DialogDelete({ open, handleClose, handleConfirm }: Props) {
  return (
    <DialogCustomized open={open} handleClose={handleClose} handleConfirm={handleConfirm} title=''>
      <Typography>Bạn có chắc chắn muốn xoá Xe chở hàng này này</Typography>
    </DialogCustomized>
  )
}
