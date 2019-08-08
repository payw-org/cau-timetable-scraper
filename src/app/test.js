const appRoot = require('app-root-path')
const data = require(appRoot + '/src/config/searchInfo.json')

console.log(Object.getOwnPropertyNames(data))