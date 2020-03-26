/**
 * Parse schedule string and find building, room, and periods.
 */

import { Lectures, Period, RefinedLecture } from './types'

type KoreanDay = '월' | '화' | '수' | '목' | '금' | '토' | '일'

function convertDay(day: KoreanDay) {
  switch (day) {
    case '월':
      return 'mon'
    case '화':
      return 'tue'
    case '수':
      return 'wed'
    case '목':
      return 'thu'
    case '금':
      return 'fri'
    case '토':
      return 'sat'
    case '일':
      return 'sun'
  }
}

function intervalToTime(interval: number | string) {
  interval = Number(interval)
  const startTime = 9

  return {
    startH: interval - 1 + startTime,
    startM: 0,
    endH: interval + startTime,
    endM: 0,
  }
}

export const parse = (lectures: Lectures) => {
  const refinedLectures = lectures.map(lecture => {
    // Convert to `RefinedLecture` interface
    // and fill with empty properties
    const refinedLecture = lecture as RefinedLecture
    refinedLecture.building = ''
    refinedLecture.room = ''
    refinedLecture.periods = []

    const schedule = lecture.schedule

    const buildingRegExp = /([0-9]+) *?관/g
    const buildingMatch = buildingRegExp.exec(schedule)
    if (buildingMatch) {
      refinedLecture.building = buildingMatch[1]
    }

    const roomRegExp = /B?([0-9-]+) *?호/g
    const roomMatch = roomRegExp.exec(schedule)
    if (roomMatch) {
      refinedLecture.room = roomMatch[1]
    }

    const timeRegExp1 = /([월화수목금토일]) *?\(?([0-9]+):([0-9]+)~([0-9]+):([0-9]+)\)?/g

    let timeMatch1: RegExpExecArray | null
    if (schedule.match(timeRegExp1)) {
      while ((timeMatch1 = timeRegExp1.exec(schedule))) {
        let period: Period = {
          day: convertDay(timeMatch1[1] as KoreanDay),
          startH: Number(timeMatch1[2]),
          startM: Number(timeMatch1[3]),
          endH: Number(timeMatch1[4]),
          endM: Number(timeMatch1[5]),
        }
        refinedLecture.periods.push(period)
      }
    } else {
      const timeRegExp2 = /([월화수목금토일]) *?(([0-9] *?,?)+)/g
      let timeMatch2
      while ((timeMatch2 = timeRegExp2.exec(schedule))) {
        const intervals = timeMatch2[2].split(',')
        const startIntervalTime = intervalToTime(intervals[0])
        const endIntervalTime = intervalToTime(intervals[intervals.length - 1])
        let period: Period = {
          day: convertDay(timeMatch2[1] as KoreanDay),
          startH: startIntervalTime.startH,
          startM: startIntervalTime.startM,
          endH: endIntervalTime.endH,
          endM: endIntervalTime.endM,
        }
        refinedLecture.periods.push(period)
      }
    }

    return refinedLecture
  })

  return refinedLectures
}
