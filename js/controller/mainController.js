angular.module("dashboard").controller('mainController', ['$scope', '$location', 'UserService', '$http', '$window',function ($scope, $location, UserService, $http,$window) {

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

  if (UserService.listaFonts == null) {
    //carrega as informações dos blocos(altura,largura, posicao) de cada convite
    $http.get('data/convites.json')
      .then(function (res) {
        try {
          UserService.dados.listaConvites = res.data;
        } catch (error) {
          $window.location.reload();
        }
      });

    //carrega as fonts
    $http.get('data/fonts.json')
      .then(function (res) {
        UserService.dados.listaFonts = res.data;
      });
    UserService.SaveState();
  }

}]);