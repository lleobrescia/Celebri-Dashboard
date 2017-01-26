(function () {
  'use strict';

  angular
    .module('dashboard')
    .service('EnviarEmail', EnviarEmail);

  EnviarEmail.$inject = ['$q', '$http', 'RequestAsFormPost'];

  /**
   * @memberof dashboard
   * @ngdoc service
   * @name EnviarEmail
   * @author Leo Brescia <leonardo@leobrescia.com.br>
   * @param {service} $q                - promise
   * @param {service} $http             - usado para requisição
   * @param {service} RequestAsFormPost - transformar requisição em uma requisição form post
   * @desc Envia um email
   * @see Veja [Angular DOC]    {@link https://docs.angularjs.org/guide/services} Para mais informações
   * @see Veja [John Papa DOC]  {@link https://github.com/johnpapa/angular-styleguide/tree/master/a1#services} Para melhores praticas
   */
  function EnviarEmail($q, $http, RequestAsFormPost) {

    this.Mail = Mail;

    /**
     * @function Mail
     * @desc monta o promise e envia o email
     * @param {String} destinatario - destinatario do email
     * @param {String} assunto - assunto do email
     * @param {String} conteudo - conteudo do email
     * @return {promise}
     * @memberof EnviarEmail
     */
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

    /**
     * @function SendData
     * @desc realiza requisição
     * @param {json} Data - dados para requisição
     * @return {object}
     * @memberof EnviarEmail
     */
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