'use strict';
angular.module('energyProjectApp')
  .controller('MainCtrl', function ($scope, $http, socket, $q) {
    $scope.awesomeThings = [];
    $scope.myDate = new Date();
    $scope.chartObject = {
        "type": "LineChart",
        "displayed": false,
        "data": {
            "cols": [{
            "id": "week",
            "label": "Week",
            "type": "string",
            "p": {}
            },
            {
            "id": "data",
            "label": "Data",
            "type": "number",
            "p": {}
          }],
            "rows": []
        },
        "options": {
        "title": "Average Energy per week",
        "isStacked": "true",
        "fill": 20,
        "displayExactValues": true,
        "vAxis": {
              "title": "Pulse",
              "gridlines": {
                "count": 10
              }
            },
            "hAxis": {
              "title": "Start of Week"
            }
          },
        "formatters": {}
    }
    $scope.getData = function() {
        console.log($scope.formatDate($scope.myDate))

        $http(
            {
                method: 'get',
                url: 'http://umm-energydev.oit.umn.edu:4242/api/query?start=' + $scope.formatDate($scope.myDate) + '&m=avg:1w-avg:energy',
        }).success(function(success) {
            console.log(success[0]);
            for(var property in success[0].dps) {
                console.log(new Date(property * 1000))
                $scope.chartObject.data.rows.push({
                    "c": [
                      {
                        "v": (new Date(property * 1000)).toString()
                      },
                      {
                        "v": success[0].dps[property],
                      }
                    ]
                  })
            }
        });
    };

    $scope.formatDate = function(date) {
        var month = ((date.getMonth() + 1) < 10)?('0' + (date.getMonth() + 1)):(date.getMonth() + 1);
        var day = (date.getDay() < 10)?('0' + date.getDay()):date.getDay();
        return date.getFullYear() + '/' + month + '/' + day + '-' + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds()
    }
  });
