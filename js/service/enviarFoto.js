(function () {
  'use strict';

  angular
    .module('dashboard')
    .service('EnviarFoto', EnviarFoto);

  EnviarFoto.$inject = ['$q', '$http'];
  function EnviarFoto($q, $http) {

    this.Request = Request;

    function Request(nome, img) {
      var call;
      var deferred = $q.defer();

      var data = { 'image': img, 'name': nome };

      call = SendData(data);

      call.success(function (data) {
        deferred.resolve(data);
      }).error(function () {
        deferred.reject(arguments);
      });
      return deferred.promise;
    }

    function SendData(Data) {
      var call = $.ajax({
        type: 'POST',
        url: 'https://celebri.com.br/celebri/web/uploadFotoCasal.aspx',
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