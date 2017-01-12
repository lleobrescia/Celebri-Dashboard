(function () {
  'use strict';

  angular
    .module('dashboard')
    .filter('raplaceHash', RaplaceHash);

  function RaplaceHash() {
    return RaplaceHashFilter;

    ////////////////

    function RaplaceHashFilter(value) {
      return (!value) ? '' : value.toString().replace(/#/g, '<br>');
    }
  }
})();