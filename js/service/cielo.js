(function () {
  'use strict';

  angular
    .module('dashboard')
    .service('Cielo', Cielo);

  Cielo.$inject = ['ipService', '$q', '$http', '$filter'];
  function Cielo(ipService, $q, $http, $filter) {

    this.Request = Request;

    function Request(numeroCartao, validadeAno, validadeMes, numeroSeg, bandeira) {
      var call;
      var deferred = $q.defer();

      $http({
        method: 'GET',
        url   : 'php/dados.php'
      }).then(function (dados) {
        var autorizacao = JSON.parse(dados.data);
        var appid       = autorizacao.appid;
        var token       = autorizacao.token;
        var d           = new Date();

        var horaLocal = d.getFullYear() + '-' + $filter('twoDigits')(d.getMonth() + 1) + '-' + $filter('twoDigits')(d.getDate()) + 'T' + $filter('twoDigits')(d.getHours()) + ':' + $filter('twoDigits')(d.getMinutes()) + ':' + $filter('twoDigits')(d.getSeconds()) + '.109-03:00';

        var xmlVar = 'mensagem=<?xml version="1.0" ?><requisicao-transacao id="a97ab62a-7956-41ea-b03f-c2e9f612c293" versao="1.2.1"><dados-ec><numero>1078465263</numero><chave>2148f89a6778fa1f00a77c89d79e4c516ab0e765a37ed5c51c98167e72672880</chave></dados-ec><dados-portador><numero>' + numeroCartao + '</numero><validade>' + validadeAno + validadeMes + '</validade><indicador>1</indicador><codigo-seguranca>' + numeroSeg + '</codigo-seguranca></dados-portador><dados-pedido><numero>178148599</numero>    <valor>18500</valor><moeda>986</moeda><data-hora>' + horaLocal + '</data-hora><idioma>PT</idioma></dados-pedido><forma-pagamento><bandeira>' + bandeira + '</bandeira>    <produto>1</produto><parcelas>1</parcelas></forma-pagamento>  <autorizar>3</autorizar><capturar>true</capturar><gerar-token>true</gerar-token></requisicao-transacao>';
        var urlVar  = 'https://ecommerce.cielo.com.br/servicos/ecommwsec.do';
        var data    = { 'url': urlVar, 'xml': xmlVar };

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
        type        : 'POST',
        url         : 'https://' + ipService.ip + '/web/request_cielo.aspx',
        data        : Data,
        contentType : 'application/x-www-form-urlencoded;charset=ISO-8859-1',
        headers     : {
          'Content-Type': 'application/x-www-form-urlencoded;charset=ISO-8859-1'
        }
      });
      return call;
    }
  }
} ());