(function() {
  'use strict';

  angular
    .module('dashboard')
    .controller('PresentesController', PresentesController);

  PresentesController.$inject = ['serverService', 'conversorService', 'ListManagerService'];

  function PresentesController(serverService, conversorService, ListManagerService) {
    const ID = 1;
    var vm = this;

    vm.dados = {
      'ConfiguracaoLojaPresentes ': {
        '@xmlns': 'http://schemas.datacontract.org/2004/07/WcfServiceCasamento',
        'Id': 0,
        'Id_usuario_logado': ID,
        'Nome': '',
        'Url': ''
      }
    };
    vm.presentes = [];

    vm.Adicionar = Adicionar;
    vm.Excluir = Excluir;

    Activate();

    ////////////////

    function Activate() {
      GetDados();
    }

    function Adicionar() {
      var dados = conversorService.Json2Xml(vm.dados, '');
      serverService.Request('ConfigAdicionalEvento_LojaPresentes', dados).then(function(resp) {
        GetDados();
      });
    }

    function Excluir() {

    }

    function GetDados() {
      serverService.Get('RetornarConfiguracaoLojaPresentes', ID).then(function(resp) {
        /**
         * O servico conversorService retorna uma string
         * O angular converte de string para objeto
         */
        resp = angular.fromJson(conversorService.Xml2Json(resp.data, ''));
        vm.presentes = resp.ArrayOfConfiguracaoLojaPresentes.ConfiguracaoLojaPresentes;
        console.log(resp);
      });
    }
  }
})();