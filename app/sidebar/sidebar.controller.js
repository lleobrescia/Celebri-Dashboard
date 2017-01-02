(function() {
  'use strict';

  angular
    .module('dashboard')
    .controller('SidebarController', SidebarController);

  SidebarController.$inject = [];

  function SidebarController() {
    var vm = this;

    vm.menu = [{
        name: 'Pagamento',
        state: 'pagamento',
        type: 'link'
      },
      {
        name: 'Casal',
        state: 'casal',
        type: 'link'
      },
      {
        name: 'Convite',
        type: 'toggle',
        pages: [{
            name: 'Configurar',
            state: 'configurarConvite',
            type: 'link'
          }, {
            name: 'Save the Date',
            state: 'savethedate',
            type: 'link'
          },
          {
            name: 'Enviar',
            state: 'enviarConvite',
            type: 'link'
          }
        ]
      },
      {
        name: 'Evento',
        type: 'toggle',
        pages: [{
            name: 'Recepção',
            state: 'recepcao',
            type: 'link'
          }, {
            name: 'Dicas de Hotel',
            state: 'hotel',
            type: 'link'
          },
          {
            name: 'Dicas de Salão de Beleza',
            state: 'salao',
            type: 'link'
          },
          {
            name: 'Lista de Presentes',
            state: 'presentes',
            type: 'link'
          },
          {
            name: 'Cardápio',
            state: 'cardapio',
            type: 'link'
          },
          // {
          //   name: 'Cotas de Lua de Mel',
          //   state: 'cotas',
          //   type: 'link'
          // }
        ]
      },
      {
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
      },
      {
        name: 'Estatisticas',
        state: 'estatisticas',
        type: 'link'
      }
    ];
    vm.openedSection = null;

    vm.IsSectionSelected = IsSectionSelected;
    vm.Sair = Sair;
    vm.ToggleSection = ToggleSection;

    Activate();

    ////////////////

    function Activate() {}

    function IsSectionSelected(section) {
      return vm.openedSection === section;
    }

    function Sair() {
      // TODO:Sair
    }

    function ToggleSection(section) {
      vm.openedSection = (vm.openedSection === section ? null : section);
    }

  }
})();