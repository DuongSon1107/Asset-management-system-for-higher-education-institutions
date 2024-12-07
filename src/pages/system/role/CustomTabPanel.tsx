import { Permission, Role } from '@/api/types'
import { AppDispatch, RootState } from '@/store'
import { getListPermission } from '@/store/reducers/permission'
import { updateRole } from '@/store/reducers/role'
import { Button, Card, List, ListItemButton, ListItemIcon, ListItemText, Switch } from '@mui/material'
import React, { useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

interface Props {
  tab: number
  value: number
  role: Role
}
export const CustomTabPanel = ({ tab, value, role }: Props) => {
  const dispatch = useDispatch<AppDispatch>()
  const permission = useSelector((store: RootState) => store.permission.permission)
  const [roleP, setRoleP] = useState<Role>(role)

  const handleSwitch = useCallback(
    (clickedPermission: Permission) => {
      // const updatedPermissions = [...roleP.listPermission]
      // const permissionIndex = updatedPermissions.findIndex(p => p.id === clickedPermission.id)
      // if (permissionIndex === -1) {
      //   // Permission not found, add it
      //   updatedPermissions.push(clickedPermission)
      // } else {
      //   // Permission found, remove it
      //   updatedPermissions.splice(permissionIndex, 1)
      // }

      // setRoleP({
      //   ...roleP,
      //   listPermission: updatedPermissions
      // })

      // dispatch(updateRole({ id: roleP.id, role: roleP }))

      setRoleP(prevRoleP => {
        const updatedPermissions = [...prevRoleP.listPermission]
        const permissionIndex = updatedPermissions.findIndex(p => p.id === clickedPermission.id)

        if (permissionIndex === -1) {
          // Permission not found, add it
          updatedPermissions.push(clickedPermission)
        } else {
          // Permission found, remove it
          updatedPermissions.splice(permissionIndex, 1)
        }

        const updatedRoleP = {
          ...prevRoleP,
          listPermission: updatedPermissions
        }

        // Dispatch the action with the updated state
        dispatch(updateRole({ id: updatedRoleP.id, role: updatedRoleP }))

        return updatedRoleP // Return the updated state
      })
    },
    [dispatch]
  )

  return (
    <Card hidden={value !== tab} variant='outlined'>
      {/* <Button onClick={() => console.log(roleP)}>â</Button> */}
      <List>
        {permission.map((permission: Permission, index: number) => (
          <ListItemButton key={index}>
            <ListItemText>{permission.name}</ListItemText>
            <ListItemIcon>
              <Switch
                checked={roleP.listPermission.find((item: Permission) => item.id == permission.id) ? true : false}
                onChange={() => handleSwitch(permission)}
              />
            </ListItemIcon>
          </ListItemButton>
        ))}
      </List>
    </Card>
  )
}
