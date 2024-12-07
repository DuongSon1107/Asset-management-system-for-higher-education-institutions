import { Box, Card, Grid, LinearProgress, Typography } from '@mui/material'
import TableHeader from './TableHeader'
import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { AppDispatch, RootState } from '@/store'
import { useSelector } from 'react-redux'
import { getListDelivery, createDelivery, updateDelivery, deleteDelivery } from '@/store/reducers/delivery'
import { DataGrid, GridColDef, GridSortModel } from '@mui/x-data-grid'
import { Delivery } from '@/api/types'
import CustomChip from '@/@core/components/mui/chip'
import { ROLE, STATE_MAINTAIN } from '@/api/enum'
import Icon from '@/@core/components/icon'
import OptionsMenu from '@/@core/components/option-menu'
import DialogDetail from './detail'
import DialogUpdate from './update'
import DialogCreate from './create'
import React from 'react'
import DialogDelete from './delete'
import { useAuth } from '@/hooks/useAuth'

interface CellType {
  row: Delivery
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
  const store = useSelector((state: RootState) => state.delivery)
  const [deliveryExist, setDeliveryExist] = useState<Delivery>()
  const [deliveryNew, setDeliveryNew] = useState<Delivery>()

  const fetchData = () => {
    dispatch(
      getListDelivery({
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
  const handleConfirmUpdate = async () => {
    if (!deliveryExist?.name || !deliveryExist?.rfid.length || !deliveryExist?.carNumber || !deliveryExist?.state) {
      return true
    }
    await dispatch(updateDelivery({ id: deliveryExist?.id as string, delivery: deliveryExist as Delivery }))

    setOpenUpdate(false)
    await fetchData()

    return true
  }
  const handleOpenCreate = () => {
    setOpenCreate(true)
  }

  const handleCloseCreate = () => {
    setOpenCreate(false)
  }
  const handleConfirmCreate = async () => {
    if (!deliveryNew?.name || !deliveryNew?.rfid || !deliveryNew?.carNumber || !deliveryNew?.state) {
      return true
    }
    await dispatch(createDelivery(deliveryNew as Delivery))

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
    await dispatch(deleteDelivery(deliveryExist!.id))

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
      field: 'name',
      minWidth: 100,
      headerName: 'Tên',
      renderCell: ({ row }: CellType) => <Typography sx={{ color: 'text.secondary' }}>{`${row.name || 0}`}</Typography>
    },
    {
      flex: 0.1,
      minWidth: 140,
      field: 'carNumber',
      headerName: 'Biển số xe',
      sortable: false,
      renderCell: ({ row }: CellType) => (
        <Typography sx={{ color: 'text.secondary' }}>{row.carNumber ? row.carNumber : ''}</Typography>
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
                      const delivery = store.deliveries.find((delivery: Delivery) => {
                        return delivery.id == row.id
                      })
                      setDeliveryExist(delivery)
                      handleOpenUpdate()
                    }
                  }
                },
                {
                  text: 'Xoá',
                  icon: <Icon icon='ic:outline-delete' fontSize={20} />,
                  menuItemProps: {
                    onClick: () => {
                      const delivery = store.deliveries.find((delivery: Delivery) => {
                        return delivery.id == row.id
                      })
                      setDeliveryExist(delivery)
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
          <Card>
            <TableHeader value={searchValue} handleFilter={setSearchValue} handleClick={handleOpenCreate} />
            <DataGrid
              autoHeight
              paginationMode='server'
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
              pagination
              pageSizeOptions={[10, 25, 50]}
              paginationModel={paginationModel}
              onPaginationModelChange={setPaginationModel}
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
              rows={store.deliveries}
              columns={columns}
              disableRowSelectionOnClick
              onRowClick={async ({ id }) => {
                handleOpenDetail()
                const delivery = store.deliveries.find(delivery => {
                  return delivery.id == id
                })
                setDeliveryExist(delivery)
              }}
            />
            {openDetail && <DialogDetail handleClose={handleCloseDetail} open={openDetail} delivery={deliveryExist!} />}
            {openUpdate && (
              <DialogUpdate
                handleClose={handleCloseUpdate}
                handleConfirm={handleConfirmUpdate}
                open={openUpdate}
                delivery={deliveryExist!}
                setDelivery={setDeliveryExist}
              />
            )}
            {openCreate && (
              <DialogCreate
                handleClose={handleCloseCreate}
                handleConfirm={handleConfirmCreate}
                open={openCreate}
                delivery={deliveryNew}
                setDelivery={setDeliveryNew}
              />
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
  subject: 'delivery-page'
}
