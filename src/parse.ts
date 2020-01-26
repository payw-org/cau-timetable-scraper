import { Lectures } from './types'

export const parse = (lectures: Lectures) => {
  lectures.map(lecture => {
    const time = lecture.time
    const building = time.match(/[0-9]+관/g)
    const room = time.match(/[0-9]+호/g)
  })
}
