const fs = require('fs')
const appRoot = require('app-root-path')

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

module.exports.run = async function(fileName) {
  var scrapedData = JSON.parse(fs.readFileSync(appRoot + '/src/resource/scraped/' + fileName,'utf8'))
  scrapedData = await delete_duplicate(scrapedData)
  fileName = fileName.replace('.json','done.json')
  fs.writeFileSync(appRoot + '/src/resource/scraped/' + fileName, JSON.stringify(scrapedData))

  return fileName
}

module.exports.delete_duplicate = delete_duplicate
module.exports.arrIndexOf = arrIndexOf
