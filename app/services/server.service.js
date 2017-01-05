/**
 * Server Service
 * @namespace Services
 */
(function () {
  'use strict';

  angular
    .module('dashboard')
    .service('serverService', serverService);

  serverService.$inject = ['$q', '$http', 'RequestAsFormPost'];
  /**
   * @namespace serverService
   * @desc Faz a coneccao com o API Service
   * @memberOf Services
   */
  function serverService($q, $http, RequestAsFormPost) {
    var appid = '60e74b56ffa91185c5fc8732e94cbb1e';
    var token = 'ea7021f308d7d4e691093dc16f6a8c8d';

    var service = {
      Get: Get,
      Request: Request
    };

    return service;

    ////////////////

    function Get(endpoint, id) {
      var xml = '<IdentificaocaoCasal xmlns="http://schemas.datacontract.org/2004/07/WcfServiceCasamento">  <Id_casal>' + id + '</Id_casal></IdentificaocaoCasal>';

      return Request(endpoint, xml);
    }

    /**
     * @namespace Request
     * @desc Envia o endpoint e o json da requisicao para a funcao SendData
     * @param {String} endpoint - endpoint do servico que deseja acessar
     * @param {xml} xml - request Json body
     * @return {Promise}
     * @memberOf Services.serverService
     */
    function Request(endpoint, xml) {
      var call;
      var deferred = $q.defer();
      var data = {
        'uri': 'http://celebri.com.br/celebri/ServiceCasamento.svc/' + endpoint,
        'xml': xml,
        'appid': appid,
        'token': token
      };

      call = SendData(data);

      call.then(function successCallback(response) {
        deferred.resolve(response);
      }, function errorCallback(response) {
        deferred.reject(arguments);
      });

      return deferred.promise;
    }

    /**
     * @namespace SendData
     * @desc Envia (ajax) um post ao API Service
     * @param {Object} Data - data para ser enviado pelo ajax
     * @return {String|JSON} Retorna um string em formato json
     * @memberOf Services.serverService
     */
    function SendData(Data) {
      var requisicao = $http({
        method: 'POST',
        url: 'https://celebri.com.br/' + origin + '/web/service_request.aspx',
        transformRequest: RequestAsFormPost.TransformRequest,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        // withCredentials: true,
        data: Data
      });

      return requisicao;
    }
  }
})();