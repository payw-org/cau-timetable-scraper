import { CTTS } from '../src'
import account from '../account'
import fs from 'fs'

const test = async () => {
  const year = 2020
  const semester = '2'

  const { lectures, colleges } = await CTTS(account, {
    year,
    semester,
  })

  const timestamp = new Date().getTime()

  fs.writeFileSync(
    `data/lectures-${year}-${semester}-${timestamp}.json`,
    JSON.stringify(lectures, null, 2)
  )
  fs.writeFileSync(
    `data/colleges-${timestamp}.json`,
    JSON.stringify(colleges, null, 2)
  )
}

test()
