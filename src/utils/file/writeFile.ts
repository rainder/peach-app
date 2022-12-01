import RNFS from 'react-native-fs'
import { encrypt } from '../crypto'
import { error, info } from '../log'

export const writeFile = async (path: string, content: string, password?: string): Promise<boolean> => {
  info(password ? 'Writing encrypted file' : 'Writing file', path)
  let encrypted
  try {
    if (password) {
      encrypted = encrypt(content, password)
    } else {
      encrypted = content
    }
  } catch (e) {
    error('Data could not be encrypted', e)
    return false
  }
  try {
    await RNFS.writeFile(RNFS.DocumentDirectoryPath + path, encrypted, 'utf8')
    return true
  } catch (e) {
    error('File could not be written', e)
    return false
  }
}
