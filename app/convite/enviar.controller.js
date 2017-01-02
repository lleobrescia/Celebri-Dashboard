(function () {
  'use strict';

  angular
    .module('dashboard')
    .controller('EnviarConviteController', EnviarConviteController);

  EnviarConviteController.inject = ['serverService', 'conversorService', 'ListManagerService'];
  function EnviarConviteController(serverService, conversorService, ListManagerService) {
    const ID = 34;
    var vm = this;

    vm.convidados = [];
    vm.ListManager = ListManagerService;
    vm.selecionados = [];

    vm.Enviar = Enviar;

    Activate();

    ////////////////

    function Activate() {
      GetDados();
    }

    function Enviar() {
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
        GetDados();
      });
    }

    function GetDados() {
      serverService.Get('RetornarConvidados', ID).then(function (resp) {
        resp = angular.fromJson(conversorService.Xml2Json(resp.data, ''));

        if (resp.ArrayOfConvidado.Convidado.length > 1) {
          vm.convidados = resp.ArrayOfConvidado.Convidado;
        } else {
          vm.convidados.push(resp.ArrayOfConvidado.Convidado);
        }

        delete vm.convidados['@xmlns'];
        delete vm.convidados['@xmlns:i'];

        console.log(vm.convidados);
      });
    }
  }
})();
