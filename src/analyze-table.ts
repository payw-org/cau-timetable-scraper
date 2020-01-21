import { Page } from 'puppeteer'

const selectors = {
  tableRow: '.sp-grid-data-row'
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

type LectureKey = keyof Lecture

const analyzeTable = async (page: Page) => {
  const lectures = await page.evaluate((tableRowSelector: string) => {
    const rows = document.querySelectorAll(tableRowSelector)
    const lectures: Lecture[] = []

    rows.forEach(row => {
      let lecture: Lecture = {
        college: '',
        subject: '',
        grade: '',
        course: '',
        section: '',
        code: '',
        name: '',
        credit: '',
        professor: '',
        closed: '',
        time: '',
        flex: '',
        note: ''
      }
      const columns = row.children
      const keys: LectureKey[] = [
        'college',
        'subject',
        'grade',
        'course',
        'section',
        'code',
        'name',
        'credit',
        'professor',
        'closed',
        'time',
        'flex',
        'note'
      ]

      for (let i = 0; i < columns.length; i += 1) {
        const key: LectureKey = keys[i]
        const dataElm = columns[i].querySelector('.sp-grid-data')
        lecture[key] = dataElm?.textContent?.trim() || ''
      }

      lectures.push(lecture)
    })

    return lectures
  }, selectors.tableRow)

  return lectures
}

export { analyzeTable }
