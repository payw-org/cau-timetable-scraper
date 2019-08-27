const axios = require('axios')
const appRoot = require('app-root-path')
const fs = require('fs')
const schedule = require('node-schedule')

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

function getDataName() {
  var paramList = Object.getOwnPropertyNames(searchInfo)
  var dataName = ''

  for (var i = 0; i < paramList.length; i++) {
    dataName += searchInfo[paramList[i]]
    if (i + 1 < paramList.length) dataName += '-'
    else dataName += '.json'
  }

  return dataName
}

// dev-mode
;(async () => {
  console.log('Play!')
  var fileNameReturn = await scraper.run()
  console.log('a')
  if (fileNameReturn != null) {
    console.log('Scraped new data')
    fileNameReturn = await duplicateDeletor.run(fileNameReturn)
    fileNameReturn = await parser.run(fileNameReturn)
  }
  console.log('Done')
})()
// var j = schedule.scheduleJob('20 46 * * * *', async function() {
//   console.log('Play!')
//   var fileNameReturn
//   fileNameReturn = await scraper.run()
//   if (fileNameReturn != null) {
//     console.log('Scraped new data')
//     fileNameReturn = await duplicateDeletor.run(fileNameReturn)
//     fileNameReturn = await parser.run(fileNameReturn)
//   }
//   console.log('Done')
// })
