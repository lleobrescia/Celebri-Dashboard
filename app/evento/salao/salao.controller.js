(function () {
  'use strict';

  angular
    .module('dashboard')
    .controller('SalaoController', SalaoController);

  SalaoController.$inject = ['serverService', 'conversorService', 'ListManagerService', 'session', '$rootScope', 'toastr'];

  function SalaoController(serverService, conversorService, ListManagerService, session, $rootScope, toastr) {
    const enable = $rootScope.pagante;
    const ID = session.user.id;

    var vm = this;

    vm.dados = {
      'ConfiguracaoGenericaEndereco': {
        '@xmlns': 'http://schemas.datacontract.org/2004/07/WcfServiceCasamento',
        'Bairro': '',
        'Cidade': '',
        'CodigoArea': ' ',
        'Email': '',
        'Endereco': '',
        'Estado': '',
        'Id': '0',
        'Id_usuario_logado': ID,
        'Nome': '',
        'Numero': '',
        'Obs': ' ',
        'Pais': ' ',
        'Site': '',
        'Telefone': '',
        'TipoLogradouro': '',
        'Tracar_rota_local': 'true'
      }
    };
    vm.carregando = true;
    vm.saloes = [];

    vm.Adicionar = Adicionar;
    vm.Excluir = Excluir;

    Activate();

    ////////////////

    function Activate() {
      GetDados();
    }

    function Adicionar() {
      vm.carregando = true;
      if (enable) {
        var dados = conversorService.Json2Xml(vm.dados, '');
        serverService.Request('ConfigAdicionalEvento_ListaSaloes', dados).then(function (resp) {
          console.log(resp);
          GetDados();
          vm.carregando = false;
        }).catch(function (error) {
          console.error('ConfigAdicionalEvento_ListaSaloes -> ', error);
          vm.carregando = false;
          vm.erro = true;
          toastr.error('Ocorreu um erro ao tentar acessar o servidor', 'Erro');
        });
      } else {
        toastr.error('Você deve efetuar o pagamento para usar essa funcionalidade');
        vm.carregando = false;
      }
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
      serverService.Request('ExcluirSaloes', dado).then(function (resp) {
        vm.carregando = false;
        toastr.success('Salão de beleza Excluido');
        GetDados();
      }).catch(function (error) {
        console.error('ExcluirSaloes -> ', error);
        vm.carregando = false;
        vm.erro = true;
        toastr.error('Ocorreu um erro ao tentar acessar o servidor', 'Erro');
      });
    }

    function GetDados() {
      vm.dados = {
        'ConfiguracaoGenericaEndereco': {
          '@xmlns': 'http://schemas.datacontract.org/2004/07/WcfServiceCasamento',
          'Bairro': '',
          'Cidade': '',
          'CodigoArea': ' ',
          'Email': '',
          'Endereco': '',
          'Estado': '',
          'Id': '0',
          'Id_usuario_logado': ID,
          'Nome': '',
          'Numero': '',
          'Obs': ' ',
          'Pais': ' ',
          'Site': '',
          'Telefone': '',
          'TipoLogradouro': ' ',
          'Tracar_rota_local': 'true'
        }
      };
      vm.carregando = true;
      vm.saloes = [];
      serverService.Get('RetornarConfiguracaoListaSaloes', ID).then(function (resp) {
        /**
         * O servico conversorService retorna uma string
         * O angular converte de string para objeto
         */
        resp = angular.fromJson(conversorService.Xml2Json(resp.data, ''));

        if (resp.ArrayOfConfiguracaoGenericaEndereco.ConfiguracaoGenericaEndereco) {
          if (resp.ArrayOfConfiguracaoGenericaEndereco.ConfiguracaoGenericaEndereco > 1) {
            vm.saloes = resp.ArrayOfConfiguracaoGenericaEndereco.ConfiguracaoGenericaEndereco;
          } else {
            vm.saloes.push(resp.ArrayOfConfiguracaoGenericaEndereco.ConfiguracaoGenericaEndereco);
          }
        }

        vm.carregando = false;
      }).catch(function (error) {
        console.error('RetornarConfiguracaoListaSaloes -> ', error);
        vm.carregando = false;
        vm.erro = true;
        toastr.error('Ocorreu um erro ao tentar acessar o servidor', 'Erro');
      });
    }
  }
})();