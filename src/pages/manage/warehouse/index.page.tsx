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
import AddCircleIcon from '@mui/icons-material/AddCircle'
import { AddDialog } from './AddDialog'
import { ROLE, STATE } from '@/api/enum'
import { DeleteDialog } from './DeleteDialog'
import { DetailDialog } from './DetailDialog'
import { EditDialog } from './EditDialog'
import { useAuth } from '@/hooks/useAuth'
import { AppDispatch, RootState } from '@/store'
import { getListWarehouse } from '@/store/reducers/warehouse'
import React, { useCallback, useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import EngineeringIcon from '@mui/icons-material/Engineering'
import { Warehouse } from '@/api/types'
import ModeEditIcon from '@mui/icons-material/ModeEdit'
import CustomTextField from '@/@core/components/mui/text-field'
import { ClearIcon } from '@mui/x-date-pickers'
import { DataGrid, GridColDef } from '@mui/x-data-grid'
import CustomChip from '@/@core/components/mui/chip'
import InfoIcon from '@mui/icons-material/Info'
import OptionsMenu from '@/@core/components/option-menu'
import DeleteIcon from '@mui/icons-material/Delete'
import { SnackbarAlert } from '@/pages/SnackbarAkert'
import Breadcrumb from '@/pages/Breadcrumb'

interface CellType {
  row: Warehouse
}

export default function Page() {
  const { user } = useAuth()
  const query =
    user?.role == ROLE.ADMIN
      ? JSON.stringify({
          state: [STATE.ACTIVE, STATE.INACTIVE]
        })
      : JSON.stringify({
          state: [STATE.ACTIVE, STATE.INACTIVE]
        })
  const warehouses = useSelector((store: RootState) => store.warehouse)
  const dispatch = useDispatch<AppDispatch>()

  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 })
  const [searchValue, setSearchValue] = useState<string>('')
  const fetchWarehouse = useCallback(() => {
    dispatch(
      getListWarehouse({
        limit: paginationModel.pageSize,
        offset: paginationModel.page * paginationModel.pageSize,
        search: searchValue,
        query: query
      })
    ).then(() => setLoading(false))
  }, [dispatch, paginationModel, query, searchValue])
  useEffect(() => {
    const timeout = setTimeout(() => {
      fetchWarehouse()
    }, 500)

    return () => {
      clearTimeout(timeout)
    }
  }, [fetchWarehouse])
  const [alert, setAlert] = useState<boolean>(false)
  const [alertMessage, setAlertMessage] = useState<string>('')
  const [addDialog, setAddDialog] = useState<boolean>(false)
  const [detailDialog, setDetailDialog] = useState<boolean>(false)
  const [editDialog, setEditDialog] = useState<boolean>(false)
  const [deleteDialog, setDeleteDialog] = useState<boolean>(false)
  const [warehouseId, setWarehouseId] = useState<string>('')
  const [loading, setLoading] = useState(false)

  const handleOpenCreate = useCallback(() => {
    setAddDialog(true)
  }, [])

  const handleOpenUpdate = useCallback((id: string) => {
    setWarehouseId(id)
    setEditDialog(true)
  }, [])

  const handleOpenDelete = useCallback((id: string) => {
    setWarehouseId(id)
    setDeleteDialog(true)
  }, [])

  const handleOpenDetail = useCallback((id: string) => {
    setWarehouseId(id)
    setDetailDialog(true)
  }, [])

  const handleCreate = useCallback(() => {
    fetchWarehouse()
    setAddDialog(false)
    setAlertMessage('Thêm kho thành công.')
    setAlert(true)
  }, [fetchWarehouse])

  const handleUpdate = useCallback(() => {
    fetchWarehouse()
    setAlertMessage('Chỉnh sửa kho thành công.')
    setEditDialog(false)
    setAlert(true)
  }, [fetchWarehouse])

  const handleDelete = useCallback(() => {
    fetchWarehouse()
    setAlertMessage('Xóa kho thành công.')
    setDeleteDialog(false)
    setAlert(true)
  }, [fetchWarehouse])

  const handleChangePage = useCallback((event: unknown, newPage: number) => {
    setLoading(true)
    setPaginationModel(prev => {
      return {
        ...prev,
        page: newPage
      }
    })
  }, [])
  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLoading(true)
    setPaginationModel(prev => {
      return {
        ...prev,
        page: 0,
        pageSize: parseInt(event.target.value, 10)
      }
    })
  }

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
      <Grid item xs={12}>
        <Breadcrumb path='Quản lý' subPath='Kho' />

        <Card>
          {alert ? <SnackbarAlert open={alert} message={alertMessage} setOpen={setAlert} severity='success' /> : null}
          {addDialog ? <AddDialog open={addDialog} handleCreate={handleCreate} setOpen={setAddDialog} /> : null}
          {editDialog ? (
            <EditDialog open={editDialog} id={warehouseId} setOpen={setEditDialog} handleUpdate={handleUpdate} />
          ) : null}
          {deleteDialog ? (
            <DeleteDialog open={deleteDialog} id={warehouseId} setOpen={setDeleteDialog} handleDelete={handleDelete} />
          ) : null}
          {detailDialog ? (
            <DetailDialog
              open={detailDialog}
              id={warehouseId}
              setOpen={setDetailDialog}
              handleDetail={fetchWarehouse}
            />
          ) : null}
          <Typography variant={'h3'} sx={{ m: 5, mb: 3 }}>
            Danh sách kho
          </Typography>
          <Divider variant='middle' />

          <CardHeader
            title={
              <CustomTextField
                InputLabelProps={{}}
                sx={{ ':hover': { color: '#1976d2' } }}
                type='text'
                placeholder='Tìm kiếm kho'
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
                  setSearchValue(e.target.value)
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
                &nbsp; Thêm kho
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
                rows={warehouses.warehouses}
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
                pagination={undefined}
                slots={{ pagination: null }}
              />
              <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component='div'
                count={Math.floor(Number(warehouses.amount))}
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
  subject: 'warehouse-page'
}
