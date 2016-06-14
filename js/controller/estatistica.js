angular.module("dashboard").controller('estatistica', ['$scope', 'user', 'EstatisticaServ', '$cookies', function ($scope, user, EstatisticaServ, $cookies) {

  $scope.getEstatistica = function () {
    user = $cookies.getObject('user');

    EstatisticaServ.getData(user.id).then(function (resp) {
      var respXml = $.parseXML(resp);

      //emails enviados
      $scope.total_convites_enviados = $(respXml).find('total_convites_enviados_cerimonia_e_festa').text();

      //convidados cadastrados
      $scope.total_convidados = $(respXml).find('total_convidados').text();

      //convidados + acompanhantes
      $scope.total_geral_convidados = $(respXml).find('total_geral_convidados').text();

      //baixou o app
      $scope.total_confirmados = $(respXml).find('total_convidados_confirmados').text();

      $scope.total_acompanhantes = $(respXml).find('total_acompanhantes').text();


      $scope.convidados_geral_labels = ["Convidados Direto", "Acompanhantes"];
      $scope.convidados_geral_data = [$scope.total_convidados, $scope.total_acompanhantes];
    });
  };
  $scope.getEstatistica();

}]);