/**
 * Teste:
 * https://qaseCommerce.cielo.com.br/servicos/ecommwsec.do
 * numero:1006993069
 * chave: 25fbb99741c739dd84d7b06ec78c9bac718838630f30b112d033ce2e621b34f3
 * ******************************************************************************
 * Producao:
 * https://ecommerce.cielo.com.br/servicos/ecommwsec.do
 * numero:1078465263
 * chave: 2148f89a6778fa1f00a77c89d79e4c516ab0e765a37ed5c51c98167e72672880
 */
(function () {
  'use strict';

  angular
    .module('dashboard')
    .service('Cielo', Cielo);

  Cielo.$inject = ['$q', '$http', 'RequestAsFormPost', '$filter'];

  /**
   * @memberof dashboard
   * @ngdoc service
   * @name Cielo
   * @author Leo Brescia <leonardo@leobrescia.com.br>
   * @param {service} $q                - promise
   * @param {service} $http             - usado para requisição
   * @param {service} RequestAsFormPost - transformar requisição em uma requisição form post
   * @param {service} $filter           - transformar alguns texto
   * @desc Serviço de consulta de CEP
   * @see Veja [Angular DOC]    {@link https://docs.angularjs.org/guide/services} Para mais informações
   * @see Veja [John Papa DOC]  {@link https://github.com/johnpapa/angular-styleguide/tree/master/a1#services} Para melhores praticas
   * @see Veja [Cielo DOC]      {@link https://developercielo.github.io/Webservice-1.5/}
   */
  function Cielo($q, $http, RequestAsFormPost, $filter) {
    var appid = '60e74b56ffa91185c5fc8732e94cbb1e';
    var token = 'ea7021f308d7d4e691093dc16f6a8c8d';

    this.Send = Send;

    /**
     * @function Send
     * @desc monta o xml da requisição da cielo e envia.
     * @param {String} numero - numero do cartao
     * @param {String} validade - validade do cartao
     * @param {String} seguranca - codigo de segurança do cartao
     * @param {String} bandeira - bandeira do cartao
     * @return {promise}
     * @memberof Cielo
     */
    function Send(numero, validade, seguranca, bandeira) {
      var call;
      var deferred = $q.defer();
      var d = new Date();
      var horaLocal = d.getFullYear() + '-' + $filter('twoDigits')(d.getMonth() + 1) + '-' + $filter('twoDigits')(d.getDate()) + 'T' + $filter('twoDigits')(d.getHours()) + ':' + $filter('twoDigits')(d.getMinutes()) + ':' + $filter('twoDigits')(d.getSeconds()) + '.109-03:00';

      var xml = 'mensagem=<?xml version="1.0" ?><requisicao-transacao id="a97ab62a-7956-41ea-b03f-c2e9f612c293" versao="1.2.1"><dados-ec><numero>1078465263</numero><chave>2148f89a6778fa1f00a77c89d79e4c516ab0e765a37ed5c51c98167e72672880</chave></dados-ec><dados-portador><numero>' + numero + '</numero><validade>' + validade + '</validade><indicador>1</indicador><codigo-seguranca>' + seguranca + '</codigo-seguranca></dados-portador><dados-pedido><numero>178148599</numero>    <valor>18500</valor><moeda>986</moeda><data-hora>' + horaLocal + '</data-hora><idioma>PT</idioma></dados-pedido><forma-pagamento><bandeira>' + bandeira + '</bandeira>    <produto>1</produto><parcelas>1</parcelas></forma-pagamento>  <autorizar>3</autorizar><capturar>true</capturar><gerar-token>true</gerar-token></requisicao-transacao>';
      var data = {
        'url': 'https://ecommerce.cielo.com.br/servicos/ecommwsec.do',
        'xml': xml
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
     * @memberof Cielo
     */
    function SendData(Data) {
      var requisicao = $http({
        method: 'POST',
        url: 'https://celebri.com.br/celebri/web/request_cielo.aspx',
        transformRequest: RequestAsFormPost.TransformRequest,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded;charset=ISO-8859-1'
        },
        data: Data
      });

      return requisicao;
    }
  }
}());