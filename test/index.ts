import 'module-alias/register'
import { CTTS } from '@@/src/main'
import account from '@@/account'

const test = async () => {
  await CTTS(account)
}

test()
