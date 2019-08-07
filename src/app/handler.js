const axios = require('axios')
const appRoot = require('app-root-path')
const schedule = require('node-schedule')

const processedData = require(appRoot +
  '/src/resource/parsed/2019-2-학부-서울--done')

axios({
  url: 'https://api.eodiro.com/aaaaa',
  method: 'get',
  data: {
    result: processedData
  }
})

const scrapSchedule = schedule.scheduleJob('10 * * * *', function() {
  console.log('매 10초에 실행')
})
