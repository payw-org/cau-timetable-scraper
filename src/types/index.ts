/**
 * CAU Portal account
 */
export type Account = {
  id: string
  pw: string
}

/**
 * Search scope
 */
export type Coverage = {
  college: string
  major: string
}

export type Coverages = Coverage[]

/**
 * Raw data scraped from website
 */
export interface Lecture {
  coverages: Coverages
  year: number
  semester: string
  campus: string
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

/**
 * A class time
 */
export type Period = {
  day: 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun'
  startH: number
  startM: number
  endH: number
  endM: number
}

/**
 * Parsed data included
 */
export interface RefinedLecture extends Lecture {
  building: string
  room: string
  periods: Period[]
}

export type RefinedLectures = RefinedLecture[]

export type ScrapeOptions = {
  year: number
  semester: '1' | '하계' | '2' | '동계'
}
