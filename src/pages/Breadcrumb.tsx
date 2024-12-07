import { Breadcrumbs, Link } from '@mui/material'
import React from 'react'
import HomeIcon from '@mui/icons-material/Home'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'

interface Props {
  path: string
  subPath: string
}
const Breadcrumb = ({ path, subPath }: Props) => {
  return (
    <Breadcrumbs aria-label='breadcrumb' separator={<ArrowForwardIosIcon fontSize='inherit' />} sx={{ mb: 5, ml: 5 }}>
      <Link underline='hover' sx={{ display: 'flex', alignItems: 'center' }} color='inherit' href='/'>
        <HomeIcon sx={{ mr: 0.5 }} fontSize='medium' />
      </Link>
      <Link underline='hover' sx={{ display: 'flex', alignItems: 'center' }} color='inherit'>
        {path}
      </Link>
      <Link underline='hover' sx={{ display: 'flex', alignItems: 'center' }} color='inherit'>
        {subPath}
      </Link>
    </Breadcrumbs>
  )
}

export default Breadcrumb
