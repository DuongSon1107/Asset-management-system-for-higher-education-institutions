// ** React Imports
import { useState, ReactNode, MouseEvent } from 'react'

// ** Next Imports
import Head from 'next/head'
import Link from 'next/link'
import Pic2 from '../../asset/image/logo2.png'
import Pic1 from '../../asset/image/logo1.png'

// ** MUI Components
import Alert from '@mui/material/Alert'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import Checkbox from '@mui/material/Checkbox'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import Box, { BoxProps } from '@mui/material/Box'
import useMediaQuery from '@mui/material/useMediaQuery'
import { styled, useTheme } from '@mui/material/styles'
import InputAdornment from '@mui/material/InputAdornment'
import MuiFormControlLabel, { FormControlLabelProps } from '@mui/material/FormControlLabel'

// ** Custom Component Import
import CustomTextField from '@/@core/components/mui/text-field'

// ** Icon Imports
import Icon from '@/@core/components/icon'

// ** Third Party Imports
import * as yup from 'yup'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'

// ** Hooks
import { useAuth } from '@/hooks/useAuth'
import useBgColor from '@/@core/hooks/useBgColor'
import { useSettings } from '@/@core/hooks/useSettings'

// ** Configs
import themeConfig from '@/configs/themeConfig'

// ** Layout Import
import BlankLayout from '@/@core/layouts/BlankLayout'

// ** Demo Imports
import FooterIllustrationsV2 from '@/views/pages/auth/FooterIllustrationsV2'
import { LoginParams } from '@/context/types'
import { LOGO_HONDA } from '@/asset/image'
import Image from 'next/image'
import { encrypt } from '@/@core/layouts/components/shared-components/footer/EncryptHandler'

// ** Styled Components
const LoginIllustration = styled('img')(({ theme }) => ({
  zIndex: 2,
  maxHeight: 680,
  marginTop: theme.spacing(12),
  marginBottom: theme.spacing(12),
  [theme.breakpoints.down(1540)]: {
    maxHeight: 550
  },
  [theme.breakpoints.down('lg')]: {
    maxHeight: 500
  }
}))

const RightWrapper = styled(Box)<BoxProps>(({ theme }) => ({
  width: '100%',
  [theme.breakpoints.up('md')]: {
    maxWidth: 450
  },
  [theme.breakpoints.up('lg')]: {
    maxWidth: 600
  },
  [theme.breakpoints.up('xl')]: {
    maxWidth: 750
  }
}))

const LinkStyled = styled(Link)(({ theme }) => ({
  textDecoration: 'none',
  color: `${theme.palette.primary.main} !important`
}))

const FormControlLabel = styled(MuiFormControlLabel)<FormControlLabelProps>(({ theme }) => ({
  '& .MuiFormControlLabel-label': {
    color: theme.palette.text.secondary
  }
}))

const schema = yup.object().shape({
  identifier: yup.string().required(),
  password: yup.string().min(5).required()
})

const defaultValues = {
  password: '11111',
  identifier: 'abc@gmail.com'
}

interface FormData {
  identifier: string
  password: string
}

const LoginPage = () => {
  const [rememberMe, setRememberMe] = useState<boolean>(true)
  const [showPassword, setShowPassword] = useState<boolean>(false)

  // ** Hooks
  const auth = useAuth()
  const theme = useTheme()
  const bgColors = useBgColor()
  const { settings } = useSettings()
  const hidden = useMediaQuery(theme.breakpoints.down('md'))

  // ** Vars
  const { skin } = settings

  const {
    control,
    setError,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues,
    mode: 'onBlur',
    resolver: yupResolver(schema)
  })

  const onSubmit = (data: FormData) => {
    const { identifier, password } = data
    const user: LoginParams = {
      username: identifier,
      password: encrypt(password),
      rememberMe: rememberMe
    }

    auth.login(user, () => {
      setError('identifier', {
        type: 'manual',
        message: 'Tài khoản hoặc Mật khẩu không hợp lệ'
      })
    })
  }

  const imageSource = skin === 'bordered' ? 'auth-v2-login-illustration-bordered' : 'auth-v2-login-illustration'

  return (
    <Box className='content-right' sx={{ backgroundColor: 'background.paper' }}>
      {!hidden ? (
        <Box
          sx={{
            flex: 1,
            display: 'flex',
            position: 'relative',
            alignItems: 'center',
            borderRadius: '20px',
            justifyContent: 'center',
            backgroundColor: 'customColors.bodyBg',
            margin: theme => theme.spacing(8, 0, 8, 8)
          }}
        >
          <Image
            src={Pic2}
            alt='First slide'
            width={900}
            height={600}
            className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'
            style={{ zIndex: 9999 }}
          />
          <FooterIllustrationsV2 />
        </Box>
      ) : null}
      <RightWrapper>
        <Box
          sx={{
            p: [6, 12],
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <Box sx={{ width: '100%', maxWidth: 400 }}>
            <Image
              style={{
                maxWidth: 250,
                height: 180,
                borderRadius: '8px',
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                display: 'block',
                margin: '0 auto',
                [theme.breakpoints.down('sm')]: {
                  maxWidth: 120,
                  height: 80
                },
                [theme.breakpoints.down('xs')]: {
                  maxWidth: 100,
                  height: 60
                }
              }}
              width={160}
              height={150}
              src={Pic1}
              alt='logo'
            />
            <Box sx={{ my: 6 }}>
              <Typography variant='h3' sx={{ mb: 1.5 }}>
                {`Chào mừng đến với ứng dụng quản lý XCD của ${themeConfig.templateName}!`}
              </Typography>
              <Typography sx={{ color: 'text.secondary' }}>Vui lòng đăng nhập tài khoản</Typography>
            </Box>

            <form noValidate autoComplete='off' onSubmit={handleSubmit(onSubmit)}>
              <Box sx={{ mb: 4 }}>
                <Controller
                  name='identifier'
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange, onBlur } }) => (
                    <CustomTextField
                      fullWidth
                      autoFocus
                      label='Email hoặc số điện thoại'
                      value={value}
                      onBlur={onBlur}
                      onChange={onChange}
                      placeholder='admin@vuexy.com'
                      error={Boolean(errors.identifier)}
                      {...(errors.identifier && { helperText: errors.identifier.message })}
                    />
                  )}
                />
              </Box>
              <Box sx={{ mb: 1.5 }}>
                <Controller
                  name='password'
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange, onBlur } }) => (
                    <CustomTextField
                      fullWidth
                      value={value}
                      onBlur={onBlur}
                      label='Mật khẩu'
                      onChange={onChange}
                      id='auth-login-v2-password'
                      error={Boolean(errors.password)}
                      {...(errors.password && { helperText: errors.password.message })}
                      type={showPassword ? 'text' : 'password'}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position='end'>
                            <IconButton
                              edge='end'
                              onMouseDown={e => e.preventDefault()}
                              onClick={() => setShowPassword(!showPassword)}
                            >
                              <Icon fontSize='1.25rem' icon={showPassword ? 'tabler:eye' : 'tabler:eye-off'} />
                            </IconButton>
                          </InputAdornment>
                        )
                      }}
                    />
                  )}
                />
              </Box>
              {/* <Box
                sx={{
                  mb: 1.75,
                  display: 'flex',
                  flexWrap: 'wrap',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                <FormControlLabel
                  label='Nhớ mật khẩu'
                  control={<Checkbox checked={rememberMe} onChange={e => setRememberMe(e.target.checked)} />}
                />
                <Typography component={LinkStyled} href='/forgot-password'>
                  Quên mật khẩu?
                </Typography>
              </Box> */}
              <Button fullWidth type='submit' variant='contained' sx={{ mb: 4 }}>
                Đăng nhập
              </Button>
              {/* <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center' }}>
                <Typography sx={{ color: 'text.secondary', mr: 2 }}>Chưa có tài khoản?</Typography>
                <Typography href='/register' component={LinkStyled}>
                  Tạo tài khoản
                </Typography>
              </Box> */}
            </form>
          </Box>
        </Box>
      </RightWrapper>
    </Box>
  )
}

LoginPage.getLayout = (page: ReactNode) => <BlankLayout>{page}</BlankLayout>

LoginPage.guestGuard = true

export default LoginPage
