'use strict';
angular.module('energyProjectApp')
  .controller('MainCtrl', function ($scope, $http, socket, $q) {
    $scope.startDate = new Date();
    $scope.endDate = new Date();
    $scope.startDate.setFullYear($scope.endDate.getFullYear() - 1);
    $scope.test = function() {
        $http.get('api/energydata/test').success(function(success) {
        console.log('senpai')
        console.log(success);
    })
    }
    
    $scope.hideSidenav = true;
    $scope.downsample = 'minute';
    $scope.energyType = '*';
    $scope.energyTypes = ['GDSP1','GDSP2','GDSP3','SciSP67'];
    $scope.downsamples = [{name:'Month', query: '1n-avg'}, {name:'Week', query: '1w-avg'}, {name:'Day', query: '1d-avg'}, {name:'Hour', query: '1h-avg'}, {name:'Minute', query: '1m-avg'}];

    $scope.searchByType = false;
    $scope.queryProgress = 0;
    $scope.queryTotal = 0;
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
        "title": "Average Energy per " + $scope.downsample,
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
        $scope.queryProgress = 0;
        $scope.queryTotal = 0;
        var searchTag;
        $scope.chartObject.data.rows = [];
        if($scope.searchByType) {
           searchTag = '{source=' + $scope.energyType + '}';
        } else {
            searchTag = '';
        }

        var url = 'http://umm-energydev.oit.umn.edu:4242/api/query?start=' + $scope.formatDate($scope.startDate, '00:00:00') + '%26end=' + $scope.formatDate($scope.endDate, '23:59:59') + '%26m=sum:rate:' + $scope.downsample + ':energy' + searchTag;



        $http(
            {
                method: 'get',
                url: 'api/energydata/test?url=' + url
        }).success(function(success) {
            console.log(success);
            $scope.chartObject.data.rows = success;
            // var promise = count(success[0].dps);
            // promise.then(function(count) {
            //     $scope.queryTotal = count;
            //     for(var property in success[0].dps) {
            //         $scope.chartObject.data.rows.push({
            //             "c": [
            //               {
            //                 "v": (new Date(property * 1000)).toString()
            //               },
            //               {
            //                 "v": success[0].dps[property],
            //               }
            //             ]
            //           })
            //         $scope.queryProgress++;
            //         $scope.queryTotal = ($scope.queryProgress / 1000) * 100;
            //     }
            // })
        });


        // $http(
        //     {
        //         method: 'get',
        //         url: 'http://umm-energydev.oit.umn.edu:4242/api/query?start=' + $scope.formatDate($scope.startDate, '00:00:00') + '&end=' + $scope.formatDate($scope.endDate, '23:59:59') + '&m=avg:' + $scope.downsample + ':energy' + searchTag
        // }).success(function(success) {
        //     var promise = count(success[0].dps);
        //     promise.then(function(count) {
        //         $scope.queryTotal = count;
        //         for(var property in success[0].dps) {
        //             $scope.chartObject.data.rows.push({
        //                 "c": [
        //                   {
        //                     "v": (new Date(property * 1000)).toString()
        //                   },
        //                   {
        //                     "v": success[0].dps[property],
        //                   }
        //                 ]
        //               })
        //             $scope.queryProgress++;
        //             $scope.queryTotal = ($scope.queryProgress / 1000) * 100;
        //         }
        //     })
        // });
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
        var month = ((date.getMonth() + 1) < 10)?('0' + (date.getMonth() + 1)):(date.getMonth() + 1);
        var day = (date.getDate() < 10)?('0' + date.getDate()):date.getDate();
        return date.getFullYear() + '/' + month + '/' + day + '-' + time;

    }
  });
