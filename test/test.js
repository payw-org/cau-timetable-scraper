/** @type {import('../src/types').RefinedLectures} */
const lectures = require('../data/lectures.json')

lectures.forEach(lecture => {
  if (lecture.coverages.length > 1) {
    console.log(JSON.stringify(lecture, null, 2))
  }
})
