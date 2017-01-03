(function() {
  'use strict';

  angular
    .module('dashboard')
    .controller('ConvidadosConfirmadosController', ConvidadosConfirmadosController);

  ConvidadosConfirmadosController.inject = ['serverService', 'conversorService', 'session'];

  function ConvidadosConfirmadosController(serverService, conversorService, session) {
    const ID = session.user.id;
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