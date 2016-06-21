angular.module("dashboard").controller('configurar_convite', ['UserService', 'ServiceCasamento', 'ipService', 'consultCEP', function (UserService, ServiceCasamento, ipService, consultCEP) {

  // evita conflito dentro das funcoes
  var self = this;

  var ID = UserService.dados.ID;

  //pega o CEP, usando um servico na internet (postmon)
  self.consultCEP = function (cep) {
    try {
      consultCEP.consultar(cep).then(function (data) {
        self.cerimonia_end = data.logradouro;
        self.cerimonia_bairro = data.bairro;
        self.cerimonia_cidade = data.cidade;
        self.cerimonia_uf = data.estado;
      });
    } catch (error) { }
  };

  self.salvarLocal = function () {
    UserService.dados.cerimonia_local = self.cerimonia_local;
    UserService.dados.cerimonia_end = self.cerimonia_end;
    UserService.dados.cerimonia_numero = self.cerimonia_numero;
    UserService.dados.cerimonia_bairro = self.cerimonia_bairro;
    UserService.dados.cerimonia_cidade = self.cerimonia_cidade;
    UserService.dados.cerimonia_uf = self.cerimonia_uf;
    UserService.dados.cerimonia_rota = self.cerimonia_rota;
    UserService.dados.cerimonia_cep = self.cerimonia_cep;
    UserService.dados.cerimonia_hora = self.cerimonia_hora;
    UserService.dados.cerimonia_min = self.cerimonia_min;

    UserService.dados.noiva_mae = self.noiva_mae;
    UserService.dados.noiva_pai = self.noiva_pai;
    UserService.dados.noivo_mae = self.noivo_mae;
    UserService.dados.noivo_pai = self.noivo_pai;
    UserService.dados.noiva_mae_memorian = self.noiva_mae_memorian;
    UserService.dados.noiva_pai_memorian = self.noiva_pai_memorian;
    UserService.dados.noivo_mae_memorian = self.noivo_mae_memorian;
    UserService.dados.noivo_pai_memorian = self.noivo_pai_memorian;
  };

  self.getLocal = function () {
    self.cerimonia_local = UserService.dados.cerimonia_local;
    self.cerimonia_end = UserService.dados.cerimonia_end;
    self.cerimonia_numero = UserService.dados.cerimonia_numero;
    self.cerimonia_bairro = UserService.dados.cerimonia_bairro;
    self.cerimonia_cidade = UserService.dados.cerimonia_cidade;
    self.cerimonia_uf = UserService.dados.cerimonia_uf;
    self.cerimonia_rota = UserService.dados.cerimonia_rota;
    self.cerimonia_cep = UserService.dados.cerimonia_cep;
    self.cerimonia_hora = UserService.dados.cerimonia_hora;
    self.cerimonia_min = UserService.dados.cerimonia_min;

    self.noiva_mae = UserService.dados.noiva_mae;
    self.noiva_pai = UserService.dados.noiva_pai;
    self.noivo_mae = UserService.dados.noivo_mae;
    self.noivo_pai = UserService.dados.noivo_pai;
    self.noiva_mae_memorian = UserService.dados.noiva_mae_memorian;
    self.noiva_pai_memorian = UserService.dados.noiva_pai_memorian;
    self.noivo_mae_memorian = UserService.dados.noivo_mae_memorian;
    self.noivo_pai_memorian = UserService.dados.noivo_pai_memorian;
  };

  //pega os dados do servidor
  self.getDadosConvite = function () {
    var urlVar = "http://" + ipService.ip + "/ServiceCasamento.svc/RetornarConfiguracaoConvite";
    var xmlVar = '<IdentificaocaoCasal xmlns="http://schemas.datacontract.org/2004/07/WcfServiceCasamento"><Id_casal>' + ID + '</Id_casal></IdentificaocaoCasal>';
    ServiceCasamento.SendData(urlVar, xmlVar).then(function (resp) {

      var respXml = $.parseXML(resp);
      var hora = $(respXml).find('Horario_cerimonia').text().split(':');

      self.cerimonia_local = $(respXml).find('Local_cerimonia').text();
      self.cerimonia_end = $(respXml).find('Endereco').text();
      self.cerimonia_numero = $(respXml).find('Numero').text();
      self.cerimonia_bairro = $(respXml).find('Bairro').text();
      self.cerimonia_cidade = $(respXml).find('Cidade').text();
      self.cerimonia_uf = $(respXml).find('Estado').text();
      self.cerimonia_rota = $(respXml).find('Tracar_rota_local').text();
      self.cerimonia_cep = $(respXml).find('Cep').text();
      self.cerimonia_hora = hora[0];

      if (hora[1] == "00") {
        self.cerimonia_min = "0";
      } else {
        self.cerimonia_min = hora[1];
      }

      self.noiva_mae = $(respXml).find('Mae_noiva').text();
      self.noiva_pai = $(respXml).find('Pai_noiva').text();
      self.noivo_mae = $(respXml).find('Mae_noivo').text();
      self.noivo_pai = $(respXml).find('Pai_noivo').text();
      self.noiva_mae_memorian = $(respXml).find('Mae_noiva_in_memoriam').text();
      self.noiva_pai_memorian = $(respXml).find('Pai_noiva_in_memoriam').text();
      self.noivo_mae_memorian = $(respXml).find('Mae_noivo_in_memoriam').text();
      self.noivo_pai_memorian = $(respXml).find('Pai_noivo_in_memoriam').text();

      self.salvarLocal();
    });
  };

  // salva os dados no servidor
  self.setDadosConvite = function () {
    var hora = self.cerimonia_hora + ":" + self.cerimonia_min;
    var urlVar = "http://" + ipService.ip + "/ServiceCasamento.svc/ConfiguracaoConvite";
    var xmlVar = '<ConfiguracaoConvite xmlns="http://schemas.datacontract.org/2004/07/WcfServiceCasamento"><Bairro>' + self.cerimonia_bairro + '</Bairro><Cep>' + self.cerimonia_cep + '</Cep><Cidade>' + self.cerimonia_cidade + '</Cidade><Endereco>' + self.cerimonia_end + '</Endereco><Estado>' + self.cerimonia_uf + '</Estado><Horario_cerimonia>' + hora + '</Horario_cerimonia><Id_usuario_logado>' + ID + '</Id_usuario_logado><Local_cerimonia>' + self.cerimonia_local + '</Local_cerimonia><Mae_noiva>' + self.noiva_mae + '</Mae_noiva><Mae_noiva_in_memoriam>' + self.noiva_mae_memorian + '</Mae_noiva_in_memoriam><Mae_noivo>' + self.noivo_mae + '</Mae_noivo><Mae_noivo_in_memoriam>' + self.noivo_mae_memorian + '</Mae_noivo_in_memoriam><Msg1></Msg1><Msg2></Msg2><Msg3></Msg3><Msg4></Msg4><Msg5></Msg5><Msg6></Msg6><Numero>' + self.cerimonia_numero + '</Numero><Obs></Obs><Pai_noiva>' + self.noiva_pai + '</Pai_noiva><Pai_noiva_in_memoriam>' + self.noiva_pai_memorian + '</Pai_noiva_in_memoriam><Pai_noivo>' + self.noivo_pai + '</Pai_noivo><Pai_noivo_in_memoriam>' + self.noivo_pai_memorian + '</Pai_noivo_in_memoriam><Pais></Pais><Tracar_rota_local>' + self.cerimonia_rota + '</Tracar_rota_local></ConfiguracaoConvite>';

    ServiceCasamento.SendData(urlVar, xmlVar);
    self.salvarLocal();
  };

  if (UserService.dados.conviteCheck) {
    self.getLocal();
  } else {
    self.getDadosConvite();
    UserService.dados.conviteCheck = true;
  }
}]);