import { Lectures } from './types'
import Print from './utils/print'

export const parse = (lectures: Lectures) => {
  lectures.map(lecture => {
    const time = lecture.time

    const buildingRegExp = /([0-9]+) *?관/g
    const buildingMatch = buildingRegExp.exec(time)
    if (buildingMatch) {
      Print.ln(buildingMatch[1] + ` `)
    }

    const roomRegExp = /([0-9]+) *?호/g
    const roomMatch = roomRegExp.exec(time)
    if (roomMatch) {
      Print.ln(roomMatch[1])
    }

    Print.ln('\n')
  })
}
