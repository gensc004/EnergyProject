'use strict';

angular.module('energyProjectApp')
  .controller('MainCtrl', function ($scope, $http, socket) {
    $scope.awesomeThings = [];

    $http.get('/api/things').success(function(awesomeThings) {
      $scope.awesomeThings = awesomeThings;
      socket.syncUpdates('thing', $scope.awesomeThings);
    });

    $scope.solarData = [];

    $http.get('/api/SolarData').success(function(success) {
      console.log(success);
      for(var i = 0; i < success.payload.length; i++) {
        console.log(success.payload[i].value)
        $scope.solarData.push({
          c: [
            {v: new Date(success.payload[i].timestamp)},
            {v: success.payload[i].value},
            {v: success.payload[i].tags.unit},
            {v: success.payload[i].tags.dorm}
          ]
        })
      }
      socket.syncUpdates('SolarData', $scope.solarData);
    })

    $scope.chartObject = {};

        $scope.secondRow = [
            {v: new Date(2314, 2, 16)},
            {v: 13},
            {v: 'Lalibertines'},
            {v: 'They are very tall'},
            {v: 25},
            {v: 'Gallantors'},
            {v: 'First Encounter'}
        ];


        $scope.chartObject.type = "AnnotationChart";

        $scope.chartObject.data = {"cols": [
            {id: "month", label: "Seconds", type: "date"},
            {id: "kepler-data", label: "Kepler-22b mission", type: "number"},
            {id: "kepler-annot", label: "Kepler-22b Annotation Title", type: "string"},
            {id: "kepler-annot-body", label: "Kepler-22b Annotation Text", type: "string"},
        ], "rows": $scope.solarData};

        $scope.chartObject.options = {
            displayAnnotations: true
        };

    $scope.addThing = function() {
      if($scope.newThing === '') {
        return;
      }
      $http.post('/api/things', { name: $scope.newThing });
      $scope.newThing = '';
    };

    $scope.deleteThing = function(thing) {
      $http.delete('/api/things/' + thing._id);
    };
  
    $scope.$on('$destroy', function () {
      socket.unsyncUpdates('thing');
    });
    
    $scope.generator = function(num) {
      for (var i = 0; i < num; i++){
        var object = {
          "metric" : "power",
          "timestamp" : null,
          "value" : null,
          "tags" : {
            "unit" : "volts",
            "dorm" : "spooner",
            "floor" : 2,
            "room" : 200
          }
        };
        object.timestamp = new Date();
        object.value = Math.floor(Math.random() * 100);
        console.log(object.value)
        $http.post('/api/SolarData', object).success(function(success) {
          console.log(success)
        })
      }
    }
    
  });
