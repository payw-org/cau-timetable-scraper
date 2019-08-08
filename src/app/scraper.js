const puppeteer = require('puppeteer')
const appRoot = require('app-root-path')
const portal = require(appRoot + '/src/module/scrap-portal.js')
const searchInfo = require(appRoot + '/src/config/searchInfo.json')
const account = require(appRoot + '/src/config/info.json')

module.exports.run = async () => {
  // creat new page
  const browser = await puppeteer.launch({ args: ['--no-sandbox'] })
  const page = await browser.newPage()
  await page.setViewport({
    width: 1280,
    height: 1080
  })

  // login portal
  await portal.loginAdmin(page, account)

  // move to timetable page
  await page.goto(
    'https://mportal.cau.ac.kr/std/usk/sUskSif001/index.do?type=1'
  )
  await page.waitForSelector('.nb-search-submit')

  // search class list
  var classListScraped = await portal.scrap_ClassList_All(page, searchInfo)

  // save class list
  await portal.saveClassList(classListScraped)

  await browser.close()
}
