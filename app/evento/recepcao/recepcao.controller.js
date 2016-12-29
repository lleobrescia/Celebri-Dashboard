// TODO: controle de erro
// TODO: Documentacao
// TODO: Set dados da cerimonia, quando necessario

/**
 * Recepção Controller
 * Usa os seguinte endpoints:
 *  - RetornarConfiguracaoEvento
 *  - ConfiguracaoEvento 
 * @namespace Controllers
 */
(function() {
  'use strict';

  angular
    .module('dashboard')
    .controller('RecepcaoController', RecepcaoController);

  RecepcaoController.$inject = ['serverService', 'conversorService'];

  function RecepcaoController(serverService, conversorService) {
    const ID = 1;
    var dadosAux = {
      'ConfiguracaoEvento': {
        '@xmlns': 'http://schemas.datacontract.org/2004/07/WcfServiceCasamento',
        '@xmlns:i': 'http://www.w3.org/2001/XMLSchema-instance',
        'Bairro': null,
        'Cep': null,
        'Cidade': null,
        'Endereco': null,
        'Estado': null,
        'Horario_festa': null,
        'Id_usuario_logado': ID,
        'Local_festa': null,
        'Mesmo_local_cerimonia': 'false',
        'Numero': null,
        'Obs': null,
        'Pais': null,
        'Tracar_rota_local': 'false'
      }
    };
    var vm = this;

    vm.carregando = true;
    vm.dados = [];
    vm.hasRecepcao = false;

    vm.Cancelar = GetDados;
    vm.SetDados = SetDados;

    Activate();

    ////////////////

    function Activate() {
      vm.dados = dadosAux.ConfiguracaoEvento;
      GetDados();
    }

    function GetDados() {
      vm.carregando = true;
      serverService.Get('RetornarConfiguracaoEvento', ID).then(function(resp) {
        /**
         * O servico conversorService retorna uma string
         * O angular converte de string para objeto
         */
        resp = angular.fromJson(conversorService.Xml2Json(resp.data, ''));

        /**
         * Se for o primeiro acesso, o servidor vai retornar um objeto
         */
        if (typeof(resp.ConfiguracaoEvento.Bairro) !== 'object') {
          vm.dados = dadosAux.ConfiguracaoEvento = resp.ConfiguracaoEvento;

          if (vm.dados.Bairro) {
            vm.hasRecepcao = true;
          }
        }

        vm.carregando = false;
      });
    }

    function SetDados() {
      vm.carregando = true;
      var dados = conversorService.Json2Xml(dadosAux, '');
      serverService.Request('ConfiguracaoEvento', dados).then(function(resp) {
        vm.carregando = false;
      });
    }
  }
})();