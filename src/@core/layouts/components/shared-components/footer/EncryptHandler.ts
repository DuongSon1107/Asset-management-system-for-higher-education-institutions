import crypto from 'crypto'

// const secret = 'pppppppppppppppppppppppppppppppp'

export const encrypt = (password: string) => {
  // const iv = Buffer.from(crypto.randomBytes(16))

  const has = crypto.createHash('sha256').update(password).digest()

  // console.log('MD5', has, has.length, has.toString('hex'))

  // const cipher = crypto.createCipheriv('aes-256-ctr', Buffer.from(secret), iv)

  // const encryptedPassword = Buffer.concat([cipher.update(password), cipher.final()])

  return has.toString('hex')
}

// export const decrypt = (password: string, iv: string) => {
//   const decipher = crypto.createDecipheriv('aes-256-ctr', Buffer.from(secret), Buffer.from(iv, 'hex'))

//   const decryptedPassword = Buffer.concat([decipher.update(Buffer.from(password, 'hex')), decipher.final()])

//   return decryptedPassword.toString()
// }

module.exports = { encrypt }
