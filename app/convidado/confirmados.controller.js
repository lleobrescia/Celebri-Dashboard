(function () {
  'use strict';

  angular
    .module('dashboard')
    .controller('ConvidadosConfirmadosController', ConvidadosConfirmadosController);

  ConvidadosConfirmadosController.inject = ['serverService', 'conversorService', 'session'];

  function ConvidadosConfirmadosController(serverService, conversorService, session) {
    const ID = 1;
    var vm = this;

    Activate();

    ////////////////

    function Activate() {
      GetDados();
    }

    function GetDados() {
      serverService.Get('RetornarConvidadosConfirmados', ID).then(function (resp) {
        resp = angular.fromJson(conversorService.Xml2Json(resp.data, ''));

        if (resp.ArrayOfListaConvidadosConfirmados.ListaConvidadosConfirmados) {
          if (resp.ArrayOfListaConvidadosConfirmados.ListaConvidadosConfirmados.length > 1) {
            vm.pessoas = resp.ArrayOfListaConvidadosConfirmados.ListaConvidadosConfirmados;
          } else {
            vm.pessoas.push(resp.ArrayOfListaConvidadosConfirmados.ListaConvidadosConfirmados);
          }
        }
      });
    }
  }
})();