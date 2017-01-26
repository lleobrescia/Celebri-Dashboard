(function () {
  'use strict';

  angular
    .module('dashboard')
    .filter('removePx', RemovePx);

  /**
   * @memberof dashboard
   * @ngdoc filter
   * @name RemovePx
   * @desc remove o px dos valores css inline <br>
   * O servidor nao armazena o px dos css <br>
   * Pasta de origem : app/convite/filter
   * @see Veja [Angular DOC]    {@link https://docs.angularjs.org/api/ng/filter/filter} Para mais informações
   * @see Veja [John Papa DOC]  {@link https://github.com/johnpapa/angular-styleguide/tree/master/a1#filters} Para melhores praticas
   */
  function RemovePx() {
    return RemovePxFilter;

    ////////////////

    /**
     * @function RemovePxFilter
     * @memberof RemovePx
     * @desc remove o px dos valores css inline
     * @param {string} value
     * @return {string}
     */
    function RemovePxFilter(value) {
      return (!value) ? '' : value.toString().replace(/px/g, '');
    }
  }
})();