(function () {
  'use strict';

  angular
    .module('dashboard')
    .controller('ConvidadosConfirmadosController', ConvidadosConfirmadosController);

  ConvidadosConfirmadosController.inject = ['serverService', 'conversorService', 'session'];

  /**
   * @todo Baixar lista
   * @todo Enviar lista por e-mail
   * @memberof dashboard
   * @ngdoc controller
   * @scope {}
   * @name ConvidadosConfirmadosController
   * @author Leo Brescia <leonardo@leobrescia.com.br>
   * @desc Retorna uma lista com os convidados cadastrados.<br>
   * Pasta de origem : app/convidado <br>
   * State : convidadosConfirmados <br>
   * Controller As : convidados <br>
   * Template Url : app/convidado/confirmados.html <br><br>
   * Usa o(s) serviço(s) do servidor:
   *  - RetornarConvidadosConfirmados {@link http://52.91.166.105/celebri/ServiceCasamento.svc/help/operations/RetornarConvidadosConfirmados}
   * @param {service} serverService    - usado para comunicar com o servidor (server.service.js)
   * @param {service} conversorService - usado para converter xml <-> json (conversor.service.js)
   * @param {service} session          - usado para armazenar e buscar dados no session (session.service.js)
   * @see Veja [Angular DOC]    {@link https://docs.angularjs.org/guide/controller} Para mais informações
   * @see Veja [John Papa DOC]  {@link https://github.com/johnpapa/angular-styleguide/tree/master/a1#controllers} Para melhores praticas
   * @see Veja [Servidor Help]  {@link http://52.91.166.105/celebri/ServiceCasamento.svc/help} Para saber sobre os serviços do servidor
   */
  function ConvidadosConfirmadosController(serverService, conversorService, session) {
    const ID = session.user.id; //Id do usuario logado. Usado para fazer requisições
    var vm = this;

    Activate();

    ////////////////

    /**
     * @function Activate
     * @desc Setup docontrolador. Exetuca assim que o controlador inicia
     * @memberof ConvidadosConfirmadosController
     */
    function Activate() {
      GetDados();
    }

    /**
     * @function GetDados
     * @desc Busca a lista de confirmados no servidor
     * @memberof ConvidadosConfirmadosController
     */
    function GetDados() {
      serverService.Get('RetornarConvidadosConfirmados', ID).then(function (resp) {
        resp = angular.fromJson(conversorService.Xml2Json(resp.data, ''));

        /**
         * Se nao houver convidados confirmados a variavel resp.ArrayOfListaConvidadosConfirmados.ListaConvidadosConfirmados
         * eh undefined. Por isso eh preciso verificar se existe.
         */
        if (resp.ArrayOfListaConvidadosConfirmados.ListaConvidadosConfirmados) {
          /**
           * Se houver apenas um convidado, o servico conversorService nao gera um array
           * portanto a variavel ListaConvidadosConfirmados dentro de resp.ArrayOfListaConvidadosConfirmados não podera
           * ser atribuida a uma outra variavel. Portanto eh preciso usar push nesse caso.
           */
          if (resp.ArrayOfListaConvidadosConfirmados.ListaConvidadosConfirmados.length > 1) {
            vm.pessoas = resp.ArrayOfListaConvidadosConfirmados.ListaConvidadosConfirmados;
          } else {
            vm.pessoas.push(resp.ArrayOfListaConvidadosConfirmados.ListaConvidadosConfirmados);
          }
        }
      });
    }
  }
})();