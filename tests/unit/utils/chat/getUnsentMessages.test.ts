import { deepStrictEqual } from 'assert'
import { defaultAccount, setAccount } from '../../../../src/utils/account'
import { getUnsentMessages, saveChat } from '../../../../src/utils/chat'
import * as chatData from '../../data/chatData'
import { resetStorage } from '../../prepare'

describe('getUnsentMessages', () => {
  beforeEach(async () => {
    await setAccount({
      ...defaultAccount,
      publicKey: '0366497c46fef0ba126a42993ed0390c17b99eb1cc1285cef10e2496478ad709b4',
    })
  })
  afterEach(() => {
    resetStorage()
    jest.clearAllMocks()
  })

  it('gets unsent messages from a chat', () => {
    saveChat(chatData.chatWithUnsentMessages.id, chatData.chatWithUnsentMessages)
    const unsentMessages = getUnsentMessages(chatData.chatWithUnsentMessages)
    deepStrictEqual(
      unsentMessages.map((m) => m.message),
      ['Test', 'D'],
    )
    deepStrictEqual(
      unsentMessages.map((m) => m.readBy.length),
      [0, 0],
    )
  })
})
