const axios = require('axios')
const appRoot = require('app-root-path')
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
 
var j = schedule.scheduleJob('*/30 * * * * *', async function(){
  console.log('Play!')
  await scraper.run()
  await duplicateDeletor.run()
  parser.run()
  console.log('Done')
});