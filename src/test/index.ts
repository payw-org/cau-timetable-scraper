import 'module-alias/register'
import { CTTS } from '@/main'
import account from '@/account'

const test = async () => {
  await CTTS(account)
}

test()
