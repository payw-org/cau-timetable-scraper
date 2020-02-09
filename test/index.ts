import { CTTS } from '../src'
import account from '../account'
import fs from 'fs'

const test = async () => {
  const lectures = await CTTS(account, {
    year: 2020,
    semester: '하계',
  })

  fs.writeFileSync(
    `data/lectures-2020-1.json`,
    JSON.stringify(lectures, null, 2)
  )
}

test()
