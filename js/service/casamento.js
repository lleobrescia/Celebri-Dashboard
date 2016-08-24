/**
 * Casamento Sevice
 * @namespace Services
 */
(function () {
  'use strict';

  angular
    .module('dashboard')
    .service('Casamento', Casamento);

  Casamento.$inject = ['ipService', '$q', '$http'];

  /**
   * @namespace Casamento
   * @desc Faz toda requisicao ao servidor utilizando promise
   * @memberOf Services
   */
  function Casamento(ipService, $q, $http) {

    this.Request = Request;

  /**
   * @namespace Request
   * @desc Passa a url e o xml para o servidor e aguarda a resposta
   * @memberOf Services.Casamento
   */
    function Request(urlVar, xmlVar) {
      var call;
      var deferred = $q.defer();

      $http({
        method: 'GET',
        url: 'php/dados.php'
      }).then(function (dados) {
        var autorizacao = JSON.parse(dados.data);
        var appid       = autorizacao.appid;
        var token       = autorizacao.token;
        var data        = { 'uri': urlVar, 'xml': xmlVar, appid: appid, token: token };

        call = SendData(data);

        call.success(function (data) {
          deferred.resolve(data);
        }).error(function () {
          deferred.reject(arguments);
        });
      });

      return deferred.promise;
    }

  /**
   * @namespace SendData
   * @desc Envia os dados para o servidor
   * @memberOf Services.Casamento
   */
    function SendData(Data) {
      var call = $.ajax({
        type        : 'POST',
        url         : 'https://' + ipService.ip + '/web/service_request.aspx',
        contentType : 'text/xml; charset=utf-8',
        data        : Data,
        xhrFields   : {
          withCredentials: true
        },
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
        }
      });
      return call;
    }
  }
} ());