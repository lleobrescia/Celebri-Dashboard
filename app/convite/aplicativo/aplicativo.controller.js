(function () {
  'use strict';

  angular
    .module('dashboard')
    .controller('AplicativoController', AplicativoController);

  AplicativoController.$inject = ['session'];

  /**
   * @memberof dashboard
   * @ngdoc controller
   * @scope {}
   * @name AplicativoController
   * @author Leo Brescia <leonardo@leobrescia.com.br>
   * @desc Mostra a senha do aplicativo de teste para o usuario.<br>
   * Pasta de origem : app/convite/aplicativo <br>
   * State : aplicativo <br>
   * Controller As : app <br>
   * Template Url : app/convite/aplicativo/aplicativo.html <br><br>
   * Usa o(s) serviço(s) do servidor:
   *
   * @param {service} session - usado para armazenar e buscar dados no session (session.service.js)
   * @see Veja [Angular DOC]    {@link https://docs.angularjs.org/guide/controller} Para mais informações
   * @see Veja [John Papa DOC]  {@link https://github.com/johnpapa/angular-styleguide/tree/master/a1#controllers} Para melhores praticas
   * @see Veja [Servidor Help]  {@link http://52.91.166.105/celebri/ServiceCasamento.svc/help} Para saber sobre os serviços do servidor
   */
  function AplicativoController(session) {
    var vm = this;

    vm.senha = session.user.casal.senhaApp;

    Activate();

    ////////////////

    /**
     * @function Activate
     * @desc Setup docontrolador. Exetuca assim que o controlador inicia
     * @memberof AplicativoController
     */
    function Activate() {}
  }
})();