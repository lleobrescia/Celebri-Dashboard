(function () {
  'use strict';

  angular
    .module('dashboard')
    .factory('RequestAsFormPost', RequestAsFormPost);

  /**
   * @memberof dashboard
   * @ngdoc factory
   * @name RequestAsFormPost
   * @desc Transforma o header do request do angular em form post
   * @see Veja [Angular DOC]    {@link https://docs.angularjs.org/guide/providers#factory-recipe} Para mais informações
   * @see Veja [John Papa DOC]  {@link https://github.com/johnpapa/angular-styleguide/tree/master/a1#factories} Para melhores praticas
   */
  function RequestAsFormPost() {
    var service = {
      TransformRequest: TransformRequest
    };

    return service;

    ////////////////

    /**
     * @function TransformRequest
     * @desc Modifica o header do request
     * @param {Object} data
     * @param {Function} getHeaders
     * @return {String} Header modificado
     * @memberof RequestAsFormPost
     */
    function TransformRequest(data, getHeaders) {
      var headers = getHeaders();
      headers['Content-type'] = 'application/x-www-form-urlencoded; charset=utf-8';
      return (SerializeData(data));
    }

    /**
     * @function SerializeData
     * @desc Serializa o header do request
     * @param {Object} data - objeto a ser serializado
     * @return {String} A data serializada
     * @memberof RequestAsFormPost
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
        .replace(/%20/g, '+');
      return (source);
    }
  }
})();