angular.module("dashboard").controller('save_date', ['$scope', 'user', 'SaveTheDate', '$cookies', function ($scope, user, SaveTheDate, $cookies) {

  $scope.salvar = function () {
    var xmlVar = '<DadosFormatacaoSaveTheDate xmlns="http://schemas.datacontract.org/2004/07/WcfServiceCasamento">  <ErrorMessage></ErrorMessage>  <Result>true</Result>  <id_casal>' + user.id + '</id_casal>  <id_modelo>' + $scope.modelo + '</id_modelo>  <msg>' + $scope.mensagem + '</msg>  <nomecasal>' + user.dadosCasal.nome_noiva + ' e ' + user.dadosCasal.nome_noivo + '</nomecasal></DadosFormatacaoSaveTheDate>';

    user.saveDate.modelo = $scope.modelo;
    user.saveDate.mensagem = $scope.mensagem;

    $cookies.putObject('user', user);

    SaveTheDate.setData(xmlVar).then(function (resp) {
    });
  };

  $scope.getData = function () {

    SaveTheDate.getData(user.id).then(function (resp) {
      var respXml = $.parseXML(resp);

      $scope.modelo = $(respXml).find('id_modelo').text();
      $scope.mensagem = $(respXml).find('msg').text();

      if ($scope.modelo == 0) {
        $scope.modelo = 1;

        if (user.id == null) {
          user = $cookies.getObject('user');
        }

        try {
          var casamento = user.dadosCasal.data_casamento.split("/");
          var dataCasamento = casamento[1] + "/" + casamento[0] + "/" + casamento[2];
        } catch (error) {
          var dataCasamento = "00/00/0000";
        }

        $scope.mensagem = 'Em momentos especiais como este, não tinha como não lembrarmos de você! Dia ' + dataCasamento + ' é um dia marcante para nós, o dia do nosso casamento e gostaríamos de compartilhar este momento com você. Marque esta data no seu calendário para não se esquecer. A sua participação é muito importante para nós! \r\n Em breve você receberá por e-mail, o convite do nosso casamento.';

        $scope.salvar();
      } else {

        user.saveDate.modelo = $scope.modelo;
        user.saveDate.mensagem = $scope.mensagem;

        $cookies.putObject('user', user);
      }
    });
  };
  user = $cookies.getObject('user');
  if (user.saveDate.modelo == null) {
    $scope.getData();
  } else {
    $scope.modelo = user.saveDate.modelo;
    $scope.mensagem = user.saveDate.mensagem;
  }
}]);