(function () {
  'use strict';

  angular
    .module('dashboard')
    .controller('EstatisticaCtrl', EstatisticaCtrl)

  EstatisticaCtrl.$inject = ['UserService', 'ipService', 'ServiceCasamento'];
  function EstatisticaCtrl(UserService, ipService, ServiceCasamento) {
    var self  = this;
    var ID    = UserService.dados.ID;

    init();

    function init() {
      self.carregando = true;
      GetEstatistica();
    }

    function GetEstatistica() {
      var urlVar = 'http://' + ipService.ip + '/ServiceCasamento.svc/RetornarEstatisticaCasamento';
      var xmlVar = '<IdentificaocaoCasal xmlns="http://schemas.datacontract.org/2004/07/WcfServiceCasamento"><Id_casal>' + ID + '</Id_casal></IdentificaocaoCasal>';

      ServiceCasamento.SendData(urlVar, xmlVar).then(function (resp) {
        var respXml = $.parseXML(resp);

        //emails enviados
        self.totalConvitesEnviados = $(respXml).find('total_convites_enviados_cerimonia_e_festa').text();

        //convidados cadastrados
        var totalConvidados        = $(respXml).find('total_convidados').text();

        //convidados + acompanhantes
        self.totalGeralConvidados  = $(respXml).find('total_geral_convidados').text();

        //baixou o app
        self.totalConfirmados      = $(respXml).find('total_convidados_confirmados').text();

        var totalAcompanhantes     = $(respXml).find('total_acompanhantes').text();


        self.convidadosGeralLabels = ['Convidados Direto', 'Acompanhantes'];
        self.convidadosGeralData   = [totalConvidados, totalAcompanhantes];

        self.carregando            = false;
      });
    }
  }
} ());