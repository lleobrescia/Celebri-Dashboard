(function () {
  'use strict';

  angular
    .module('dashboard')
    .service('ListManagerService', ListManagerService);

  /**
   * @memberof dashboard
   * @ngdoc service
   * @name ListManagerService
   * @author Leo Brescia <leonardo@leobrescia.com.br>
   * @desc Gerencia listas de selecionados. Retirando e colocando itens da lista fornecida
   * @see Veja [Angular DOC]    {@link https://docs.angularjs.org/guide/services} Para mais informações
   * @see Veja [John Papa DOC]  {@link https://github.com/johnpapa/angular-styleguide/tree/master/a1#services} Para melhores praticas
   */
  function ListManagerService() {
    this.Exists = Exists;
    this.IsIndeterminate = IsIndeterminate;
    this.Toggle = Toggle;
    this.ToggleAll = ToggleAll;

    ////////////////

    /**
     * @function Exists
     * @desc Verifica se o item existe em uma lista fornecida
     * @param {Object} item - objeto para verificacao
     * @param {Array} selecedList - lista para verificar se contem o item
     * @return {Boolean}
     * @memberof ListManagerService
     */
    function Exists(item, selecedList) {
      return selecedList.indexOf(item) > -1;
    }

    /**
     * @function IsIndeterminate
     * @desc Verifica se a lista de selecionados esta completa
     * @param {Array} selecedList - lista dos selecionados
     * @param {Array} list - lista contendo todos os itens disponiveis
     * @return {Boolean}
     * @memberof ListManagerService
     */
    function IsIndeterminate(selecedList, list) {
      return (selecedList.length !== 0 &&
        selecedList.length !== list.length);
    }

    /**
     * @function Toggle
     * @desc Retira ou coloca o item na lista fornecida
     * @param {Object} item - objeto para inclusao/exclusao da lista
     * @param {Array} selecedList -lista de selecionados
     * @memberof ListManagerService
     */
    function Toggle(item, selecedList) {
      var idx = selecedList.indexOf(item);
      if (idx > -1) {
        selecedList.splice(idx, 1);
      } else {
        selecedList.push(item);
      }
    }

    /**
     * @function ToggleAll
     * @desc Retira ou coloca todos os itens na lista de selecionados
     * @param {Array} selecedList - lista dos selecionados
     * @param {Array} list - lista contendo todos os itens disponiveis
     * @memberof ListManagerService
     */
    function ToggleAll(selecedList, list) {
      if (selecedList.length === list.length) {
        selecedList.splice(0, selecedList.length);
      } else if (selecedList.length === 0 || selecedList.length > 0) {
        selecedList.splice(0, selecedList.length);
        angular.forEach(list, function (item) {
          selecedList.push(item);
        });
      }
    }
  }
})();