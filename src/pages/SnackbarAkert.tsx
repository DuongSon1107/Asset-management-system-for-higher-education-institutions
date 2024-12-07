import { Snackbar, Alert, Typography, AlertColor } from '@mui/material'
import React, { Dispatch, SetStateAction, useCallback } from 'react'

interface Props {
  open: boolean
  message: string
  setOpen: Dispatch<SetStateAction<boolean>>
  severity: AlertColor
}

export const SnackbarAlert = ({ open, message, setOpen, severity }: Props) => {
  const handleCloseAlert = useCallback(
    (event?: React.SyntheticEvent | Event, reason?: string) => {
      if (reason === 'clickaway') {
        return
      }
      setOpen(false)
    },
    [setOpen]
  )

  return (
    <Snackbar
      anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      open={open}
      autoHideDuration={2000}
      onClose={handleCloseAlert}
      key={'bottomleft'}
    >
      <Alert onClose={handleCloseAlert} severity={severity} sx={{ width: '100%' }} variant='filled'>
        <Typography>{message} </Typography>
      </Alert>
    </Snackbar>
  )
}
