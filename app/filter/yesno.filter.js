(function() {
  'use strict';

  angular
    .module('dashboard')
    .filter('yesno', YesNo);

  function YesNo() {
    return YesNoFilter;

    ////////////////

    function YesNoFilter(value) {
      return value ? 'sim' : 'não';
    }
  }
})(); 