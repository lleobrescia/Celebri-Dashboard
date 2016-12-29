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
            state: 'pagamento',
            type: 'link'
          }, {
            name: 'Save the Date',
            state: 'pagamento',
            type: 'link'
          },
          {
            name: 'Enviar',
            state: 'pagamento',
            type: 'link'
          }
        ]
      },
      {
        name: 'Evento',
        type: 'toggle',
        pages: [{
            name: 'Recepção',
            state: 'pagamento',
            type: 'link'
          }, {
            name: 'Dicas de Hotel',
            state: 'pagamento',
            type: 'link'
          },
          {
            name: 'Dicas de Salão de Beleza',
            state: 'pagamento',
            type: 'link'
          },
          {
            name: 'Lista de Presentes',
            state: 'pagamento',
            type: 'link'
          },
          {
            name: 'Cardápio',
            state: 'pagamento',
            type: 'link'
          }
        ]
      },
      {
        name: 'Convidados',
        type: 'toggle',
        pages: [{
          name: 'Cadastrar',
          state: 'pagamento',
          type: 'link'
        }, {
          name: 'Confirmados',
          state: 'pagamento',
          type: 'link'
        }]
      },
      {
        name: 'Estatisticas',
        state: 'pagamento',
        type: 'link'
      }
    ];

    Activate();

    ////////////////

    function Activate() {

      console.log(vm.menu);
    }
  }
})();