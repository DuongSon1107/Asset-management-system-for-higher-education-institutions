import {
  Card,
  CardContent,
  CardHeader,
  Collapse,
  Divider,
  Grid,
  IconButton,
  List,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  Menu,
  MenuItem,
  MenuList,
  Stack,
  Typography
} from '@mui/material'
import React, { useCallback, useEffect, useState } from 'react'
import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import InfoIcon from '@mui/icons-material/Info'
import { AddDialog } from './AddDialog'
import { getListCategory } from '@/store/reducers/category'
import { useDispatch } from 'react-redux'
import { AppDispatch, RootState } from '@/store'
import { useSelector } from 'react-redux'
import { CategoryAccordion } from './CategoryAccordion'
import Breadcrumb from '@/pages/Breadcrumb'
import { STATE } from '@/api/enum'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'
import ArrowRightIcon from '@mui/icons-material/ArrowRight'
import { EditDialog } from './EditDialog'
import { SnackbarAlert } from '@/pages/SnackbarAkert'
import { DeleteDialog } from './DeleteDialog'
import { DetailDialog } from './DetailDialog'
import { Category } from '@/api/types'

export default function Page() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)

  const dispatch = useDispatch<AppDispatch>()
  const fetchCategory = useCallback(() => {
    dispatch(
      getListCategory({
        query: JSON.stringify({
          state: [STATE.ACTIVE]
        })
      })
    )
  }, [dispatch])
  useEffect(() => {
    fetchCategory()
  }, [fetchCategory])

  const handleClose = () => {
    setAnchorEl(null)
  }
  const [alert, setAlert] = useState<boolean>(false)
  const [alertMessage, setAlertMessage] = useState<string>('')
  const [addDialog, setAddDialog] = useState<boolean>(false)
  const [detailDialog, setDetailDialog] = useState<boolean>(false)
  const [editDialog, setEditDialog] = useState<boolean>(false)
  const [deleteDialog, setDeleteDialog] = useState<boolean>(false)
  const [selectedIndex, setSelectedIndex] = React.useState<string>('')
  const [expanded, setExpanded] = useState<boolean>(false)
  const [categoryId, setCategoryId] = React.useState<string>('')
  const category = useSelector((store: RootState) => store.category.categories)
  const handleOpenAdd = useCallback(() => {
    setAddDialog(true), handleClose()
  }, [])
  const handleOpenEdit = useCallback(() => {
    setEditDialog(true), handleClose()
  }, [])
  const handleOpenDelete = useCallback(() => {
    setDeleteDialog(true), handleClose()
  }, [])
  const handleOpenDetail = useCallback(() => {
    setDetailDialog(true), handleClose()
  }, [])

  const handleCreate = useCallback(() => {
    fetchCategory(), setAddDialog(false), setAlertMessage('Thêm danh mục loại xe thành công'), setAlert(true)
  }, [fetchCategory])
  const handleUpdate = useCallback(() => {
    fetchCategory(), setEditDialog(false), setAlertMessage('Chỉnh sửa danh mục loại xe thành công'), setAlert(true)
  }, [fetchCategory])
  const handleDelete = useCallback(() => {
    fetchCategory(), setDeleteDialog(false), setAlertMessage('Xóa danh mục loại xe thành công'), setAlert(true)
  }, [fetchCategory])

  return (
    <Grid container spacing={6}>
      <Grid item xs={12} sm={12} md={12} lg={12}>
        <Breadcrumb path='Hệ thống' subPath='Loại xe' />
        {alert ? <SnackbarAlert open={alert} message={alertMessage} setOpen={setAlert} severity='success' /> : null}
        {addDialog ? (
          <AddDialog open={addDialog} handleCreate={handleCreate} setOpen={setAddDialog} parentId={selectedIndex} />
        ) : null}
        {editDialog ? (
          <EditDialog open={editDialog} handleUpdate={handleUpdate} setOpen={setEditDialog} id={categoryId} />
        ) : null}
        {detailDialog ? <DetailDialog open={detailDialog} id={categoryId} setOpen={setDetailDialog} /> : null}
        {deleteDialog ? (
          <DeleteDialog open={deleteDialog} setOpen={setDeleteDialog} handleDelete={handleDelete} id={categoryId} />
        ) : null}

        <Stack direction={'row'} columnGap={5} flexWrap={'wrap'} justifyContent={'stretch'} rowGap={5}>
          <Card variant='outlined' sx={{ width: '30%', minWidth: '300px', maxWidth: '100%' }}>
            <CardHeader
              title={<Typography variant='h3'>Danh mục cha</Typography>}
              action={
                <IconButton aria-label='close' onClick={handleOpenAdd}>
                  <PlaylistAddIcon />
                </IconButton>
              }
            />
            <Divider variant='middle' />
            <CardContent sx={{ p: 0 }}>
              <List sx={{ maxHeight: '65vh', overflow: 'auto' }}>
                <ListItemButton selected={selectedIndex == '' ? true : false}>
                  <IconButton
                    onClick={() => {
                      setSelectedIndex('')
                      setExpanded(!expanded)
                    }}
                  >
                    {expanded ? <ArrowDropDownIcon /> : <ArrowRightIcon />}
                  </IconButton>
                  <ListItemText
                    primary='Danh sách danh mục'
                    onClick={() => {
                      setSelectedIndex('')
                    }}
                  />
                </ListItemButton>
                <Collapse in={expanded} sx={{ width: '100%' }}>
                  <CategoryAccordion
                    parentId=''
                    categoryId={selectedIndex}
                    deptlevel={0}
                    setCategoryId={setSelectedIndex}
                  />
                </Collapse>
              </List>
            </CardContent>
          </Card>
          <Card
            variant='outlined'
            sx={{ width: '68%', height: '80vh', minWidth: '60%', maxWidth: '100%', resize: '-moz-initial' }}
          >
            <CardHeader title='Danh mục con '></CardHeader>
            <Divider variant='middle' />
            <CardContent>
              <MenuList>
                {category
                  .filter((items: Category) => items.parentId === selectedIndex)
                  .map((category: Category) => (
                    <>
                      <ListItemButton onClick={() => setCategoryId(category.id)} key={category.id}>
                        <ListItemText primary={category.name} />
                        <ListItemAvatar>{category.state}</ListItemAvatar>
                        <IconButton
                          onClick={(event: React.MouseEvent<HTMLElement>) => {
                            setAnchorEl(event.currentTarget)
                          }}
                        >
                          <MoreVertIcon />
                        </IconButton>
                      </ListItemButton>
                      <Divider component='li' />
                    </>
                  ))}
              </MenuList>
              <Menu
                id='long-menu'
                MenuListProps={{
                  'aria-labelledby': 'long-button'
                }}
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
              >
                <MenuItem onClick={handleOpenEdit}>
                  <EditIcon />
                  &nbsp; Chỉnh sửa danh mục
                </MenuItem>

                <MenuItem onClick={handleOpenDelete}>
                  <DeleteIcon />
                  &nbsp; Xóa danh mục
                </MenuItem>
                <MenuItem onClick={handleOpenDetail}>
                  <InfoIcon /> &nbsp; Thông tin danh mục
                </MenuItem>
              </Menu>
            </CardContent>
          </Card>
        </Stack>
      </Grid>
    </Grid>
  )
}
Page.acl = {
  action: 'category',
  subject: 'category-page'
}
