/** @type {import('../src/types').Lectures} */
const lectures = require('../data/lectures-atomic.json')
const fs = require('fs')

let times = []

lectures.forEach(lecture => {
  if (lecture.time !== '/') {
    // console.log(lecture.time)
    times.push(lecture.time)
  }
})

fs.writeFileSync(`data/times.txt`, times.join(`\n`))
