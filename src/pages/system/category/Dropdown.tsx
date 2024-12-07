import { Category } from '@/api/types'
import { List, Menu } from '@mui/material'
import React, { Dispatch, SetStateAction } from 'react'
import CategoryMenuItem from './CategoryMenuItem'
import { useSelector } from 'react-redux'
import { RootState } from '@/store'

interface Props {
  submenus: any
  dropdown: boolean
  setDropDown: Dispatch<SetStateAction<boolean>>
  deptlevel: number
  anchorEl: null | HTMLElement
}
export const Dropdown = ({ submenus, dropdown, deptlevel, anchorEl, setDropDown }: Props) => {
  deptlevel = deptlevel + 1

  const category = useSelector((store: RootState) =>
    store.category.categories.filter((item: Category) => item.parentId == submenus.id)
  )

  return (
    <Menu
      sx={{ p: 0 }}
      open={dropdown}
      onClose={() => setDropDown(false)}
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: 'top',
        horizontal: deptlevel < 3 ? 'right' : 'left'
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: deptlevel < 3 ? 'left' : 'right'
      }}
    >
      <List>
        {category.map((submenu: Category, index: number) => (
          <CategoryMenuItem items={submenu} key={index} deptlevel={deptlevel} />
        ))}
      </List>
    </Menu>
  )
}
