const puppeteer = require('puppeteer')
const appRoot = require('app-root-path')
var account = require(appRoot + '/resource/info.json')

/**
 *     {
        "학년": "전체",
        "이수구분": "교양",
        "과목번호-분반": "49950-01",
        "과목명": "ACT",
        "담당교수": "최민지",
        "학점": "2",
        "시간": "2",
        "강의실/강의시간": "102관 401호 (월3,4)",
        "강의평": "",
        "담은 인원": "52",
        "개설학과": "",
        "유의사항": "공통교양"
		},
		/**
 * Index    title          usage
 * 0        학년      
 * 1        이수구분         
 * 2        과목번호-분반   true        
 * 3        과목명          true
 * 4        담당교수        true
 * 5        학점
 * 6        시간
 * 7        강의실/강의시간 true  
 * 8        강의평          
 * 9        담은인원
 * 10       개설학과
 * 11       유의사항
 * 5,6,8,9
 */

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
 * scrap class list with column 5,6,8,9.
 * each column match with 과목번호-분반, 과목명, 담당교수, 강의실/강의시간
 */
async function scrapClassList(page) {
  var ClassListScraped = []
  var ClassItemScraped = {}
  var lenOfClassList

  lenOfClassList = await page.evaluate(() => {
    return document.querySelector('.section-gap').children[0].children[0]
      .children[0].children[1].children[0].children.length
  })

  for (var i = 0; i < lenOfClassList; i++) {
    ClassItemScraped['과목번호-분반'] = await page.evaluate(index => {
      return document.querySelector('.section-gap').children[0].children[0]
        .children[0].children[1].children[0].children[index].children[5]
        .innerText
    }, i)
    ClassItemScraped['과목명'] = await page.evaluate(index => {
      return document.querySelector('.section-gap').children[0].children[0]
        .children[0].children[1].children[0].children[index].children[6]
        .innerText
    }, i)
    ClassItemScraped['담당교수'] = await page.evaluate(index => {
      return document.querySelector('.section-gap').children[0].children[0]
        .children[0].children[1].children[0].children[index].children[8]
        .innerText
    }, i)
    ClassItemScraped['강의실/강의시간'] = await page.evaluate(index => {
      return document.querySelector('.section-gap').children[0].children[0]
        .children[0].children[1].children[0].children[index].children[9]
        .innerText
    }, i)

    ClassListScraped.push(ClassItemScraped)
    console.log(ClassItemScraped)
  }

  return ClassListScraped
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
  var result = await scrapClassList(page)

  console.log(result[0]['과목명'])

  await page.screenshot({ path: 'example.png' })
  await browser.close()
})()
