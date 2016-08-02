(function () {
  'use strict';

  angular
    .module('dashboard')
    .service('Casamento', Casamento);

  Casamento.$inject = ['ipService', '$q', '$http'];
  function Casamento(ipService, $q, $http) {

    this.Request = Request;

    function Request(urlVar, xmlVar) {
      var call;
      var deferred = $q.defer();

      $http({
        method: 'GET',
        url: 'php/dados.php'
      }).then(function (dados) {
        var autorizacao = JSON.parse(dados.data);
        var appid = autorizacao.appid;
        var token = autorizacao.token;
        var data = { 'uri': urlVar, 'xml': xmlVar, appid: appid, token: token };

        call = SendData(data);

        call.success(function (data) {
          deferred.resolve(data);
        }).error(function () {
          deferred.reject(arguments);
        });
      });

      return deferred.promise;
    }

    function SendData(Data) {
      var call = $.ajax({
        type: 'POST',
        url: 'https://' + ipService.ip + '/web/service_request.aspx',
        contentType: 'text/xml; charset=utf-8',
        data: Data,
        xhrFields: {
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