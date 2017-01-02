(function() {
  'use strict';

  angular
    .module('dashboard')
    .controller('ConvidadosConfirmadosController', ConvidadosConfirmadosController);

  ConvidadosConfirmadosController.inject = ['serverService', 'conversorService'];

  function ConvidadosConfirmadosController(serverService, conversorService) {
    const ID = 1;
    var vm = this;

    Activate();

    ////////////////

    function Activate() {
      GetDados();
    }

    function GetDados() {
      serverService.Get('RetornarConvidadosConfirmados', ID).then(function(resp) {
        resp = angular.fromJson(conversorService.Xml2Json(resp.data, ''));
        vm.pessoas = resp.ArrayOfListaConvidadosConfirmados.ListaConvidadosConfirmados;
        console.log(resp);
      });
    }
  }
})();