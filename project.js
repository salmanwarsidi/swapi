app = angular.module("swapi", ['ngRoute']);

app.controller("MainController", function($scope, $http, $route, $routeParams, $location){
  
  $scope.items = [];
  $scope.loading = false;
  $scope.end=false;
  
  $scope.url="http://swapi.co/api/people/?format=json";
  $scope.more = function(){
    if($scope.end){
      $scope.loading = false;
      return false;
    } 
    $http({
      method: "GET",
      url: $scope.url
    }).success(function(data){
      var currentId = $routeParams.id;
      if($scope.url==data.next) return false;
      angular.forEach(data.results, function(value, key) {
        var new_data=value;
        var peopleID = new_data.url.replace(/^\D+|\D+$/g, "");
        new_data.peopleID=peopleID;
        if(new_data.species[0]!=undefined){
          $http({method: "GET",url: new_data.species[0]+'?format=json'}).success(function(data2){
            new_data.species_name=data2.name;
          });          
        }
        else{
            new_data.species_name='Unknown';
        }
            $scope.items.push(new_data);
      });
      $scope.loading = false;
      $scope.url=data.next;        
      if(data.next==null){
        $scope.end=true;
      }
      $scope.loading = false;
    });
  };
  
  $scope.more();
});
app.controller('DetailController', function($scope, $routeParams, $http) {
     $scope.itemDetails = [];
     $scope.name = "DetailController";
     $scope.params = $routeParams;
      $http({method: "GET",url:"http://swapi.co/api/people/"+$scope.params.peopleID+"/?format=json"}).success(function(data){
        $scope.itemDetails=data;
        if(data.species[0]!=undefined){
          $http({method: "GET",url:data.species[0]+"?format=json"}).success(function(spec){
            $scope.itemDetails.species_name=spec.name;
          });          
        }
        else{
            $scope.itemDetails.species_name='Unknown';
        }
      });    
      $scope.back=function() {
        window.history.back();
      };
});
app.controller('ListController', function($scope, $routeParams) {
     $scope.name = "ListController";
     $scope.params = $routeParams;
});
app.config(function($routeProvider, $locationProvider) {
  $routeProvider
  .when('/detail/:peopleID', {
    templateUrl: 'detail.html',
    controller: 'DetailController'
  })
  .when('/', {
    templateUrl: 'list.html',
    controller: 'ListController'
  });

  $locationProvider.html5Mode(true);
});

app.directive("whenScrolled", function(){
  return{
    
    restrict: 'A',
    link: function(scope, elem, attrs){
    
      raw = elem[0];
    
      elem.bind("scroll", function(){
        if(raw.scrollTop+raw.offsetHeight+5 >= raw.scrollHeight){
          scope.loading = true;
          
          scope.$apply(attrs.whenScrolled);
        }
      });
    }
  }
});