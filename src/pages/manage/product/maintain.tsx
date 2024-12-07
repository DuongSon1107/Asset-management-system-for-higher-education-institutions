import Icon from '@/@core/components/icon'
import CustomTextField from '@/@core/components/mui/text-field'
import OptionsMenu from '@/@core/components/option-menu'
import { STATE_MAINTAIN, STATE_MAINTENANCE } from '@/api/enum'
import CustomChip from '@/@core/components/mui/chip'

import { Product, maintainProductParams } from '@/api/types'
import { AppDispatch } from '@/store'
import {
  deleteMaintainProduct,
  historyMaintainProduct,
  maintainProduct,
  updateMaintainProduct
} from '@/store/reducers/product'
import { Box, Button, Grid, LinearProgress, Typography } from '@mui/material'
import { DataGrid, GridColDef, GridRowModel } from '@mui/x-data-grid'
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { format } from 'date-fns'
import dayjs, { Dayjs } from 'dayjs'
import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import DialogCustomized from '@/views/components/dialogs/DialogCustomized'

interface Props {
  open: boolean
  handleClose: () => void
  handleConfirm: () => void
  product: Product
  setProduct: any
}
interface maintainProps {
  startDate: Dayjs
  finishDate: Dayjs | null
  description: string
}
interface CellType {
  row: maintainProductParams
}

export default function DialogMaintain({ open, handleClose, handleConfirm, product, setProduct }: Props) {
  const dispatch = useDispatch<AppDispatch>()
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 5 })
  const [historyDelete, setHistoryDelete] = useState<maintainProductParams>()
  const [openDelete, setOpenDelete] = useState<boolean>(false)

  const [history, setHistory] = useState<maintainProductParams[]>([])
  const [historyChange, setHistoryChange] = useState<maintainProductParams[]>([])
  const [maintain, setMaintain] = useState<maintainProps>({
    startDate: dayjs(new Date()),
    finishDate: null,
    description: ''
  })

  const handleCloseDelete = () => {
    setOpenDelete(false)
  }
  const handleOpenDelete = () => {
    setOpenDelete(true)
  }

  const handleConfirmDelete = async () => {
    await dispatch(deleteMaintainProduct(historyDelete!.id!))

    await fetchData()
    setOpenDelete(false)
  }

  const fetchData = () => {
    dispatch(historyMaintainProduct(product.id))
      .then(res => {
        setHistory(res.payload.history)
      })
      .catch(e => console.log(e))
  }

  useEffect(() => {
    fetchData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, product.id])

  const processRowUpdate = async (newRow: GridRowModel) => {
    const newHistoryChange = [...historyChange]
    const historyIndex = newHistoryChange.findIndex(his => his.id == (newRow as maintainProductParams).id)
    if (historyIndex == -1) {
      setHistoryChange([...historyChange, newRow as maintainProductParams])
    } else {
      newHistoryChange[historyIndex] = newRow as maintainProductParams
      setHistoryChange(newHistoryChange)
    }
    const updatedRow = { ...newRow, isNew: false }

    return updatedRow
  }

  const handleSaveChange = async () => {
    await dispatch(updateMaintainProduct(historyChange))
    setHistoryChange([])
    await fetchData()
    await handleConfirm()

    // await handleClose()
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
      field: 'startDate',
      headerName: 'Ngày bắt đầu',
      type: 'date',
      editable: true,
      valueGetter(params) {
        dayjs(params.value).toDate()
      },
      sortable: false,
      renderCell: ({ row }: CellType) => (
        <Typography sx={{ color: 'text.secondary' }}>
          {row.startDate ? format(row.startDate, 'dd-MM-yyyy') : ''}
        </Typography>
      )
    },
    {
      flex: 0.1,
      minWidth: 100,
      field: 'finishDate',
      headerName: 'Ngày kết thúc',
      type: 'date',
      editable: true,
      valueGetter(params) {
        dayjs(params.value).toDate()
      },
      sortable: false,
      renderCell: ({ row }: CellType) => (
        <Typography sx={{ color: 'text.secondary' }}>
          {row.finishDate ? format(row.finishDate, 'dd-MM-yyyy') : ''}
        </Typography>
      )
    },
    {
      flex: 0.2,
      minWidth: 100,
      field: 'description',
      headerName: 'Ghi chú',
      type: 'string',
      editable: true,
      sortable: false,
      renderCell: ({ row }: CellType) => (
        <Typography sx={{ color: 'text.secondary' }}>{row.description ? row.description : ''}</Typography>
      )
    },
    {
      flex: 0.1,
      minWidth: 100,
      field: 'state',
      editable: true,
      headerName: 'Trạng thái',
      type: 'singleSelect',
      valueOptions: [
        { value: STATE_MAINTENANCE.COMPLETED, label: 'Hoàn thành', color: 'red' },
        { value: STATE_MAINTENANCE.DOING, label: 'Đang bảo trì' }
      ],
      sortable: false,
      renderCell: ({ row }: CellType) => {
        switch (row.state) {
          case STATE_MAINTENANCE.COMPLETED:
            return <CustomChip rounded size='small' skin='light' color='success' label='Hoàn thành' />
          case STATE_MAINTENANCE.DOING:
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
                  text: 'Xoá',
                  icon: <Icon icon='ic:outline-delete' fontSize={20} />,
                  menuItemProps: {
                    onClick: () => {
                      handleOpenDelete()
                      setHistoryDelete(row)
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
      handleConfirm={handleSaveChange}
      title={'Bảo trì ' + product.name}
      maxWidth='md'
    >
      <Grid container spacing={4} justifyContent='center'>
        <Grid item xs={6}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              sx={{ width: '100%' }}
              label='Ngày bắt đầu'
              format='DD/MM/YYYY'
              value={dayjs(maintain.startDate)}
              onChange={newValue => {
                setMaintain({ ...maintain, startDate: newValue! })
              }}
              slotProps={{
                textField: {
                  name: 'startDate',
                  id: 'startDate'
                }
              }}
            />
          </LocalizationProvider>
        </Grid>
        <Grid item xs={6}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              sx={{ width: '100%' }}
              label='Ngày kết thúc'
              format='DD/MM/YYYY'
              value={dayjs(maintain.finishDate)}
              onChange={newValue => {
                setMaintain({ ...maintain, finishDate: newValue! })
              }}
              slotProps={{
                textField: {
                  name: 'finishDate',
                  id: 'finishDate',
                  error:
                    maintain.finishDate == null ? false : maintain?.startDate.unix() > maintain?.finishDate?.unix(),
                  helperText:
                    maintain.finishDate == null
                      ? false
                      : maintain?.startDate.unix() > maintain?.finishDate?.unix()
                      ? 'Ngày kết thúc không được trước ngày bắt đầu'
                      : ''
                }
              }}
            />
          </LocalizationProvider>
        </Grid>
        <Grid item xs={12}>
          <CustomTextField
            label='Ghi chú'
            fullWidth
            multiline
            rows={4}
            value={maintain?.description ? maintain?.description : ''}
            id='description'
            onChange={e => {
              setMaintain({
                ...maintain,
                description: e.target.value
              })
            }}
          />
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
            <Typography variant='h5'>{'Lịch sử bảo trì'}</Typography>
            {product.state === STATE_MAINTAIN.ACTIVE || product.state === STATE_MAINTAIN.MAINTAIN ? (
              <Button
                variant='contained'
                onClick={async () => {
                  try {
                    const res = await dispatch(
                      maintainProduct({
                        id: product?.id,
                        description: maintain.description,
                        startDate: maintain.startDate.unix() * 1000,
                        finishDate: maintain.finishDate ? maintain.finishDate.unix() * 1000 : null
                      })
                    )

                    if (res.meta.requestStatus == 'fulfilled') {
                      await handleConfirm()
                      await fetchData()
                    }
                  } catch (error) {}
                }}
              >
                {'Bảo trì'}
              </Button>
            ) : (
              <></>
            )}
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
            paginationModel={paginationModel}
            onPaginationModelChange={setPaginationModel}
            rowHeight={40}
            editMode='row'
            rows={history}
            columns={columns}
            disableRowSelectionOnClick
            processRowUpdate={processRowUpdate}
          />
        </Grid>
      </Grid>
      <DialogCustomized
        open={openDelete}
        handleClose={handleCloseDelete}
        handleConfirm={handleConfirmDelete}
        title=''
        maxWidth='xs'
      >
        <Typography>Bạn có chắc chắn muốn xoá bản ghi này này</Typography>
      </DialogCustomized>
    </DialogCustomized>
  )
}
