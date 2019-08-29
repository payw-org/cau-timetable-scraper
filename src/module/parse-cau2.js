var app_path = '/home/bitnami/app/dev-hcj'

/**
 *
 * @param {JSON} src
 * @param {String} title
 */
function createFile(src, title) {
  src = JSON.stringify(src)
  var fs = require('fs')
  fs.writeFileSync(app_path + '/server/resources/' + title, src, {
    encoding: 'utf8',
    flag: 'w'
  })
}

function parseDayToDay(src) {
  if (src == '월') return 'MON'
  if (src == '화') return 'TUE'
  if (src == '수') return 'WED'
  if (src == '목') return 'THU'
  if (src == '금') return 'FRI'
  if (src == '토') return 'SAT'
  if (src == '일') return 'SUN'
  return 'ErrorDay'
}

function parseIntToTime(num) {
  if (num < 10) num = '0' + num + '30'
  else num = num + '30'
  return num
}

function testData(data_scrap) {
  let temp
  for (let i = 0; i < data_scrap.length; i++) {
    temp = data_scrap[i]['강의시간/강의실']

    if (temp != '') {
      console.log(temp)
      temp = temp.match(/\(\d\d?-\d\d?\)|\(\d\d?\)/g)
      console.log('>' + temp)
    }
    console.log('')
  }
}

function parseToLocations(src) {
  let result = new Object()
  let locations = new Array()
  let srcOrigin = src
  let error = false

  let location
  let gwan, ho

  let hoRegEx = /\d\d\d(?:-\d|)(?=(?:-\d)|호)/g
  let gwanRegEx = /^\d\d\d(?=관)/g

  // get ho array
  ho = src.match(hoRegEx)

  // remove ho from src
  src = src.replace(hoRegEx, '')

  // get gwan array
  gwan = src.match(gwanRegEx)

  // remove gwan from src
  src = src.replace(gwanRegEx, '')

  if (gwan != null && ho != null) {
    // match gwan with ho
    if (ho.length == gwan.length && ho.length != 0 && gwan.length != 0) {
      for (let i = 0; i < ho.length; i++) {
        if (gwan[i] == '805') gwan[i] = '805-806'
        location = new Object()
        location.building = gwan[i]
        location.room = ho[i]
        locations.push(location)
      }
    } else if (ho.length > gwan.length && ho.length != 0 && gwan.length != 0) {
      if (ho.length - gwan.length == 1 && gwan.length == 1) {
        gwan.push(gwan[0])
        for (let i = 0; i < ho.length; i++) {
          if (gwan[i] == '805') gwan[i] = '805-806'

          location = new Object()
          location.building = gwan[i]
          location.room = ho[i]
          locations.push(location)
        }
      }
    } else {
      error = true
    }
  } else {
    console.log(gwan + ' ' + ho)
    error = true
  }

  result.locations = locations
  result.srcOrigin = srcOrigin
  result.rest = src
  result.error = error

  return result
}

function parseToTimes(src) {
  let result = new Object()
  let times = new Array()
  let srcOrigin = src
  let error = false

  let time
  let day, number, start, end

  let numberRegEx = /[월화수목금토일]\d\d?(?:,\d\d?|)*(?!\d)(?!\:)/g
  let number2RegEx = /[월화수목금토일](?:\(|)\d\d:\d\d~\d\d:\d\d/g
  let dayRegEx = /[월화수목금토일]/g
  let startRegEx = /^\d\d?/
  let start2RegEx = /\d\d:\d\d(?=~)/
  let endRegEx = /\d\d?$/
  let end2RegEx = /\d\d:\d\d$/

  if (src == undefined) {
    result.times = times
    result.srcOrigin = srcOrigin
    result.rest = src
    result.error = true
    return result
  }

  // get day array
  number = src.match(numberRegEx)

  number2 = src.match(number2RegEx)

  if (number2 != null) {
    for (let i = 0; i < number2.length; i++) {
      time = new Object()

      day = number2[i].match(dayRegEx)
      number2[i] = number2[i].replace(dayRegEx, '')
      start = number2[i].match(start2RegEx)
      start = start[0].replace(':', '')
      end = number2[i].match(end2RegEx)
      end = end[0].replace(':', '')

      time.day = parseDayToDay(day)
      time.start = start
      time.end = end
      times.push(time)
    }
  }

  if (number != null) {
    for (let i = 0; i < number.length; i++) {
      time = new Object()

      day = number[i].match(dayRegEx)
      number[i] = number[i].replace(dayRegEx, '')
      start = parseInt(number[i].match(startRegEx), 10) + 8
      start = parseIntToTime(start)
      end = parseInt(number[i].match(endRegEx), 10) + 9
      end = parseIntToTime(end)

      time.day = parseDayToDay(day)
      time.start = start
      time.end = end
      times.push(time)
    }
  }

  if (number == null && number2 == null) {
    error = true
  }

  result.times = times
  result.srcOrigin = srcOrigin
  result.rest = src
  result.error = error

  return result
}

module.exports.parseToTimes = parseToTimes
module.exports.createFile = createFile
module.exports.parseDayToDay = parseDayToDay
module.exports.parseIntToTime = parseIntToTime
module.exports.testData = testData
module.exports.parseToLocations = parseToLocations