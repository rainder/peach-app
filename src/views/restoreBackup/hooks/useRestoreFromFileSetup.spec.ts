import { renderHook, waitFor } from '@testing-library/react-native'
import { useRestoreFromFileSetup } from './useRestoreFromFileSetup'
import { MSINANHOUR } from '../../../constants'
import { account1 } from '../../../../tests/unit/data/accountData'
import { act } from 'react-test-renderer'

jest.useFakeTimers()

const navigationReplaceMock = jest.fn()
const useNavigationMock = jest.fn().mockReturnValue({
  replace: (...args: any[]) => navigationReplaceMock(...args),
})
jest.mock('../../../hooks/useNavigation', () => ({
  useNavigation: () => useNavigationMock(),
}))

const decryptAccountMock = jest.fn().mockResolvedValue([account1])
jest.mock('../../../utils/account/decryptAccount', () => ({
  decryptAccount: (...args: any[]) => decryptAccountMock(...args),
}))
const recoverAccountMock = jest.fn().mockResolvedValue(account1)
jest.mock('../../../utils/account/recoverAccount', () => ({
  recoverAccount: (...args: any[]) => recoverAccountMock(...args),
}))

const storeAccountMock = jest.fn()
jest.mock('../../../utils/account/storeAccount', () => ({
  storeAccount: (...args: any[]) => storeAccountMock(...args),
}))

const apiSuccess = {
  expiry: Date.now() + MSINANHOUR,
  accessToken: 'accessToken',
}
const authMock = jest.fn().mockResolvedValue([apiSuccess, null])
jest.mock('../../../utils/peachAPI', () => ({
  auth: (...args: any[]) => authMock(...args),
}))

describe('useRestoreFromFileSetup', () => {
  const encryptedAccount = 'encryptedAccount'
  const password = 'password'
  afterEach(() => {
    jest.clearAllMocks()
  })
  it('restores account from file', async () => {
    const { result } = renderHook(useRestoreFromFileSetup)
    act(() => {
      result.current.setFile({
        name: '',
        content: encryptedAccount,
      })
      result.current.setPassword(password)
    })
    act(() => {
      result.current.submit()
    })
    await waitFor(() => {
      expect(result.current.restored).toBeTruthy()
    })
    expect(decryptAccountMock).toHaveBeenCalledWith({
      encryptedAccount,
      password,
    })
    expect(recoverAccountMock).toHaveBeenCalledWith(account1)
    expect(storeAccountMock).toHaveBeenCalledWith(account1)
  })
})
