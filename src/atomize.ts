/**
 * There are multiple duplicate lecture data in different coverages.
 * This script removes duplicate entries and merge them into coverages property.
 */

import { Lectures } from './types'

export const atomize = (lectures: Lectures) => {
  let i = lectures.length

  while (i--) {
    const currentLecture = lectures[i]
    const dupIndex = lectures.findIndex((lecture, index) => {
      return (
        index !== i &&
        lecture.year === currentLecture.year &&
        lecture.semester === currentLecture.semester &&
        lecture.campus === currentLecture.campus &&
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
        if (
          lectures[dupIndex].coverages.findIndex(
            ({ college, major }) =>
              college === coverage.college && major === coverage.major
          ) === -1
        ) {
          lectures[dupIndex].coverages.push(coverage)
        }
      })
      lectures.splice(i, 1)
    }
  }

  return lectures
}
