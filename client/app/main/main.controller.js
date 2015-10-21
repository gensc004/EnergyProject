'use strict';

angular.module('energyProjectApp')
  .controller('MainCtrl', function ($scope, $http, socket) {
    $scope.awesomeThings = [];

    $http.get('/api/things').success(function(awesomeThings) {
      $scope.awesomeThings = awesomeThings;
      socket.syncUpdates('thing', $scope.awesomeThings);
    });

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
    
    function generator(num){
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
      
      for (var i = 0; i < num; i++){
        object.timestamp = new Date();
        object.value = int(Math.random() * 10);
      }
    }
    
  });
