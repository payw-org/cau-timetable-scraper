var app_path = require('app-root-path')

function parseIntToTime(src) {
  // parse int to time (##:00)
  src = src + 8
  if (src < 10) src = '0' + src
  src = src + ':00'
  return src.toString()
}

function parseDayToDay(src) {
  if (src == '월') return 1
  if (src == '화') return 2
  if (src == '수') return 3
  if (src == '목') return 4
  if (src == '금') return 5
  if (src == '토') return 6
  if (src == '일') return 7
  return 'Error'
}

function mergeTimes(src) {
  // 같은요일에 다른 강의실을 쓰는 경우는 없다고 가정
  var tempOfTime = new Array()
  var startOfTime = ''
  var endOfTime = ''
  var day = ''

  src.forEach(function(item, index) {
    // time integration

    if (day != item.substr(0, 1)) {
      // new day of week
      day = item.substr(0, 1)
      startOfTime = item.substr(0, 7) // include 'day' and '~'
    }

    if (
      index == src.length - 1 || // the last item
      day != src[index + 1].substr(0, 1) || // the last item in same day of week
      (day == src[index + 1].substr(0, 1) && // the last time in time
        parseInt(src[index].substr(1, 2)) >=
          parseInt(src[index + 1].substr(1, 2)))
    ) {
      endOfTime = item.substr(7, 5)
      tempOfTime.push(startOfTime + endOfTime)
      day = ''
    }
  })
  return tempOfTime
}

function mergeRooms(ho, gwan) {
  ho.forEach(function(item, index) {
    if (gwan[index % gwan.length] == null || item == null) return null
    ho[index] = gwan[index % gwan.length] + ' ' + item
  })
  return ho
}

function duplicateRoom(room, time) {
  var numOfRoom = room.length
  var numOfTime = time.length
  var i
  for (i = 0; i < numOfTime - numOfRoom; i++) {
    room.push(room[numOfRoom - 1])
  }
  return room
}

function parseClassRoom_Time(src) {
  var result = new Array()
  var gwan = new Array()
  var ho = new Array()
  var time = new Array()
  var num
  var tempOfTime
  var tempOfRoom
  var partOfTimeInt
  var temp, item, item2
  var day

  if ((temp = src.match(/\d\d\d관/g)) != null) {
    temp.forEach(function(item, index) {
      tempOfRoom = item
      gwan.push(tempOfRoom)
    })
  }
  if ((temp = src.match(/(?:[A-z]|)\d\d\d(?:-\d|)호/g)) != null) {
    temp.forEach(function(item, index) {
      tempOfRoom = item
      ho.push(tempOfRoom)
    })
  }
  if ((temp = src.match(/(?:[A-z]|)\d\d\d-\d[^호]/g)) != null) {
    temp.forEach(function(item, index) {
      tempOfRoom = item.substr(0, item.length - 1) + '호'
      ho.push(tempOfRoom)
    })
  }

  if ((temp = src.match(/[월화수목금토일]\d\d:\d\d~\d\d:\d\d/g)) != null) {
    for (var i = 0; i < temp.length; i++) {
      item = temp[i]
      day = /[월화수목금토일]/.exec(item)[0]
      src = src.replace(day, day + ' ')
    }
  }

  if ((temp = src.match(/[월화수목금토일]\d+(?:,\d+)*/g)) != null) {
    for (var i = 0; i < temp.length; i++) {
      item = temp[i]
      day = /[월화수목금토일]/.exec(item)[0]
      item = item.split(',')
      for (var j = 0; j < item.length; j++) {
        item2 = item[j]
        partOfTimeInt = parseInt(/\d+/.exec(item2)[0])
        tempOfTime =
          day +
          parseIntToTime(partOfTimeInt) +
          '~' +
          parseIntToTime(partOfTimeInt + 1) // 월09:00~10:00 ...
        time.push(tempOfTime)
      }
    }
  }

  if ((temp = src.match(/[월화수목금토일].\d\d:\d\d~\d\d:\d\d/g)) != null) {
    for (var i = 0; i < temp.length; i++) {
      item = temp[i]
      day = /[월화수목금토일]/.exec(item)[0]
      tempOfTime = item.replace(/[월화수목금토일]./, day)
      time.push(tempOfTime)
    }
  }

  ho = mergeRooms(ho, gwan)
  time = mergeTimes(time)
  ho = duplicateRoom(ho, time)

  ho.forEach(function(item, index) {
    if (/\d\d\d관 (?:[A-z]|)\d\d\d(?:-\d|)호/.test(item) == false) {
      console.log(' - Error ' + item)
      console.log(src)
      ho = ''
    }
  })
  time.forEach(function(item, index) {
    if (/[월화수목금토일]\d\d:\d\d~\d\d:\d\d/.test(item) == false) {
      console.log(' - Error ' + item)
      console.log(src)
      time = ''
    }
  })
  if (ho == null) ho = ''
  if (time == null) time = ''

  result.push(ho)
  result.push(time)
  return result
}

function parseToSend(src) {
  var newSrc = new Array()
  var course
  var location
  var time
  src.forEach(function(item, index) {
    course = new Object()

    course.classId = item['course_no'] + '-' + item['class_no']
    course.name = item['name']
    course.instructor = item['instructor']

    // etc data
    course.college = item['college']
    course.subject = item['subject']
    course.grade = item['grade']
    course.course = item['course']
    course.type = item['type']
    course.unit = item['unit']
    course.term = item['term']
    if (item['closed'] == '폐강') course.closed = true
    else course.closed = false
    course.flexible = item['flexible']
    course.note = item['note']

    course.locations = new Array()
    item['room'].forEach(function(item2, index) {
      location = new Object()
      location.building = /\d\d\d관/.exec(item2)[0].split('관')[0]
      location.room = /(?:[A-z]|)\d\d\d(?:-\d|)호/.exec(item2)[0].split('호')[0]
      course.locations.push(location)
    })

    course.times = new Array()
    item['time'].forEach(function(item2, index) {
      time = new Object()
      time.day = parseDayToDay(/[월화수목금토]/.exec(item2)[0])
      time.start = /\d\d:\d\d~/.exec(item2)[0].split('~')[0]
      time.end = /~\d\d:\d\d/.exec(item2)[0].split('~')[1]
      time.start = time.start.replace(':', '')
      time.end = time.end.replace(':', '')
      course.times.push(time)
    })

    newSrc.push(course)
  })
  return newSrc
}

function createFile(src, fileName) {
  src = JSON.stringify(src)
  var fs = require('fs')
  fileName = fileName.replace('done.json', 'complete.json')
  fs.writeFileSync(app_path + '/src/resource/parsed/' + fileName, src)
}

function getDataName(data) {
  var paramList = Object.getOwnPropertyNames(data)
  var dataName = ''

  for (var i = 0; i < paramList.length; i++) {
    dataName += searchInfo[paramList[i]]
    if (i + 1 < paramList.length) dataName += '-'
    else dataName += '.json'
  }

  return dataName
}

module.exports.createFile = createFile
module.exports.parseToSend = parseToSend
module.exports.parseClassRoom_Time = parseClassRoom_Time
module.exports.duplicateRoom = duplicateRoom
module.exports.mergeRooms = mergeRooms
module.exports.mergeTimes = mergeTimes
module.exports.parseDayToDay = parseDayToDay
module.exports.parseIntToTime = parseIntToTime
module.exports.getDataName = getDataName
