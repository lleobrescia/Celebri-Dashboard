(function() {
  'use strict';

  angular
    .module('dashboard')
    .filter('yesno', YesNo);

  /**
   * @memberof dashboard
   * @ngdoc filter
   * @name YesNo
   * @desc troca o valor booleano para sim ou nao <br>
   * Pasta de origem : app/filter
   * @see Veja [Angular DOC]    {@link https://docs.angularjs.org/api/ng/filter/filter} Para mais informações
   * @see Veja [John Papa DOC]  {@link https://github.com/johnpapa/angular-styleguide/tree/master/a1#filters} Para melhores praticas
   */
  function YesNo() {
    return YesNoFilter;

    ////////////////

    /**
     * @function YesNoFilter
     * @memberof YesNo
     * @desc troca o valor booleano para sim ou nao
     * @param {boolean} value
     * @return {string}
     */
    function YesNoFilter(value) {
      return value ? 'sim' : 'não';
    }
  }
})(); 