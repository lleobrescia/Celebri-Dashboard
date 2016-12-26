/**
* @namespace Directives
*/
(function () {
  'use strict';

  angular
    .module('dashboard')
    .directive('sidebar', SideBar);

  /**
  * @namespace Cabecalho
  * @desc Retorna o template do cabecalho
  * @memberOf Directives
  */
  function SideBar() {
    return {
      templateUrl: 'app/sidebar/sidebar.html',
      restrict: 'AE'
    };
  }

})();
