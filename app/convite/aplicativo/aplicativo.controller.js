(function () {
  'use strict';

  angular
    .module('dashboard')
    .controller('AplicativoController', AplicativoController);

  AplicativoController.$inject = ['session'];

  function AplicativoController(session) {
    var vm = this;

    vm.senha = session.user.casal.senhaApp;


    Activate();

    ////////////////

    function Activate() {}
  }
})();