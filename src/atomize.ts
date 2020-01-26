import { Lectures } from './types'

export const atomize = (lectures: Lectures) => {
  const atomicLectures: Lectures = lectures.filter((lecture, index) => {
    return (
      index ===
      lectures.findIndex(obj => {
        return obj.code === lecture.code
      })
    )
  })

  return atomicLectures

  // fs.writeFileSync(
  //   `data/lectures-atomic.json`,
  //   JSON.stringify(atomicLectures, null, 2)
  // )
}
