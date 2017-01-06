(function () {
  'use strict';

  angular
    .module('dashboard')
    .service('EnviarEmail', EnviarEmail);

  EnviarEmail.$inject = ['$q', '$http', 'RequestAsFormPost'];

  function EnviarEmail($q, $http, RequestAsFormPost) {

    this.Mail = Mail;

    function Mail(destinatario, assunto, conteudo) {
      var call;
      var deferred = $q.defer();

      var data = {
        'destinatario': destinatario,
        'assunto': assunto,
        'conteudo': conteudo
      };

      call = SendData(data);

      call.then(function successCallback(response) {
        deferred.resolve(response);
      }, function errorCallback(response) {
        deferred.reject(arguments);
      });

      return deferred.promise;
    }

    function SendData(Data) {
      var requisicao = $http({
        method: 'POST',
        url: 'https://www.celebri.com.br/celebri/web/enviar_email_generico.aspx',
        transformRequest: RequestAsFormPost.TransformRequest,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
        },
        data: Data
      });

      return requisicao;
    }
  }
}());