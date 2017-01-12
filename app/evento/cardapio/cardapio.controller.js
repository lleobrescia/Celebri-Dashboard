(function () {
  'use strict';

  angular
    .module('dashboard')
    .controller('CardapioController', CardapioController);

  CardapioController.$inject = ['serverService', 'conversorService', 'ListManagerService', 'session', 'toastr', '$rootScope'];

  function CardapioController(serverService, conversorService, ListManagerService, session, toastr, $rootScope) {
    const enable = $rootScope.pagante;
    const ID = session.user.id;

    var vm = this;

    vm.dados = {
      'Cardapio': {
        '@xmlns': 'http://schemas.datacontract.org/2004/07/WcfServiceCasamento',
        'Descricao': '',
        'Id': 0,
        'Id_usuario_logado': ID,
        'Nome': ''
      }
    };
    vm.cardapios = [];
    vm.carregando = true;
    vm.erro = false;

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
        serverService.Request('CadastrarCardapio', dados).then(function (resp) {
          vm.carregando = false;

          vm.dados.Cardapio.Descricao = '';
          vm.dados.Cardapio.Nome = '';

          toastr.success('Cardápio Adicionado');

          GetDados();
        }).catch(function (error) {
          console.error('CadastrarCardapio -> ', error);
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
      serverService.Request('ExcluirCardapio', dado).then(function (resp) {
        vm.carregando = false;
        toastr.success('Cardápio Excluido');
        GetDados();
      }).catch(function (error) {
        console.error('ExcluirCardapio -> ', error);
        vm.carregando = false;
        vm.erro = true;
        toastr.error('Ocorreu um erro ao tentar acessar o servidor', 'Erro');
      });
    }

    function GetDados() {
      vm.carregando = true;
      vm.cardapios = [];
      serverService.Get('RetornarCardapio', ID).then(function (resp) {
        /**
         * O servico conversorService retorna uma string
         * O angular converte de string para objeto
         */
        resp = angular.fromJson(conversorService.Xml2Json(resp.data, ''));

        if (resp.ArrayOfCardapio.Cardapio) {
          if (resp.ArrayOfCardapio.Cardapio.length > 1) {
            vm.cardapios = resp.ArrayOfCardapio.Cardapio;
          } else {
            vm.cardapios.push(resp.ArrayOfCardapio.Cardapio);
          }
        }

        vm.carregando = false;

      }).catch(function (error) {
        console.error('RetornarCardapio -> ', error);
        vm.carregando = false;
        vm.erro = true;
        toastr.error('Ocorreu um erro ao tentar acessar o servidor', 'Erro');
      });
    }
  }
})();