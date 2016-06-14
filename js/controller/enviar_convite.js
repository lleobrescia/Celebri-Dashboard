angular.module("dashboard").controller('enviar_convite', ['$scope', 'Convite', 'user', '$cookies', 'Convidados', function ($scope, Convite, user, $cookies, Convidados) {

  $scope.carregando = true;
  $scope.allowToSend = false;
  $scope.mensagem = false;

  $scope.convidado_lista = [];
  $scope.selecionados = [];

  $scope.checkAll = function () {
    if ($scope.selectedAll) {
      $scope.selectedAll = true;
      $scope.allowToSend = true;
    } else {
      $scope.selectedAll = false;
      $scope.allowToSend = false;
      $scope.selecionados = [];
    }
    angular.forEach($scope.convidado_lista, function (item) {
      item.Selected = $scope.selectedAll;

      if ($scope.selectedAll) {
        $scope.selecionados.push(item.Id);
      }
    });
  };

  $scope.checkConvidado = function (id, selected) {
    if (selected) {
      $scope.selecionados.push(id);
    } else {
      var count = 0;
      angular.forEach($scope.selecionados, function (item) {
        if (item == id) {
          $scope.selecionados.splice(count, 1);
        }
        count++;
      });
    }
    if ($scope.selecionados.length > 0) {
      $scope.allowToSend = true;
    } else {
      $scope.allowToSend = false;
    }
  };

  $scope.enviar = function () {
    var xmlVar = '<ListaEmailConvidados xmlns="http://schemas.datacontract.org/2004/07/WcfServiceCasamento">  <Id_casal>' + user.id + '</Id_casal>  <Id_convidado>';

    angular.forEach($scope.selecionados, function (item) {
      xmlVar += '<int xmlns="http://schemas.microsoft.com/2003/10/Serialization/Arrays">' + item + '</int>';
    });
    xmlVar += '</Id_convidado></ListaEmailConvidados>';

    Convite.enviarEmail(xmlVar).then(function (resp) {
      $scope.mensagem = true;
    });
  };

  $scope.getConvidados = function () {
    user = $cookies.getObject('user');

    Convidados.getData(user.id).then(function (resp) {
      var respXml = $.parseXML(resp);

      $(respXml).find('Convidado').each(function () {
        var status = "Enviado";
        if ($(this).find('ConviteEnviado').text() == 'false') status = "Não Enviado";

        $scope.convidado_lista.push(
          {
            'Id': $(this).find('Id').text(),
            'Nome': $(this).find('Nome').text(),
            'Email': $(this).find('Email').text(),
            'ConviteEnviado': status
          }
        );
      });
      $scope.carregando = false;
    });
  };

  $scope.getConvidados();
  $scope.senhaApp = user.senhaApp;
}]);