import { Page } from 'puppeteer'
import { Lecture, Lectures, Coverage } from './types'

const selectors = {
  tableRow: '.sp-grid-data-row',
}

type PortalColumnKey =
  | 'college'
  | 'major'
  | 'grade'
  | 'course'
  | 'section'
  | 'code'
  | 'name'
  | 'creditAndTime'
  | 'professor'
  | 'closed'
  | 'schedule'
  | 'flex'
  | 'note'

type Options = {
  year: string
  semester: string
  courseCoverage: string
  campusCoverage: string
  collegeCoverage: string
  majorCoverage: string
  majorCode: string
}

const analyzeTable = async (page: Page, options: Options) => {
  const lectures = await page.evaluate(
    (tableRowSelector: string, options: Options) => {
      const rows = document.querySelectorAll(tableRowSelector)
      const lectures: Lectures = []

      rows.forEach(row => {
        // Initialize a new lecture
        let newLecture: Lecture = {
          coverages: [],
          year: parseInt(options.year),
          semester: options.semester,
          campus: options.campusCoverage,
          college: '',
          major: '',
          grade: 0,
          course: '',
          section: '',
          code: '',
          name: '',
          credit: 0,
          time: 0,
          professor: '',
          closed: '',
          schedule: '',
          flex: '',
          note: '',
        }
        const columns = row.children
        const keys: PortalColumnKey[] = [
          'college',
          'major',
          'grade',
          'course',
          'section',
          'code',
          'name',
          'creditAndTime',
          'professor',
          'closed',
          'schedule',
          'flex',
          'note',
        ]

        const coverage: Coverage = {
          // year: options.year,
          // semester: options.semester,
          // course: options.courseCoverage,
          // campus: options.campusCoverage,
          college: options.collegeCoverage,
          major: options.majorCoverage,
          majorCode: options.majorCode,
        }

        for (let i = 0; i < columns.length; i += 1) {
          const key: PortalColumnKey = keys[i]
          const dataElm = columns[i].querySelector('.sp-grid-data')
          const data = dataElm?.textContent?.trim() || ''

          if (key === 'grade') {
            newLecture[key] = parseInt(data) || 0
          } else if (key === 'creditAndTime') {
            const arrs = data.split('-')
            const credit = parseFloat(arrs[0])
            const time = parseFloat(arrs[1])

            newLecture['credit'] = credit
            newLecture['time'] = time
          } else {
            newLecture[key] = data
          }
        }

        newLecture.coverages.push(coverage)
        lectures.push(newLecture)
      })

      return lectures
    },
    selectors.tableRow,
    options
  )

  return lectures
}

export { analyzeTable }
