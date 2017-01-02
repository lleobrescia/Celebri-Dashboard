(function() {
  'use strict';

  angular
    .module('dashboard')
    .controller('CadastrarConvidadoController', CadastrarConvidadoController);

  CadastrarConvidadoController.$inject = ['serverService', 'conversorService', 'ListManagerService'];

  function CadastrarConvidadoController(serverService, conversorService, ListManagerService) {
    const ID = 1;
    var vm = this;

    vm.pessoas = [];
    vm.dados = {
      'Convidado  ': {
        '@xmlns': 'http://schemas.datacontract.org/2004/07/WcfServiceCasamento',
        "ConvidadoSomenteCerimonia": false,
        "ConviteEnviado": false,
        "Email": "",
        "Id": 0,
        "Id_usuario_logado": ID,
        "Nome": "",
        "Padrinho": false,
        "Qtde_Acompanhantes": 0,
        "SaveTheDateEnviado": false,
        "Senha": ""
      }
    };

    vm.Adicionar = Adicionar;
    vm.Excluir = Excluir;

    Activate();

    ////////////////

    function Activate() {
      GetDados();
    }

    function Adicionar() {
      var dados = conversorService.Json2Xml(vm.dados, '');
      serverService.Request('CadastroConvidados', dados).then(function(resp) {
        GetDados();
      });
    }

    function Excluir() {

    }

    function GetDados() {
      serverService.Get('RetornarConvidados', ID).then(function(resp) {
        /**
         * O servico conversorService retorna uma string
         * O angular converte de string para objeto
         */
        resp = angular.fromJson(conversorService.Xml2Json(resp.data, ''));

        if (resp.ArrayOfConvidado.Convidado.length > 1) {
          vm.pessoas = resp.ArrayOfConvidado.Convidado;
        } else {
          vm.pessoas = resp.ArrayOfConvidado;
        }

        delete vm.pessoas['@xmlns'];
        delete vm.pessoas['@xmlns:i'];
        console.log(vm.pessoas);
      });
    }
  }
})();