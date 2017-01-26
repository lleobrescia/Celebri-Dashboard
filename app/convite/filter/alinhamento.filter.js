(function () {
  'use strict';

  angular
    .module('dashboard')
    .filter('alinhamento', Alinhamento);

  /**
   * @memberof dashboard
   * @ngdoc filter
   * @name Alinhamento
   * @desc retorna o alinhamento (right,left,center) baseado no numero(0,1,2) <br>
   * Pasta de origem : app/convite/filter
   * @see Veja [Angular DOC]    {@link https://docs.angularjs.org/api/ng/filter/filter} Para mais informações
   * @see Veja [John Papa DOC]  {@link https://github.com/johnpapa/angular-styleguide/tree/master/a1#filters} Para melhores praticas
   */
  function Alinhamento() {
    return AlinhamentoFilter;

    ////////////////

    /**
     * @function AlinhamentoFilter
     * @memberof Alinhamento
     * @desc retorna o alinhamento (right,left,center) baseado no numero(0,1,2)
     * @param {string} value
     * @return {string}
     */
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