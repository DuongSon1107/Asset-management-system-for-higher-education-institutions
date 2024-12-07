import { Category } from '@/api/types'
import { AppDispatch, RootState } from '@/store'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'
import {
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuList,
  Popover
} from '@mui/material'
import React, { Dispatch, SetStateAction, useCallback, useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import ArrowRightIcon from '@mui/icons-material/ArrowRight'

import { Dropdown } from './Dropdown'

interface Props {
  items: any
  deptlevel: number
}

const CategoryMenuItem = ({ items, deptlevel }: Props) => {
  const [dropdown, setDropDown] = useState(false)
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)

  const category = useSelector((store: RootState) =>
    store.category.categories.find((item: Category) => item.parentId == items.id)
  )

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget.parentElement)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }

  useEffect(() => {
    // const handler = (e: any) => {
    //   if (dropdown && ref.current && !ref.current.contains(e.target)) {
    //     setDropDown(false)
    //   }
    // }
    // document.addEventListener('mousedown', handler)
    // document.addEventListener('touchstart', handler)
    // return () => {
    //   document.addEventListener('mousedown', handler)
    //   document.addEventListener('touchstart', handler)
    // }
  }, [dropdown])

  const onMouseEnter = useCallback(() => {
    window.innerWidth > 960 && setDropDown(true)
  }, [])
  const onMouseLeave = useCallback(() => {
    window.innerWidth > 960 && setDropDown(false)
  }, [])

  return (
    <ListItem className='menu-items' value={items.id}>
      {category ? (
        <>
          <ListItemButton
            aria-haspopup='menu'
            aria-expanded={dropdown ? true : false}
            onClick={handleClick}
            onMouseEnter={handleClick}
          >
            <ListItemText> {items.name}</ListItemText>
            <ListItemIcon>
              <IconButton
                onClick={() => {
                  setDropDown(prevState => !prevState)
                }}
              >
                {dropdown ? <ArrowDropDownIcon /> : <ArrowRightIcon />}
              </IconButton>
            </ListItemIcon>
          </ListItemButton>

          {dropdown ? (
            <Dropdown
              setDropDown={setDropDown}
              submenus={items}
              dropdown={dropdown}
              deptlevel={deptlevel}
              anchorEl={anchorEl}
            />
          ) : (
            ''
          )}
        </>
      ) : (
        <ListItemButton>{items.name}</ListItemButton>
      )}
    </ListItem>
  )
}

export default CategoryMenuItem
