/**
 * Enviar Foto Service
 * @author Leo Brescia <leonardo@leobrescia.com.br>
 * @namespace Casal
 */
(function () {
  'use strict';

  angular
    .module('dashboard')
    .service('EnviarFoto', EnviarFoto);

  EnviarFoto.$inject = ['$q', '$http', 'RequestAsFormPost'];
  /**
   * @memberof dashboard
   * @ngdoc service
   * @scope {}
   * @name EnviarFoto
   * @author Leo Brescia <leonardo@leobrescia.com.br>
   * @desc Pasta de origem: app/casal. Usado somente na pagina de casal <br>
   * Envia a foto do casal recortada para o servidor.<br>
   * Envia a foto para o script https://celebri.com.br/celebri/web/uploadFotoCasal.aspx
   * @param {service} $q                - usado para promise
   * @param {service} $http             - usado para requisicao
   * @param {service} RequestAsFormPost - transforma a requisicao em uma requisicao de form
   * @see Veja [Angular DOC]    {@link https://docs.angularjs.org/guide/services} Para mais informações
   * @see Veja [John Papa DOC]  {@link https://github.com/johnpapa/angular-styleguide/tree/master/a1#services} Para melhores praticas
   */
  function EnviarFoto($q, $http, RequestAsFormPost) {
    var service = {
      Request: Request
    };

    return service;

    ////////////////

    /**
     * @function Request
     * @memberof EnviarFoto
     * @desc Cria e retorna uma promise para a solicitação ao servidor
     * @param {string} nome - Id do Casal
     * @param {image} img   - Imagem na base64
     * @returns {Promise} Dados do envio
     */
    function Request(nome, img) {
      var call;
      var deferred = $q.defer();
      var data = {
        'image': img,
        'name': nome
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
     * @function SendData
     * @memberof EnviarFoto
     * @desc Envia os dados ao servidor
     * @param {JSON} Data - Dados para serem enviados ao servidor
     * @returns {Object} Resposta do $http
     */
    function SendData(Data) {
      var requisicao = $http({
        method: 'POST',
        url: 'https://celebri.com.br/celebri/web/uploadFotoCasal.aspx',
        transformRequest: RequestAsFormPost.TransformRequest,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
        },
        data: Data
      });

      return requisicao;
    }
  }
})();