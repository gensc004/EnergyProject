'use strict';

angular.module('energyProjectApp')
  .controller('MainCtrl', function ($scope, $http, socket, $q) {
    $scope.awesomeThings = [];


    $scope.putData = function() {
        var message = {
            metric: 'power',
            timestamp: Date.now(),
            tags: {
                units : 'kW/s',
                source : 'Solar-Panels-Somewhere',
            }
        }

        $http(
            {
                method: 'post', 
                url: "http://umm-energydev.oit.umn.edu:4242/api/put", 
                data: message, 
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': 'GET, PUT, POST, DELETE, OPTIONS',
                    'Access-Control-Max-Age': '1000',
                    'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With'
        }}).success(function(success) {
            console.log(success);
        }) 
    }



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
      if(num > 0) {
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
        var promise = $scope.generateSingle(object);
        promise.then(function(success) {
          $scope.generator(num - 1);
        })
      }
    }

    $scope.generateSingle = function(object) {
      var deferred = $q.defer()
      setTimeout(function() {
          $http.post('/api/SolarData', object).success(function(success) {
              console.log(success)
              deferred.resolve();
          })
        }, 1000
      )
      return deferred.promise;
    }

    $scope.options = {
            chart: {
                type: 'lineChart',
                height: 450,
                margin : {
                    top: 20,
                    right: 20,
                    bottom: 40,
                    left: 55
                },
                x: function(d){ return d.x; },
                y: function(d){ return d.y; },
                useInteractiveGuideline: true,
                dispatch: {
                    stateChange: function(e){ console.log("stateChange"); },
                    changeState: function(e){ console.log("changeState"); },
                    tooltipShow: function(e){ console.log("tooltipShow"); },
                    tooltipHide: function(e){ console.log("tooltipHide"); }
                },
                xAxis: {
                    axisLabel: 'Time (ms)'
                },
                yAxis: {
                    axisLabel: 'Watts',
                    tickFormat: function(d){
                        return d3.format('.02f')(d);
                    },
                    axisLabelDistance: 30
                },
                callback: function(chart){
                    console.log("!!! lineChart callback !!!");
                }
            },
            title: {
                enable: true,
                text: 'Title for Line Chart'
            },
            subtitle: {
                enable: true,
                text: 'Subtitle for simple line chart. Lorem ipsum dolor sit amet, at eam blandit sadipscing, vim adhuc sanctus disputando ex, cu usu affert alienum urbanitas.',
                css: {
                    'text-align': 'center',
                    'margin': '10px 13px 0px 7px'
                }
            },
            caption: {
                enable: true,
                html: '<b>Figure 1.</b> Lorem ipsum dolor sit amet, at eam blandit sadipscing, <span style="text-decoration: underline;">vim adhuc sanctus disputando ex</span>, cu usu affert alienum urbanitas. <i>Cum in purto erat, mea ne nominavi persecuti reformidans.</i> Docendi blandit abhorreant ea has, minim tantas alterum pro eu. <span style="color: darkred;">Exerci graeci ad vix, elit tacimates ea duo</span>. Id mel eruditi fuisset. Stet vidit patrioque in pro, eum ex veri verterem abhorreant, id unum oportere intellegam nec<sup>[1, <a href="https://github.com/krispo/angular-nvd3" target="_blank">2</a>, 3]</sup>.',
                css: {
                    'text-align': 'justify',
                    'margin': '10px 13px 0px 7px'
                }
            }
        };

        $scope.data = sinAndCos();

        /*Random Data Generator */
        function sinAndCos() {
            var sin = [],sin2 = [],
                cos = [];

            //Data is represented as an array of {x,y} pairs.
            for (var i = 0; i < 100; i++) {
                sin.push({x: i, y: Math.sin(i/10)});
                sin2.push({x: i, y: i % 10 == 5 ? null : Math.sin(i/10) *0.25 + 0.5});
                cos.push({x: i, y: .5 * Math.cos(i/10+ 2) + Math.random() / 10});
            }

            //Line chart data should be sent as an array of series objects.
            return [
                {
                    values: sin,      //values - represents the array of {x,y} data points
                    key: 'Sine Wave', //key  - the name of the series.
                    color: '#ff7f0e'  //color - optional: choose your own line color.
                },
                {
                    values: cos,
                    key: 'Cosine Wave',
                    color: '#2ca02c'
                },
                {
                    values: sin2,
                    key: 'Another sine wave',
                    color: '#7777ff',
                    area: true      //area - set to true if you want this line to turn into a filled area chart.
                }
            ];
        };

    
  });
