import 'module-alias/register'
import { Lecture } from '@/analyze-table'
import lectures from '@@/data/lectures.json'
import fs from 'fs'

const typedLectures: Lecture[] = lectures as Lecture[]

console.log(typedLectures.length)

const times = typedLectures.map(lecture => {
  return lecture.time
})

const places = typedLectures.map(lecture => {
  let place = ''
  const building = lecture.time.match(/[0-9]+관/g)
  if (building) {
    place += building[0]
  }
  const room = lecture.time.match(/[0-9]+호/g)
  if (room) {
    place += ' ' + room[0]
  }
  return place
})

fs.writeFileSync('data/times.txt', times.join('\n'))
fs.writeFileSync('data/places.txt', places.join('\n'))
