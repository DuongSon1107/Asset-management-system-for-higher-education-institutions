// ** React Imports

// ** MUI Imports
import Dialog, { DialogProps } from '@mui/material/Dialog'
import Typography from '@mui/material/Typography'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import IconButton from '@mui/material/IconButton'

// ** Icon Imports
import Icon from '@/@core/components/icon'
import { Box } from '@mui/material'
import React from 'react'

interface Props extends DialogProps {
  open: boolean
  handleClose: () => void
  title: string
  children: React.ReactNode
}

const DialogCustomizedInfo = ({ open, handleClose, title, children, ...props }: Props) => {
  return (
    <div>
      <Dialog
        open={open}
        // onClose={handleClose}
        aria-labelledby='customized-dialog-title'
        sx={{ '& .MuiDialog-paper': { overflow: 'visible' } }}
        fullWidth
        maxWidth='md'
        {...props}
      >
        <DialogTitle id='customized-dialog-title' sx={{ p: 4 }}>
          <Typography variant='h4' component='span'>
            {title}
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
          <Box sx={{ p: 3 }} />
        </DialogContent>

        {/* <DialogActions sx={{ justifyContent: 'center', p: theme => `${theme.spacing(3)} !important` }}>
          <Button onClick={handleClose}>Đã hiểu</Button>
        </DialogActions> */}
      </Dialog>
    </div>
  )
}

export default DialogCustomizedInfo
