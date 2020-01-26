import { Page } from 'puppeteer'
import { Lecture, Lectures } from './types'

const selectors = {
  tableRow: '.sp-grid-data-row'
}

type LectureKey = keyof Lecture

const analyzeTable = async (page: Page) => {
  const lectures = await page.evaluate((tableRowSelector: string) => {
    const rows = document.querySelectorAll(tableRowSelector)
    const lectures: Lectures = []

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
