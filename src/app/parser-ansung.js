var appRoot = require('app-root-path')
var fs = require('fs')
var data_vender = 'cau2'

const parseCau = require(appRoot + '/src/module/parse-cau2.js')

module.exports.run = fileName => {
  const scrapedData = JSON.parse(
    fs.readFileSync(appRoot + '/src/resource/scraped/' + fileName, 'utf8')
  )
//
  let data_parse = new Array()
  let data_parse_error = new Array()
  
  let classInfo
  let classInfo_error
  let data_scrap_unit
  
  let resultOfParse
  let buildings = new Array()
  for (let i = 0; i < scrapedData.length; i++) {
    data_scrap_unit = scrapedData[i]
  
    // init classInfo
    classInfo = new Object()
    classInfo_error = null
  
    classInfo.class_id = data_scrap_unit['과목번호-분반'] // done.
    classInfo.name = data_scrap_unit['과목명'] // done.
    classInfo.instructor = data_scrap_unit['담당교수'] // done.
  
    // parse location
    resultOfParse = parseToLocations(data_scrap_unit['강의실/강의시간'])
    if (resultOfParse.error == false)
      classInfo.locations = resultOfParse.locations
    else {
      classInfo_error = new Object()
      classInfo_error.srcOrigin = data_scrap_unit['강의실/강의시간'] + 1
    }
  
    // parse time
    resultOfParse = parseToTimes(data_scrap_unit['강의실/강의시간'])
    if (resultOfParse.error == false) classInfo.times = resultOfParse.times
    else {
      classInfo_error = new Object()
      classInfo_error.srcOrigin = data_scrap_unit['강의실/강의시간'] + 2
    }
  
    // invalid data set
    if (
      classInfo_error == null &&
      classInfo.times.length < classInfo.locations.length
    ) {
      classInfo_error = new Object()
      classInfo_error.srcOrigin = data_scrap_unit['강의실/강의시간'] + 3
    }
  
    // the number of time is more than location
    if (
      classInfo_error == null &&
      classInfo.times.length > classInfo.locations.length
    ) {
      let diff = classInfo.times.length - classInfo.locations.length
      for (let i = 0; i < diff; i++) {
        classInfo.locations.push(
          classInfo.locations[classInfo.locations.length - 1]
        )
      }
    }
  
    if (classInfo_error == null) {
      data_parse.push(classInfo)
      if (buildings.includes(classInfo.locations[0].building) == false)
        buildings.push(classInfo.locations[0].building)
    }
    if (classInfo_error != null) {
      data_parse_error.push(classInfo_error)
    }
  }
  
  data_parse.vender = data_vender
  createFile(data_parse, '/parse/parse-' + data_vender + '.json')
  createFile(
    data_parse_error,
    '/parse-debug/parse-' + data_vender + '-error.json'
  )
  createFile(buildings, '/parse-debug/buildings-' + data_vender + '.json')
//  
  courseArray = parseCau.parseToSend(courseArray)
  courseArray = parseCau.format(courseArray)

  parseCau.createFile(courseArray, fileName)

  return fileName
}
