/**
 * @namespace Directives
 */
(function () {
  'use strict';

  angular
    .module('dashboard')
    .directive('sidebar', SideBar);

  /**
   * @memberof dashboard
   * @ngdoc directive
   * @name SideBar
   * @desc Retorna o template do cabecalho
   */
  function SideBar() {
    return {
      templateUrl: 'app/sidebar/sidebar.html',
      restrict: 'AE'
    };
  }

})();