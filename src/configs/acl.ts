import { ROLE } from '@/api/enum'
import { useAuth } from '@/hooks/useAuth'
import { AbilityBuilder, Ability } from '@casl/ability'

export type Subjects = string
export type Actions = 'manage' | 'create' | 'read' | 'update' | 'delete'

export type AppAbility = Ability<[Actions, Subjects]> | undefined

export const AppAbility = Ability as any
export type ACLObj = {
  action: Actions
  subject: string
}

/**
 * Please define your own Ability rules according to your app requirements.
 * We have just shown Admin and Client rules for demo purpose where
 * admin can manage everything and client can just visit ACL page
 */
const defineRulesFor = (role: string, subject: string) => {
  const { can, rules } = new AbilityBuilder(AppAbility)

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const auth = useAuth()

  if (role === 'ADMIN') {
    can('manage', 'all')
  } else if (role === 'WAREHOUSE') {
    can(['manage'], 'takeout-page')
    can(['manage'], 'product-page')
    can(['manage'], 'history-page')
    can(['manage'], 'setting-page')
  } else {
    can(['read', 'create', 'update', 'delete'], subject)
  }
  // if (role === ROLE.ADMIN) {
  //   can('manage', 'all')
  // } else {
  //   for (const permission of auth.user!.listPermission!) {
  //     can([permission.type, permission.page])
  //   }
  // }

  return rules
}

export const buildAbilityFor = (role: string, subject: string): AppAbility => {
  return new AppAbility(defineRulesFor(role, subject), {
    // https://casl.js.org/v5/en/guide/subject-type-detection
    // @ts-ignore
    detectSubjectType: object => object!.type
  })
}

export const defaultACLObj: ACLObj = {
  action: 'manage',
  subject: 'all'
}

export default defineRulesFor
