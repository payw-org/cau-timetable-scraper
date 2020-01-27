import { Page } from 'puppeteer'
import Print from './utils/print'
import { PendingXHR } from 'pending-xhr-puppeteer'
import { analyzeTable } from './analyze-table'
import { Lectures } from './types'

const selectors = {
  yearSelect: '#sel_year',
  semesterSelect: '#sel_shtm',
  courseSelect: '#sel_course',
  campusSelect: '#sel_camp',
  collegeSelect: '#sel_colg',
  majorSelect: '#sel_sust',
  searchButton: '.nb-search-submit button',
}

async function getOptionsFromSelect(page: Page, selectSelector: string) {
  // let options: string[]
  let options: { value: string; label: string }[]

  options = await page.evaluate((selectSelector: string) => {
    // const options: string[] = []
    let options: { value: string; label: string }[] = []
    const selectElm = document.querySelector(
      selectSelector
    ) as HTMLSelectElement

    selectElm.querySelectorAll('option').forEach(option => {
      if (!option.innerText.trim().includes('-')) {
        options.push({
          value: option.value,
          label: option.textContent?.trim() || '',
        })
      }
    })

    return options
  }, selectSelector)

  return options
}

async function selectOption(page: Page, selectSelector: string, value: string) {
  const pendingXHR = new PendingXHR(page)

  await page.evaluate(
    (selectSelector: string, value: string) => {
      const selectElm = document.querySelector(
        selectSelector
      ) as HTMLSelectElement
      selectElm.value = value
      selectElm.dispatchEvent(new Event('change'))
    },
    selectSelector,
    value
  )

  await pendingXHR.waitForAllXhrFinished()
}

async function clickSearch(page: Page) {
  const pendingXHR = new PendingXHR(page)
  await page.click(selectors.searchButton)
  await pendingXHR.waitForAllXhrFinished()
}

export const scrapeTimetable = async (page: Page) => {
  Print.ln('Navigating to timetable page...')

  await page.goto('https://mportal.cau.ac.kr/std/usk/sUskSif001/index.do')

  Print.done()

  let totalLectures: Lectures = []

  const yearOptions = await getOptionsFromSelect(page, selectors.yearSelect)

  // Only current year
  const yearOption = yearOptions[0]
  await selectOption(page, selectors.yearSelect, yearOption.value)

  const semesterOptions = await getOptionsFromSelect(
    page,
    selectors.semesterSelect
  )

  for (let semesterIndex = 0; semesterIndex < 1; semesterIndex += 1) {
    const semesterOption = semesterOptions[semesterIndex]
    await selectOption(page, selectors.semesterSelect, semesterOption.value)
    const courseOptions = await getOptionsFromSelect(
      page,
      selectors.courseSelect
    )

    // Only college. No postgraduate course.
    for (let courseIndex = 0; courseIndex < 1; courseIndex += 1) {
      const courseOption = courseOptions[courseIndex]
      await selectOption(page, selectors.courseSelect, courseOption.value)
      const campusOptions = await getOptionsFromSelect(
        page,
        selectors.campusSelect
      )

      // Only Seoul campus
      for (let campusIndex = 0; campusIndex < 1; campusIndex += 1) {
        const campusOption = campusOptions[campusIndex]
        await selectOption(page, selectors.campusSelect, campusOption.value)
        const collegeOptions = await getOptionsFromSelect(
          page,
          selectors.collegeSelect
        )

        for (
          let collegeIndex = 0;
          collegeIndex < collegeOptions.length;
          collegeIndex += 1
        ) {
          const collegeOption = collegeOptions[collegeIndex]
          await selectOption(page, selectors.collegeSelect, collegeOption.value)
          const majorOptions = await getOptionsFromSelect(
            page,
            selectors.majorSelect
          )

          for (
            let majorIndex = 0;
            majorIndex < majorOptions.length;
            majorIndex += 1
          ) {
            const majorOption = majorOptions[majorIndex]
            await selectOption(page, selectors.majorSelect, majorOption.value)
            await clickSearch(page)

            Print.ln(
              `${semesterOption.label}-${courseOption.label}-${campusOption.label}-${collegeOption.label}-${majorOption.label}`,
              true
            )

            const lectures = await analyzeTable(page, {
              year: yearOption.label.trim(),
              semester: semesterOption.label.trim(),
              courseCoverage: courseOption.label.trim(),
              campusCoverage: campusOption.label.trim(),
              collegeCoverage: collegeOption.label.trim(),
              majorCoverage: majorOption.label.trim(),
            })

            totalLectures.push(...lectures)
          }
        }
      }
    }
  }

  return totalLectures
}
