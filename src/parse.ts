import { Lectures, Period, RefinedLecture, LectureKey } from './types'

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

function createRefinedLecture() {
  const refinedLecture: RefinedLecture = {
    college: '',
    subject: '',
    grade: '',
    course: '',
    section: '',
    code: '',
    name: '',
    credit: '',
    professor: '',
    closed: '',
    time: '',
    flex: '',
    note: '',
    building: '',
    room: '',
    periods: []
  }

  return refinedLecture
}

function intervalToTime(interval: number | string) {
  interval = Number(interval)
  const startTime = 9

  return {
    startH: interval - 1 + startTime,
    startM: 0,
    endH: interval + startTime,
    endM: 0
  }
}

export const parse = (lectures: Lectures) => {
  const refinedLectures = lectures.map(lecture => {
    const refinedLecture = createRefinedLecture()
    let key: LectureKey
    for (key in lecture) {
      refinedLecture[key] = lecture[key]
    }

    const timeStr = lecture.time

    const buildingRegExp = /([0-9]+) *?관/g
    const buildingMatch = buildingRegExp.exec(timeStr)
    if (buildingMatch) {
      refinedLecture.building = buildingMatch[1]
    }

    const roomRegExp = /([0-9]+) *?호/g
    const roomMatch = roomRegExp.exec(timeStr)
    if (roomMatch) {
      refinedLecture.room = roomMatch[1]
    }

    const timeRegExp1 = /([월화수목금토일]) *?\(?([0-9]+):([0-9]+)~([0-9]+):([0-9]+)\)?/g

    let timeMatch1: RegExpExecArray | null
    if (timeStr.match(timeRegExp1)) {
      while ((timeMatch1 = timeRegExp1.exec(timeStr))) {
        let period: Period = {
          day: convertDay(timeMatch1[1] as KoreanDay),
          startH: Number(timeMatch1[2]),
          startM: Number(timeMatch1[3]),
          endH: Number(timeMatch1[4]),
          endM: Number(timeMatch1[5])
        }
        refinedLecture.periods.push(period)
      }
    } else {
      const timeRegExp2 = /([월화수목금토일]) *?(([0-9] *?,?)+)/g
      let timeMatch2
      while ((timeMatch2 = timeRegExp2.exec(timeStr))) {
        const intervals = timeMatch2[2].split(',')
        const startIntervalTime = intervalToTime(intervals[0])
        const endIntervalTime = intervalToTime(intervals[intervals.length - 1])
        let period: Period = {
          day: convertDay(timeMatch2[1] as KoreanDay),
          startH: startIntervalTime.startH,
          startM: startIntervalTime.startM,
          endH: endIntervalTime.endH,
          endM: endIntervalTime.endM
        }
        refinedLecture.periods.push(period)
      }
    }

    return refinedLecture
  })

  return refinedLectures
}
