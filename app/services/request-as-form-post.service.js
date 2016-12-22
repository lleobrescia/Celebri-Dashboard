/**
* Request As Form Post Service
* @namespace Factories
*/
(function () {
  'use strict';

  angular
    .module('dashboard')
    .factory('RequestAsFormPost', RequestAsFormPost);

  /**
  * @namespace RequestAsFormPost
  * @desc Transforma o header do request do angular em form post
  * @memberOf Factories
  */
  function RequestAsFormPost() {
    var service = {
      TransformRequest: TransformRequest
    };

    return service;

    ////////////////

    /**
     * @namespace TransformRequest
     * @desc Modifica o header do request
     * @param {Object} data
     * @param {Function} getHeaders
     * @return {String} Header modificado
     * @memberOf Factories.RequestAsFormPost
     */
    function TransformRequest(data, getHeaders) {
      var headers = getHeaders();
      headers['Content-type'] = 'application/x-www-form-urlencoded; charset=utf-8';
      return (SerializeData(data));
    }

    /**
    * @namespace SerializeData
    * @desc Serializa o header do request
    * @param {Object} data - objeto a ser serializado
    * @return {String} A data serializada
    * @memberOf Factories.RequestAsFormPost
    */
    function SerializeData(data) {
      if (!angular.isObject(data)) {
        return ((data === null) ? '' : data.toString());
      }
      var buffer = [];
      for (var name in data) {
        if (!data.hasOwnProperty(name)) {
          continue;
        }
        var value = data[name];
        buffer.push(
          encodeURIComponent(name) +
          '=' +
          encodeURIComponent((value === null) ? '' : value)
        );
      }
      var source = buffer
        .join('&')
        .replace(/%20/g, '+')
        ;
      return (source);
    }
  }
})();
