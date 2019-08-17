var appRoot = require('app-root-path')
var fs = require('fs')

const parseCau = require(appRoot + '/src/module/parse-cau.js')


module.exports.run = (fileName) => {
  const scrapedData = JSON.parse(fs.readFileSync(appRoot + '/src/resource/scraped/' + fileName,'utf8'))
  var courseArray = new Array()

  var course
  
  var classId_DivNo
  var className
  var classInstructor
  var classRoom_Time
  var classRoom
  
  for (i = 0; i < scrapedData.length; i++) {
    course = new Object()
    classId_DivNo = scrapedData[i]['과목번호-분반']
    className = scrapedData[i]['과목명']
    classInstructor = scrapedData[i]['담당교수']
    classRoom = scrapedData[i]['강의실/강의시간']
  
    classId_DivNo = classId_DivNo.split('-')
    classRoom_Time = parseCau.parseClassRoom_Time(classRoom)
  
    // main data
    course.course_no = classId_DivNo[0]
    course.class_no = classId_DivNo[1]
    course.name = className
    course.instructor = classInstructor
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

    if (course.room != '' && course.time != '') {
      // 재택강의 제거
      courseArray.push(course)
    }
  }
  
  courseArray = parseCau.parseToSend(courseArray)
  
  parseCau.createFile(courseArray,fileName)
  
  return fileName
}
