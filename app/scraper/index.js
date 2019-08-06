const puppeteer = require('puppeteer')
const fs = require('fs')
const appRoot = require('app-root-path')
const portal = require('./portal.js')
var account = require(appRoot + '/resource/info.json')

var searchInfo = {
  year: '2019',
  semester: '1',
  course: '학부',
  campus: '서울',
  college: '소프트웨어대학',
  major: '소프트웨어학부',
  className: ''
}

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
 * @param {*} selector
 * @param {*} index
 * select selectTag in page and delay (100ms)
 */
async function select_selectTag(page, selector, index) {
  console.log(selector + ' option:nth-child(' + index + ')')
  console.log(index)
  var delay = 100 // 50 also success

  // select option
  await page.evaluate(
    (selector, index) => {
      document.querySelector(
        selector + ' option:nth-child(' + index + ')'
      ).selected = true
    },
    selector,
    index
  )

  // apply change
  await page.evaluate(selector => {
    var element = document.querySelector(selector)
    element.dispatchEvent(new Event('change'))
  }, selector)

  await page.waitFor(delay)
}

/**
 *
 * @param {*} page
 * @param {*} infoSearchItem
 * search class list with selecting select tag and click search button
 */
async function search_ClassList(page, infoSearchItem) {
  await select_selectTag(page, '#sel_year', infoSearchItem['year'])
  await select_selectTag(page, '#sel_shtm', infoSearchItem['semester'])
  await select_selectTag(page, '#sel_course', infoSearchItem['course'])
  await select_selectTag(page, '#sel_camp', infoSearchItem['campus'])
  await select_selectTag(page, '#sel_colg', infoSearchItem['college'])
  await select_selectTag(page, '#sel_sust', infoSearchItem['major'])

  // click
  await page.evaluate(() => {
    document
      .querySelector('.nb-search-submit')
      .children[0].children[0].children[0].click()
  })
  await page.waitFor(3000)
}

/**
 *
 * @param {*} page
 * scrap class list with column 5,6,8,9.
 * each column match with 과목번호-분반, 과목명, 담당교수, 강의실/강의시간
 */
async function scrap_ClassList(page) {
  var classListScraped = new Array()
  var classItemScraped
  var length_ClassList

  // get length of class list
  length_ClassList = await page.evaluate(() => {
    return document.querySelector('.section-gap').children[0].children[0]
      .children[0].children[1].children[0].children.length
  })

  for (var i = 0; i < length_ClassList; i++) {
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

async function change_InfoSearch_ToIndex_withArray(page, infoSearch) {
  var string_SelectTag_Item
  var length_SelectTag_List

  // year
  if (infoSearch['year'] != '') {
    // get length of select tag list
    length_SelectTag_List = await page.evaluate(() => {
      return document.querySelector('#sel_year').children.length
    })

    // match with infoSearch
    for (var i = 0; i < length_SelectTag_List; i++) {
      // get string of item from select tag list
      string_SelectTag_Item = await page.evaluate(index => {
        return document
          .querySelector('#sel_year')
          .children[index].innerText.trim()
      }, i)

      if (infoSearch['year'] == string_SelectTag_Item) break
    }

    // change infoSearch to index with array
    infoSearch['year'] = [i + 1]

    // select select tag
    await select_selectTag(page, '#sel_year', infoSearch['year'][0])
  }

  // semester
  if (infoSearch['semester'] != '') {
    if (infoSearch['semester'] == '1') infoSearch['semester'] = [1]
    else if (infoSearch['semester'] == '하계') infoSearch['semester'] = [2]
    else if (infoSearch['semester'] == '2') infoSearch['semester'] = [3]
    else if (infoSearch['semester'] == '동계') infoSearch['semester'] = [4]

    // select select tag
    await select_selectTag(page, '#sel_shtm', infoSearch['semester'][0])
  }

  // course
  if (infoSearch['course'] != '') {
    if (infoSearch['course'] == '학부') infoSearch['course'] = [1]
    else if (infoSearch['course'] == '대학원') infoSearch['course'] = [2]

    // select select tag
    await select_selectTag(page, '#sel_course', infoSearch['course'][0])
  }

  // campus
  if (infoSearch['campus'] != '') {
    if (infoSearch['campus'] == '서울') infoSearch['campus'] = [2]
    else if (infoSearch['campus'] == '안성') infoSearch['campus'] = [3]

    // select select tag
    await select_selectTag(page, '#sel_camp', infoSearch['campus'][0])
  }

  // college
  if (infoSearch['college'] != '') {
    // get length of select tag list
    length_SelectTag_List = await page.evaluate(() => {
      return document.querySelector('#sel_colg').children.length
    })
    // match with infoSearch
    for (var i = 0; i < length_SelectTag_List; i++) {
      // get string of item from select tag list
      string_SelectTag_Item = await page.evaluate(index => {
        return document
          .querySelector('#sel_colg')
          .children[index].innerText.trim()
      }, i)
      if (infoSearch['college'] == string_SelectTag_Item) break
    }

    infoSearch['college'] = [i + 1]

    // select select tag
    await select_selectTag(page, '#sel_colg', infoSearch['college'][0])
  }

  // major
  if (infoSearch['major'] != '') {
    // get length of select tag list
    length_SelectTag_List = await page.evaluate(() => {
      return document.querySelector('#sel_sust').children.length
    })

    // match with infoSearch
    for (var i = 0; i < length_SelectTag_List; i++) {
      // get string of item from select tag list
      string_SelectTag_Item = await page.evaluate(index => {
        return document
          .querySelector('#sel_sust')
          .children[index].innerText.trim()
      }, i)

      if (infoSearch['major'] == string_SelectTag_Item) break
    }

    infoSearch['major'] = [i + 1]

    // select select tag
    await select_selectTag(page, '#sel_sust', infoSearch['major'][0])
  }

  return infoSearch
}

/**
 *
 * @param {*} page
 * @param {*} infoSearch
 * fill in empty attribute of infoSearch with index 1~max
 */
async function fill_Empty_InfoSearch_withArray(page, infoSearch) {
  var length

  if (infoSearch['year'] == '') {
    // get num of option on select tag
    length = await page.evaluate(() => {
      return document.querySelector('#sel_year').children.length
    })
    // add index to searchInfo
    infoSearch['year'] = new Array()
    for (var i = 1; i <= length; i++) {
      infoSearch['year'].push(i)
    }
  }
  if (infoSearch['semester'] == '') {
    // get num of option on select tag
    length = await page.evaluate(() => {
      return document.querySelector('#sel_shtm').children.length
    })
    // add index to searchInfo
    infoSearch['semester'] = new Array()
    for (var i = 1; i <= length; i++) {
      infoSearch['semester'].push(i)
    }
  }
  if (infoSearch['course'] == '') {
    // get num of option on select tag
    length = await page.evaluate(() => {
      return document.querySelector('#sel_course').children.length
    })
    // add index to searchInfo
    infoSearch['course'] = new Array()
    for (var i = 1; i <= length; i++) {
      infoSearch['course'].push(i)
    }
  }
  if (infoSearch['campus'] == '') {
    // get num of option on select tag
    length = await page.evaluate(() => {
      return document.querySelector('#sel_camp').children.length
    })
    // add index to searchInfo
    infoSearch['campus'] = new Array()
    for (var i = 1; i <= length; i++) {
      infoSearch['campus'].push(i)
    }
  }
  if (infoSearch['college'] == '') {
    // get num of option on select tag
    length = await page.evaluate(() => {
      return document.querySelector('#sel_colg').children.length
    })
    // add index to searchInfo
    infoSearch['college'] = new Array()
    for (var i = 1; i <= length; i++) {
      infoSearch['college'].push(i)
    }
  }
  if (infoSearch['major'] == '') {
    // get num of option on select tag
    length = await page.evaluate(() => {
      return document.querySelector('#sel_sust').children.length
    })
    // add index to searchInfo
    infoSearch['major'] = new Array()
    for (var i = 1; i <= length; i++) {
      infoSearch['major'].push(i)
    }
  }

  return infoSearch
}

/**
 *
 * @param {*} page
 * @param {*} infoSearch
 * fill in select tag and click search to show class list
 */
async function scrap_ClassList_All(page, infoSearch) {
  var classListScraped = new Array()

  console.log(infoSearch)
  infoSearch = await change_InfoSearch_ToIndex_withArray(page, infoSearch)
  console.log(infoSearch)
  infoSearch = await fill_Empty_InfoSearch_withArray(page, infoSearch)
  console.log(infoSearch)
  console.log('Finished')

  for (var a = 0; a < infoSearch['year'].length; a++) {
    for (var b = 0; b < infoSearch['semester'].length; b++) {
      for (var c = 0; c < infoSearch['course'].length; c++) {
        for (var d = 0; d < infoSearch['campus'].length; d++) {
          for (var e = 0; e < infoSearch['college'].length; e++) {
            for (var f = 0; f < infoSearch['major'].length; f++) {
              console.log('loop')
              // set infoSearchItem
              var infoSearchItem = {
                year: infoSearch['year'][a],
                semester: infoSearch['semester'][b],
                course: infoSearch['course'][c],
                campus: infoSearch['campus'][d],
                college: infoSearch['college'][e],
                major: infoSearch['major'][f]
              }

              // search
              await search_ClassList(page, infoSearchItem)
              // scrap class list and merge with existing class list
              classListScraped.concat(await scrap_ClassList(page))
              console.log(classListScraped)
            }
          }
        }
      }
    }
  }

  return classListScraped
}

async function saveClassList(classListScraped) {
  var classListScrapedString = JSON.stringify(classListScraped)

  fs.writeFileSync(
    appRoot + '/resource/scraped/' + fileName,
    classListScrapedString
  )
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
  var classListScraped = await scrap_ClassList_All(page, searchInfo)

  // save class list
  await saveClassList(classListScraped)

  await page.screenshot({ path: 'example.png' })
  await browser.close()
})()
