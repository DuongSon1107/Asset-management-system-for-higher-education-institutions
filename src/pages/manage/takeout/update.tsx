import CustomTextField from '@/@core/components/mui/text-field'
import { STATE, STATUS_TRANSFER, STATUS_TRANSFERDETAIL } from '@/api/enum'
import { Product, Takeout, TransferProduct } from '@/api/types'
import { AppDispatch, RootState } from '@/store'
import { getListWarehouse } from '@/store/reducers/warehouse'
import { getListMaker } from '@/store/reducers/maker'
import DialogCustomized from '@/views/components/dialogs/DialogCustomized'
import { Box, Button, Divider, FormControl, Grid, List, ListItem, MenuItem, Stack, Typography } from '@mui/material'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Controller, useForm } from 'react-hook-form'
import React from 'react'
import * as Yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { STRING } from '@/asset/string'
import CustomAutocomplete from '@/@core/components/mui/autocomplete'
import { getListDelivery } from '@/store/reducers/delivery'
import { DataGrid, GridColDef } from '@mui/x-data-grid'
import Icon from '@/@core/components/icon'
import AddProduct from './addProduct'
import DatePickerWrapper from '@/@core/styles/libs/react-datepicker'
import DatePicker from 'react-datepicker'
import { useAuth } from '@/hooks/useAuth'
import CustomChip from '@/@core/components/mui/chip'
import { v4 as uuidv4 } from 'uuid'
import OptionsMenu from '@/@core/components/option-menu'

interface Props {
  open: boolean
  handleClose: () => void
  handleConfirm: (takeout: Takeout) => void
  takeout: Takeout
}

interface CellType {
  row: TransferProduct
}

export default function DialogUpdate({ open, handleClose, handleConfirm, takeout }: Props) {
  const { user } = useAuth()
  const query = JSON.stringify({
    state: STATE.ACTIVE
  })
  const dispatch = useDispatch<AppDispatch>()

  const validationSchema = Yup.object().shape({
    title: Yup.string().required(STRING.notBlank),
    deliveryId: Yup.string(),
    fromWarehouseId: Yup.string().required(STRING.notBlank),
    toWarehouseId: Yup.string().required(STRING.notBlank),
    transferDate: Yup.string().required(STRING.notBlank),
    accountId: Yup.string().required(STRING.notBlank),

    // listProduct: Yup.array().required(STRING.notBlank),
    status: Yup.string().required(STRING.notBlank),
    state: Yup.string().required(STRING.notBlank)
  })
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 5 })

  const [openAddRfid, setOpenAddRfid] = useState<boolean>(false)

  const {
    register,
    getValues,
    handleSubmit,
    setValue,
    trigger,
    control,
    formState: { errors, isValid }
  } = useForm<Takeout>({
    mode: 'onBlur',
    defaultValues: {
      id: takeout.id,
      accountId: user?.id
    },
    resolver: yupResolver(validationSchema)
  })

  const warehouse = useSelector((state: RootState) => state.warehouse)
  const maker = useSelector((state: RootState) => state.maker)
  const delivery = useSelector((state: RootState) => state.delivery)
  const [searchFromWarehouse, setSearchFromWarehouse] = React.useState<string>('')
  const [searchToWarehouse, setSearchToWarehouse] = React.useState<string>('')
  const [searchDelivery, setSearchDelivery] = React.useState<string>('')
  const [listTransferProduct, setListTransferProduct] = React.useState<TransferProduct[]>([])
  const [listProductChange, setListProductChange] = React.useState<Product[]>([])

  useEffect(() => {
    dispatch(getListDelivery({ query: query }))
    dispatch(getListWarehouse({ query: query }))
    dispatch(getListMaker({ query: query }))
  }, [dispatch, query])

  useEffect(() => {
    setListTransferProduct(takeout.listProduct)
  }, [takeout.listProduct])

  const handleOpenAddRfid = () => {
    const listProduct: Product[] = []
    for (const transferProduct of listTransferProduct) {
      transferProduct.product ? listProduct.push(transferProduct.product) : undefined
    }
    setListProductChange(listProduct)
    setOpenAddRfid(true)
  }

  const handleCloseAddRfid = () => {
    setOpenAddRfid(false)
  }

  const handleConfirmAddRfid = (products: Product[]) => {
    // setListProductChoice(products)
    const listTransferProductNew = [...listTransferProduct]
    for (const product of products) {
      const index = listTransferProductNew.findIndex(value => value.product?.id === product.id)
      if (index === -1) {
        const transferProduct: TransferProduct = {
          id: uuidv4(),
          product: product,
          productId: product.id,
          category: product.category,
          categoryId: product.categoryId,
          description: '',
          status: STATUS_TRANSFERDETAIL.SOLVE,
          state: STATE.ACTIVE,
          option: ''
        }
        listTransferProductNew.push(transferProduct)
      }
    }
    listTransferProductNew.forEach((transferProduct, index) => {
      const indexPrd = products.findIndex(value => value.id === transferProduct.product?.id)
      if (indexPrd === -1) {
        listTransferProductNew.splice(index, 1)
      }
    })
    setListTransferProduct(listTransferProductNew)
    setOpenAddRfid(false)
  }

  const onSubmit = () => {
    trigger()
    setValue('listProduct', listTransferProduct)

    if (isValid) {
      handleConfirm(getValues() as Takeout)
    } else {
    }
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
      flex: 0.05,
      minWidth: 140,
      field: 'name',
      headerName: 'Tên XCD',

      sortable: false,
      renderCell: ({ row }: CellType) => (
        <Typography sx={{ color: 'text.secondary' }}>{row.product ? row.product.name : ''}</Typography>
      )
    },
    {
      flex: 0.15,
      minWidth: 100,
      field: 'rfid',
      headerName: 'RFID',
      sortable: false,
      renderCell: ({ row }: CellType) => (
        <>
          <List sx={{ overflowX: 'auto' }} component={Stack} direction={'row'} spacing={0}>
            {row.product?.rfid.map((rfid, index) => {
              return (
                <>
                  <ListItem key={rfid.rfid} sx={{ color: 'text.secondary' }}>
                    <Typography>{rfid.code ? rfid.code : ''}</Typography>
                  </ListItem>
                  {index !== row.product!.rfid.length - 1 ? <Divider orientation='vertical' flexItem /> : <></>}
                </>
              )
            })}
          </List>
        </>
      )
    },
    {
      flex: 0.05,
      minWidth: 100,
      field: 'category',
      headerName: 'Loại',
      sortable: false,
      renderCell: ({ row }: CellType) => (
        <Typography sx={{ color: 'text.secondary' }}>{row.category ? row.category.name : ''}</Typography>
      )
    },
    {
      flex: 0.05,
      minWidth: 100,
      field: 'status',
      headerName: 'Tình trạng',
      sortable: false,
      renderCell: ({ row }: CellType) => {
        switch (row.status) {
          case STATUS_TRANSFERDETAIL.CANCEL:
            return <CustomChip rounded size='small' skin='light' color='error' label='Huỷ bỏ' />
          case STATUS_TRANSFERDETAIL.SOLVE:
            return <CustomChip rounded size='small' skin='light' color='info' label='Đang xử lý' />
          case STATUS_TRANSFERDETAIL.SUCCESS:
            return <CustomChip rounded size='small' skin='light' color='success' label='Thành công' />
          case STATUS_TRANSFERDETAIL.TRANSPORT:
            return <CustomChip rounded size='small' skin='light' color='primary' label='Đang vận chuyển' />
        }
      }
    },

    // {
    //   flex: 0.05,
    //   minWidth: 100,
    //   field: 'status',
    //   headerName: 'Trạng thái',
    //   sortable: false,
    //   renderCell: ({ row }: CellType) => (
    //     <Typography sx={{ color: 'text.secondary' }}>{row.category ? row.category.name : ''}</Typography>
    //   )
    // },
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
                  text: 'Xoá',
                  icon: <Icon icon='ic:outline-delete' fontSize={20} />,
                  menuItemProps: {
                    onClick: () => {
                      const listTransferProductNew = [...listTransferProduct]
                      const index = listTransferProductNew.findIndex(value => value.id === row.id)
                      if (index !== -1) {
                        listTransferProductNew.splice(index, 1)
                        setListTransferProduct(listTransferProductNew)
                      }
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
    <DialogCustomized open={open} handleClose={handleClose} handleConfirm={onSubmit} title='Sửa takeout' maxWidth='lg'>
      <FormControl onSubmit={handleSubmit(onSubmit)} style={{ width: '100%' }}>
        <Grid container spacing={5}>
          <Grid item xs={3}>
            <CustomTextField
              label='Tiêu đề'
              type='text'
              {...register('title')}
              defaultValue={takeout?.title ? takeout?.title : ''}
              error={errors.title && true}
              helperText={errors.title && errors.title.message}
              fullWidth
            />
          </Grid>

          <Grid item xs={3}>
            <Controller
              control={control}
              name='fromWarehouseId'
              defaultValue={takeout?.fromWarehouse.id}
              render={({ field: { onChange, onBlur, ref } }) => (
                <CustomAutocomplete
                  onChange={(e, value) => {
                    onChange(value?.id)
                  }}
                  onBlur={onBlur}
                  ref={ref}
                  defaultValue={takeout?.fromWarehouse ? takeout?.fromWarehouse : null}
                  inputValue={searchFromWarehouse}
                  onInputChange={(event, newInputValue) => {
                    setSearchFromWarehouse(newInputValue)
                  }}
                  disabled={listTransferProduct.length === 0 ? false : true}
                  options={warehouse.warehouses.concat(maker.makers)}
                  getOptionLabel={warehouse => warehouse.name}
                  renderOption={(props, option) => <span {...props}>{option.name}</span>}
                  renderInput={params => (
                    <CustomTextField
                      {...params}
                      label='Từ kho'
                      type='text'
                      error={errors.fromWarehouseId && true}
                      helperText={errors.fromWarehouseId && errors.fromWarehouseId.message}
                      fullWidth
                    />
                  )}
                />
              )}
            />
          </Grid>
          <Grid item xs={3}>
            <Controller
              control={control}
              name='toWarehouseId'
              defaultValue={takeout?.toWarehouse.id}
              render={({ field: { onChange, onBlur, ref } }) => (
                <CustomAutocomplete
                  onChange={(e, value) => {
                    onChange(value?.id)
                  }}
                  onBlur={onBlur}
                  ref={ref}
                  defaultValue={takeout?.toWarehouse ? takeout?.toWarehouse : null}
                  inputValue={searchToWarehouse}
                  onInputChange={(event, newInputValue) => {
                    setSearchToWarehouse(newInputValue)
                  }}
                  options={warehouse.warehouses.concat(maker.makers)}
                  getOptionLabel={warehouse => warehouse.name}
                  renderOption={(props, option) => <span {...props}>{option.name}</span>}
                  renderInput={params => (
                    <CustomTextField
                      {...params}
                      label='Đến kho'
                      type='text'
                      error={errors.toWarehouseId && true}
                      helperText={errors.toWarehouseId && errors.toWarehouseId.message}
                      fullWidth
                    />
                  )}
                />
              )}
            />
          </Grid>
          <Grid item xs={3}>
            <Controller
              control={control}
              name='deliveryId'
              defaultValue={takeout?.delivery ? takeout?.delivery.id : null}
              render={({ field: { onChange, onBlur, ref } }) => (
                <CustomAutocomplete
                  onChange={(e, value) => {
                    onChange(value?.id)
                  }}
                  onBlur={onBlur}
                  ref={ref}
                  defaultValue={takeout?.delivery ? takeout?.delivery : null}
                  inputValue={searchDelivery}
                  onInputChange={(event, newInputValue) => {
                    setSearchDelivery(newInputValue)
                  }}
                  options={delivery.deliveries}
                  getOptionLabel={delivery => delivery.name}
                  renderOption={(props, option) => <span {...props}>{option.name}</span>}
                  renderInput={params => (
                    <CustomTextField
                      {...params}
                      label='Xe vận chuyển'
                      type='text'
                      error={errors.deliveryId && true}
                      helperText={errors.deliveryId && errors.deliveryId.message}
                      fullWidth
                    />
                  )}
                />
              )}
            />
          </Grid>
          <Grid item xs={3}>
            <CustomTextField
              select
              {...register('status')}
              label='Tình trạng'
              type='text'
              error={errors.status && true}
              defaultValue={takeout.status}
              helperText={errors.status && errors.status.message}
              fullWidth
            >
              <MenuItem value={STATUS_TRANSFER.FIND}>{'Đang tìm xe'}</MenuItem>
              <MenuItem value={STATUS_TRANSFER.SCANNING}>{'Đang quét'}</MenuItem>
              <MenuItem value={STATUS_TRANSFER.TRANSFER}>{'Đang vận chuyển'}</MenuItem>
              <MenuItem value={STATUS_TRANSFER.SUCCESS}>{'Thành công'}</MenuItem>
            </CustomTextField>
          </Grid>

          <Grid item xs={3}>
            <CustomTextField
              select
              {...register('state')}
              label='Trạng thái'
              type='text'
              defaultValue={takeout.state ? takeout.state : null}
              error={errors.state && true}
              helperText={errors.state && errors.state.message}
              fullWidth
            >
              <MenuItem value={STATE.ACTIVE}>Đang hoạt động</MenuItem>
              <MenuItem value={STATE.INACTIVE}>Không hoạt động</MenuItem>
            </CustomTextField>
          </Grid>
          <Grid item xs={3} display={'flex'}>
            <DatePickerWrapper>
              <Controller
                control={control}
                name='transferDate'
                defaultValue={takeout.transferDate}
                render={({ field: { onBlur, onChange, ref, value } }) => (
                  <DatePicker
                    onChange={value1 => {
                      onChange((value1 as Date).getTime())
                    }}
                    onBlur={onBlur}
                    selected={new Date(value)}
                    ref={ref}
                    customInput={
                      <CustomTextField
                        {...register('transferDate')}
                        label={'Thời gian'}
                        fullWidth
                        style={{ width: '100%' }}
                      />
                    }
                  />
                )}
              />
            </DatePickerWrapper>
          </Grid>
          <Grid item xs={12} display={'flex'} sx={{ alignItems: 'center' }}>
            <Button
              variant='contained'
              onClick={handleOpenAddRfid}
              disabled={getValues().fromWarehouseId === undefined ? true : false}
            >
              {'Thêm XCD'}
            </Button>
          </Grid>
          <Grid item xs={12}>
            <DataGrid
              autoHeight
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
              hideFooterSelectedRowCount
              disableRowSelectionOnClick
              paginationModel={paginationModel}
              onPaginationModelChange={setPaginationModel}
              rowHeight={60}
              rows={listTransferProduct}
              columns={columns}
            />
          </Grid>
        </Grid>
      </FormControl>
      {openAddRfid ? (
        <AddProduct
          open={openAddRfid}
          handleClose={handleCloseAddRfid}
          handleConfirm={handleConfirmAddRfid}
          products={listProductChange}
          fromWarehouseId={getValues().fromWarehouseId}
        />
      ) : (
        <></>
      )}
    </DialogCustomized>
  )
}
