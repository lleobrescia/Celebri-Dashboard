/**
 * MainController
 * O controlador fica no index.
 * Quando for para usar algo que afete todos os views, utilize esse controlador
 * @namespace Controllers
 */
(function () {
  'use strict';

  angular
    .module('dashboard')
    .controller('MainController', MainController);

  MainController.$inject = [];
  /**
   * @namespace MainController
   * @desc Controlador principal do sistema. Afeta todos os views. Fica localizado no index.html
   * @see Veja {@link https://docs.angularjs.org/guide/controller|Angular DOC} Para mais informações
   * @see Veja {@link https://github.com/johnpapa/angular-styleguide/tree/master/a1#controllers|John Papa DOC} Para melhores praticas
   * @memberOf Controllers
   */
  function MainController() {
    var vm = this;

    vm.dialogControl = true; //Controla o display do popup que esta na index

    vm.GetTimes = GetTimes;

    Activate();

    ////////////////

    /**
     * @namespace Activate
     * @desc Setup docontrolador. Exetuca assim que o controlador inicia
     * @memberOf Controllers.MainController
     */
    function Activate() {}

    /**
     * @namespace GetTimes
     * @desc Usado para executar o ng repeat n vezes
     * @param {int} n Numero de vezes que o ng-repeat deve executar
     * @memberOf Controllers.MainController
     */
    function GetTimes(n) {
      return new Array(n);
    }
  }
})();