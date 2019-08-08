const puppeteer = require('puppeteer')
const appRoot = require('app-root-path')
const fs = require('fs')

const portal = require(appRoot + '/src/module/scrap-portal.js')

module.exports.run = async () => {
  // creat new page
  var searchInfo = JSON.parse(fs.readFileSync(appRoot + '/src/config/searchInfo.json','utf8'))
  const account = JSON.parse(fs.readFileSync(appRoot + '/src/config/info.json','utf8'))
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
  await browser.close()

  // check exist file
  var dataName = portal.getDataName(searchInfo)
  if(fs.existsSync(appRoot + '/src/resource/scraped/' + dataName)){
    var existData = fs.readFileSync(appRoot + '/src/resource/scraped/' + dataName, 'utf8')
    var newData = JSON.stringify(classListScraped)
    if(existData === newData){
      return null
    }
  }

  // save class list
  await portal.saveClassList(classListScraped,dataName)

  return dataName
}
