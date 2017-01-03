(function () {
  'use strict';

  angular
    .module('dashboard')
    .filter('alinhamento', Alinhamento);

  function Alinhamento() {
    return AlinhamentoFilter;

    ////////////////

    function AlinhamentoFilter(value) {
      var retorno = '';
      switch (value) {
        case '2':
          retorno = 'right';
          break;
        case '0':
          retorno = 'left';
          break;
        case '1':
          retorno = 'center';
          break;
        default:
          retorno = 'left';
          break;
      }
      return retorno;
    }
  }
})();