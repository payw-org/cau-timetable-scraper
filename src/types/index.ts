export type Account = {
  id: string
  pw: string
}

export type Coverage = {
  year: string
  semester: string
  course: string
  campus: string
  college: string
  major: string
}

export type Coverages = Coverage[]

export interface Lecture {
  coverages: Coverages
  college: string
  major: string
  grade: number
  course: string
  section: string
  code: string
  name: string
  credit: number
  time: number
  professor: string
  closed: string
  schedule: string
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
