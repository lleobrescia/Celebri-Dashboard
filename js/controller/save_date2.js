angular.module("dashboard").controller('save_date2', ['$scope', 'user', '$cookies', 'SaveTheDate', 'Convidados', function ($scope, user, $cookies, SaveTheDate, Convidados) {

  $scope.selectedAll = false;
  $scope.allowToSend = false;

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

  $scope.checkConvidado = function (key, id, selected) {
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

    SaveTheDate.enviarEmail(xmlVar);
  };

  $scope.getConvidados = function () {

    if (user.id == null) {
      user = $cookies.getObject('user');
    }

    Convidados.getData(user.id).then(function (resp) {
      var respXml = $.parseXML(resp);
      $scope.convidado_lista = [];

      $(respXml).find('Convidado').each(function () {
        $scope.convidado_lista.push(
          {
            'Id': $(this).find('Id').text(),
            'nome': $(this).find('Nome').text(),
            'email': $(this).find('Email').text(),
            'Selected': false,
          }
        );
      });
    });
  };
  $scope.getConvidados();
}]);