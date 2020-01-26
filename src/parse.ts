import { Lectures } from './types'
import Print from './utils/print'

export const parse = (lectures: Lectures) => {
  lectures.map(lecture => {
    const timeStr = lecture.time

    const buildingRegExp = /([0-9]+) *?관/g
    const buildingMatch = buildingRegExp.exec(timeStr)
    if (buildingMatch) {
      Print.ln(buildingMatch[1] + ` `)
    }

    const roomRegExp = /([0-9]+) *?호/g
    const roomMatch = roomRegExp.exec(timeStr)
    if (roomMatch) {
      Print.ln(roomMatch[1])
    }

    const timeRegExp1 = /[월화수목금토일] *?\(?[0-9]+:[0-9]+~[0-9]+:[0-9]+\)?/g

    const timeRegExp2 = /[월화수목금토일] *?([0-9] *?,?)+/g
  })
}
