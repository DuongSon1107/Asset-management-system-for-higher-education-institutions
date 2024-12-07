import {
  IconButton,
  TextField,
  MenuItem,
  Button,
  CardHeader,
  Dialog,
  DialogContent,
  Stack,
  DialogTitle,
  Typography,
  Divider,
  DialogActions,
  ListItemText,
  List,
  Collapse,
  ListItemButton,
  Card
} from '@mui/material'
import { Box } from '@mui/system'
import * as Yup from 'yup'
import React, { Dispatch, SetStateAction, useCallback, useState } from 'react'
import CloseIcon from '@mui/icons-material/Close'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from 'react-hook-form'
import { Category } from '@/api/types'
import { useDispatch, useSelector } from 'react-redux'
import { STATE } from '@/api/enum'

import { updateCategory } from '@/store/reducers/category'
import { AppDispatch, RootState } from '@/store'
import { SnackbarAlert } from '@/pages/SnackbarAkert'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'
import ArrowRightIcon from '@mui/icons-material/ArrowRight'
import { CategoryAccordion } from './CategoryAccordion'

interface Props {
  id: string
  handleUpdate: () => void
  open: boolean
  setOpen: Dispatch<SetStateAction<boolean>>
}

export const EditDialog = ({ handleUpdate, setOpen, id, open }: Props) => {
  const dispatch = useDispatch<AppDispatch>()

  const validationSchema = Yup.object().shape({
    name: Yup.string().required('Tên không được để trống !'),
    color: Yup.string(),
    parentId: Yup.string(),
    description: Yup.string(),
    state: Yup.string()
  })
  const formOptions = { resolver: yupResolver(validationSchema) }
  const { register, handleSubmit, formState, getValues, setValue } = useForm(formOptions)
  const { errors } = formState
  const [alert, setAlert] = useState<boolean>(false)

  const category = useSelector((store: RootState) => store.category.categories.find((item: Category) => item.id == id))
  const parentCategory = useSelector((store: RootState) => store.category.categories)
  const [selectedIndex, setSelectedIndex] = useState<string>(category?.parentId as string)

  const [expanded, setExpanded] = useState<boolean>(false)

  const onClose = useCallback(() => {
    setOpen(false)
  }, [setOpen])
  const onSubmit = useCallback(async () => {
    if (selectedIndex == 'Cha') {
      setValue('parentId', '')
    } else {
      setValue('parentId', selectedIndex)
    }
    const res = await dispatch(updateCategory({ id: id, category: getValues() as Category }))
    switch (res.meta.requestStatus) {
      case 'fulfilled':
        handleUpdate()
      case 'rejected':
        setAlert(true)
    }
  }, [selectedIndex, dispatch, id, getValues, setValue, handleUpdate])

  return (
    <Dialog open={open} maxWidth={'lg'} fullWidth>
      <DialogTitle>
        <CardHeader
          sx={{ p: 0 }}
          title={
            <Typography variant='h3' justifyContent={'center'}>
              Chỉnh sửa danh mục
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
        {alert && (
          <SnackbarAlert open={alert} message={'Tồn tại thông tin nhập vào !'} setOpen={setAlert} severity='error' />
        )}
        <Box component='form' autoComplete='off' onSubmit={handleSubmit(onSubmit)} noValidate>
          <Stack direction='row' justifyContent={'space-evenly'}>
            <Card sx={{ width: '45%' }} variant='outlined'>
              <Stack direction='row' justifyContent='space-evenly' flexWrap={'wrap'} alignItems='center'>
                <TextField
                  {...register('name')}
                  label='Tên'
                  variant='outlined'
                  name='name'
                  fullWidth
                  defaultValue={category?.name}
                  helperText={errors.name?.message?.toString()}
                  error={errors.name && true}
                  sx={{ m: 5, width: '100%' }}
                />

                <TextField
                  {...register('color')}
                  label='Màu'
                  variant='outlined'
                  name='color'
                  defaultValue={category?.color}
                  helperText={errors.color?.message?.toString()}
                  error={errors.color && true}
                  sx={{ m: 5, width: '100%' }}
                />
                <TextField
                  {...register('state')}
                  label='Trạng thái'
                  variant='outlined'
                  name='state'
                  select
                  defaultValue={category?.state}
                  helperText={errors.state?.message?.toString()}
                  error={errors.color && true}
                  sx={{ m: 5, width: '100%' }}
                >
                  <MenuItem key={1} value={STATE.ACTIVE}>
                    {' '}
                    Đang hoạt động{' '}
                  </MenuItem>
                  <MenuItem key={2} value={STATE.INACTIVE}>
                    {' '}
                    Không hoạt động{' '}
                  </MenuItem>
                </TextField>

                <TextField
                  {...register('description')}
                  label='Mô tả'
                  variant='outlined'
                  multiline
                  rows={2}
                  name='description'
                  defaultValue={category?.description}
                  helperText={errors.description?.message?.toString()}
                  error={errors.description && true}
                  sx={{ m: 5, width: '100%' }}
                />
              </Stack>
            </Card>
            <Card sx={{ width: '50%' }} variant='outlined'>
              <Stack direction='column' justifyContent='space-evenly' flexWrap={'wrap'} alignItems='flex-start'>
                <TextField
                  {...register('parentId')}
                  label='Danh mục cha'
                  variant='outlined'
                  name='parentId'
                  defaultValue={
                    category?.parentId
                      ? parentCategory.find((items: Category) => items.id == category?.parentId)?.name
                      : 'Cha'
                  }
                  value={
                    selectedIndex == 'Cha'
                      ? 'Cha'
                      : parentCategory.find((items: Category) => items.id == selectedIndex)?.name
                  }
                  InputProps={{ readOnly: true }}
                  helperText={errors.parentId?.message?.toString()}
                  error={errors.parentId && true}
                  sx={{ m: 5, width: '93%' }}
                ></TextField>
                <List sx={{ maxHeight: '50vh', overflow: 'auto', width: '100%' }}>
                  <ListItemButton
                    selected={selectedIndex == 'Cha' ? true : false}
                    onClick={() => {
                      setSelectedIndex('Cha')
                    }}
                  >
                    <IconButton
                      onClick={e => {
                        e.stopPropagation()
                        setExpanded(!expanded)
                      }}
                    >
                      {expanded ? <ArrowDropDownIcon /> : <ArrowRightIcon />}
                    </IconButton>
                    <ListItemText primary='Danh mục cha' />
                  </ListItemButton>
                  <Collapse in={expanded} sx={{ width: '100%' }}>
                    <CategoryAccordion
                      parentId=''
                      categoryId={selectedIndex}
                      currentCategory={category as Category}
                      deptlevel={0}
                      setCategoryId={setSelectedIndex}
                    />
                  </Collapse>
                </List>
              </Stack>
            </Card>
          </Stack>
          &nbsp;
          <DialogActions sx={{ p: 0 }}>
            <Button variant='outlined' color='error' onClick={onClose}>
              Đóng
            </Button>
            <Button variant='contained' color='success' type='submit'>
              Xác nhận
            </Button>
          </DialogActions>
        </Box>
      </DialogContent>
    </Dialog>
  )
}
