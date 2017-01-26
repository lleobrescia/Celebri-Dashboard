(function () {
  'use strict';

  angular
    .module('dashboard')
    .controller('SidebarController', SidebarController);

  SidebarController.$inject = ['session', '$state'];
  /**
   * @memberof dashboard
   * @ngdoc controller
   * @scope {}
   * @name SidebarController
   * @author Leo Brescia <leonardo@leobrescia.com.br>
   * @desc Controla a barra lateral do dashboard.<br>
   * Pasta de origem : app/sidebar <br>
   * Controller As : sidebar<br>
   * Template Url : app/sidebar/sidebar.html <br><br>
   * @param {service} session    - usado para armazenar e buscar dados no session (session.service.js)
   * @param {service} $state - usado para converter xml <-> json (conversor.service.js)
   * @see Veja [Angular DOC]    {@link https://docs.angularjs.org/guide/controller} Para mais informações
   * @see Veja [John Papa DOC]  {@link https://github.com/johnpapa/angular-styleguide/tree/master/a1#controllers} Para melhores praticas
   */
  function SidebarController(session, $state) {
    var vm = this;

    vm.menu = [{
      name: 'Pagamento',
      state: 'pagamento',
      type: 'link'
    }, {
      name: 'Casal',
      state: 'casal',
      type: 'link'
    }, {
      name: 'Convite',
      type: 'toggle',
      pages: [{
        name: 'Configurar',
        state: 'cerimonia',
        type: 'link'
      }, {
        name: 'Save the Date',
        state: 'savethedate',
        type: 'link'
      }, {
        name: 'Aplicativo',
        state: 'aplicativo',
        type: 'link'
      }, {
        name: 'Enviar',
        state: 'enviarConvite',
        type: 'link'
      }]
    }, {
      name: 'Informações Adicionais',
      type: 'toggle',
      pages: [{
          name: 'Recepção',
          state: 'recepcao',
          type: 'link'
        }, {
          name: 'Dicas de Hotel',
          state: 'hotel',
          type: 'link'
        }, {
          name: 'Dicas de Salão de Beleza',
          state: 'salao',
          type: 'link'
        }, {
          name: 'Lista de Presentes',
          state: 'presentes',
          type: 'link'
        }, {
          name: 'Cardápio',
          state: 'cardapio',
          type: 'link'
        },
        {
          name: 'Cotas de Lua de Mel',
          state: 'cotas',
          type: 'link'
        }
      ]
    }, {
      name: 'Convidados',
      type: 'toggle',
      pages: [{
        name: 'Cadastrar',
        state: 'cadastrarConvidados',
        type: 'link'
      }, {
        name: 'Confirmados',
        state: 'convidadosConfirmados',
        type: 'link'
      }]
    }, {
      name: 'Estatísticas',
      state: 'estatisticas',
      type: 'link'
    }];
    vm.openedSection = null;
    vm.userName = session.user.casal.nomeUser;

    /**
     * Atribuição das funçoes as variaveis do escopo
     */
    vm.IsSectionSelected = IsSectionSelected;
    vm.Sair = Sair;
    vm.ToggleSection = ToggleSection;

    Activate();

    ////////////////

    /**
     * @function Activate
     * @desc Setup docontrolador. Exetuca assim que o controlador inicia
     * @memberof SidebarController
     */
    function Activate() {}

    /**
     * @function IsSectionSelected
     * @desc Verifica se o menu clicado eh o ativo. Serve para alterar a classe do menu
     * @param {object} section - section do menu
     * @return {boolean}
     * @memberof SidebarController
     */
    function IsSectionSelected(section) {
      return vm.openedSection === section;
    }

    /**
     * @function Sair
     * @desc Apaga o session do usuario e envia ele para o login
     * @memberof SidebarController
     */
    function Sair() {
      session.user.id = null;
      session.SaveState();
      session.Remove();
    }

    /**
     * @function ToggleSection
     * @desc Abre a seção do menu.
     * @memberof SidebarController
     */
    function ToggleSection(section) {
      vm.openedSection = (vm.openedSection === section ? null : section);
    }

  }
})();