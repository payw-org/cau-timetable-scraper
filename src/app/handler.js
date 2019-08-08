// const axios = require('axios')
const appRoot = require('app-root-path')
const fs = require('fs')
const scraper = require(appRoot + '/src/app/scraper.js')
const parser = require(appRoot + '/src/app/parser.js')
const duplicateDeletor = require(appRoot + '/src/app/duplicate-deletor.js')

// const processedData = require(appRoot +
//   '/src/resource/parsed/2019-2-학부-서울--done')

// axios({
//   url: 'https://api.eodiro.com/aaaaa',
//   method: 'get',
//   data: {
//     result: processedData
//   }
// })

var schedule = require('node-schedule');
function getDataName(){
  var searchInfo = JSON.parse(fs.readFileSync(appRoot + '/src/config/searchInfo.json','utf8'))
  var paramList = Object.getOwnPropertyNames(searchInfo)
  var dataName = ""
  
  for(var i=0; i<paramList.length; i++){
    dataName += searchInfo[paramList[i]]
    if(i+1 < paramList.length)
      dataName += '-'
    else
      dataName += '.json'
  }
  
  return dataName
}
 
var j = schedule.scheduleJob('*/30 * * * * *', async function(){
  console.log('Play!')
  await scraper.run()
  await duplicateDeletor.run()
  await parser.run()
  console.log('Done')
});