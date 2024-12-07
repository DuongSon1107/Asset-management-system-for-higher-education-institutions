import CustomTextField from '@/@core/components/mui/text-field'
import { STATE_MAINTAIN } from '@/api/enum'
import { Product, Rfid } from '@/api/types'
import DialogCustomizedInfo from '@/views/components/dialogs/DialogCustomizedInfo'
import { Box, Grid, LinearProgress, Typography } from '@mui/material'
import { DataGrid, GridColDef } from '@mui/x-data-grid'
import { format } from 'date-fns'
import { useState } from 'react'

interface Props {
  open: boolean
  handleClose: () => void
  product: Product
}

interface CellType {
  row: Rfid
}

export default function DialogDetail({ open, handleClose, product }: Props) {
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 5 })

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
    }
  ]

  return (
    <DialogCustomizedInfo open={open} handleClose={handleClose} title='Thông tin chi tiết XCD' maxWidth='md'>
      <Grid container spacing={6} justifyContent='center'>
        <Grid item xs={4}>
          <CustomTextField
            fullWidth
            label='Tên'
            defaultValue={product?.name ? product?.name : ''}
            id='name'
            InputProps={{ readOnly: true }}
          />
        </Grid>
        <Grid item xs={4}>
          <CustomTextField
            label='Loại'
            fullWidth
            defaultValue={product?.category ? product?.category.name : ''}
            id='category'
            InputProps={{ readOnly: true }}
          />
        </Grid>
        <Grid item xs={4}>
          <CustomTextField
            label='Kho hiện tại'
            fullWidth
            defaultValue={product?.currentWarehouse ? product?.currentWarehouse.name : ''}
            id='name'
            InputProps={{ readOnly: true }}
          />
        </Grid>
        <Grid item xs={4}>
          <CustomTextField
            label='Kho sử dụng'
            fullWidth
            defaultValue={product?.deliveryWarehouse ? product?.deliveryWarehouse.name : ''}
            id='name'
            InputProps={{ readOnly: true }}
          />
        </Grid>
        <Grid item xs={4}>
          <CustomTextField
            label='Kho lưu trữ'
            fullWidth
            defaultValue={product?.storageWarehouse ? product?.storageWarehouse.name : ''}
            id='name'
            InputProps={{ readOnly: true }}
          />
        </Grid>

        <Grid item xs={4}>
          {product?.state == STATE_MAINTAIN.ACTIVE && product.maintainNext ? (
            <CustomTextField
              label='Lần bảo trì tiếp theo'
              fullWidth
              defaultValue={format(new Date(product.maintainNext), 'dd/MM/yyyy')}
              id='maintain'
              InputProps={{ readOnly: true }}
            />
          ) : (
            <></>
          )}
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
          </Box>
          <DataGrid
            autoHeight
            slots={{
              loadingOverlay: LinearProgress
            }}
            getRowId={row => row.rfid}
            paginationModel={paginationModel}
            onPaginationModelChange={setPaginationModel}
            disableRowSelectionOnClick
            rowHeight={40}
            rows={product?.rfid}
            columns={columns}
          />
        </Grid>
      </Grid>
    </DialogCustomizedInfo>
  )
}
