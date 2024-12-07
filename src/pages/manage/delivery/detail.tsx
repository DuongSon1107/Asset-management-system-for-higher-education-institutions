import CustomTextField from '@/@core/components/mui/text-field'
import { STATE_MAINTAIN } from '@/api/enum'
import { Delivery, Rfid } from '@/api/types'
import DialogCustomizedInfo from '@/views/components/dialogs/DialogCustomizedInfo'
import { Box, Grid, LinearProgress, MenuItem, Typography } from '@mui/material'
import { DataGrid, GridColDef } from '@mui/x-data-grid'
import { useState } from 'react'

interface Props {
  open: boolean
  handleClose: () => void
  delivery: Delivery
}

interface CellType {
  row: Rfid
}

export default function DialogDetail({ open, handleClose, delivery }: Props) {
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
    <DialogCustomizedInfo open={open} handleClose={handleClose} title='Thông tin chi tiết Xe chở hàng' maxWidth='md'>
      <Grid container spacing={6}>
        <Grid item xs={4}>
          <CustomTextField
            fullWidth
            label='Tên'
            defaultValue={delivery?.name ? delivery?.name : ''}
            id='name'
            InputProps={{ readOnly: true }}
          />
        </Grid>
        <Grid item xs={4}>
          <CustomTextField
            label='Biển số xe'
            fullWidth
            defaultValue={delivery?.carNumber ? delivery?.carNumber : ''}
            id='carNumber'
            InputProps={{ readOnly: true }}
          />
        </Grid>

        <Grid item xs={4}>
          <CustomTextField
            fullWidth
            select
            label='Trạng thái'
            defaultValue={delivery?.state ? delivery?.state : ''}
            id='state'
            InputProps={{ readOnly: true }}
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
            rows={delivery?.rfid}
            columns={columns}
          />
        </Grid>
      </Grid>
    </DialogCustomizedInfo>
  )
}
