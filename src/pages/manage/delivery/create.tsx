import CustomTextField from '@/@core/components/mui/text-field'
import { STATE_MAINTAIN } from '@/api/enum'
import { Delivery, Rfid } from '@/api/types'

import DialogCustomized from '@/views/components/dialogs/DialogCustomized'
import { Box, Button, FormControl, Grid, LinearProgress, MenuItem, Typography } from '@mui/material'
import { useEffect, useState } from 'react'

import { DataGrid, GridColDef, GridRowModel } from '@mui/x-data-grid'
import OptionsMenu from '@/@core/components/option-menu'
import Icon from '@/@core/components/icon'
import { v4 as uuidv4 } from 'uuid'

interface Props {
  open: boolean
  handleClose: () => void
  handleConfirm: () => Promise<boolean>
  delivery: Delivery | undefined
  setDelivery: any
}

interface CellType {
  row: Rfid
}

export default function DialogCreate({ open, handleClose, handleConfirm, delivery, setDelivery }: Props) {
  // const { user } = useAuth()

  const [submitted, setSubmitted] = useState<boolean>(false)
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 5 })

  useEffect(() => {
    console.log(delivery?.rfid)
  })
  const processRowUpdate = async (newRow: GridRowModel) => {
    const newRfid = [...delivery!.rfid]
    const index = newRfid.findIndex(rfid => (rfid as any).id === (newRow as any).id)

    newRfid[index] = newRow as Rfid
    setDelivery({ ...delivery, rfid: newRfid })

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
                      const newRfid = [...delivery!.rfid]
                      const index = newRfid.findIndex(rfid => rfid.rfid === row.rfid)
                      newRfid.splice(index, 1)
                      setDelivery({ ...delivery, rfid: newRfid })
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
      title='Thêm Xe Chở Hàng'
      maxWidth='md'
    >
      <FormControl onSubmit={handleConfirm}>
        <Grid container spacing={2} justifyContent='center'>
          <Grid item xs={4} alignItems={'center'}>
            <CustomTextField
              label='Tên'
              fullWidth
              value={delivery?.name ? delivery?.name : ''}
              error={submitted && !delivery?.name}
              helperText={submitted && !delivery?.name ? 'Trường này là bắt buộc' : ' '}
              id='name'
              onChange={e => {
                setDelivery({
                  ...delivery,
                  [e.target.id]: e.target.value
                })
              }}
            />
          </Grid>
          <Grid item xs={4}>
            <CustomTextField
              fullWidth
              label='Biển số xe'
              error={submitted && !delivery?.carNumber}
              helperText={submitted && !delivery?.carNumber ? 'Trường này là bắt buộc' : ' '}
              id='carNumber'
              onChange={e => {
                setDelivery({
                  ...delivery,
                  [e.target.id]: e.target.value
                })
              }}
            ></CustomTextField>
          </Grid>
          <Grid item xs={4}>
            <CustomTextField
              select
              fullWidth
              label='Trạng thái'
              value={delivery?.state ? delivery?.state : ''}
              error={submitted && !delivery?.state}
              helperText={submitted && !delivery?.state ? 'Trường này là bắt buộc' : ' '}
              id='state'
              onChange={e => {
                setDelivery({
                  ...delivery,
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
                  const newRfid = delivery?.rfid ? [...delivery.rfid] : []
                  const rfid: any = { code: '', rfid: '', id: uuidv4() }
                  newRfid.push(rfid)
                  setDelivery({
                    ...delivery,
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
              rows={delivery?.rfid ? delivery.rfid : []}
              columns={columns}
              processRowUpdate={processRowUpdate}
            />
          </Grid>
        </Grid>
      </FormControl>
    </DialogCustomized>
  )
}
