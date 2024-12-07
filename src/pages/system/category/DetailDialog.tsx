import {
  IconButton,
  TextField,
  Button,
  CardHeader,
  Dialog,
  DialogContent,
  Stack,
  DialogTitle,
  Typography,
  Divider,
  DialogActions
} from '@mui/material'
import { Box } from '@mui/system'
import React, { Dispatch, SetStateAction, useCallback } from 'react'
import CloseIcon from '@mui/icons-material/Close'
import { Category } from '@/api/types'
import { useSelector } from 'react-redux'

import { RootState } from '@/store'

interface Props {
  id: string
  open: boolean
  setOpen: Dispatch<SetStateAction<boolean>>
}
export const DetailDialog = ({ setOpen, id, open }: Props) => {
  const category = useSelector((store: RootState) => store.category.categories.find((item: Category) => item.id == id))
  const parent = useSelector((store: RootState) =>
    store.category.categories.find((item: Category) => item.id == category?.parentId)
  )

  const onClose = useCallback(() => {
    setOpen(false)
  }, [setOpen])

  return (
    <Dialog open={open} maxWidth={'sm'} fullWidth>
      <DialogTitle>
        <CardHeader
          sx={{ p: 0 }}
          title={
            <Typography variant='h3' justifyContent={'center'}>
              Thông tin danh mục
            </Typography>
          }
          action={
            <IconButton aria-label='close' onClick={onClose}>
              <CloseIcon />
            </IconButton>
          }
        />
      </DialogTitle>
      <Divider variant='middle' />
      <DialogContent>
        <Box>
          <Stack direction='row' useFlexGap flexWrap='wrap'>
            <TextField
              label='Tên'
              variant='outlined'
              name='name'
              fullWidth
              defaultValue={category?.name}
              sx={{ mt: 3, width: '100%' }}
            />

            <TextField
              label='Màu'
              variant='outlined'
              name='color'
              defaultValue={category?.color}
              sx={{ mt: 5, width: '100%' }}
            />
            <TextField
              label='Danh mục cha'
              variant='outlined'
              name='parentId'
              defaultValue={parent?.name}
              sx={{ mt: 5, width: '100%' }}
            />
            <TextField
              label='Mô tả'
              variant='outlined'
              multiline
              rows={2}
              name='description'
              defaultValue={category?.description}
              sx={{ mt: 5, width: '100%' }}
            />
          </Stack>
          &nbsp;
          <DialogActions sx={{ p: 0 }}>
            <Button variant='outlined' color='error' onClick={onClose}>
              Đóng
            </Button>
          </DialogActions>
        </Box>
      </DialogContent>
    </Dialog>
  )
}
