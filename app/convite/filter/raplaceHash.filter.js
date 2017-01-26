(function () {
  'use strict';

  angular
    .module('dashboard')
    .filter('raplaceHash', RaplaceHash);

  /**
   * @memberof dashboard
   * @ngdoc filter
   * @name RaplaceHash
   * @desc troca o '#' pela quebra de linha em html <br>
   * O servidor so armazena # como quebra de linha <br>
   * Pasta de origem : app/convite/filter
   * @see Veja [Angular DOC]    {@link https://docs.angularjs.org/api/ng/filter/filter} Para mais informações
   * @see Veja [John Papa DOC]  {@link https://github.com/johnpapa/angular-styleguide/tree/master/a1#filters} Para melhores praticas
   */
  function RaplaceHash() {
    return RaplaceHashFilter;

    ////////////////

    /**
     * @function RaplaceHashFilter
     * @memberof RaplaceHash
     * @desc troca o '#' pela quebra de linha em html
     * @param {string} value
     * @return {string}
     */
    function RaplaceHashFilter(value) {
      return (!value) ? '' : value.toString().replace(/#/g, '<br>');
    }
  }
})();