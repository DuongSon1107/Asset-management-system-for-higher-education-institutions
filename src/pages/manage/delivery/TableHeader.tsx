// ** Next Import

// ** MUI Imports
import Box from '@mui/material/Box'

// ** Custom Component Import
import CustomTextField from '@/@core/components/mui/text-field'
import { Button, Typography } from '@mui/material'

interface TableHeaderProps {
  value: string
  handleFilter: (val: string) => void
  handleClick: () => void
}

const TableHeader = (props: TableHeaderProps) => {
  // ** Props
  const { value, handleFilter, handleClick } = props

  return (
    <>
      <Box
        sx={{
          p: 5,
          pb: 3,
          width: '100%',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}
      >
        <Typography variant='h4'>{'Danh sách Xe chở hàng đang hoạt động'}</Typography>
      </Box>
      <Box
        sx={{
          p: 5,
          pb: 3,
          width: '100%',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}
      >
        <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}>
          <CustomTextField
            value={value}
            sx={{ mr: 4, mb: 2 }}
            placeholder='Tìm kiếm'
            onChange={e => handleFilter(e.target.value)}
          />
        </Box>
        <Box>
          <Button sx={{ mb: 2 }} variant='contained' color='primary' onClick={handleClick}>
            {'Thêm Xe chở hàng'}
          </Button>
        </Box>
      </Box>
    </>
  )
}

export default TableHeader
