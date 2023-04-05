import { decryptSymmetricKey } from './decryptSymmetricKey'

const decryptMock = jest.fn()
const verifyMock = jest.fn()
jest.mock('../../../utils/pgp', () => ({
  decrypt: (...args: any) => decryptMock(...args),
  verify: (...args: any) => verifyMock(...args),
}))

describe('decryptSymmetricKey', () => {
  it('should return symmetric key and null', async () => {
    const symmetricKeyEncrypted = 'encrypted symmetric key'
    const symmetricKeySignature = 'symmetric key signature'
    const pgpPublicKey = 'pgp public key'
    const symmetricKey = 'symmetric key'
    decryptMock.mockReturnValue(symmetricKey)
    verifyMock.mockReturnValue(true)
    const [symmetricKeyResult, error] = await decryptSymmetricKey(
      symmetricKeyEncrypted,
      symmetricKeySignature,
      pgpPublicKey,
    )
    expect(symmetricKeyResult).toEqual(symmetricKey)
    expect(error).toEqual(null)
  })
  it('should handle failed decryption', async () => {
    const symmetricKeyEncrypted = 'encrypted symmetric key'
    const symmetricKeySignature = 'symmetric key signature'
    const pgpPublicKey = 'pgp public key'
    decryptMock.mockImplementation(() => {
      throw new Error('DECRYPTION_FAILED')
    })
    const [symmetricKeyResult, error] = await decryptSymmetricKey(
      symmetricKeyEncrypted,
      symmetricKeySignature,
      pgpPublicKey,
    )
    expect(symmetricKeyResult).toEqual(null)
    expect(error).toEqual('DECRYPTION_FAILED')
  })
  it('should handle invalid signature', async () => {
    const symmetricKeyEncrypted = 'encrypted symmetric key'
    const symmetricKeySignature = 'invalid symmetric key signature'
    const pgpPublicKey = 'pgp public key'
    const symmetricKey = 'symmetric key'
    decryptMock.mockReturnValue(symmetricKey)
    verifyMock.mockReturnValue(false)
    const [symmetricKeyResult, error] = await decryptSymmetricKey(
      symmetricKeyEncrypted,
      symmetricKeySignature,
      pgpPublicKey,
    )
    expect(symmetricKeyResult).toEqual(symmetricKey)
    expect(error).toEqual('INVALID_SIGNATURE')
  })
})
