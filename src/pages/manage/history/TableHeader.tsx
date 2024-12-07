// ** Next Import
// import Link from 'next/link'

// ** MUI Imports
// import Box from '@mui/material/Box'
import { Box, Typography } from '@mui/material'

// import Button from '@mui/material/Button'
// import { GridRowId } from '@mui/x-data-grid'
// import MenuItem from '@mui/material/MenuItem'

// ** Custom Component Import
import CustomTextField from '@/@core/components/mui/text-field'

interface TableHeaderProps {
  value: string
  handleFilter: (val: string) => void
}

const TableHeader = (props: TableHeaderProps) => {
  // ** Props
  const { value, handleFilter } = props

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
        <Box>
          <Typography variant='h4'>{'Lịch sử các chuyến xe'}</Typography>
        </Box>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}>
          <CustomTextField
            value={value}
            sx={{ mr: 4, mb: 2 }}
            placeholder='Search Invoice'
            onChange={e => handleFilter(e.target.value)}
          />
        </Box>
      </Box>
    </>
  )
}

export default TableHeader
