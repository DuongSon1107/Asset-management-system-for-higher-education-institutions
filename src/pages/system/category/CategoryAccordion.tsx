import { ListItemButton, ListItemIcon, ListItemText, Collapse, List, IconButton } from '@mui/material'
import React, { Dispatch, SetStateAction } from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '@/store'
import { Category } from '@/api/types'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'
import ArrowRightIcon from '@mui/icons-material/ArrowRight'

interface Props {
  parentId: string
  categoryId: string
  setCategoryId: Dispatch<SetStateAction<string>>
  deptlevel: number
  currentCategory?: Category
}
export const CategoryAccordion = ({ parentId, categoryId, setCategoryId, deptlevel, currentCategory }: Props) => {
  deptlevel = deptlevel + 1
  const [expandedIndex, setExpandedIndex] = React.useState<string[]>([])
  const category = useSelector((store: RootState) => store.category.categories)
  const expandIcon = useSelector((store: RootState) => store.category.categories)

  return (
    <List key={deptlevel}>
      {category
        .filter((items: Category) => items.parentId == parentId && items.id != currentCategory?.id)
        .map((category: Category) => (
          <>
            <ListItemButton
              sx={{
                pt: 2,
                height: '50px',

                borderTopRightRadius: '20px',
                borderBottomRightRadius: '20px'
              }}
              selected={categoryId == category.id}
              onClick={() => {
                setCategoryId(category.id)
              }}
            >
              {expandIcon.find((item: Category) => item.parentId == category.id) ? (
                <>
                  <ListItemIcon>
                    <IconButton
                      sx={{ ml: 4 * deptlevel }}
                      onClick={e => {
                        e.stopPropagation(),
                          setExpandedIndex(prevState => {
                            if (prevState.includes(category.id)) {
                              const newArray = expandedIndex.filter(item => item !== category.id)

                              return [...newArray]
                            } else {
                              return [...prevState, category.id]
                            }
                          })
                      }}
                    >
                      {expandedIndex.find((item: string) => item == category.id) ? (
                        <ArrowDropDownIcon />
                      ) : (
                        <ArrowRightIcon />
                      )}
                    </IconButton>
                  </ListItemIcon>
                  <ListItemText primary={category.name} />
                </>
              ) : (
                <>
                  <ListItemIcon sx={{ ml: 4 * deptlevel }}>
                    <IconButton disabled></IconButton>
                  </ListItemIcon>
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  <ListItemText primary={category.name} />
                </>
              )}
            </ListItemButton>
            <Collapse in={expandedIndex.find((item: string) => item == category.id) ? true : false}>
              <CategoryAccordion
                parentId={category.id}
                categoryId={categoryId}
                setCategoryId={setCategoryId}
                deptlevel={deptlevel}
                currentCategory={currentCategory}
              />
            </Collapse>
          </>
        ))}
    </List>
  )
}
