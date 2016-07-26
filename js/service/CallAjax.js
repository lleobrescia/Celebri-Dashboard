/**
 * Call Ajax Sevice
 * @namespace Services
 */
(function () {
  'use strict';
  angular
    .module('dashboard')
    .service('CallAjax', CallAjax);

  CallAjax.$inject = ['ipService'];
  /**
   * @namespace CallAjax
   * @desc Envia requisicao para o servico do celebri
   * @memberOf Services
   */
  function CallAjax(ipService) {
    this.resposta = CallAjaxfn;

    /**
     * @name CallAjaxfn
     * @desc Faz requisicao ao arquivo service_request.aspx
     * @param {String} appid ID do dashboard
     * @param {String} urlVar URL do servico
     * @param {String} token Token do dashboard
     * @param {String} xmlVar Dados da requisicao
     * @returns {String} resposta do servico
     * @memberOf Services.CallAjax
     */
    function CallAjaxfn(urlVar, xmlVar, appid, token) {
      var dataVar = { 'uri': urlVar, 'xml': xmlVar, appid: appid, token: token };
      var call = $.ajax({
        type: 'POST',
        url: 'https://' + ipService.ip + '/web/service_request.aspx',
        contentType: 'text/xml; charset=utf-8',
        data: dataVar,
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