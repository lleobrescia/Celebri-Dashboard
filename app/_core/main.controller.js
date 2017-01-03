(function() {
  'use strict';

  angular
    .module('dashboard')
    .controller('MainController', MainController);

  MainController.$inject = [];

  function MainController() {
    var vm = this;

    vm.GetTimes = GetTimes;

    Activate();

    ////////////////

    function Activate() {}

    function GetTimes(n) {
      return new Array(n);
    }
  }
})();