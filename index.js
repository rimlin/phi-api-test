var http = require('http');
var async = require('async');
var request = require('request');
var moment = require('moment');
var fs = require('fs');

const N = 10

const makeRequest = (path) => {
  return (callback) => {
    var timeBefore = moment().valueOf()
    request(path, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        var time = moment().valueOf() - timeBefore
        callback(null, time)
      }
    })
  }
}

const makeParallel = (path) => {
  return (callback) => {
      async.parallel(Array(N).fill(makeRequest(`http://localhost:3000/${path}`)), (err, requestTimes) => {
        var midTime = (requestTimes.reduce((previousValue, currentValue) => {
          return previousValue + currentValue
        }, 0) / N)

        var val = `${moment().format()}| ${path}: ${midTime}ms`

        fs.appendFile("log", `${val} \n`, function(err) {
            console.log(val);
            callback()
        });

      })
  }
}


console.log('Start tests...')
fs.appendFile("log", `\n -------------new test------------- \n`, function(err) {
  async.parallel([
      makeParallel('api/app/weeks?user=heart-light-scent&appv=1.3'),
      makeParallel('api/app/weekreplay/31d9e0f6-90e1-4825-aca4-19f4fd0089d1?user=pen-development-measure&appv=1.3'),
      makeParallel('api/app/previousweeks/31d9e0f6-90e1-4825-aca4-19f4fd0089d1?user=pen-development-measure&appv=1.3'),
      makeParallel('api/app/weeks/79e630f2-beb1-473c-ac4e-dc8015728119?user=heart-light-scent&appv=1.3'),
  ], (err, res) => {
    console.log('End tests...')
  })
});
