import CustomTextField from '@/@core/components/mui/text-field'
import { STATE, STATUS_TRANSFER, STATUS_TRANSFERDETAIL } from '@/api/enum'
import { Takeout, TransferProduct } from '@/api/types'
import DialogCustomizedInfo from '@/views/components/dialogs/DialogCustomizedInfo'
import CustomChip from '@/@core/components/mui/chip'
import { Grid, MenuItem, Typography } from '@mui/material'
import { DataGrid, GridColDef } from '@mui/x-data-grid'
import { format } from 'date-fns'
import { useState } from 'react'

interface Props {
  open: boolean
  handleClose: () => void
  takeout: Takeout | undefined
}

interface CellType {
  row: TransferProduct
}

export default function DialogDetail({ open, handleClose, takeout }: Props) {
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 })

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
      headerName: 'Tên XCD',
      renderCell: ({ row }: CellType) => (
        <Typography sx={{ color: 'text.secondary' }}>{row.product ? row.product.name : ``}</Typography>
      )
    },
    {
      flex: 0.1,
      minWidth: 140,
      field: 'category',
      headerName: 'Loại XCD',
      sortable: false,
      renderCell: ({ row }: CellType) => (
        <Typography sx={{ color: 'text.secondary' }}>{row.category ? row.category.name : ''}</Typography>
      )
    },
    {
      flex: 0.1,
      minWidth: 140,
      field: 'scan',
      headerName: 'Loại XCD',
      sortable: false,
      renderCell: ({ row }: CellType) => (
        <Typography sx={{ color: 'text.secondary' }}>{row.category ? row.category.name : ''}</Typography>
      )
    },
    {
      flex: 0.1,
      minWidth: 100,
      field: 'status',
      headerName: 'Trạng thái',
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
    }
  ]

  return (
    <DialogCustomizedInfo open={open} handleClose={handleClose} title='Thông tin chi tiết XCD' maxWidth='md'>
      <Grid container spacing={6}>
        <Grid item xs={4} height={80}>
          <CustomTextField
            fullWidth
            label='Tiêu đề'
            defaultValue={takeout?.title ? takeout.title : ''}
            id='title'
            InputProps={{ readOnly: true }}
          />
        </Grid>
        <Grid item xs={4} height={80}>
          <CustomTextField
            fullWidth
            label='Từ kho'
            defaultValue={takeout?.fromWarehouse ? takeout.fromWarehouse.name : ''}
            id='fromWarehouse'
            InputProps={{ readOnly: true }}
          />
        </Grid>
        <Grid item xs={4} height={80}>
          <CustomTextField
            label='Đến kho'
            fullWidth
            defaultValue={takeout?.toWarehouse ? takeout.toWarehouse.name : ''}
            id='toWarehouse'
            InputProps={{ readOnly: true }}
          />
        </Grid>
        <Grid item xs={4} height={80}>
          <CustomTextField
            label='Ngày vận chuyển'
            fullWidth
            defaultValue={takeout?.transferDate ? format(new Date(takeout.transferDate), 'HH:mm MM/dd/yyyy') : ''}
            id='category'
            InputProps={{ readOnly: true }}
          />
        </Grid>
        <Grid item xs={4} height={80}>
          {takeout?.delivery?.name ? (
            <CustomTextField
              label='Xe vận chuyển'
              fullWidth
              defaultValue={takeout?.delivery?.name}
              id='name'
              InputProps={{ readOnly: true }}
            />
          ) : (
            <></>
          )}
        </Grid>
        <Grid item xs={4} height={80}>
          {takeout?.delivery ? (
            <CustomTextField
              label='Biến số xe'
              fullWidth
              defaultValue={takeout?.delivery?.carNumber}
              id='name'
              InputProps={{ readOnly: true }}
            />
          ) : (
            <></>
          )}
        </Grid>
        <Grid item xs={4} height={80}>
          <CustomTextField
            select
            label='Tình trạng'
            type='text'
            fullWidth
            defaultValue={takeout?.status ? takeout.status : ''}
            InputProps={{ readOnly: true }}
          >
            <MenuItem value={STATUS_TRANSFER.FIND}>Đang tìm xe</MenuItem>
            <MenuItem value={STATUS_TRANSFER.SCANNING}>Đang quét</MenuItem>
            <MenuItem value={STATUS_TRANSFER.TRANSFER}>Đang vận chuyển</MenuItem>
            <MenuItem value={STATUS_TRANSFER.SUCCESS}>Thành công</MenuItem>
          </CustomTextField>
        </Grid>
        <Grid item xs={4} height={80}>
          <CustomTextField
            select
            label='Trạng thái'
            type='text'
            fullWidth
            defaultValue={takeout?.state ? takeout.state : ''}
          >
            <MenuItem value={STATE.ACTIVE}>Đang hoạt động</MenuItem>
            <MenuItem value={STATE.INACTIVE}>Không hoạt động</MenuItem>
          </CustomTextField>
        </Grid>
        <Grid item xs={12} style={{ height: 500, width: '100%' }}>
          {takeout?.listProduct ? (
            <div style={{ height: 500, width: '100%' }}>
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
                paginationModel={paginationModel}
                onPaginationModelChange={setPaginationModel}
                rowHeight={40}
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
                rows={takeout?.listProduct}
                columns={columns}
                disableRowSelectionOnClick
              />
            </div>
          ) : (
            <></>
          )}
        </Grid>
      </Grid>
    </DialogCustomizedInfo>
  )
}
