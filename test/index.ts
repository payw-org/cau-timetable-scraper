import 'module-alias/register'
import { CTTS } from '@@/src'
import account from '@@/account'

const test = async () => {
  await CTTS(account)
}

test()
