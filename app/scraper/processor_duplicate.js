const fs = require('fs')
const appRoot = require('app-root-path')
const fileName = '/resource/scraped/2019-2-학부-서울--'

var data = JSON.parse(fs.readFileSync(appRoot + fileName + '.json', 'utf-8'))

function arrIndexOf(arr, item) {
  var length = arr.length
  for (var i = 0; i < arr.length; i++) {
    if (
      arr[i]['과목번호-분반'] == item['과목번호-분반'] &&
      arr[i]['과목명'] == item['과목명'] &&
      arr[i]['담당교수'] == item['담당교수'] &&
      arr[i]['강의실/강의시간'] == item['강의실/강의시간']
    ) {
      break
    }
  }
  return i
}

async function delete_duplicate(data) {
  var a = new Array()

  return await data.filter((item, index) => {
    return arrIndexOf(data, item) == index
  })
}

;(async function() {
  data = await delete_duplicate(data)

  fs.writeFileSync(appRoot + fileName + 'done.json', JSON.stringify(data))
})()
