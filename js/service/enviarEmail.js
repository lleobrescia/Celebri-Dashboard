(function () {
  'use strict';

  angular
    .module('dashboard')
    .service('EnviarEmail', EnviarEmail);

  EnviarEmail.$inject = ['$q', '$http'];
  function EnviarEmail($q, $http) {

    this.Mail = Mail;

    function Mail(destinatario, assunto, conteudo) {
      var call;
      var deferred = $q.defer();

      var data = { 'destinatario': destinatario, 'assunto': assunto, 'conteudo': conteudo };

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
        url: 'https://www.celebri.com.br/celebri/web/enviar_email_generico.aspx',
        contentType: 'text/html; charset=utf-8',
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