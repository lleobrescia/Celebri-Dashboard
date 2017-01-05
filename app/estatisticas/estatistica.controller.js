(function () {
  'use strict';

  angular
    .module('dashboard')
    .controller('EstatisticaController', EstatisticaController);

  EstatisticaController.$inject = ['serverService', 'conversorService', 'session'];

  function EstatisticaController(serverService, conversorService, session) {
    const ID = session.user.id;
    var vm = this;

    vm.carregando = true;
    vm.convidadosGeralData = [];
    vm.convidadosGeralLabel = [];
    vm.dados = {
      'DadosEstatisticaCasamento': {
        '@xmlns': 'http://schemas.datacontract.org/2004/07/WcfServiceCasamento',
        '@xmlns:i': 'http://www.w3.org/2001/XMLSchema-instance',
        'total_acompanhantes': '',
        'total_acompanhantes_confirmados': '',
        'total_convidados': '',
        'total_convidados_confirmados': '',
        'total_convidados_somente_cerimonia': '',
        'total_convites_enviados_apenas_cerimonia': '',
        'total_convites_enviados_cerimonia_e_festa': '',
        'total_geral_convidados': '',
        'total_geral_convidados_confirmados': '',
        'total_save_the_date_enviados': ''
      }
    };
    vm.erro = false;

    Activate();

    ////////////////

    function Activate() {
      GetDados();
    }

    function GetDados() {
      serverService.Get('RetornarEstatisticaCasamento', ID).then(function (resp) {
        resp = angular.fromJson(conversorService.Xml2Json(resp.data, ''));
        vm.dados = resp;

        vm.convidadosGeralLabels = ['Convidados Direto', 'Acompanhantes'];
        vm.convidadosGeralData = [resp.DadosEstatisticaCasamento.total_convidados, resp.DadosEstatisticaCasamento.total_acompanhantes];

        vm.carregando = false;
      }).catch(function (error) {
        console.error('RetornarEstatisticaCasamento -> ', error);
        vm.carregando = false;
        vm.erro = true;
      });
    }
  }
})();