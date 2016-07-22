(function () {
  'use strict';

  angular
    .module('dashboard')
    .controller('PagamentoCtrl', PagamentoCtrl);

  PagamentoCtrl.$inject = ['ipService', 'ServiceCasamento', 'UserService']
  function PagamentoCtrl(ipService, ServiceCasamento, UserService) {
    var self = this;

    init();

    function init() {
    }
  }
} ());