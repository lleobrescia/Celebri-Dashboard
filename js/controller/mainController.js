angular.module("dashboard").controller('mainController', ['$scope', '$location','UserService', function ($scope, $location,UserService) {

  $scope.checkTemplate = function () {

    if ("/login" == $location.path()) {
      $scope.login = "login";
      $scope.cabecalho = "";
    } else {
      $scope.login = "";
      $scope.cabecalho = "templates/parts/sidebar.html";
    }
  };

  //for ng-repeat
  $scope.getTimes = function (n) {
    return new Array(n);
  };
}]);