(function () {
  'use strict';

  angular
    .module('dashboard')
    .filter('sufixPx', SufixPx);

  function SufixPx() {
    return SufixPxFilter;

    ////////////////

    function SufixPxFilter(value) {
      return (!value) ? '' : value.toString() + 'px';
    }
  }
})();