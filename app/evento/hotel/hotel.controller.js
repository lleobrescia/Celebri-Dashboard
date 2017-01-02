(function() {
  'use strict';

  angular
    .module('dashboard')
    .controller('HotelController', HotelController);

  HotelController.$inject = ['serverService', 'conversorService', 'ListManagerService'];

  function HotelController(serverService, conversorService, ListManagerService) {
    const ID = 1;
    var vm = this;

    vm.dados = {
      'ConfiguracaoGenericaEndereco': {
        '@xmlns': 'http://schemas.datacontract.org/2004/07/WcfServiceCasamento',
        'Bairro': '',
        'Cidade': '',
        'CodigoArea': '',
        'Email': '',
        'Endereco': '',
        'Estado': '',
        'Id': '0',
        'Id_usuario_logado': ID,
        'Nome': '',
        'Numero': '',
        'Obs': '',
        'Pais': '',
        'Site': '',
        'Telefone': '',
        'TipoLogradouro': '',
        'Tracar_rota_local': ''
      }
    };
    vm.hoteis = [];
    vm.selecionados = [];

    vm.Adicionar = Adicionar;
    vm.Excluir = Excluir;

    Activate();

    ////////////////

    function Activate() {
      GetDados();
    }

    function Adicionar() {
      var dados = conversorService.Json2Xml(vm.dados, '');
      serverService.Request('ConfigAdicionalEvento_ListaHoteis', dados).then(function(resp) {
        GetDados();
      });

      console.log(dados);
    }

    function Excluir() {
      var lista = {
        'ListaRegistrosExcluir ': {
          '@xmlns': 'http://schemas.datacontract.org/2004/07/WcfServiceCasamento',
          'Id_casal': ID,
          'Id_registro': {
            'int': []
          }
        }
      };
    }

    function GetDados() {
      serverService.Get('RetornarConfiguracaoListaHoteis', ID).then(function(resp) {
        /**
         * O servico conversorService retorna uma string
         * O angular converte de string para objeto
         */
        resp = angular.fromJson(conversorService.Xml2Json(resp.data, ''));
        vm.hoteis = resp.ArrayOfConfiguracaoGenericaEndereco.ConfiguracaoGenericaEndereco ;
        console.log(resp);
        console.log( vm.hoteis);

      });
    }
  }
})();