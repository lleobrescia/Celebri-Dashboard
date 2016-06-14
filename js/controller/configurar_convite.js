angular.module("dashboard").controller('configurar_convite', ['$scope', 'ConfiguracaoConvite', 'user', '$cookies', function ($scope, ConfiguracaoConvite, user, $cookies) {

  // evita conflito dentro das funcoes
  var self = this;

  //salva as informações do form dentro de user
  self.setLocalDados = function () {
    user.convite_dados.cerimonia_local = $scope.cerimonia_local;
    user.convite_dados.cerimonia_end = $scope.cerimonia_end;
    user.convite_dados.cerimonia_numero = $scope.cerimonia_numero;
    user.convite_dados.cerimonia_bairro = $scope.cerimonia_bairro;
    user.convite_dados.cerimonia_cidade = $scope.cerimonia_cidade;
    user.convite_dados.cerimonia_uf = $scope.cerimonia_uf;
    user.convite_dados.cerimonia_rota = $scope.cerimonia_rota;
    user.convite_dados.cerimonia_cep = $scope.cerimonia_cep;
    user.convite_dados.cerimonia_hora = $scope.cerimonia_hora;
    user.convite_dados.cerimonia_min = $scope.cerimonia_min;
    user.convite_dados.noiva_mae = $scope.noiva_mae;
    user.convite_dados.noiva_pai = $scope.noiva_pai;
    user.convite_dados.noivo_mae = $scope.noivo_mae;
    user.convite_dados.noivo_pai = $scope.noivo_pai;
    user.convite_dados.noiva_mae_memorian = $scope.noiva_mae_memorian;
    user.convite_dados.noiva_pai_memorian = $scope.noiva_pai_memorian;
    user.convite_dados.noivo_mae_memorian = $scope.noivo_mae_memorian;
    user.convite_dados.noivo_pai_memorian = $scope.noivo_pai_memorian;

    //Salva no cookie o Objeto user (que contem as informacoes globais)
    $cookies.putObject('user', user);
  };

  //pega as informações de user e coloca no $scope
  self.getLocalDados = function () {
    $scope.cerimonia_local = user.convite_dados.cerimonia_local;
    $scope.cerimonia_end = user.convite_dados.cerimonia_end;
    $scope.cerimonia_numero = user.convite_dados.cerimonia_numero;
    $scope.cerimonia_bairro = user.convite_dados.cerimonia_bairro;
    $scope.cerimonia_cidade = user.convite_dados.cerimonia_cidade;
    $scope.cerimonia_uf = user.convite_dados.cerimonia_uf;
    $scope.cerimonia_rota = user.convite_dados.cerimonia_rota;
    $scope.cerimonia_cep = user.convite_dados.cerimonia_cep;
    $scope.cerimonia_hora = user.convite_dados.cerimonia_hora;
    $scope.cerimonia_min = user.convite_dados.cerimonia_min;
    $scope.noiva_mae = user.convite_dados.noiva_mae;
    $scope.noiva_pai = user.convite_dados.noiva_pai;
    $scope.noivo_mae = user.convite_dados.noivo_mae;
    $scope.noivo_pai = user.convite_dados.noivo_pai;
    $scope.noiva_mae_memorian = user.convite_dados.noiva_mae_memorian;
    $scope.noiva_pai_memorian = user.convite_dados.noiva_pai_memorian;
    $scope.noivo_mae_memorian = user.convite_dados.noivo_mae_memorian;
    $scope.noivo_pai_memorian = user.convite_dados.noivo_pai_memorian;
  };

  //pega o CEP, usando um servico na internet (postmon)
  $scope.consultCEP = function () {
    var cep = $scope.cerimonia_cep.replace(/\./g, '');
    cep = cep.replace(/\-/g, '');
    if (cep.length > 7) {
      $.ajax({
        url: "http://api.postmon.com.br/v1/cep/" + cep,
        success: function (data) {
          $scope.cerimonia_end = data.logradouro;
          $scope.cerimonia_bairro = data.bairro;
          $scope.cerimonia_cidade = data.cidade;
          $scope.cerimonia_uf = data.estado;
        }
      });
    }
  };

  //pega os dados do servidor
  $scope.getDadosConvite = function () {
    ConfiguracaoConvite.getData(user.id).then(function (resp) {

      var respXml = $.parseXML(resp);
      var hora = $(respXml).find('Horario_cerimonia').text().split(':');

      $scope.cerimonia_local = $(respXml).find('Local_cerimonia').text();
      $scope.cerimonia_end = $(respXml).find('Endereco').text();
      $scope.cerimonia_numero = $(respXml).find('Numero').text();
      $scope.cerimonia_bairro = $(respXml).find('Bairro').text();
      $scope.cerimonia_cidade = $(respXml).find('Cidade').text();
      $scope.cerimonia_uf = $(respXml).find('Estado').text();
      $scope.cerimonia_rota = $(respXml).find('Tracar_rota_local').text();
      $scope.cerimonia_cep = $(respXml).find('Cep').text();
      $scope.cerimonia_hora = hora[0];

      if (hora[1] == "00") {
        $scope.cerimonia_min = "0";
      } else {
        $scope.cerimonia_min = hora[1];
      }

      $scope.noiva_mae = $(respXml).find('Mae_noiva').text();
      $scope.noiva_pai = $(respXml).find('Pai_noiva').text();
      $scope.noivo_mae = $(respXml).find('Mae_noivo').text();
      $scope.noivo_pai = $(respXml).find('Pai_noivo').text();
      $scope.noiva_mae_memorian = $(respXml).find('Mae_noiva_in_memoriam').text();
      $scope.noiva_pai_memorian = $(respXml).find('Pai_noiva_in_memoriam').text();
      $scope.noivo_mae_memorian = $(respXml).find('Mae_noivo_in_memoriam').text();
      $scope.noivo_pai_memorian = $(respXml).find('Pai_noivo_in_memoriam').text();

      self.setLocalDados();
    });
  };

  // salva os dados no servidor
  $scope.setDadosConvite = function () {
    var hora = $scope.cerimonia_hora + ":" + $scope.cerimonia_min;
    var xml = '<ConfiguracaoConvite xmlns="http://schemas.datacontract.org/2004/07/WcfServiceCasamento"><Bairro>' + $scope.cerimonia_bairro + '</Bairro><Cep>' + $scope.cerimonia_cep + '</Cep><Cidade>' + $scope.cerimonia_cidade + '</Cidade><Endereco>' + $scope.cerimonia_end + '</Endereco><Estado>' + $scope.cerimonia_uf + '</Estado><Horario_cerimonia>' + hora + '</Horario_cerimonia><Id_usuario_logado>' + user.id + '</Id_usuario_logado><Local_cerimonia>' + $scope.cerimonia_local + '</Local_cerimonia><Mae_noiva>' + $scope.noiva_mae + '</Mae_noiva><Mae_noiva_in_memoriam>' + $scope.noiva_mae_memorian + '</Mae_noiva_in_memoriam><Mae_noivo>' + $scope.noivo_mae + '</Mae_noivo><Mae_noivo_in_memoriam>' + $scope.noivo_mae_memorian + '</Mae_noivo_in_memoriam><Msg1></Msg1><Msg2></Msg2><Msg3></Msg3><Msg4></Msg4><Msg5></Msg5><Msg6></Msg6><Numero>' + $scope.cerimonia_numero + '</Numero><Obs></Obs><Pai_noiva>' + $scope.noiva_pai + '</Pai_noiva><Pai_noiva_in_memoriam>' + $scope.noiva_pai_memorian + '</Pai_noiva_in_memoriam><Pai_noivo>' + $scope.noivo_pai + '</Pai_noivo><Pai_noivo_in_memoriam>' + $scope.noivo_pai_memorian + '</Pai_noivo_in_memoriam><Pais></Pais><Tracar_rota_local>' + $scope.cerimonia_rota + '</Tracar_rota_local></ConfiguracaoConvite>';

    ConfiguracaoConvite.setData(xml);
    self.setLocalDados();
  };

  // setup/Contonstrutor
  user = $cookies.getObject('user');

  if (user.convite_dados.cerimonia_local == null || user.convite_dados.cerimonia_local == '') {
    $scope.getDadosConvite();
  } else {
    self.getLocalDados();
  }
}]);