import { Box, Card, Grid, LinearProgress, Typography } from '@mui/material'
import TableHeader from './TableHeader'
import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { AppDispatch, RootState } from '@/store'
import { useSelector } from 'react-redux'
import { DataGrid, GridColDef, GridSortModel } from '@mui/x-data-grid'
import { Takeout } from '@/api/types'
import CustomChip from '@/@core/components/mui/chip'
import { ROLE, STATE, STATUS_TRANSFER } from '@/api/enum'
import Icon from '@/@core/components/icon'
import OptionsMenu from '@/@core/components/option-menu'
import DialogDetail from './detail'
import DialogUpdate from './update'
import DialogCreate from './create'
import React from 'react'
import DialogDelete from './delete'
import { useAuth } from '@/hooks/useAuth'
import toast from 'react-hot-toast'
import { createTakeout, deleteTakeout, getListTakeout, updateTakeout } from '@/store/reducers/takeout'
import { format } from 'date-fns'
import { getListPermission } from '@/store/reducers/permission'
import Breadcrumb from '@/pages/Breadcrumb'

interface CellType {
  row: Takeout
}

export default function Page() {
  const { user } = useAuth()
  const query =
    user?.role == ROLE.ADMIN
      ? JSON.stringify({
          state: [STATE.ACTIVE, STATE.INACTIVE]
        })
      : JSON.stringify({
          state: [STATE.INACTIVE]
        })
  const [searchValue, setSearchValue] = useState<string>('')
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 })
  const [sortModel, setSortModel] = React.useState<GridSortModel>([
    {
      field: 'createdAt',
      sort: 'desc'
    }
  ])

  const [openDetail, setOpenDetail] = useState<boolean>(false)
  const [openUpdate, setOpenUpdate] = useState<boolean>(false)
  const [openCreate, setOpenCreate] = useState<boolean>(false)
  const [openDelete, setOpenDelete] = useState<boolean>(false)

  const dispatch = useDispatch<AppDispatch>()
  const store = useSelector((state: RootState) => state.takeout)
  const [takeoutExist, setTakeoutExist] = useState<Takeout>()

  const fetchData = async () => {
    dispatch(
      getListTakeout({
        limit: paginationModel.pageSize,
        offset: paginationModel.page * paginationModel.pageSize,
        search: searchValue,
        order: sortModel[0] ? sortModel[0].field : undefined,
        arrange: sortModel[0] ? (sortModel[0].sort as string) : undefined,
        query: query
      })
    )
  }

  useEffect(() => {
    dispatch(getListPermission())

    fetchData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, searchValue, setSearchValue, sortModel, paginationModel, setPaginationModel])

  const handleOpenDetail = () => {
    setOpenDetail(true)
  }

  const handleCloseDetail = () => {
    setOpenDetail(false)
  }
  const handleOpenUpdate = () => {
    setOpenUpdate(true)
  }

  const handleCloseUpdate = () => {
    setOpenUpdate(false)
  }
  const handleConfirmUpdate = async (takeout: Takeout) => {
    console.log(takeout)

    await dispatch(updateTakeout({ id: takeout.id, takeout: takeout }))
    setOpenUpdate(false)
    await fetchData()
  }
  const handleOpenCreate = () => {
    setOpenCreate(true)
  }

  const handleCloseCreate = () => {
    setOpenCreate(false)
  }
  const handleConfirmCreate = async (takeout: Takeout) => {
    await dispatch(createTakeout(takeout as Takeout))
    setOpenCreate(false)
    await fetchData()

    return true
  }

  const handleOpenDelete = () => {
    setOpenDelete(true)
  }

  const handleCloseDelete = () => {
    setOpenDelete(false)
  }
  const handleConfirmDelete = async () => {
    const res = await dispatch(deleteTakeout(takeoutExist!.id))
    if (res.meta.requestStatus == 'fulfilled') {
      toast.success('Xoá takeout thành công!')
    } else {
      toast.error('Xoá takeout thất bại!')
    }
    setOpenDelete(false)
    await fetchData()
  }

  const columns: GridColDef[] = [
    {
      flex: 0.05,
      field: 'id',
      minWidth: 50,
      headerName: '#',
      renderCell: ({ api, id }) => {
        const condition = api.getRowIndexRelativeToVisibleRows(id)
        const index = condition + paginationModel.page * paginationModel.pageSize

        return (
          <Typography>
            {condition != undefined ? `${index + 1}` : `${paginationModel.page * paginationModel.pageSize}`}
          </Typography>
        )
      }
    },
    {
      flex: 0.1,
      field: 'fromWarehouse',
      minWidth: 100,
      headerName: 'Từ kho',
      renderCell: ({ row }: CellType) => (
        <Typography sx={{ color: 'text.secondary' }}>
          {row.fromWarehouse ? `${row.fromWarehouse.name || 0}` : ``}
        </Typography>
      )
    },
    {
      flex: 0.1,
      minWidth: 100,
      field: 'toWarehouse',
      headerName: 'Đến kho',
      renderCell: ({ row }: CellType) => (
        <Typography sx={{ color: 'text.secondary' }}>
          {row.toWarehouse ? `${row.toWarehouse.name || 0}` : ``}
        </Typography>
      )
    },
    {
      flex: 0.1,
      minWidth: 140,
      field: 'transferDate',
      headerName: 'Thời gian',
      sortable: false,
      renderCell: ({ row }: CellType) => (
        <Typography sx={{ color: 'text.secondary' }}>
          {row.transferDate ? format(new Date(row.transferDate), 'HH:mm MM/dd/yyyy') : ''}
        </Typography>
      )
    },
    {
      flex: 0.1,
      minWidth: 100,
      field: 'status',
      headerName: 'Tình trạng',
      sortable: false,
      renderCell: ({ row }: CellType) => {
        switch (row.status) {
          case STATUS_TRANSFER.FIND:
            return <CustomChip rounded size='small' skin='light' color='secondary' label='Đang chờ vận chuyển' />
          case STATUS_TRANSFER.SCANNING:
            return <CustomChip rounded size='small' skin='light' color='primary' label='Đang kiểm tra' />
          case STATUS_TRANSFER.TRANSFER:
            return <CustomChip rounded size='small' skin='light' color='info' label='Đang vận chuyển' />
          case STATUS_TRANSFER.SUCCESS:
            return <CustomChip rounded size='small' skin='light' color='success' label='Thành công' />
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
      headerName: '',
      renderCell: ({ row }: CellType) => (
        <div onClick={e => e.stopPropagation()}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <OptionsMenu
              menuProps={{ sx: { '& .MuiMenuItem-root svg': { mr: 2 } } }}
              iconButtonProps={{ size: 'small', sx: { color: 'text.secondary' } }}
              options={[
                {
                  text: 'Chỉnh sửa',
                  icon: <Icon icon='tabler:edit' fontSize={20} />,
                  menuItemProps: {
                    onClick: () => {
                      const product = store.takeouts.find((takeout: Takeout) => {
                        return takeout.id == row.id
                      })
                      setTakeoutExist(product)
                      handleOpenUpdate()
                    }
                  }
                },
                {
                  text: 'Xoá',
                  icon: <Icon icon='ic:outline-delete' fontSize={20} />,
                  menuItemProps: {
                    onClick: () => {
                      const product = store.takeouts.find((takeout: Takeout) => {
                        return takeout.id == row.id
                      })
                      setTakeoutExist(product)
                      handleOpenDelete()
                    }
                  }
                }
              ]}
            />
          </Box>
        </div>
      )
    }
  ]

  return (
    <>
      <Grid container spacing={6}>
        <Grid item xs={12}>
          <Breadcrumb path='Quản lý' subPath='Takeout' />
          <Card>
            <TableHeader value={searchValue} handleFilter={setSearchValue} handleClick={handleOpenCreate} />
            <DataGrid
              autoHeight
              paginationMode='server'
              pageSizeOptions={[10, 25, 50]}
              paginationModel={paginationModel}
              onPaginationModelChange={setPaginationModel}
              slotProps={{
                pagination: {
                  labelRowsPerPage: 'Số bản ghi mỗi trang',
                  labelDisplayedRows(paginationInfo) {
                    return (
                      <Typography>
                        {paginationInfo.from} - {paginationInfo.to} trên {paginationInfo.count}
                      </Typography>
                    )
                  }
                }
              }}
              slots={{
                loadingOverlay: LinearProgress
              }}
              sortModel={sortModel}
              onSortModelChange={newSortModel => setSortModel(newSortModel)}
              rowHeight={62}
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
              hideFooterSelectedRowCount
              rowCount={Number(store.amount)}
              rows={store.takeouts}
              columns={columns}
              disableRowSelectionOnClick
              onRowClick={async ({ id }) => {
                handleOpenDetail()
                const takeout = store.takeouts.find(takeout => {
                  return takeout.id == id
                })
                setTakeoutExist(takeout)
              }}
            />
            {openDetail && <DialogDetail handleClose={handleCloseDetail} open={openDetail} takeout={takeoutExist} />}
            {openUpdate && (
              <DialogUpdate
                handleClose={handleCloseUpdate}
                handleConfirm={handleConfirmUpdate}
                open={openUpdate}
                takeout={takeoutExist!}
              />
            )}
            {openCreate && (
              <DialogCreate handleClose={handleCloseCreate} handleConfirm={handleConfirmCreate} open={openCreate} />
            )}
            {openDelete && (
              <DialogDelete handleClose={handleCloseDelete} handleConfirm={handleConfirmDelete} open={openDelete} />
            )}
          </Card>
        </Grid>
      </Grid>
    </>
  )
}
Page.acl = {
  action: 'manage',
  subject: 'takeout-page'
}
