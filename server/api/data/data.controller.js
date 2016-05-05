'use strict';

var _ = require('lodash');
var request = require('request');
exports.test = function (req, res) {
  req.param("url")
  var url = req.param("url") 
  console.log(url)
  request.get(url, function(err, httpResponse, body) {
    var rows = []
    body = JSON.parse(body);
    console.log(body)
    for(var property in body[0].dps) {
        rows.push({
          "c": [
            {
              "v": (new Date(property * 1000)).toString()
            },
            {
              "v": body[0].dps[property],
            }
          ]
        })
    }

    res.send(rows);
  })
}