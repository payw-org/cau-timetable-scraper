import 'module-alias/register'
import { Lecture } from '@/analyze-table'
import lectures from '@@/data/lectures-college.json'
import fs from 'fs'

const typedLectures = lectures as Lecture[]

// Remove duplicates
const atomicLectures = typedLectures.filter((lecture, index) => {
  return (
    index ===
    typedLectures.findIndex(obj => {
      return obj.code === lecture.code
    })
  )
})

const parsedLectures = []

for (let i = 0; i < atomicLectures.length; i += 1) {
  const lecture = atomicLectures[i]
  let parsed = ''

  if (lecture.time === '/') {
    parsed = `❌ ${lecture.code}-${lecture.college}-${lecture.course}-${lecture.name} - no time`
  } else {
    parsed = `✅ ${lecture.code}-${lecture.college}-${lecture.course}-${lecture.name} -> `
    const building = lecture.time.match(/[0-9]+관/g)
    const room = lecture.time.match(/[0-9]+호/g)
    parsed += `building: ${building}, room: ${room}`
  }

  parsedLectures.push(parsed)
}

fs.writeFileSync('data/parsed.txt', parsedLectures.join('\n'))
