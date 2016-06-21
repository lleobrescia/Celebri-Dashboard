angular.module("dashboard").controller('estatistica', ['UserService', 'ipService', 'ServiceCasamento', function (UserService, ipService, ServiceCasamento) {

  var self = this;
  var ID = UserService.dados.ID;
  self.carregando = true;

  self.getEstatistica = function () {
    var urlVar = "http://" + ipService.ip + "/ServiceCasamento.svc/RetornarEstatisticaCasamento";
    var xmlVar = '<IdentificaocaoCasal xmlns="http://schemas.datacontract.org/2004/07/WcfServiceCasamento"><Id_casal>' + ID + '</Id_casal></IdentificaocaoCasal>';

    ServiceCasamento.SendData(urlVar, xmlVar).then(function (resp) {
      var respXml = $.parseXML(resp);

      //emails enviados
      self.total_convites_enviados = $(respXml).find('total_convites_enviados_cerimonia_e_festa').text();

      //convidados cadastrados
      self.total_convidados = $(respXml).find('total_convidados').text();

      //convidados + acompanhantes
      self.total_geral_convidados = $(respXml).find('total_geral_convidados').text();

      //baixou o app
      self.total_confirmados = $(respXml).find('total_convidados_confirmados').text();

      self.total_acompanhantes = $(respXml).find('total_acompanhantes').text();


      self.convidados_geral_labels = ["Convidados Direto", "Acompanhantes"];
      self.convidados_geral_data = [self.total_convidados, self.total_acompanhantes];

      self.carregando = false;
    });
  };
  self.getEstatistica();
}]);