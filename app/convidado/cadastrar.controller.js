(function () {
  'use strict';

  angular
    .module('dashboard')
    .controller('CadastrarConvidadoController', CadastrarConvidadoController);

  CadastrarConvidadoController.$inject = ['serverService', 'conversorService', 'ListManagerService', 'session', '$rootScope', 'toastr'];

  function CadastrarConvidadoController(serverService, conversorService, ListManagerService, session, $rootScope, toastr) {
    const enable = $rootScope.pagante;
    const ID = session.user.id;

    var vm = this;

    vm.carregando = true;
    vm.pessoas = [];
    vm.dados = {
      'Convidado': {
        '@xmlns': 'http://schemas.datacontract.org/2004/07/WcfServiceCasamento',
        'ConvidadoSomenteCerimonia': false,
        'ConviteEnviado': false,
        'Email': '',
        'Id': 0,
        'Id_usuario_logado': ID,
        'Nome': '',
        'Padrinho': false,
        'Qtde_Acompanhantes': 0,
        'SaveTheDateEnviado': false,
        'Senha': ''
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
      if (enable) {
        var dados = conversorService.Json2Xml(vm.dados, '');
        serverService.Request('CadastroConvidados', dados).then(function (resp) {
          vm.dados.Convidado.Nome = '';
          vm.dados.Convidado.Email = '';
          vm.dados.Convidado.Qtde_Acompanhantes = 0;

          toastr.success('Convidado Adicionado');

          GetDados();
        }).catch(function (error) {
          console.error('CadastroConvidados -> ', error);
          vm.carregando = false;
          vm.erro = true;
          toastr.error('Ocorreu um erro ao tentar acessar o servidor', 'Erro');
        });
      } else {
        toastr.error('Você deve efetuar o pagamento para usar essa funcionalidade');
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
      serverService.Request('ExcluirConvidados', dado).then(function (resp) {
        vm.carregando = false;
        toastr.success('Convidado Excluido');
        GetDados();
      }).catch(function (error) {
        console.error('ExcluirConvidados -> ', error);
        vm.carregando = false;
        vm.erro = true;
        toastr.error('Ocorreu um erro ao tentar acessar o servidor', 'Erro');
      });
    }

    function GetDados() {
      vm.carregando = true;
      vm.pessoas = [];
      serverService.Get('RetornarConvidados', ID).then(function (resp) {
        /**
         * O servico conversorService retorna uma string
         * O angular converte de string para objeto
         */
        resp = angular.fromJson(conversorService.Xml2Json(resp.data, ''));

        console.log(resp);

        if (resp.ArrayOfConvidado.Convidado) {
          if (resp.ArrayOfConvidado.Convidado.length > 1) {
            vm.pessoas = resp.ArrayOfConvidado.Convidado;
          } else {
            vm.pessoas = resp.ArrayOfConvidado;
          }
        }

        vm.carregando = false;
        delete vm.pessoas['@xmlns'];
        delete vm.pessoas['@xmlns:i'];
        console.log(vm.pessoas);
      }).catch(function (error) {
        console.error('RetornarConvidados -> ', error);
        vm.carregando = false;
        vm.erro = true;
        toastr.error('Ocorreu um erro ao tentar acessar o servidor', 'Erro');
      });
    }
  }
})();