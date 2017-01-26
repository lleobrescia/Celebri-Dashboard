(function () {
  'use strict';

  angular
    .module('dashboard')
    .controller('EstatisticaController', EstatisticaController);

  EstatisticaController.$inject = ['serverService', 'conversorService', 'session'];

  /**
   * @todo fornercer mais informações
   * @memberof dashboard
   * @ngdoc controller
   * @scope {}
   * @name EstatisticaController
   * @author Leo Brescia <leonardo@leobrescia.com.br>
   * @desc Recebe os dados do servidor e monta um grafico utilizando o module chart.js.<br>
   * Pasta de origem : app/estatisticas <br>
   * State : estatisticas <br>
   * Controller As : ctrl<br>
   * Template Url : app/estatisticas/estatisticas.html <br><br>
   * Usa o serviço(s) do(s) servidor:
   *  - RetornarEstatisticaCasamento {@link http://52.91.166.105/celebri/ServiceCasamento.svc/help/operations/RetornarEstatisticaCasamento}
   * @param {service} serverService    - usado para comunicar com o servidor (server.service.js)
   * @param {service} conversorService - usado para converter xml <-> json (conversor.service.js)
   * @param {service} session          - usado para armazenar e buscar dados no session (session.service.js)
   * @see Veja [Angular DOC]    {@link https://docs.angularjs.org/guide/controller} Para mais informações
   * @see Veja [John Papa DOC]  {@link https://github.com/johnpapa/angular-styleguide/tree/master/a1#controllers} Para melhores praticas
   * @see Veja [Servidor Help]  {@link http://52.91.166.105/celebri/ServiceCasamento.svc/help} Para saber sobre os serviços do servidor
   */
  function EstatisticaController(serverService, conversorService, session) {
    const ID = session.user.id; //id do usuario logado.Usado para fazer requisições
    var vm = this;

    vm.carregando = true; //Controla o loading
    vm.convidadosGeralData = []; //Valores para colocar no grafico
    vm.convidadosGeralLabel = []; //Legendas dos valores
    vm.dados = {
      'DadosEstatisticaCasamento': {
        '@xmlns': 'http://schemas.datacontract.org/2004/07/WcfServiceCasamento',
        '@xmlns:i': 'http://www.w3.org/2001/XMLSchema-instance',
        'total_acompanhantes': '',
        'total_acompanhantes_confirmados': '',
        'total_convidados': '',
        'total_convidados_confirmados': '',
        'total_convidados_somente_cerimonia': '',
        'total_convites_enviados_apenas_cerimonia': '',
        'total_convites_enviados_cerimonia_e_festa': '',
        'total_geral_convidados': '',
        'total_geral_convidados_confirmados': '',
        'total_save_the_date_enviados': ''
      }
    };
    vm.erro = false;

    Activate();

    ////////////////

    /**
     * @function Activate
     * @desc Setup docontrolador. Exetuca assim que o controlador inicia
     * @memberof EstatisticaController
     */
    function Activate() {
      GetDados();
    }

    /**
     * @function GetDados
     * @desc Pega os dados do servidor e envia para o grafico
     * @memberof EstatisticaController
     */
    function GetDados() {
      serverService.Get('RetornarEstatisticaCasamento', ID).then(function (resp) {
        resp = angular.fromJson(conversorService.Xml2Json(resp.data, ''));
        vm.dados = resp;

        vm.convidadosGeralLabels = ['Convidados Direto', 'Acompanhantes'];
        vm.convidadosGeralData = [resp.DadosEstatisticaCasamento.total_convidados, resp.DadosEstatisticaCasamento.total_acompanhantes];

        vm.carregando = false;
      }).catch(function (error) {
        console.error('RetornarEstatisticaCasamento -> ', error);
        vm.carregando = false;
        vm.erro = true;
      });
    }
  }
})();