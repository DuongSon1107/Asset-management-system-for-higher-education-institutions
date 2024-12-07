// "use client"

// ** React Imports
import { createContext, useEffect, useState, ReactNode } from 'react'

// ** Next Import
import { useRouter } from 'next/navigation'
import { usePathname } from 'next/navigation'
import { useSearchParams } from 'next/navigation'

// ** Axios
// import axios from 'axios'

// ** Config
import authConfig from '@/configs/auth'

// ** Types
import { AuthValuesType, LoginParams, ErrCallbackType, UserDataType } from './types'
import authApi from '@/api/auth'

// ** Defaults
const defaultProvider: AuthValuesType = {
  user: null,
  loading: true,
  setUser: () => null,
  setLoading: () => Boolean,
  login: () => Promise.resolve(),
  logout: () => Promise.resolve()
}

const AuthContext = createContext(defaultProvider)

type Props = {
  children: ReactNode
}

const AuthProvider = ({ children }: Props) => {
  // ** States
  const [user, setUser] = useState<UserDataType | null>(defaultProvider.user)
  const [loading, setLoading] = useState<boolean>(defaultProvider.loading)

  // ** Hooks
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  // ** Cookies

  useEffect(() => {
    const initAuth = async (): Promise<void> => {
      const storedToken = window.localStorage.getItem(authConfig.storageTokenKeyName)!
      if (storedToken) {
        setLoading(true)
        authApi
          .auth()
          .then(async res => {
            setLoading(false)
            setUser({ ...res.data.account })
          })
          .catch(async () => {
            localStorage.removeItem('userData')
            localStorage.removeItem('accessToken')
            setUser(null)
            setLoading(false)

            if (
              // authConfig.onTokenExpiration === 'logout' &&
              !pathname.includes('login')
            ) {
              router.replace('/login')
            }
          })
      } else {
        setLoading(false)
      }
    }

    initAuth()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleLogin = (params: LoginParams, errorCallback?: ErrCallbackType) => {
    authApi
      .login(params)
      .then(async res => {
        params.rememberMe
          ? window.localStorage.setItem(authConfig.storageTokenKeyName, res.headers['authorization'])
          : null
        const returnUrl = searchParams.get('returnUrl')

        setUser({ ...res.data.account })

        params.rememberMe ? window.localStorage.setItem('userData', JSON.stringify(res.data.account)) : null

        const redirectURL = returnUrl && returnUrl !== '/' ? returnUrl : '/'

        router.replace(redirectURL as string)
      })

      .catch(err => {
        if (errorCallback) errorCallback(err)
      })
  }

  const handleLogout = () => {
    setUser(null)
    window.localStorage.removeItem('userData')
    window.localStorage.removeItem(authConfig.storageTokenKeyName)
    router.push('/login')
  }

  const values = {
    user,
    loading,
    setUser,
    setLoading,
    login: handleLogin,
    logout: handleLogout
  }

  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>
}

export { AuthContext, AuthProvider }
