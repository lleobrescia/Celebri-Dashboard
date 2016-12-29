(function() {
  'use strict';

  angular
    .module('dashboard')
    .filter('nospace', NoSpace);

  function NoSpace() {
    return NoSpaceFilter;

    ////////////////

    function NoSpaceFilter(value) {
      return (!value) ? '' : value.replace(/ /g, '');
    }
  }
})();