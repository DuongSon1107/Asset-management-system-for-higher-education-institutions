import CustomTextField from '@/@core/components/mui/text-field'
import { STATE } from '@/api/enum'
import { Product } from '@/api/types'
import { AppDispatch, RootState } from '@/store'
import { getListProduct, isLoading } from '@/store/reducers/product'
import DialogCustomized from '@/views/components/dialogs/DialogCustomized'
import { Box, Divider, Grid, List, ListItem, Stack, Typography } from '@mui/material'
import { DataGrid, GridColDef, GridRowSelectionModel, GridSortModel } from '@mui/x-data-grid'
import React, { useEffect } from 'react'
import { useState } from 'react'
import { useFieldArray, useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'

interface Props {
  open: boolean
  handleClose: () => void
  handleConfirm: (Product: Product[]) => void
  products: Product[]
  fromWarehouseId: string
}

interface CellType {
  row: Product
}

interface FormType {
  listProduct: Product[]
}

export default function AddProduct({ open, handleClose, handleConfirm, products, fromWarehouseId }: Props) {
  const query = JSON.stringify([
    {
      state: STATE.ACTIVE
    },
    {
      currentWarehouseId: fromWarehouseId
    }
  ])
  console.log(fromWarehouseId)

  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 5 })
  const [searchProduct, setSearchProduct] = React.useState<string>('')
  const [rowSelectionModel, setRowSelectionModel] = React.useState<GridRowSelectionModel>([])
  const [sortModel, setSortModel] = React.useState<GridSortModel>([
    {
      field: 'createdAt',
      sort: 'desc'
    }
  ])
  const { control } = useForm<FormType>()
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'listProduct',
    keyName: '_id'
  })
  const dispatch = useDispatch<AppDispatch>()
  const product = useSelector((state: RootState) => state.product)

  useEffect(() => {
    dispatch(isLoading())
    dispatch(
      getListProduct({
        limit: paginationModel.pageSize,
        offset: paginationModel.page * paginationModel.pageSize,
        search: searchProduct,
        order: sortModel[0] ? sortModel[0].field : undefined,
        arrange: sortModel[0] ? (sortModel[0].sort as string) : undefined,
        query: query
      })
    )
  }, [dispatch, paginationModel, query, searchProduct, sortModel])

  useEffect(() => {
    append(products)
    for (const prd of products) {
      setRowSelectionModel(prevState => [...prevState, prd.id])
    }
  }, [append, products])

  const onSubmit = () => {
    handleConfirm(fields)
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
        <Typography sx={{ color: 'text.secondary' }}>{row.name ? row.name : ''}</Typography>
      )
    },
    {
      flex: 0.25,
      minWidth: 100,
      field: 'rfid',
      headerName: 'RFID',
      sortable: false,
      renderCell: ({ row }: CellType) => (
        <>
          <List sx={{ overflowX: 'auto' }} component={Stack} direction={'row'} spacing={0}>
            {row.rfid.map((rfid, index) => {
              return (
                <>
                  <ListItem key={rfid.rfid} sx={{ color: 'text.secondary' }}>
                    <Typography>{rfid.code ? rfid.code : ''}</Typography>
                  </ListItem>
                  {index !== row.rfid.length - 1 ? <Divider orientation='vertical' flexItem /> : <></>}
                </>
              )
            })}
          </List>
        </>
      )
    },
    {
      flex: 0.1,
      minWidth: 100,
      field: 'category',
      headerName: 'Loại',
      sortable: false,
      renderCell: ({ row }: CellType) => (
        <Typography sx={{ color: 'text.secondary' }}>{row.category ? row.category.name : ''}</Typography>
      )
    }
  ]

  return (
    <>
      <DialogCustomized open={open} handleClose={handleClose} handleConfirm={onSubmit} title='Thêm XCD' maxWidth='md'>
        <Grid item xs={12}>
          <Box
            sx={{
              width: '100%',
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}>
              <CustomTextField
                fullWidth
                value={searchProduct}
                sx={{ mr: 4, mb: 2 }}
                placeholder='Tìm kiếm'
                onChange={e => setSearchProduct(e.target.value)}
              />
            </Box>
            <Box></Box>
          </Box>
        </Grid>
        {/* <FormControl onSubmit={handleSubmit(onSubmit)}> */}
        <Grid item xs={12}>
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
            rowCount={Number(product.amount)}
            paginationModel={paginationModel}
            onPaginationModelChange={val => {
              const rowSelectionModelNew: GridRowSelectionModel = []
              fields.map(field => {
                rowSelectionModelNew.push(field.id)
              })
              setRowSelectionModel(rowSelectionModelNew)
              setPaginationModel(val)
            }}
            rowHeight={60}
            rows={product.products ? product.products : []}
            loading={product.loading}
            columns={columns}
            sortModel={sortModel}
            onSortModelChange={newSortModel => setSortModel(newSortModel)}
            checkboxSelection
            hideFooterSelectedRowCount
            disableRowSelectionOnClick
            onRowSelectionModelChange={newRowSelectionModel => {
              for (const prd of product.products) {
                const indexSelect = newRowSelectionModel.findIndex(id => prd.id === id)
                if (indexSelect !== -1) {
                  const productIndex = fields.findIndex(field => field.id == prd.id)
                  if (productIndex === -1) {
                    append(prd)
                  }
                } else {
                  const productIndex = fields.findIndex(field => field.id == prd.id)
                  if (productIndex !== -1) {
                    remove(productIndex)
                  }
                }
              }
              setRowSelectionModel(newRowSelectionModel)
            }}
            rowSelectionModel={rowSelectionModel}
          />
        </Grid>
        {/* </FormControl> */}
      </DialogCustomized>
    </>
  )
}
