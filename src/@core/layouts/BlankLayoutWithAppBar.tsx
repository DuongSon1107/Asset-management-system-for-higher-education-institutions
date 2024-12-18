// ** MUI Imports
import { styled } from '@mui/material/styles'
import Box, { BoxProps } from '@mui/material/Box'

// ** Types
import { BlankLayoutWithAppBarProps } from './types'

// ** AppBar Imports
import AppBar from '@/@core/layouts/components/blank-layout-with-appBar'

// Styled component cho Blank Layout với AppBar
const StyledBlankLayoutWithAppBarWrapper = styled(Box)<BoxProps>(({ theme }) => ({
  height: '100vh',

  // Layout cho các trang Blank Layout V1
  '& .content-center': {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing(5),
    minHeight: `calc(100vh - ${theme.spacing((theme.mixins.toolbar.minHeight as number) / 4)})`
  },

  // Layout cho các trang Blank Layout V2
  '& .content-right': {
    display: 'flex',
    overflowX: 'hidden',
    position: 'relative',
    minHeight: `calc(100vh - ${theme.spacing((theme.mixins.toolbar.minHeight as number) / 4)})`
  }
}))

const BlankLayoutWithAppBar = ({ children }: BlankLayoutWithAppBarProps) => {
  return (
    <StyledBlankLayoutWithAppBarWrapper>
      <AppBar />
      <Box
        className='app-content'
        sx={{
          overflowX: 'hidden',
          position: 'relative',
          minHeight: theme => `calc(100vh - ${theme.spacing((theme.mixins.toolbar.minHeight as number) / 4)})`
        }}
      >
        {children}
      </Box>
    </StyledBlankLayoutWithAppBarWrapper>
  )
}

export default BlankLayoutWithAppBar
