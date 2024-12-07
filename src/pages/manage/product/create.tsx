import CustomTextField from '@/@core/components/mui/text-field'
import { STATE, STATE_MAINTAIN } from '@/api/enum'
import { Product, Rfid } from '@/api/types'
import { AppDispatch, RootState } from '@/store'
import { getListCategory } from '@/store/reducers/category'
import { getListWarehouse } from '@/store/reducers/warehouse'
import { getListMaker } from '@/store/reducers/maker'
import DialogCustomized from '@/views/components/dialogs/DialogCustomized'
import { Box, Button, FormControl, Grid, LinearProgress, MenuItem, Typography } from '@mui/material'
import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useSelector } from 'react-redux'
import { DataGrid, GridColDef, GridRowModel } from '@mui/x-data-grid'
import OptionsMenu from '@/@core/components/option-menu'
import Icon from '@/@core/components/icon'
import { v4 as uuidv4 } from 'uuid'

interface Props {
  open: boolean
  handleClose: () => void
  handleConfirm: () => Promise<boolean>
  product: Product | undefined
  setProduct: any
}

interface CellType {
  row: Rfid
}

export default function DialogCreate({ open, handleClose, handleConfirm, product, setProduct }: Props) {
  // const { user } = useAuth()
  const query = JSON.stringify({
    state: STATE.ACTIVE
  })
  const dispatch = useDispatch<AppDispatch>()
  const category = useSelector((state: RootState) => state.category)
  const warehouse = useSelector((state: RootState) => state.warehouse)
  const maker = useSelector((state: RootState) => state.maker)
  const [submitted, setSubmitted] = useState<boolean>(false)
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 5 })

  useEffect(() => {
    dispatch(getListCategory({}))
    dispatch(getListWarehouse({ query: query }))
    dispatch(getListMaker({ query: query }))
  }, [dispatch, query])

  useEffect(() => {
    console.log(product?.rfid)
  })
  const processRowUpdate = async (newRow: GridRowModel) => {
    const newRfid = [...product!.rfid]
    const index = newRfid.findIndex(rfid => (rfid as any).id === (newRow as any).id)

    newRfid[index] = newRow as Rfid
    setProduct({ ...product, rfid: newRfid })

    const updatedRow = { ...newRow }

    return updatedRow
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
      minWidth: 140,
      field: 'code',
      headerName: 'Mã code',
      type: 'string',
      editable: true,
      sortable: false,
      renderCell: ({ row }: CellType) => (
        <Typography sx={{ color: 'text.secondary' }}>{row.code ? row.code : ''}</Typography>
      )
    },
    {
      flex: 0.2,
      minWidth: 100,
      field: 'rfid',
      headerName: 'RFID',
      type: 'string',
      editable: true,
      sortable: false,
      renderCell: ({ row }: CellType) => (
        <Typography sx={{ color: 'text.secondary' }}>{row.rfid ? row.rfid : ''}</Typography>
      )
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
                // {
                //   text: 'Chỉnh sửa',
                //   icon: <Icon icon='tabler:edit' fontSize={20} />,
                //   menuItemProps: {
                //     // onClick: () => {}
                //   }
                // },
                {
                  text: 'Xoá',
                  icon: <Icon icon='ic:outline-delete' fontSize={20} />,
                  menuItemProps: {
                    onClick: () => {
                      const newRfid = [...product!.rfid]
                      const index = newRfid.findIndex(rfid => rfid.rfid === row.rfid)
                      newRfid.splice(index, 1)
                      setProduct({ ...product, rfid: newRfid })
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
    <DialogCustomized
      open={open}
      handleClose={handleClose}
      handleConfirm={async () => {
        setSubmitted(await handleConfirm())
      }}
      title='Thêm XCD'
      maxWidth='md'
    >
      <FormControl onSubmit={handleConfirm}>
        <Grid container spacing={2} justifyContent='center'>
          <Grid item xs={4} alignItems={'center'}>
            <CustomTextField
              label='Tên'
              fullWidth
              value={product?.name ? product?.name : ''}
              error={submitted && !product?.name}
              helperText={submitted && !product?.name ? 'Trường này là bắt buộc' : ' '}
              id='name'
              onChange={e => {
                setProduct({
                  ...product,
                  [e.target.id]: e.target.value
                })
              }}
            />
          </Grid>

          <Grid item xs={4}>
            <CustomTextField
              select
              fullWidth
              label='Loại'
              id='category'
              value={product?.category ? product?.category.name : ''}
              error={submitted && !product?.category}
              helperText={submitted && !product?.category ? 'Trường này là bắt buộc' : ' '}
              onChange={e => {
                const categoryName = e.target.value
                const newCategory = category.categories.find(category => category.name == categoryName)
                setProduct({
                  ...product,
                  category: newCategory,
                  categoryId: newCategory?.id
                })
              }}
            >
              {category.categories.map(category => {
                return (
                  <MenuItem key={category.id} value={category.name}>
                    {category.name}
                  </MenuItem>
                )
              })}
            </CustomTextField>
          </Grid>
          <Grid item xs={4}>
            <CustomTextField
              select
              fullWidth
              label='Kho hiện tại'
              value={product?.currentWarehouse ? product?.currentWarehouse.id : ''}
              error={submitted && !product?.currentWarehouse}
              helperText={submitted && !product?.currentWarehouse ? 'Trường này là bắt buộc' : ' '}
              id='currentWarehouse'
              onChange={e => {
                const idFound = e.target.value
                const newWarehouse = warehouse.warehouses.find(warehouse => warehouse.id == idFound)

                if (newWarehouse) {
                  setProduct({
                    ...product,
                    currentWarehouse: newWarehouse,
                    currentWarehouseId: newWarehouse?.id
                  })

                  return
                }
                const newMaker = maker.makers.find(maker => maker.id == idFound)

                if (newMaker) {
                  setProduct({
                    ...product,
                    currentWarehouse: newMaker,
                    currentWarehouseId: newMaker?.id
                  })

                  return
                }
              }}
            >
              {warehouse.warehouses.map(warehouse => {
                return (
                  <MenuItem key={warehouse.id} value={warehouse.id}>
                    {warehouse.name}
                  </MenuItem>
                )
              })}
              {maker.makers.map(maker => {
                return (
                  <MenuItem key={maker.id} value={maker.id}>
                    {maker.name}
                  </MenuItem>
                )
              })}
            </CustomTextField>
          </Grid>
          <Grid item xs={4}>
            <CustomTextField
              select
              fullWidth
              label='Kho sử dụng'
              value={product?.deliveryWarehouse ? product?.deliveryWarehouse.id : ''}
              error={submitted && !product?.deliveryWarehouse}
              helperText={submitted && !product?.deliveryWarehouse ? 'Trường này là bắt buộc' : ' '}
              id='deliveryWarehouse'
              onChange={e => {
                const idFound = e.target.value
                const newMaker = maker.makers.find(maker => maker.id == idFound)

                setProduct({
                  ...product,
                  deliveryWarehouse: newMaker,
                  deliveryWarehouseId: newMaker?.id
                })
              }}
            >
              {maker.makers.map(maker => {
                return (
                  <MenuItem key={maker.id} value={maker.id}>
                    {maker.name}
                  </MenuItem>
                )
              })}
            </CustomTextField>
          </Grid>
          <Grid item xs={4}>
            <CustomTextField
              select
              fullWidth
              label='Kho lưu trữ'
              value={product?.storageWarehouse ? product?.storageWarehouse.id : ''}
              error={submitted && !product?.storageWarehouse}
              helperText={submitted && !product?.storageWarehouse ? 'Trường này là bắt buộc' : ' '}
              id='storageWarehouse'
              onChange={e => {
                const idFound = e.target.value
                const newWarehouse = warehouse.warehouses.find(warehouse => warehouse.id == idFound)
                setProduct({
                  ...product,
                  storageWarehouse: newWarehouse,
                  storageWarehouseId: newWarehouse?.id
                })
              }}
            >
              {warehouse.warehouses.map(warehouse => {
                return (
                  <MenuItem key={warehouse.id} value={warehouse.id}>
                    {warehouse.name}
                  </MenuItem>
                )
              })}
            </CustomTextField>
          </Grid>

          <Grid item xs={4}>
            <CustomTextField
              select
              fullWidth
              label='Trạng thái'
              value={product?.state ? product?.state : ''}
              error={submitted && !product?.state}
              helperText={submitted && !product?.state ? 'Trường này là bắt buộc' : ' '}
              id='state'
              onChange={e => {
                setProduct({
                  ...product,
                  state: e.target.value
                })
              }}
            >
              <MenuItem value={STATE_MAINTAIN.ACTIVE}>Đang hoạt động</MenuItem>
              <MenuItem value={STATE_MAINTAIN.INACTIVE}>Không hoạt động</MenuItem>
            </CustomTextField>
          </Grid>
          <Grid item xs={12}>
            <Box
              sx={{
                p: 1,
                pb: 3,
                width: '100%',
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
            >
              <Typography variant='h5'>{'RFID'}</Typography>
              <Button
                variant='contained'
                onClick={() => {
                  const newRfid = product?.rfid ? [...product.rfid] : []
                  const rfid: any = { code: '', rfid: '', id: uuidv4() }
                  newRfid.push(rfid)
                  setProduct({
                    ...product,
                    rfid: newRfid
                  })
                }}
              >
                {'Thêm RFID'}
              </Button>
            </Box>
            <DataGrid
              autoHeight
              slots={{
                loadingOverlay: LinearProgress
              }}
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
              editMode='row'
              paginationModel={paginationModel}
              onPaginationModelChange={setPaginationModel}
              disableRowSelectionOnClick
              rowHeight={40}
              rows={product?.rfid ? product.rfid : []}
              columns={columns}
              processRowUpdate={processRowUpdate}
            />
          </Grid>
        </Grid>
      </FormControl>
    </DialogCustomized>
  )
}
