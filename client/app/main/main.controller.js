'use strict';
angular.module('energyProjectApp')
  .controller('MainCtrl', function ($scope, $http, socket, $q) {
    $scope.startDate = new Date();
    $scope.endDate = new Date();
    $scope.hideSidenav = true;
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

    $scope.downsample = '30s-avg';
    $scope.energyType = '*';
    $scope.energyTypes = ['GDSP1','GDSP2','GDSP3','SciSP67'];
    $scope.searchByType = false;
    $scope.queryProgress = 0;
    $scope.queryTotal = 0;
    $scope.getData = function() {
        $scope.queryProgress = 0;
        $scope.queryTotal = 0;
        console.log($scope.searchByType)
        var searchTag;
        $scope.chartObject.data.rows = [];
        if($scope.searchByType) {
           searchTag = '{source=' + $scope.energyType + '}';
        } else {
            searchTag = '';
        }
        $http(
            {
                method: 'get',
                url: 'http://umm-energydev.oit.umn.edu:4242/api/query?start=' + $scope.formatDate($scope.startDate, '00:00:00') + '&end=' + $scope.formatDate($scope.endDate, '23:59:59') + '&m=avg:' + $scope.downsample + ':energy' + searchTag
        }).success(function(success) {
            var promise = count(success[0].dps);
            promise.then(function(count) {
                $scope.queryTotal = count;
                console.log($scope.queryTotal)
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
                    $scope.queryProgress++;
                    $scope.queryTotal = ($scope.queryProgress / 1000) * 100;
                    console.log($scope.queryTotal)
                }
            })
        });
    };

    var count = function(ob) {
        var promise = $q.defer();
        var count = 0;
        for(var prop in ob) {
            count++;
        }
        promise.resolve(count);
        return promise.promise;
    }

    $scope.formatDate = function(date, time) {
        console.log(date);
        var month = ((date.getMonth() + 1) < 10)?('0' + (date.getMonth() + 1)):(date.getMonth() + 1);
        var day = (date.getDate() < 10)?('0' + date.getDate()):date.getDate();
        console.log(day)
        //return date.getFullYear() + '/' + month + '/' + day + '-' + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds()
        return date.getFullYear() + '/' + month + '/' + day + '-' + time;

    }
  });
