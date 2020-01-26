export type Account = {
  id: string
  pw: string
}

export interface Lecture {
  college: string
  subject: string
  grade: string
  course: string
  section: string
  code: string
  name: string
  credit: string
  professor: string
  closed: string
  time: string
  flex: string
  note: string
}

export type LectureKey = keyof Lecture

export type Lectures = Lecture[]

export type Period = {
  day: 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun'
  startH: number
  startM: number
  endH: number
  endM: number
}

export interface RefinedLecture extends Lecture {
  building: string
  room: string
  periods: Period[]
}

export type RefinedLectures = RefinedLecture[]
