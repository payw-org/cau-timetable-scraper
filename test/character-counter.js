/** @type {import('../src/types').RefinedLectures} */
const lectures = require('../data/lectures.json')

let maxCollegeLength = 0
let maxScheduleLength = 0

lectures.forEach(lecture => {
  // if (lecture.grade !== '1')

  if (maxCollegeLength < lecture.college.length) {
    maxCollegeLength = lecture.college.length
  }

  if (maxScheduleLength < lecture.schedule.length) {
    maxScheduleLength = lecture.schedule.length
  }
})

console.log(`maxCollegeLength: ${maxCollegeLength}`)
console.log(`maxScheduleLength: ${maxScheduleLength}`)
