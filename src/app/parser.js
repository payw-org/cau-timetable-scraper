var appRoot = require('app-root-path')
const parseCau = require(appRoot + '/src/module/parse-cau.js')
const scrapedData = require(appRoot +
  '/src/resource/scraped/2019-2-학부-서울-소프트웨어대학-.json')


module.exports.run = async () => {
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
  
    course.course_no = classId_DivNo[0]
    course.class_no = classId_DivNo[1]
    course.name = className
    course.instructor = classInstructor
    course.room = classRoom_Time[0]
    course.time = classRoom_Time[1]
  
    if (course.room != '' && course.time != '') {
      // 재택강의 제거
      courseArray.push(course)
    }
  }
  
  courseArray = parseCau.parseToSend(courseArray)
  
  parseCau.createFile(courseArray)
  
}
