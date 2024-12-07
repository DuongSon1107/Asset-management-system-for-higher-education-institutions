/**
 *  Set Home URL based on User Roles
 */
const getHomeRoute = (role: string) => {
  if (role === 'WAREHOUSE') return '/manage/takeout'
  else return '/dashboard'
}

export default getHomeRoute
