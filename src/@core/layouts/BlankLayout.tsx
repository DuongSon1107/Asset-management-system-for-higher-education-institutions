// ** MUI Imports
import { styled } from '@mui/material/styles'
import Box, { BoxProps } from '@mui/material/Box'

// ** Types
import { BlankLayoutProps } from './types'

// Styled component cho Blank Layout
const StyledWrapper = styled(Box)<BoxProps>(({ theme }) => ({
  height: '100vh',

  // Layout cho các trang Blank Layout V1
  '& .content-center': {
    display: 'flex',
    minHeight: '100vh',
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing(5)
  },

  // Layout cho các trang Blank Layout V2
  '& .content-right': {
    display: 'flex',
    minHeight: '100vh',
    overflowX: 'hidden',
    position: 'relative'
  }
}))

const BlankLayout = ({ children }: BlankLayoutProps) => (
  <StyledWrapper className="layout-wrapper">
    <Box className="app-content" sx={{ overflow: 'hidden', minHeight: '100vh', position: 'relative' }}>
      {children}
    </Box>
  </StyledWrapper>
)

export default BlankLayout
