(function () {
  'use strict';

  angular
    .module('dashboard')
    .controller('SetupController', SetupController);

  SetupController.$inject = ['session', '$state', 'conversorService', 'serverService'];
  /**
   * @memberof dashboard
   * @ngdoc controller
   * @scope {}
   * @name SetupController
   * @author Leo Brescia <leonardo@leobrescia.com.br>
   * @desc Controla a barra lateral do dashboard.<br>
   * Pasta de origem : app/setup <br>
   * Controller As : setup<br>
   * Template Url : app/setup/main.html <br><br>
   * Usa o serviço(s) do(s) servidor:
   *  - AtualizarStatusSetup {@link http://52.91.166.105/celebri/ServiceCasamento.svc/help/operations/AtualizarStatusSetup}
   * @param {service} session           - usado para armazenar e buscar dados no session (session.service.js)
   * @param {service} $state            - usado para trocar de view
   * @param {service} conversorService  - usado para converter xml <-> json {@link dashboard.conversorService}
   * @param {service} serverService     - usado para comunicar com o servidor {@link dashboard.serverService}
   * @see Veja [Angular DOC]    {@link https://docs.angularjs.org/guide/controller} Para mais informações
   * @see Veja [John Papa DOC]  {@link https://github.com/johnpapa/angular-styleguide/tree/master/a1#controllers} Para melhores praticas
   */
  function SetupController(session, $state, conversorService, serverService) {
    const ID = session.user.id;
    var vm = this;

    vm.conviteLink = 'https://celebri.com.br/celebri/template_convite_app/android/template1_android.png'; //link para o template para o mini convite
    vm.modeloConvite = '';
    vm.pessedBy = {
      'noivos': false,
      'foto': false,
      'convite': false,
      'informacoes': false,
      'edicao': false,
      'confirmacao': false
    };
    vm.senhaApp = session.user.casal.senhaApp;
    vm.status = {
      'StatusSetupCelebri': {
        '@xmlns': 'http://schemas.datacontract.org/2004/07/WcfServiceCasamento',
        'IdCasal': ID,
        'Status': false,
        'UltimoPassoFinalizado': ''
      }
    };

    /**
     * Atribuição das funçoes as variaveis do escopo
     */
    vm.AtualizarPasso = AtualizarPasso;
    vm.IsCurrent = IsCurrent;
    vm.GetModelId = GetModelId;
    vm.SetModelId = SetModelId;
    vm.SetUpMinConvite = SetUpMinConvite;

    Activate();

    ////////////////

    /**
     * @function Activate
     * @desc Setup docontrolador. Exetuca assim que o controlador inicia
     * @memberof SetupController
     */
    function Activate() {}

    /**
     * @function AtualizarPasso
     * @desc Atualiza o passo do usuario no setup
     * @param {string} passo - passo que o usuario finalizou
     * @memberof SetupController
     */
    function AtualizarPasso(passo) {
      vm.status.StatusSetupCelebri.UltimoPassoFinalizado = passo;

      if (passo === '6') {
        vm.status.StatusSetupCelebri.Status = true;
      }

      var dados = conversorService.Json2Xml(vm.status, '');

      serverService.Request('AtualizarStatusSetup', dados);
    }

    /**
     * @function IsCurrent
     * @desc Verifica qual é o state atual para mudar a classe do top-navegacao
     * @memberof SetupController
     */
    function IsCurrent(state) {
      return (state === $state.current.name);
    }

    /**
     * @function GetModelId
     * @desc Fornerce o id do modelo do convite escolhido
     * @return {number} - id do modelo do convite
     * @memberof SetupController
     */
    function GetModelId() {
      return sessionStorage.modelo;
    }

    /**
     * @function SetModelId
     * @desc Salva no session o modelo do convite escolhido
     * @memberof SetupController
     */
    function SetModelId() {
      sessionStorage.modelo = vm.modeloConvite;
    }

    /**
     * @function SetUpMinConvite
     * @desc Configura o mini convite do ultimo passo
     * @memberof SetupController
     */
    function SetUpMinConvite() {
      vm.conviteLink = 'https://celebri.com.br/celebri/template_convite_app/android/template' + sessionStorage.modelo + '_android.png';
    }

  }
})();