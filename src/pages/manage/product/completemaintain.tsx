import CustomTextField from '@/@core/components/mui/text-field'
import { MAINTAIN_TIME } from '@/api/enum'
import { Product } from '@/api/types'
import DialogCustomized from '@/views/components/dialogs/DialogCustomized'
import { Grid, MenuItem } from '@mui/material'

interface Props {
  open: boolean
  handleClose: () => void
  handleConfirm: () => void
  product: Product
  setProduct: any
}

export default function DialogMaintainComplete({ open, handleClose, handleConfirm, product, setProduct }: Props) {
  return (
    <DialogCustomized open={open} handleClose={handleClose} handleConfirm={handleConfirm} title='Hoàn tất bảo trì'>
      <Grid container spacing={2} justifyContent='center'>
        <CustomTextField
          select
          fullWidth
          label='Nhắc bảo trì tiếp theo'
          value={product?.nextDate ? product?.nextDate : null}
          id='description'
          onChange={e => {
            setProduct({
              ...product,
              nextDate: e.target.value
            })
          }}
        >
          <MenuItem value={MAINTAIN_TIME.DAY_15}>15 Ngày</MenuItem>
          <MenuItem value={MAINTAIN_TIME.DAY_30}>30 Ngày</MenuItem>
          <MenuItem value={MAINTAIN_TIME.DAY_60}>60 Ngày</MenuItem>
          <MenuItem value={MAINTAIN_TIME.DAY_90}>90 Ngày</MenuItem>
        </CustomTextField>
      </Grid>
    </DialogCustomized>
  )
}
