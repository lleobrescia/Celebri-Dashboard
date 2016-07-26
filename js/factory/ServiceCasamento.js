/**
 * Service Casamento Factory
 * @namespace Factories
 */
(function () {
  'use strict';
  angular
    .module('dashboard')
    .factory('ServiceCasamento', ServiceCasamento);

  ServiceCasamento.$inject = ['CallAjax', '$q', '$http'];

  /**
  * @namespace ServiceCasamento
  * @memberOf Factories
  */
  function ServiceCasamento(CallAjax, $q, $http) {

    var service = {
      SendData: SendData
    };
    return service;

    /**
     * @namespace SendData
     * @desc faz requisição ao servidor utilizando promise
     * @param {String} urlVar URL do serviço
     * @param {String} xmlVar XML de equisição
     * @memberOf Factories.ServiceCasamento
     */
    function SendData(urlVar, xmlVar) {
      var call;
      var deferred = $q.defer();

      $http({
        method: 'GET',
        url: 'php/dados.php'
      }).then(function (dados) {
        var autorizacao = JSON.parse(dados.data);
        var appid = autorizacao.appid;
        var token = autorizacao.token;

        call = CallAjax.resposta(urlVar, xmlVar, appid, token);

        call.success(function (data) {
          deferred.resolve(data);
        }).error(function () {
          deferred.reject(arguments);
        });
      });

      return deferred.promise;
    }
  }
} ());