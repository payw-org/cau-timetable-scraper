import { CTTS } from '../src'
import account from '../account'
import fs from 'fs'

const test = async () => {
  const lectures = await CTTS(account)

  fs.writeFileSync(`data/lectures.json`, JSON.stringify(lectures, null, 2))
}

test()
