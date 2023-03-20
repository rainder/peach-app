import { logMock } from '../../../tests/unit/prepare'
import { isProduction } from '../system'
import { log } from './log'

jest.mock('../system', () => ({
  isProduction: jest.fn(),
}))

describe('log', () => {
  const logSpy = jest.spyOn(console, 'log')

  beforeEach(() => {
    jest.clearAllMocks()
  })
  it('is logging log to console for dev environment', () => {
    ;(isProduction as jest.Mock).mockReturnValueOnce(false)

    log('Test')
    expect(logSpy).toHaveBeenCalledWith(expect.stringContaining('LOG - Test'))
    expect(logMock).not.toHaveBeenCalled()
  })
  it('is logging log to crashlytics for prod environment', () => {
    ;(isProduction as jest.Mock).mockReturnValueOnce(true)
    log('Test')
    expect(logMock).toHaveBeenCalledWith(expect.stringContaining('LOG - Test'))
    expect(logSpy).not.toHaveBeenCalled()
  })
})
