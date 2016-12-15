(function () {
  'use strict';

  angular
    .module('dashboard')
    .controller('MainController', MainController);

  MainController.inject = [];
  function MainController() {
    var vm = this;

    Activate();

    ////////////////

    function Activate() { }
  }
})();
