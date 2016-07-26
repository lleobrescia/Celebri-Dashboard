/**
 * HTTP Prefix Directive
 * @namespace Directives
 */
(function () {
  'use strict';
  angular
    .module('dashboard')
    .directive('httpPrefix', httpPrefix);

  /**
  * @namespace httpPrefix
  * @desc Adiciona http antes do texto digitado
  * @memberOf Directives
  */
  function httpPrefix() {
    var httpPrefix = {
      link: link,
      require: 'ngModel',
      restrict: 'A'
    };

    return httpPrefix;

    function link(scope, element, attrs, controller) {
      function ensureHttpPrefix(value) {
        // Need to add prefix if we don't have http:// prefix already AND we don't have part of it
        if (value && !/^(https?):\/\//i.test(value) &&
          'http://'.indexOf(value) !== 0 &&
          'https://'.indexOf(value) !== 0) {

          controller.$setViewValue('http://' + value);
          controller.$render();
          return 'http://' + value;
        }
        else {
          return value;
        }
      }
      controller.$formatters.push(ensureHttpPrefix);
      controller.$parsers.splice(0, 0, ensureHttpPrefix);
    }
  }
} ());