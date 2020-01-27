/** @type {import('../src/types').RefinedLectures} */
const lectures = require('../data/lectures-refined.json')

let maxCollegeLength = 0
let maxSubjectLength = 0

lectures.forEach(lecture => {
  // if (lecture.grade !== '1')

  if (maxCollegeLength < lecture.college.length) {
    maxCollegeLength = lecture.college.length
  }

  if (maxSubjectLength < lecture.subject.length) {
    maxSubjectLength = lecture.subject.length
  }
})

console.log(`maxCollegeLength: ${maxCollegeLength}`)
console.log(`maxSubjectLength: ${maxSubjectLength}`)
