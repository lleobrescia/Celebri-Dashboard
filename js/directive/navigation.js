/**
 * Navigation Directive
 * @namespace Directives
 */
(function () {
  'use strict';
  angular
    .module('dashboard')
    .directive('navigation', navigation);

  /**
  * @namespace navigation
  * @desc Retorna o template do menu
  * @memberOf Directives
  */
  function navigation() {
    var navigation = {
      restrict    : 'E',
      replace     : true,
      scope       : {
        menu: '='
      },
      templateUrl : '/dashboard/templates/parts/navigation.html'
    };

    return navigation;
  }
} ());