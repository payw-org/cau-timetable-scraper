import { Lectures } from './types'

export const atomize = (lectures: Lectures) => {
  let i = lectures.length

  while (i--) {
    const currentLecture = lectures[i]
    const dupIndex = lectures.findIndex((lecture, index) => {
      return (
        index !== i &&
        lecture.college === currentLecture.college &&
        lecture.major === currentLecture.major &&
        lecture.grade === currentLecture.grade &&
        lecture.course === currentLecture.course &&
        lecture.section === currentLecture.section &&
        lecture.code === currentLecture.code &&
        lecture.name === currentLecture.name &&
        lecture.credit === currentLecture.credit &&
        lecture.time === currentLecture.time &&
        lecture.professor === currentLecture.professor &&
        lecture.closed === currentLecture.closed &&
        lecture.schedule === currentLecture.schedule &&
        lecture.flex === currentLecture.flex &&
        lecture.note === currentLecture.note
      )
    })

    if (dupIndex !== -1) {
      currentLecture.coverages.forEach(coverage => {
        lectures[dupIndex].coverages.push(coverage)
      })
      lectures.splice(i, 1)
    }
  }

  return lectures
}
