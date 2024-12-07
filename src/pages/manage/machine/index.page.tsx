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
import EngineeringIcon from '@mui/icons-material/Engineering'
import React, { useCallback, useEffect, useState } from 'react'
import { AddDialog } from './AddDialog'
import AddCircleIcon from '@mui/icons-material/AddCircle'
import { useDispatch, useSelector } from 'react-redux'
import { getListMachine } from '@/store/reducers/machine'
import { AppDispatch, RootState } from '@/store'
import DeleteIcon from '@mui/icons-material/Delete'
import ModeEditIcon from '@mui/icons-material/ModeEdit'
import InfoIcon from '@mui/icons-material/Info'
import { EditDialog } from './EditDialog'
import { DetailDialog } from './DetailDialog'
import { DeleteDialog } from './DeleteDialog.'
import CustomTextField from '@/@core/components/mui/text-field'
import { ROLE, STATE_MAINTAIN, TYPE_MACHINE } from '@/api/enum'
import { useAuth } from '@/hooks/useAuth'
import { ClearIcon } from '@mui/x-date-pickers'
import { Machine } from '@/api/types'
import OptionsMenu from '@/@core/components/option-menu'
import { DataGrid, GridColDef } from '@mui/x-data-grid'
import CustomChip from '@/@core/components/mui/chip'
import { SnackbarAlert } from '@/pages/SnackbarAkert'
import Breadcrumb from '@/pages/Breadcrumb'

interface CellType {
  row: Machine
}

export default function Page() {
  const { user } = useAuth()
  const query =
    user?.role == ROLE.ADMIN
      ? JSON.stringify({
          state: [STATE_MAINTAIN.ACTIVE, STATE_MAINTAIN.INACTIVE, STATE_MAINTAIN.MAINTAIN]
        })
      : JSON.stringify({
          state: [STATE_MAINTAIN.ACTIVE, STATE_MAINTAIN.MAINTAIN]
        })
  const dispatch = useDispatch<AppDispatch>()
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 })
  const [searchValue, setSearchValue] = useState<string | undefined>(undefined)
  const [loading, setLoading] = useState(false)
  const fetchMachine = useCallback(() => {
    // setLoading(true)
    dispatch(
      getListMachine({
        limit: paginationModel.pageSize,
        offset: paginationModel.page * paginationModel.pageSize,
        search: searchValue,
        query: query
      })
    ).then(() => setLoading(false))
  }, [dispatch, paginationModel, query, searchValue])
  useEffect(() => {
    const timeout = setTimeout(() => {
      fetchMachine()
    }, 500)

    return () => {
      clearTimeout(timeout)
    }
  }, [fetchMachine])
  const machine = useSelector((store: RootState) => store.machine)
  const [alert, setAlert] = useState<boolean>(false)
  const [alertMessage, setAlertMessage] = useState<string>('')
  const [addDialog, setAddDialog] = useState<boolean>(false)
  const [detailDialog, setDetailDialog] = useState<boolean>(false)
  const [editDialog, setEditDialog] = useState<boolean>(false)
  const [deleteDialog, setDeleteDialog] = useState<boolean>(false)
  const [machineId, setMachineId] = useState<string>('')

  const handleOpenCreate = useCallback(() => {
    setAddDialog(true)
  }, [])

  const handleOpenUpdate = useCallback((id: string) => {
    setMachineId(id)
    setEditDialog(true)
  }, [])

  const handleOpenDelete = useCallback((id: string) => {
    setMachineId(id)
    setDeleteDialog(true)
  }, [])

  const handleOpenDetail = useCallback((id: string) => {
    setMachineId(id)
    setDetailDialog(true)
  }, [])

  const handleCreate = useCallback(() => {
    setLoading(true)
    fetchMachine()
    setAddDialog(false)
    setAlertMessage('Thêm máy quét thành công.')
    setAlert(true)
  }, [fetchMachine])

  const handleUpdate = useCallback(() => {
    setLoading(true)
    fetchMachine()
    setAlertMessage('Chỉnh sửa máy quét thành công.')
    setEditDialog(false)
    setAlert(true)
  }, [fetchMachine])

  const handleDelete = useCallback(() => {
    setLoading(true)
    fetchMachine()
    setAlertMessage('Xóa máy quét thành công.')
    setDeleteDialog(false)
    setAlert(true)
  }, [fetchMachine])

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

  const handleClearSearch = useCallback(() => {
    setLoading(true)
    setSearchValue('')
  }, [])

  const handleSearch = useCallback((e: any) => {
    setLoading(true)
    setSearchValue(e.target.value),
      setPaginationModel(prev => {
        return {
          ...prev,
          page: 0
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
      renderCell: ({ api, id }) => {
        const condition = api.getRowIndexRelativeToVisibleRows(id)
        const index = condition + paginationModel.page * paginationModel.pageSize

        return (
          <Typography>
            {condition !== undefined ? `${index + 1}` : `${paginationModel.page * paginationModel.pageSize}`}
          </Typography>
        )
      }
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
      field: 'type',
      minWidth: 100,
      sortable: false,
      headerName: 'Loại',
      renderCell: ({ row }: CellType) => {
        switch (row.type) {
          case TYPE_MACHINE.FIXED:
            return <Typography sx={{ color: 'text.secondary' }}>{'Cố định'}</Typography>
          case TYPE_MACHINE.MOVING:
            return <Typography sx={{ color: 'text.secondary' }}>{'Di động'}</Typography>
        }
      }
    },
    {
      flex: 0.1,
      minWidth: 100,
      field: 'warehouse',
      headerName: 'Kho ',
      sortable: false,
      renderCell: ({ row }: CellType) => (
        <Typography sx={{ color: 'text.secondary' }}>{row.warehouse ? row.warehouse.name : '. . .'}</Typography>
      )
    },
    {
      flex: 0.1,
      field: 'location',
      minWidth: 100,
      sortable: false,
      headerName: 'Vị trí',
      renderCell: ({ row }: CellType) => (
        <Typography sx={{ color: 'text.secondary' }}>{`${row.location || 0}`}</Typography>
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
          case STATE_MAINTAIN.ACTIVE:
            return <CustomChip rounded size='small' skin='light' color='success' label='Đang hoạt động' />
          case STATE_MAINTAIN.INACTIVE:
            return <CustomChip rounded size='small' skin='light' color='error' label='Không hoạt động' />
          case STATE_MAINTAIN.MAINTAIN:
            return <CustomChip rounded size='small' skin='light' color='warning' label='Đang bảo trì' />
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
      <Grid item xs={12}>
        <Breadcrumb path='Quản lý' subPath='Máy quét' />
        <Card>
          {alert ? <SnackbarAlert open={alert} message={alertMessage} setOpen={setAlert} severity='success' /> : null}
          {addDialog ? <AddDialog open={addDialog} handleCreate={handleCreate} setOpen={setAddDialog} /> : null}
          {editDialog ? (
            <EditDialog open={editDialog} id={machineId} handleUpdate={handleUpdate} setOpen={setEditDialog} />
          ) : null}
          {detailDialog ? <DetailDialog open={detailDialog} id={machineId} setOpen={setDetailDialog} /> : null}
          {deleteDialog ? (
            <DeleteDialog open={deleteDialog} id={machineId} handleDelete={handleDelete} setOpen={setDeleteDialog} />
          ) : null}

          <Typography variant={'h3'} sx={{ m: 5, mb: 3 }}>
            Danh sách máy quét
          </Typography>
          <Divider variant='middle' />
          <CardHeader
            title={
              <CustomTextField
                sx={{ ':hover': { color: '#1976d2' } }}
                type='text'
                placeholder='Tìm kiếm máy quét'
                InputProps={{
                  endAdornment: (
                    <InputAdornment position='end'>
                      <IconButton disabled={searchValue ? false : true} onClick={handleClearSearch}>
                        <ClearIcon />
                      </IconButton>
                    </InputAdornment>
                  )
                }}
                value={searchValue}
                onChange={handleSearch}
              />
            }
            action={
              <Button variant='contained' onClick={handleOpenCreate}>
                <AddCircleIcon />
                &nbsp; Thêm máy quét
              </Button>
            }
          />
          <CardContent>
            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 300 }}>
                <CircularProgress />
              </Box>
            ) : (
              <DataGrid
                hideFooterSelectedRowCount
                disableRowSelectionOnClick
                disableColumnMenu
                rowHeight={62}
                columns={columns}
                rows={machine.machines}
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
                slots={{
                  pagination: null
                }}
              />
            )}
            <TablePagination
              rowsPerPageOptions={[10, 25, 50]}
              component='div'
              count={Math.floor(Number(machine.amount))}
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
        </Card>
      </Grid>
    </Grid>
  )
}
Page.acl = {
  action: 'manage',
  subject: 'machine-page'
}
