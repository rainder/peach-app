import { deepEqual } from 'assert'
import { parseError } from '../../../../src/utils/system'

describe('parseError', () => {
  it('should parse an error', () => {
    deepEqual(parseError(new Error('test')), 'test')
    deepEqual(parseError('test'), 'TEST')
    deepEqual(parseError(1), 'UNKNOWN_ERROR')
  })
})
