// ** React Imports

// ** MUI Imports
import Button from '@mui/material/Button'
import Dialog, { DialogProps } from '@mui/material/Dialog'
import Typography from '@mui/material/Typography'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import IconButton from '@mui/material/IconButton'

// ** Icon Imports
import Icon from '@/@core/components/icon'

interface Props extends DialogProps {
  open: boolean
  handleConfirm: () => void
  handleClose: () => void
  title: string
  children: React.ReactNode
}

const DialogCustomized = ({ open, handleConfirm, handleClose, title, children, ...props }: Props) => {
  return (
    <div>
      <Dialog
        open={open}
        aria-labelledby='customized-dialog-title'
        sx={{ '& .MuiDialog-paper': { overflow: 'visible' } }}
        fullWidth
        {...props}
      >
        <DialogTitle id='customized-dialog-title' sx={{ p: 4 }}>
          <Typography variant='h4' component='span'>
            {title ? title : ' '}&nbsp;
          </Typography>
          <IconButton
            aria-label='close'
            onClick={handleClose}
            sx={{ top: 8, right: 10, position: 'absolute', color: 'grey.500' }}
          >
            <Icon icon='tabler:x' fontSize='1.25rem ' />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers sx={{ p: theme => `${theme.spacing(4)} !important` }}>
          {children}
        </DialogContent>
        <DialogActions sx={{ p: theme => `${theme.spacing(3)} !important` }}>
          <Button variant='outlined' color='error' onClick={handleClose}>
            Đóng
          </Button>
          <Button variant='outlined' color='success' onClick={handleConfirm}>
            Xác nhận
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}

export default DialogCustomized
