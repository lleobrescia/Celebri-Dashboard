angular.module("dashboard").controller('mainController', ['$scope', '$location', 'user', '$cookies', function ($scope, $location, user, $cookies) {

  $scope.checkTemplate = function () {
    var usuario = $cookies.getObject('user');

    if ("/login" == $location.path()) {
      $scope.login = "login";
      $scope.cabecalho = "";
    } else {
      if (usuario != null) {
        user = usuario;
      }
      $scope.login = "";
      $scope.cabecalho = "templates/parts/sidebar.html";
    }
  };

  //for ng-repeat
  $scope.getTimes = function (n) {
    return new Array(n);
  };
}]);