(function () {
  'use strict';

  angular
    .module('dashboard')
    .filter('nospace', NoSpace);

  /**
   * @memberof dashboard
   * @ngdoc filter
   * @name NoSpace
   * @desc retira todo o espaço de uma string <br>
   * Pasta de origem : app/filter
   * @see Veja [Angular DOC]    {@link https://docs.angularjs.org/api/ng/filter/filter} Para mais informações
   * @see Veja [John Papa DOC]  {@link https://github.com/johnpapa/angular-styleguide/tree/master/a1#filters} Para melhores praticas
   */
  function NoSpace() {
    return NoSpaceFilter;

    ////////////////

    /**
     * @function NoSpaceFilter
     * @memberof NoSpace
     * @desc retorna uma string sem espeaço
     * @param {string} value
     * @return {string}
     */
    function NoSpaceFilter(value) {
      return (!value) ? '' : value.replace(/ /g, '');
    }
  }
})();