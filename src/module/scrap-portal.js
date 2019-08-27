const fs = require('fs')
const appRoot = require('app-root-path')

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
  await page.waitFor(1000)
}

/**
 *
 * @param {*} page
 * @param {*} selector
 * @param {*} index
 * select selectTag in page and delay
 */
async function select_selectTag(page, selector, index) {
  // wait
  await page.waitForSelector(selector + ' option:nth-child(' + index + ')')
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

  // await page.waitFor(30)
  await page.waitForFunction(
    'document.querySelector(".sp-loading-wrap").style.display != "block"',
    { polling: 'mutation', timeout: 0 }
  )
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
  await page.waitForFunction(
    'document.querySelector(".sp-loading-wrap").style.display != "block"',
    {
      polling: 'mutation',
      timeout: 0
    }
  )
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

  console.log('>> ' + length_ClassList + ' line would be scraped.')

  // scrap main data
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
        .children[0].children[1].children[0].children[index].children[10]
        .innerText
    }, i)

    // scrap etc data
    classItemScraped['대학'] = await page.evaluate(index => {
      return document.querySelector('.section-gap').children[0].children[0]
        .children[0].children[1].children[0].children[index].children[0]
        .innerText
    }, i)
    classItemScraped['개설학과'] = await page.evaluate(index => {
      return document.querySelector('.section-gap').children[0].children[0]
        .children[0].children[1].children[0].children[index].children[1]
        .innerText
    }, i)
    classItemScraped['학년'] = await page.evaluate(index => {
      return document.querySelector('.section-gap').children[0].children[0]
        .children[0].children[1].children[0].children[index].children[2]
        .innerText
    }, i)
    classItemScraped['과정'] = await page.evaluate(index => {
      return document.querySelector('.section-gap').children[0].children[0]
        .children[0].children[1].children[0].children[index].children[3]
        .innerText
    }, i)
    classItemScraped['이수구분'] = await page.evaluate(index => {
      return document.querySelector('.section-gap').children[0].children[0]
        .children[0].children[1].children[0].children[index].children[4]
        .innerText
    }, i)
    classItemScraped['학점'] = await page.evaluate(index => {
      return document
        .querySelector('.section-gap')
        .children[0].children[0].children[0].children[1].children[0].children[
          index
        ].children[7].innerText.split('-')[0]
    }, i)
    classItemScraped['시간'] = await page.evaluate(index => {
      return document
        .querySelector('.section-gap')
        .children[0].children[0].children[0].children[1].children[0].children[
          index
        ].children[7].innerText.split('-')[1]
    }, i)
    classItemScraped['폐강'] = await page.evaluate(index => {
      return document.querySelector('.section-gap').children[0].children[0]
        .children[0].children[1].children[0].children[index].children[9]
        .innerText
    }, i)
    classItemScraped['유연학기'] = await page.evaluate(index => {
      return document.querySelector('.section-gap').children[0].children[0]
        .children[0].children[1].children[0].children[index].children[11]
        .innerText
    }, i)
    classItemScraped['비고'] = await page.evaluate(index => {
      return document.querySelector('.section-gap').children[0].children[0]
        .children[0].children[1].children[0].children[index].children[12]
        .innerText
    }, i)

    classListScraped.push(classItemScraped)
    process.stdout.write('.')
  }

  return classListScraped
}

/**
 *
 * @param {*} page
 * @param {*} infoSearch
 * fill in select tag and click search to show class list
 */
async function scrap_ClassList_All(page, infoSearch) {
  var classListScraped = new Array()

  infoSearch = await change_InfoSearch_ToIndex_withArray(page, infoSearch)

  infoSearch = await fill_InfoSearch_WithArray(
    page,
    infoSearch,
    'year',
    '#sel_year'
  )
  for (var a = 0; a < infoSearch['year'].length; a++) {
    await select_selectTag(page, '#sel_year', infoSearch['year'][a])
    infoSearch = await fill_InfoSearch_WithArray(
      page,
      infoSearch,
      'semster',
      '#sel_shtm'
    )
    for (var b = 0; b < infoSearch['semester'].length; b++) {
      await select_selectTag(page, '#sel_shtm', infoSearch['semester'][b])
      infoSearch = await fill_InfoSearch_WithArray(
        page,
        infoSearch,
        'course',
        '#sel_course'
      )
      for (var c = 0; c < infoSearch['course'].length; c++) {
        await select_selectTag(page, '#sel_course', infoSearch['course'][c])
        infoSearch = await fill_InfoSearch_WithArray(
          page,
          infoSearch,
          'campus',
          '#sel_camp'
        )
        for (var d = 0; d < infoSearch['campus'].length; d++) {
          await select_selectTag(page, '#sel_camp', infoSearch['campus'][d])
          infoSearch = await fill_InfoSearch_WithArray(
            page,
            infoSearch,
            'college',
            '#sel_colg'
          )
          for (var e = 0; e < infoSearch['college'].length; e++) {
            await select_selectTag(page, '#sel_colg', infoSearch['college'][e])
            infoSearch = await fill_InfoSearch_WithArray(
              page,
              infoSearch,
              'major',
              '#sel_sust'
            )
            for (var f = 0; f < infoSearch['major'].length; f++) {
              // set infoSearchItem.
              var infoSearchItem = {
                year: infoSearch['year'][a],
                semester: infoSearch['semester'][b],
                course: infoSearch['course'][c],
                campus: infoSearch['campus'][d],
                college: infoSearch['college'][e],
                major: infoSearch['major'][f]
              }

              console.log('>> Search')
              // search
              await search_ClassList(page, infoSearchItem)
              // scrap class list and merge with existing class list
              classListScraped = classListScraped.concat(
                await scrap_ClassList(page)
              )
              console.log('>>')
              await page.screenshot({
                path:
                  appRoot +
                  '/src/screenshots/' +
                  infoSearch['year'][a] +
                  '-' +
                  infoSearch['semester'][b] +
                  '-' +
                  infoSearch['course'][c] +
                  '-' +
                  infoSearch['campus'][d] +
                  '-' +
                  infoSearch['college'][e] +
                  '-' +
                  infoSearch['major'][f] +
                  '.png'
              })
            }
            infoSearch['major'] = ''
          }
          infoSearch['college'] = ''
        }
        infoSearch['campus'] = ''
      }
      infoSearch['cours'] = ''
    }
    infoSearch['semester'] = ''
  }

  return classListScraped
}

async function saveClassList(classListScraped, fileName) {
  var classListScrapedString = JSON.stringify(classListScraped)
  fs.writeFileSync(
    appRoot + '/src/resource/scraped/' + fileName,
    classListScrapedString
  )
}

async function change_InfoSearch_ToIndex_withArray(page, infoSearchOrigin) {
  var string_SelectTag_Item
  var length_SelectTag_List
  var infoSearch = new Object()
  Object.assign(infoSearch, infoSearchOrigin)

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
async function fill_InfoSearch_WithArray(
  page,
  infoSearch,
  selector,
  selectorId
) {
  var length
  var i
  if (infoSearch[selector] == '') {
    // get num of option on select tag
    length = await page.evaluate(selectorId => {
      return document.querySelector(selectorId).children.length
    }, selectorId)

    // add index to searchInfo
    infoSearch[selector] = new Array()
    i = 1
    if (selector == 'campus' || selector == 'college' || selector == 'major')
      i++
    for (i; i <= length; i++) {
      infoSearch[selector].push(i)
    }
  }

  return infoSearch
}

function getDataName(data) {
  var paramList = Object.getOwnPropertyNames(data)
  var dataName = ''

  for (var i = 0; i < paramList.length; i++) {
    dataName += data[paramList[i]]
    if (i + 1 < paramList.length) dataName += '-'
    else dataName += '.json'
  }

  return dataName
}

module.exports.saveClassList = saveClassList
module.exports.scrap_ClassList_All = scrap_ClassList_All
module.exports.scrap_ClassList = scrap_ClassList
module.exports.search_ClassList = search_ClassList
module.exports.select_selectTag = select_selectTag
module.exports.loginAdmin = loginAdmin
module.exports.fill_InfoSearch_WithArray = fill_InfoSearch_WithArray
module.exports.change_InfoSearch_ToIndex_withArray = change_InfoSearch_ToIndex_withArray
module.exports.getDataName = getDataName
