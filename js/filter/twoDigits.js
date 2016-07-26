/**
 * Two Digitis Factory
 * @namespace Filters
 */
(function () {
  'use strict';
  angular
    .module('dashboard')
    .filter('twoDigits', twoDigits);

  /**
  * @namespace twoDigits
  * @memberOf Filters
  */
  function twoDigits() {
    return twoDigitsFn;

    /**
    * @namespace twoDigitsFn
    * @desc Garante que os min vao ter dois digitos se for menor de 10
    * @memberOf Filters.twoDigits
    */
    function twoDigitsFn(n) {
      var num = parseInt(n, 10);
      if (isNaN(num)) {
        return n;
      }

      if (num / 10 < 1) {
        num = '0' + num;
      }
      return num;
    }
  }
} ());