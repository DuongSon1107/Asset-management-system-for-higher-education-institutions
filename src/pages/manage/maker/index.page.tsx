import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
  Divider,
  Grid,
  IconButton,
  InputAdornment,
  TablePagination,
  Typography
} from '@mui/material'
import { AddDialog } from './AddDialog'
import { ROLE, STATE } from '@/api/enum'
import { useAuth } from '@/hooks/useAuth'
import { AppDispatch, RootState } from '@/store'
import { getListMaker } from '@/store/reducers/maker'
import React, { useCallback, useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { DeleteDialog } from './DeleteDialog'
import EngineeringIcon from '@mui/icons-material/Engineering'
import { DetailDialog } from './DetailDialog'
import { EditDialog } from './EditDialog'
import CustomTextField from '@/@core/components/mui/text-field'
import { ClearIcon } from '@mui/x-date-pickers'
import AddCircleIcon from '@mui/icons-material/AddCircle'
import DeleteIcon from '@mui/icons-material/Delete'
import ModeEditIcon from '@mui/icons-material/ModeEdit'
import { Maker } from '@/api/types'
import { DataGrid, GridColDef } from '@mui/x-data-grid'
import CustomChip from '@/@core/components/mui/chip'
import InfoIcon from '@mui/icons-material/Info'
import OptionsMenu from '@/@core/components/option-menu'
import { SnackbarAlert } from '@/pages/SnackbarAkert'
import Breadcrumb from '@/pages/Breadcrumb'

interface CellType {
  row: Maker
}

export default function Page() {
  const { user } = useAuth()
  const query =
    user?.role == ROLE.ADMIN
      ? JSON.stringify({
          state: [STATE.ACTIVE, STATE.INACTIVE]
        })
      : JSON.stringify({
          state: [STATE.ACTIVE]
        })
  const maker = useSelector((store: RootState) => store.maker)

  const dispatch = useDispatch<AppDispatch>()
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 })
  const [searchValue, setSearchValue] = useState<string>('')

  const fetchMaker = useCallback(() => {
    // setLoading(true)
    dispatch(
      getListMaker({
        limit: paginationModel.pageSize,
        offset: paginationModel.page * paginationModel.pageSize,
        search: searchValue,
        query: query
      })
    ).then(() => setLoading(false))
  }, [dispatch, paginationModel, query, searchValue])

  useEffect(() => {
    const timeout = setTimeout(() => {
      fetchMaker()
    }, 500)

    return () => {
      clearTimeout(timeout)
    }
  }, [fetchMaker])

  const [alert, setAlert] = useState<boolean>(false)
  const [alertMessage, setAlertMessage] = useState<string>('')
  const [addDialog, setAddDialog] = useState<boolean>(false)
  const [detailDialog, setDetailDialog] = useState<boolean>(false)
  const [editDialog, setEditDialog] = useState<boolean>(false)
  const [deleteDialog, setDeleteDialog] = useState<boolean>(false)
  const [makerId, setMakerId] = useState<string>('')
  const [loading, setLoading] = useState(false)

  const handleOpenCreate = useCallback(() => {
    setAddDialog(true)
  }, [])

  const handleOpenUpdate = useCallback((id: string) => {
    setMakerId(id)
    setEditDialog(true)
  }, [])

  const handleOpenDelete = useCallback((id: string) => {
    setMakerId(id)
    setDeleteDialog(true)
  }, [])

  const handleOpenDetail = useCallback((id: string) => {
    setMakerId(id)
    setDetailDialog(true)
  }, [])

  const handleCreate = useCallback(() => {
    fetchMaker()
    setAddDialog(false)
    setAlertMessage('Thêm Maker thành công.')
    setAlert(true)
  }, [fetchMaker])

  const handleUpdate = useCallback(() => {
    fetchMaker()
    setAlertMessage('Chỉnh sửa Maker thành công.')
    setEditDialog(false)
    setAlert(true)
  }, [fetchMaker])

  const handleDelete = useCallback(() => {
    fetchMaker()
    setAlertMessage('Xóa Maker thành công.')
    setDeleteDialog(false)
    setAlert(true)
  }, [fetchMaker])

  const handleChangePage = useCallback((event: unknown, newPage: number) => {
    setLoading(true)
    setPaginationModel(prev => {
      return {
        ...prev,
        page: newPage
      }
    })
  }, [])
  const handleChangeRowsPerPage = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setLoading(true)
    setPaginationModel(prev => {
      return {
        ...prev,
        page: 0,
        pageSize: parseInt(event.target.value, 10)
      }
    })
  }, [])

  const columns: GridColDef[] = [
    {
      flex: 0.05,
      field: 'id',
      minWidth: 30,
      headerName: '#',
      sortable: false,
      renderCell: ({ api, id }) => (
        <Typography>
          {paginationModel.page * paginationModel.pageSize + api.getRowIndexRelativeToVisibleRows(id) + 1}
        </Typography>
      )
    },
    {
      flex: 0.1,
      field: 'name',
      minWidth: 100,
      headerName: 'Tên',
      sortable: false,
      renderCell: ({ row }: CellType) => <Typography sx={{ color: 'text.secondary' }}>{`${row.name || 0}`}</Typography>
    },
    {
      flex: 0.1,
      field: 'address',
      minWidth: 100,
      sortable: false,
      headerName: 'Vị trí',
      renderCell: ({ row }: CellType) => (
        <Typography sx={{ color: 'text.secondary' }}>{`${row.address || 0}`}</Typography>
      )
    },
    {
      flex: 0.1,
      minWidth: 100,
      field: 'state',
      headerName: 'Trạng thái',
      sortable: false,
      renderCell: ({ row }: CellType) => {
        switch (row.state) {
          case STATE.ACTIVE:
            return <CustomChip rounded size='small' skin='light' color='success' label='Đang hoạt động' />
          case STATE.INACTIVE:
            return <CustomChip rounded size='small' skin='light' color='error' label='Không hoạt động' />
        }
      }
    },
    {
      flex: 0.05,
      minWidth: 50,
      sortable: false,
      field: 'actions',
      renderHeader: () => <EngineeringIcon fontSize='large'></EngineeringIcon>,
      renderCell: ({ row }: CellType) => (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <OptionsMenu
            menuProps={{ sx: { '& .MuiMenuItem-root svg': { mr: 2 } } }}
            iconButtonProps={{ size: 'small', sx: { color: 'text.secondary' } }}
            options={[
              {
                text: 'Chỉnh sửa',
                icon: <ModeEditIcon />,
                menuItemProps: {
                  onClick: () => {
                    handleOpenUpdate(row.id)
                  }
                }
              },
              {
                text: 'Xoá',
                icon: <DeleteIcon />,
                menuItemProps: {
                  onClick: () => {
                    handleOpenDelete(row.id)
                  }
                }
              },
              {
                text: 'Chi tiết',
                icon: <InfoIcon />,
                menuItemProps: {
                  onClick: () => {
                    handleOpenDetail(row.id)
                  }
                }
              }
            ]}
          />
        </Box>
      )
    }
  ]

  return (
    <Grid container spacing={6}>
      <Grid item xs={12} xl={12}>
        <Breadcrumb path='Quản lý' subPath='Maker' />

        <Card>
          {alert ? <SnackbarAlert open={alert} message={alertMessage} setOpen={setAlert} severity='success' /> : null}

          {addDialog ? <AddDialog open={addDialog} handleCreate={handleCreate} setOpen={setAddDialog} /> : null}
          {editDialog ? (
            <EditDialog open={editDialog} id={makerId} setOpen={setEditDialog} handleUpdate={handleUpdate} />
          ) : null}
          {deleteDialog ? (
            <DeleteDialog open={deleteDialog} id={makerId} setOpen={setDeleteDialog} handleDelete={handleDelete} />
          ) : null}
          {detailDialog ? (
            <DetailDialog open={detailDialog} id={makerId} setOpen={setDetailDialog} handleDetail={fetchMaker} />
          ) : null}
          <Typography variant={'h3'} sx={{ m: 5, mb: 3 }}>
            Danh sách Maker
          </Typography>
          <Divider variant='middle' />
          <CardHeader
            title={
              <CustomTextField
                InputLabelProps={{}}
                sx={{ ':hover': { color: '#1976d2' } }}
                type='text'
                placeholder='Tìm kiếm maker'
                InputProps={{
                  endAdornment: (
                    <InputAdornment position='end'>
                      <IconButton
                        disabled={searchValue ? false : true}
                        onClick={() => {
                          setLoading(true)

                          setSearchValue('')
                        }}
                      >
                        <ClearIcon />
                      </IconButton>
                    </InputAdornment>
                  )
                }}
                value={searchValue}
                onChange={e => {
                  setLoading(true)
                  setSearchValue(e.target.value),
                    setPaginationModel(prev => {
                      return {
                        ...prev,
                        page: 0
                      }
                    })
                }}
              />
            }
            action={
              <Button variant='contained' onClick={handleOpenCreate}>
                <AddCircleIcon />
                &nbsp; Thêm Maker
              </Button>
            }
          />
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 300 }}>
              <CircularProgress />
            </Box>
          ) : (
            <CardContent>
              <DataGrid
                hideFooterSelectedRowCount
                disableRowSelectionOnClick
                disableColumnMenu
                rowHeight={62}
                columns={columns}
                rows={maker.makers}
                autoHeight
                sx={{
                  // disable cell selection style
                  '.MuiDataGrid-cell:focus': {
                    outline: 'none'
                  },

                  // pointer cursor on ALL rows
                  '& .MuiDataGrid-row:hover': {
                    cursor: 'pointer'
                  }
                }}
                slots={{ pagination: null }}
              />
              <TablePagination
                rowsPerPageOptions={[2, 10, 25]}
                component='div'
                count={Math.floor(Number(maker.amount))}
                rowsPerPage={paginationModel.pageSize}
                page={paginationModel.page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                labelRowsPerPage='Số dòng trên mỗi trang'
                labelDisplayedRows={({ from, to, count }) =>
                  `${from}-${to} trong số ${count !== -1 ? count : `nhiều hơn ${to}`}`
                }
              />
            </CardContent>
          )}
        </Card>
      </Grid>
    </Grid>
  )
}
Page.acl = {
  action: 'manage',
  subject: 'maker-page'
}
