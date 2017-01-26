(function () {
  'use strict';

  angular
    .module('dashboard')
    .controller('MainController', MainController);

  MainController.$inject = [];

  /**
   * @memberof dashboard
   * @ngdoc controller
   * @scope {}
   * @name MainController
   * @author Leo Brescia <leonardo@leobrescia.com.br>
   * @desc Controlador principal do sistema. Afeta todos os views. Fica localizado no index.html<br>
   * Pasta de origem : app/_core <br>
   * State :  <br>
   * Controller As : main<br>
   * Template Url :  <br><br>
   * @see Veja [Angular DOC]    {@link https://docs.angularjs.org/guide/controller} Para mais informações
   * @see Veja [John Papa DOC]  {@link https://github.com/johnpapa/angular-styleguide/tree/master/a1#controllers} Para melhores praticas
   */
  function MainController() {
    var vm = this;

    vm.dialogControl = true; //Controla o display do popup que esta na index

    vm.GetTimes = GetTimes;

    Activate();

    ////////////////

    /**
     * @function Activate
     * @desc Setup docontrolador. Exetuca assim que o controlador inicia
     * @memberof MainController
     */
    function Activate() {}

    /**
     * @function GetTimes
     * @desc Usado para executar o ng repeat n vezes
     * @param {int} n - Numero de vezes que o ng-repeat deve executar
     * @memberof MainController
     */
    function GetTimes(n) {
      return new Array(n);
    }
  }
})();