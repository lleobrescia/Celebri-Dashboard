(function () {
  'use strict';

  angular
    .module('dashboard')
    .controller('PresentesController', PresentesController);

  PresentesController.$inject = ['serverService', 'conversorService', 'ListManagerService', 'session', 'toastr', '$rootScope'];

  function PresentesController(serverService, conversorService, ListManagerService, session, toastr, $rootScope) {
    const enable = $rootScope.pagante;
    const ID = session.user.id;

    var vm = this;

    vm.dados = {
      'ConfiguracaoLojaPresentes': {
        '@xmlns': 'http://schemas.datacontract.org/2004/07/WcfServiceCasamento',
        'Id': 0,
        'Id_usuario_logado': ID,
        'Nome': '',
        'Url': ''
      }
    };
    vm.carregando = true;
    vm.erro = false;
    vm.presentes = [];

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
        serverService.Request('ConfigAdicionalEvento_LojaPresentes', dados).then(function (resp) {
          GetDados();
          vm.carregando = false;
          toastr.success('Loja Adicionada');
        }).catch(function (error) {
          console.error('ConfigAdicionalEvento_LojaPresentes -> ', error);
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
      serverService.Request('ExcluirLojasPresentes', dado).then(function (resp) {
        vm.carregando = false;
        toastr.success('Loja Excluida');
        GetDados();
      }).catch(function (error) {
        console.error('ExcluirLojasPresentes -> ', error);
        vm.carregando = false;
        vm.erro = true;
        toastr.error('Ocorreu um erro ao tentar acessar o servidor', 'Erro');
      });
    }

    function GetDados() {
      vm.carregando = true;
      vm.presentes = [];
      serverService.Get('RetornarConfiguracaoLojaPresentes', ID).then(function (resp) {
        vm.carregando = false;
        /**
         * O servico conversorService retorna uma string
         * O angular converte de string para objeto
         */
        resp = angular.fromJson(conversorService.Xml2Json(resp.data, ''));

        if (resp.ArrayOfConfiguracaoLojaPresentes.ConfiguracaoLojaPresentes) {
          if (resp.ArrayOfConfiguracaoLojaPresentes.ConfiguracaoLojaPresentes.length > 1) {
            vm.presentes = resp.ArrayOfConfiguracaoLojaPresentes.ConfiguracaoLojaPresentes;
          } else {
            vm.presentes.push(resp.ArrayOfConfiguracaoLojaPresentes.ConfiguracaoLojaPresentes);
          }
        }

      }).catch(function (error) {
        console.error('RetornarConfiguracaoLojaPresentes -> ', error);
        vm.carregando = false;
        vm.erro = true;
        toastr.error('Ocorreu um erro ao tentar acessar o servidor', 'Erro');
      });
    }
  }
})();