/**
 * Navigation Factory
 * @namespace Factories
 */
(function () {
  'use strict';
  angular
    .module('dashboard')
    .factory('consultCEP', consultCEP);

  consultCEP.$inject = ['$q'];

  /**
   * @namespace consultCEP
   * @desc Serviço de consulta de CEP
   * @memberOf Factories
   */
  function consultCEP($q) {

    return {
      consultar: Consultar
    };

    /**
     * @namespace Consultar
     * @desc Consulta o cep fornecido e retorna os dados do local
     * @see {@link foo} utiliza o Postmon API.
     * @see {@link http://postmon.com.br/}
     * @param {String} cepToConsult CEP para consultar
     * @memberOf Factories.consultCEP
     */
    function Consultar(cepToConsult) {
      var cep = cepToConsult.replace(/\./g, '');
      cep = cep.replace(/\-/g, '');
      var deferred = $q.defer();

      if (cep.length > 7) {
        var call = $.ajax({
          url: 'https://api.postmon.com.br/v1/cep/' + cep
        });

        call.then(function successCallback(response) {
          deferred.resolve(response);
        }, function errorCallback(response) {
          deferred.reject(arguments);
        });

        return deferred.promise;
      } else {
        return '';
      }
    }
  }
}());