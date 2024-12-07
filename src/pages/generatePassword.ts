const LOWERCASE_LETTERS = 'abcdefghiklmnopqrstuvwxyz'
const UPPERCASE_LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
const NUMBERS = '0123456789'
const SYMBOLS = '!@#$%^&*()_+-={}[]|;:<>,.?/~`'
export function generatePassword() {
  let chars = ''
  chars += UPPERCASE_LETTERS
  chars += LOWERCASE_LETTERS
  chars += NUMBERS
  // chars += SYMBOLS
  let password = ''
  for (let i = 0; i < 12; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length))
  }

  return password
}
