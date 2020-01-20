import { Page } from 'puppeteer'
import Print from '@/utils/print'

type TimetablePageSelectors = {
  yearSelect: string
  semesterSelect: string
  courseSelect: string
  campusSelect: string
  collegeSelect: string
  majorSelect: string
  searchButton: string
}

const selectors: TimetablePageSelectors = {
  yearSelect: '#sel_year',
  semesterSelect: '#sel_shtm',
  courseSelect: '#sel_course',
  campusSelect: '#sel_camp',
  collegeSelect: '#sel_colg',
  majorSelect: '#sel_sust',
  searchButton: '.nb-search-submit button'
}

export const scrapeTimetable = async (page: Page) => {
  Print.ln('Navigating to timetable page...')

  await page.goto('https://mportal.cau.ac.kr/std/usk/sUskSif001/index.do')

  await page.evaluate((selectors: TimetablePageSelectors) => {
    function getSelectElm(selector: string) {
      return document.querySelector(selector) as HTMLSelectElement
    }

    function getOptionsFromSelect(selectElm: HTMLSelectElement) {
      const options: string[] = []
      selectElm.querySelectorAll('option').forEach(option => {
        options.push(option.value)
      })

      return options
    }

    function changeSelect(selectElm: HTMLSelectElement, value: string) {
      selectElm.value = value
      selectElm.dispatchEvent(new Event('change'))
    }

    const yearSelectElm = getSelectElm(selectors.yearSelect)
    const semesterSelectElm = getSelectElm(selectors.semesterSelect)
    const courseSelectElm = getSelectElm(selectors.courseSelect)
    const campusSelectElm = getSelectElm(selectors.campusSelect)
    const collegeSelectElm = getSelectElm(selectors.collegeSelect)
    const majorSelectElm = getSelectElm(selectors.majorSelect)

    const yearOptions = getOptionsFromSelect(yearSelectElm)
    const semesterOptions = getOptionsFromSelect(semesterSelectElm)
    const courseOptions = getOptionsFromSelect(courseSelectElm)
    const collegeOptions = getOptionsFromSelect(collegeSelectElm)
    const majorOptions = getOptionsFromSelect(majorSelectElm)
  }, selectors)
}
