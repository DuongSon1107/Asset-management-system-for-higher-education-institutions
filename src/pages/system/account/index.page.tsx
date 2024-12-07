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
import DeleteIcon from '@mui/icons-material/Delete'
import ModeEditIcon from '@mui/icons-material/ModeEdit'
import React, { useCallback, useEffect, useState } from 'react'
import { AddDialog } from './AddDialog'
import { ROLE, STATE } from '@/api/enum'
import { useAuth } from '@/hooks/useAuth'
import { RootState, AppDispatch } from '@/store'
import { getListAccount } from '@/store/reducers/account'
import AddCircleIcon from '@mui/icons-material/AddCircle'
import { useSelector, useDispatch } from 'react-redux'
import { DeleteDialog } from './DeleteDialog'
import { DetailDialog } from './DetailDialog'
import { EditDialog } from './EditDialog'
import { Account } from '@/api/types'
import { ClearIcon } from '@mui/x-date-pickers'
import CustomTextField from '@/@core/components/mui/text-field'
import { DataGrid, GridColDef } from '@mui/x-data-grid'
import OptionsMenu from '@/@core/components/option-menu'
import CustomChip from '@/@core/components/mui/chip'
import InfoIcon from '@mui/icons-material/Info'
import Breadcrumb from '@/pages/Breadcrumb'
import { SnackbarAlert } from '@/pages/SnackbarAkert'

interface Props {
  role?: ROLE
  addActive?: boolean
  id?: string
  breadcrumb?: boolean
  header?: string
  pageSize?: number
}
interface CellType {
  row: Account
}

export default function Page({ role, id, breadcrumb = true, header, pageSize, addActive = true }: Props) {
  const { user } = useAuth()
  const query =
    user?.role == ROLE.ADMIN && role && id
      ? JSON.stringify({
          state: [STATE.ACTIVE, STATE.INACTIVE],
          role: [role],
          warehouseId: [id]
        })
      : JSON.stringify({
          state: [STATE.ACTIVE, STATE.INACTIVE]
        })

  const account = useSelector((store: RootState) => store.account)
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: pageSize ? pageSize : 10 })
  const [searchValue, setSearchValue] = useState<string>('')
  const dispatch = useDispatch<AppDispatch>()
  const fetchAccount = useCallback(() => {
    dispatch(
      getListAccount({
        limit: paginationModel.pageSize,
        offset: paginationModel.page * paginationModel.pageSize,
        search: searchValue,
        query: query
      })
    ).then(() => setLoading(false))
  }, [dispatch, paginationModel.page, paginationModel.pageSize, query, searchValue])
  useEffect(() => {
    const timeout = setTimeout(() => {
      fetchAccount()
    }, 500)

    return () => {
      clearTimeout(timeout)
    }
  }, [fetchAccount])
  const [alert, setAlert] = useState<boolean>(false)
  const [alertMessage, setAlertMessage] = useState<string>('')
  const [active, setActive] = useState<boolean>(false)
  const [addDialog, setAddDialog] = useState<boolean>(false)
  const [detailDialog, setDetailDialog] = useState<boolean>(false)
  const [editDialog, setEditDialog] = useState<boolean>(false)
  const [deleteDialog, setDeleteDialog] = useState<boolean>(false)
  const [accountId, setAccountId] = useState<string>('')
  const [loading, setLoading] = useState(false)

  const handleOpenCreate = useCallback(() => {
    if (addActive) {
      setAddDialog(true)
    } else {
      setActive(true)
    }
  }, [addActive])

  const handleOpenUpdate = useCallback((id: string) => {
    setAccountId(id)
    setEditDialog(true)
  }, [])

  const handleOpenDelete = useCallback((id: string) => {
    setAccountId(id)
    setDeleteDialog(true)
  }, [])

  const handleOpenDetail = useCallback((id: string) => {
    setAccountId(id)
    setDetailDialog(true)
  }, [])

  const handleCreate = useCallback(() => {
    fetchAccount()
    setAddDialog(false)
    setAlertMessage('Thêm tài khoản thành công.')
    setAlert(true)
  }, [fetchAccount])

  const handleUpdate = useCallback(() => {
    fetchAccount()
    setAlertMessage('Chỉnh sửa tài khoản thành công.')
    setEditDialog(false)
    setAlert(true)
  }, [fetchAccount])

  const handleDelete = useCallback(() => {
    fetchAccount()
    setAlertMessage('Xóa tài khoản thành công.')
    setDeleteDialog(false)
    setAlert(true)
  }, [fetchAccount])
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
      renderCell: ({ row }: CellType) => (
        <Typography sx={{ color: 'text.secondary' }}>{`${row.displayName || 0}`}</Typography>
      )
    },
    {
      flex: 0.1,
      field: 'phone',
      minWidth: 100,
      sortable: false,
      headerName: 'Số điện thoại',
      renderCell: ({ row }: CellType) => <Typography sx={{ color: 'text.secondary' }}>{`${row.phone || 0}`}</Typography>
    },
    {
      flex: 0.1,
      field: 'email',
      minWidth: 100,
      sortable: false,
      headerName: 'Email',
      renderCell: ({ row }: CellType) => <Typography sx={{ color: 'text.secondary' }}>{`${row.email || 0}`}</Typography>
    },
    {
      flex: 0.1,
      field: 'role',
      minWidth: 100,
      sortable: false,
      headerName: 'Vai trò',
      renderCell: ({ row }: CellType) => {
        switch (row.role) {
          case ROLE.ADMIN:
            return <Typography sx={{ color: 'text.secondary' }}>Admin</Typography>
          case ROLE.MAKER:
            return <Typography sx={{ color: 'text.secondary' }}>Quản lý maker</Typography>
          case ROLE.WAREHOUSE:
            return <Typography sx={{ color: 'text.secondary' }}>Quản lý kho</Typography>
        }
      }
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
        {breadcrumb ? <Breadcrumb path='Hệ thống' subPath='Tài khoản' /> : null}
        <Card>
          {alert ? <SnackbarAlert open={alert} message={alertMessage} setOpen={setAlert} severity='success' /> : null}

          {active ? (
            <SnackbarAlert
              open={active}
              setOpen={setActive}
              message='Không thể thêm do trạng thái đang không hoạt động!'
              severity='warning'
            />
          ) : null}
          {addDialog ? (
            <AddDialog
              open={addDialog}
              handleCreate={handleCreate}
              setOpen={setAddDialog}
              roleAccount={role}
              storeId={id}
            />
          ) : null}
          {editDialog ? (
            <EditDialog open={editDialog} id={accountId} setOpen={setEditDialog} handleUpdate={handleUpdate} />
          ) : null}
          {detailDialog ? <DetailDialog open={detailDialog} id={accountId} setOpen={setDetailDialog} /> : null}
          {deleteDialog ? (
            <DeleteDialog open={deleteDialog} id={accountId} setOpen={setDeleteDialog} handleDelete={handleDelete} />
          ) : null}
          <Typography variant={header ? 'h5' : 'h4'} sx={{ m: 5, mb: 3 }}>
            {header ? header : 'Danh sách tài khoản'}
          </Typography>
          <Divider variant='middle' />
          <CardHeader
            title={
              <CustomTextField
                InputLabelProps={{}}
                sx={{ ':hover': { color: '#1976d2' } }}
                type='text'
                placeholder='Tìm kiếm tài khoản'
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
                &nbsp; Thêm tài khoản
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
                hideFooter
                hideFooterSelectedRowCount
                disableColumnMenu
                rowHeight={62}
                columns={columns}
                rows={account.accounts}
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
              <Divider variant='fullWidth' />
              <TablePagination
                rowsPerPageOptions={pageSize ? [pageSize] : [5, 10]}
                component='div'
                count={Math.floor(Number(account.amount))}
                rowsPerPage={paginationModel.pageSize}
                page={paginationModel.page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                labelRowsPerPage={'Số dòng trên mỗi trang'}
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
  action: 'account',
  subject: 'account-page'
}
