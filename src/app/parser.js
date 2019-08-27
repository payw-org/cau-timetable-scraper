var appRoot = require('app-root-path')
var fs = require('fs')

const parseCau = require(appRoot + '/src/module/parse-cau.js')

module.exports.run = fileName => {
  const scrapedData = JSON.parse(
    fs.readFileSync(appRoot + '/src/resource/scraped/' + fileName, 'utf8')
  )

  var courseArray = new Array()
  var course
  var classRoom_Time

  for (i = 0; i < scrapedData.length; i++) {
    course = new Object()
    classList = new Array()

    classRoom_Time = parseCau.parseClassRoom_Time(
      scrapedData[i]['강의실/강의시간']
    )

    // main data
    course.course_no = scrapedData[i]['과목번호-분반'].split('-')[0]
    course.class_no = scrapedData[i]['과목번호-분반'].split('-')[1]
    course.name = scrapedData[i]['과목명']
    course.instructor = scrapedData[i]['담당교수']
    course.room = classRoom_Time[0]
    course.time = classRoom_Time[1]

    // etc data
    course.college = scrapedData[i]['대학']
    course.subject = scrapedData[i]['개설학과']
    course.grade = scrapedData[i]['학년']
    course.course = scrapedData[i]['과정']
    course.type = scrapedData[i]['이수구분']
    course.unit = scrapedData[i]['학점']
    course.term = scrapedData[i]['시간']
    course.closed = scrapedData[i]['폐강']
    course.flexible = scrapedData[i]['유연학기']
    course.note = scrapedData[i]['비고']

    // file data
    course.year = String(fileName.split('-')[0])
    if (fileName.split('-')[1] == 0) course.semester = '1학기'
    if (fileName.split('-')[1] == 1) course.semester = '여름방학'
    if (fileName.split('-')[1] == 2) course.semester = '2학기'
    if (fileName.split('-')[1] == 3) course.semester = '겨울방학'
    course.theCourse = fileName.split('-')[2]
    course.campus = fileName.split('-')[3]
    console.log(course)

    if (course.room != '' && course.time != '') {
      // 재택강의 제거
      courseArray.push(course)
    }
  }

  courseArray = parseCau.parseToSend(courseArray)
  courseArray = parseCau.format(courseArray)

  parseCau.createFile(courseArray, fileName)

  return fileName
}
