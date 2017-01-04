(function () {
  'use strict';

  angular
    .module('dashboard')
    .filter('removePx', RemovePx);

  function RemovePx() {
    return RemovePxFilter;

    ////////////////

    function RemovePxFilter(value) {
      return (!value) ? '' : value.toString().replace(/px/g, '');
    }
  }
})(); 