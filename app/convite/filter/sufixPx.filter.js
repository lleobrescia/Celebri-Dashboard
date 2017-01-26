(function () {
  'use strict';

  angular
    .module('dashboard')
    .filter('sufixPx', SufixPx);

  /**
   * @memberof dashboard
   * @ngdoc filter
   * @name SufixPx
   * @desc adiciona o px dos valores css inline <br>
   * O servidor nao armazena o px dos css <br>
   * Pasta de origem : app/convite/filter
   * @see Veja [Angular DOC]    {@link https://docs.angularjs.org/api/ng/filter/filter} Para mais informações
   * @see Veja [John Papa DOC]  {@link https://github.com/johnpapa/angular-styleguide/tree/master/a1#filters} Para melhores praticas
   */
  function SufixPx() {
    return SufixPxFilter;

    ////////////////

    /**
     * @function SufixPxFilter
     * @memberof SufixPx
     * @desc adiciona o px dos valores css inline
     * @param {string} value
     * @return {string}
     */
    function SufixPxFilter(value) {
      return (!value) ? '' : value.toString() + 'px';
    }
  }
})();