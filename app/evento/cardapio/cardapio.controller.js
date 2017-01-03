(function() {
  'use strict';

  angular
    .module('dashboard')
    .controller('CardapioController', CardapioController);

  CardapioController.$inject = ['serverService', 'conversorService', 'ListManagerService', 'session'];

  function CardapioController(serverService, conversorService, ListManagerService, session) {
    const ID = session.user.id;
    var vm = this;

    vm.dados = {
      'Cardapio ': {
        '@xmlns': 'http://schemas.datacontract.org/2004/07/WcfServiceCasamento',
        'Descricao': '',
        'Id': 0,
        'Id_usuario_logado': ID,
        'Nome': ''
      }
    };
    vm.cardapios = [];

    vm.Adicionar = Adicionar;
    vm.Excluir = Excluir;

    Activate();

    ////////////////

    function Activate() {
      GetDados();
    }

    function Adicionar() {
      var dados = conversorService.Json2Xml(vm.dados, '');
      serverService.Request('CadastrarCardapio', dados).then(function(resp) {
        GetDados();
      });
    }

    function Excluir() {

    }

    function GetDados() {
      serverService.Get('RetornarCardapio', ID).then(function(resp) {
        /**
         * O servico conversorService retorna uma string
         * O angular converte de string para objeto
         */
        resp = angular.fromJson(conversorService.Xml2Json(resp.data, ''));
        vm.cardapios = resp.ArrayOfCardapio.Cardapio;
        console.log(resp);
      });
    }
  }
})();