import DialogCustomized from '@/views/components/dialogs/DialogCustomized'
import { Typography } from '@mui/material'

interface Props {
  open: boolean
  handleClose: () => void
  handleConfirm: () => void
}

export default function DialogDelete({ open, handleClose, handleConfirm }: Props) {
  return (
    <DialogCustomized open={open} handleClose={handleClose} handleConfirm={handleConfirm} title='' maxWidth={'xs'}>
      <Typography>Bạn có chắc chắn muốn xoá takeout này</Typography>
    </DialogCustomized>
  )
}
