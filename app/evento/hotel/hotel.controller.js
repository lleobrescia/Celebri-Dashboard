(function () {
  'use strict';

  angular
    .module('dashboard')
    .controller('HotelController', HotelController);

  HotelController.$inject = ['serverService', 'conversorService', 'ListManagerService', 'session', 'toastr'];

  function HotelController(serverService, conversorService, ListManagerService, session, toastr) {
    const ID = session.user.id;
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
    vm.carregando = true;
    vm.erro = false;
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
      vm.carregando = true;
      var dados = conversorService.Json2Xml(vm.dados, '');
      serverService.Request('ConfigAdicionalEvento_ListaHoteis', dados).then(function (resp) {
        vm.carregando = false;
        toastr.success('Hotel Adicionado!');
        GetDados();
      }).catch(function (error) {
        console.error('ConfigAdicionalEvento_ListaHoteis -> ', error);
        vm.carregando = false;
        vm.erro = true;
        toastr.error('Ocorreu um erro ao tentar acessar o servidor', 'Erro');
      });
    }

    function Excluir(id) {
      vm.carregando = true;
      var item = {
        'ListaRegistrosExcluir': {
          '@xmlns': 'http://schemas.datacontract.org/2004/07/WcfServiceCasamento',
          'Id_casal': ID,
          'Id_registro': {
            'int': [{
              '#text': id,
              '@xmlns': 'http://schemas.microsoft.com/2003/10/Serialization/Arrays'
            }]
          }
        }
      };

      var dado = conversorService.Json2Xml(item, '');
      serverService.Request('ExcluirHoteis', dado).then(function (resp) {
        vm.carregando = false;
        toastr.success('Hotel Excluido');
        GetDados();
      }).catch(function (error) {
        console.error('ExcluirHoteis -> ', error);
        vm.carregando = false;
        vm.erro = true;
        toastr.error('Ocorreu um erro ao tentar acessar o servidor', 'Erro');
      });
    }

    function GetDados() {
      vm.carregando = true;
      serverService.Get('RetornarConfiguracaoListaHoteis', ID).then(function (resp) {
        vm.hoteis = [];
        /**
         * O servico conversorService retorna uma string
         * O angular converte de string para objeto
         */
        resp = angular.fromJson(conversorService.Xml2Json(resp.data, ''));
        vm.carregando = false;
        vm.hoteis = resp.ArrayOfConfiguracaoGenericaEndereco.ConfiguracaoGenericaEndereco;
      }).catch(function (error) {
        console.error('RetornarConfiguracaoListaHoteis -> ', error);
        vm.carregando = false;
        vm.erro = true;
        toastr.error('Ocorreu um erro ao tentar acessar o servidor', 'Erro');
      });
    }
  }
})();