(function () {
  'use strict';

  angular
    .module('dashboard')
    .filter('raplaceHash', RaplaceHash);

  function RaplaceHash() {
    return RaplaceHashFilter;

    ////////////////

    function RaplaceHashFilter(value) {
      return (!value) ? '' : value.replace(/#/g, '<br>');
    }
  }
})();