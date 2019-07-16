var exports = (module.exports = {})

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

exports.change_InfoSearch_ToIndex_withArray = change_InfoSearch_ToIndex_withArray
exports.fill_InfoSearch_WithArray = fill_InfoSearch_WithArray
