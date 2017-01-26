(function () {
  'use strict';
  angular
    .module('dashboard')
    .filter('twoDigits', twoDigits);

  /**
   * @memberof dashboard
   * @ngdoc filter
   * @name twoDigits
   * @desc deixa um numero decimal com dois digitos <br>
   * Pasta de origem : app/filter
   * @see Veja [Angular DOC]    {@link https://docs.angularjs.org/api/ng/filter/filter} Para mais informações
   * @see Veja [John Papa DOC]  {@link https://github.com/johnpapa/angular-styleguide/tree/master/a1#filters} Para melhores praticas
   */
  function twoDigits() {
    return twoDigitsFn;

    /**
     * @function twoDigitsFn
     * @memberof twoDigits
     * @desc deixa um numero decimal com dois digitos. Ex.: 2 -> 02
     * @param {number|string} value
     * @return {string}
     */
    function twoDigitsFn(value) {
      var num = parseInt(value, 10);
      if (isNaN(num)) {
        return value;
      }

      if (num / 10 < 1) {
        num = '0' + num;
      }
      return num;
    }
  }
}());