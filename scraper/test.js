const puppeteer = require('puppeteer')
const fs = require('fs')
const appRoot = require('app-root-path')
var account = require(appRoot + '/resource/info.json')

var searchInfo = {
  year: '2019',
  semester: '1',
  course: '3', // '학부'
  campus: '1', // '서울'
  college: '3B500', // 소프트웨어대학
  major: '3B510', // 소프트웨어학부
  className: ''
}

/**
 *
 * @param {*} page
 * @param {*} account
 * login cau portal with admin account
 */
async function loginAdmin(page, account) {
  // go to login page
  await page.goto(
    'https://mportal.cau.ac.kr/common/auth/SSOlogin.do?redirectUrl=/main.do'
  )
  await page.waitForSelector('#txtUserID')

  // login with admin account
  await page.evaluate(
    (ID, PW) => {
      document.querySelector('#txtUserID').value = ID
      document.querySelector('#txtPwd').value = PW
    },
    account.admin.ID,
    account.admin.PW
  )
  await page.click('.btn-login')
  await page.waitForSelector('.nb-font-13')
}

/**
 *
 * @param {*} page
 * @param {*} searchInfo
 * fill in select tag and click search to show class list
 */

async function searchClassList(page, searchInfo) {
  var delay = 100 // 50 also success

  // fill in
  await page.select('#sel_year', searchInfo['year'])
  await page.waitFor(delay)
  await page.select('#sel_shtm', searchInfo['semester'])
  await page.waitFor(delay)
  await page.select('#sel_course', searchInfo['course'])
  await page.waitFor(delay)
  await page.select('#sel_camp', searchInfo['campus'])
  await page.waitFor(delay)
  await page.select('#sel_colg', searchInfo['college'])
  await page.waitFor(delay)
  await page.select('#sel_sust', searchInfo['major'])
  await page.waitFor(delay)

  // click
  await page.evaluate(() => {
    document
      .querySelector('.nb-search-submit')
      .children[0].children[0].children[0].click()
  })
  await page.waitFor(delay * 10)
}

/**
 *
 * @param {*} page
 * scrap class list with column 5,6,8,9.
 * each column match with 과목번호-분반, 과목명, 담당교수, 강의실/강의시간
 */
async function scrapClassList(page) {
  var classListScraped = new Array()
  var classItemScraped
  var lenOfClassList

  lenOfClassList = await page.evaluate(() => {
    return document.querySelector('.section-gap').children[0].children[0]
      .children[0].children[1].children[0].children.length
  })

  for (var i = 0; i < lenOfClassList; i++) {
    classItemScraped = new Object()
    classItemScraped['과목번호-분반'] = await page.evaluate(index => {
      return document.querySelector('.section-gap').children[0].children[0]
        .children[0].children[1].children[0].children[index].children[5]
        .innerText
    }, i)
    classItemScraped['과목명'] = await page.evaluate(index => {
      return document.querySelector('.section-gap').children[0].children[0]
        .children[0].children[1].children[0].children[index].children[6]
        .innerText
    }, i)
    classItemScraped['담당교수'] = await page.evaluate(index => {
      return document.querySelector('.section-gap').children[0].children[0]
        .children[0].children[1].children[0].children[index].children[8]
        .innerText
    }, i)
    classItemScraped['강의실/강의시간'] = await page.evaluate(index => {
      return document.querySelector('.section-gap').children[0].children[0]
        .children[0].children[1].children[0].children[index].children[9]
        .innerText
    }, i)

    classListScraped.push(classItemScraped)
  }

  return classListScraped
}

;(async () => {
  // creat new page
  const browser = await puppeteer.launch({ args: ['--no-sandbox'] })
  const page = await browser.newPage()
  await page.setViewport({
    width: 1280,
    height: 1080
  })

  // login portal
  await loginAdmin(page, account)

  // move to timetable page
  await page.goto(
    'https://mportal.cau.ac.kr/std/usk/sUskSif001/index.do?type=1'
  )
  await page.waitForSelector('.nb-search-submit')

  // search class list
  await searchClassList(page, searchInfo)

  // scrap class list
  var classListScraped = await scrapClassList(page)
  var classListScrapedString = JSON.stringify(classListScraped)

  var fileName =
    searchInfo['year'] +
    '_' +
    searchInfo['semester'] +
    '_' +
    searchInfo['course'] +
    '_' +
    searchInfo['campus'] +
    '_' +
    searchInfo['college'] +
    '_' +
    searchInfo['major'] +
    '.json'
  fs.writeFileSync(
    appRoot + '/resource/scraped/' + fileName,
    classListScrapedString
  )

  await page.screenshot({ path: 'example.png' })
  await browser.close()
})()
