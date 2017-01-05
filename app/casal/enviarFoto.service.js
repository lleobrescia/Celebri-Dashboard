/**
 * Server Service
 * @namespace Services
 */
(function() {
  'use strict';

  angular
    .module('dashboard')
    .service('EnviarFoto', EnviarFoto);

  EnviarFoto.$inject = ['$q', '$http', 'RequestAsFormPost'];
  /**
   * @namespace EnviarFoto
   * @desc Faz a coneccao com o API Service
   * @memberOf Services
   */
  function EnviarFoto($q, $http, RequestAsFormPost) {
    const origin = 'celebri_dev';

    var service = {
      Request: Request
    };

    return service;

    ////////////////

    /**
     * @namespace Request
     * @desc Envia o endpoint e o json da requisicao para a funcao SendData
     * @param {String} endpoint - endpoint do servico que deseja acessar
     * @param {xml} xml - request Json body
     * @return {Promise}
     * @memberOf Services.EnviarFoto
     */
    function Request(nome, img) {
      var call;
      var deferred = $q.defer();
      var data = { 'image': img, 'name': nome };

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
     * @memberOf Services.EnviarFoto
     */
    function SendData(Data) {
      var requisicao = $http({
        method: 'POST',
        url: 'https://celebri.com.br/' + origin + '/web/uploadFotoCasal.aspx',
        transformRequest: RequestAsFormPost.TransformRequest,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
        },
        // withCredentials: true,
        data: Data
      });

      return requisicao;
    }
  }
})();