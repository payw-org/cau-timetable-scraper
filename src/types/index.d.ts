export type Account = {
  id: string
  pw: string
}

export type Lecture = {
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

export type Lectures = Lecture[]

export type RefinedLecture = {
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
  building: string
  room: string
  flex: string
  note: string
}

export type RefinedLectures = RefinedLecture[]
