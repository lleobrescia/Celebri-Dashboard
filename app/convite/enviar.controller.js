(function () {
  'use strict';

  angular
    .module('dashboard')
    .controller('EnviarConviteController', EnviarConviteController);

  EnviarConviteController.inject = ['serverService', 'conversorService', 'ListManagerService', 'session', 'toastr'];

  function EnviarConviteController(serverService, conversorService, ListManagerService, session, toastr) {
    const ID = session.user.id;
    var vm = this;

    vm.carregando = true;
    vm.convidados = [];
    vm.erro = false;
    vm.ListManager = ListManagerService;
    vm.selecionados = [];

    vm.Enviar = Enviar;

    Activate();

    ////////////////

    function Activate() {
      GetDados();
    }

    function Enviar() {
      vm.carregando = true;
      var lista = {
        'ListaEmailConvidados': {
          '@xmlns': 'http://schemas.datacontract.org/2004/07/WcfServiceCasamento',
          'Id_casal': ID,
          'Id_convidado': {
            'int': []
          }
        }
      };
      var xml = null;

      angular.forEach(vm.selecionados, function (selecionado) {
        lista.ListaEmailConvidados.Id_convidado.int.push({
          '@xmlns': 'http://schemas.microsoft.com/2003/10/Serialization/Arrays',
          '#text': selecionado.Id
        });
      });
      xml = conversorService.Json2Xml(lista, '');

      serverService.Request('EnvioEmailConvite', xml).then(function (resp) {
        vm.carregando = false;
        toastr.success('Convite Enviado!');
        GetDados();
      }).catch(function (error) {
        console.error('RetornarFormatacaoSaveTheDate -> ', error);
        vm.carregando = false;
        vm.erro = true;
        toastr.error('Não foi possível enviar os convites', 'Erro');
      });
    }

    function GetDados() {
      vm.carregando = true;
      serverService.Get('RetornarConvidados', ID).then(function (resp) {
        resp = angular.fromJson(conversorService.Xml2Json(resp.data, ''));

        if (resp.ArrayOfConvidado.Convidado.length > 1) {
          vm.convidados = resp.ArrayOfConvidado.Convidado;
        } else {
          vm.convidados.push(resp.ArrayOfConvidado.Convidado);
        }

        vm.carregando = false;

        delete vm.convidados['@xmlns'];
        delete vm.convidados['@xmlns:i'];
      }).catch(function (error) {
        console.error('RetornarConvidados -> ', error);
        vm.carregando = false;
        vm.erro = true;
        toastr.error('Ocorreu um erro ao tentar acessar o servidor', 'Erro');
      });
    }
  }
})();