(function() {
  'use strict';

  angular
    .module('dashboard')
    .controller('ConviteController', ConviteController);

  ConviteController.$inject = ['serverService', 'conversorService', 'session'];

  function ConviteController(serverService, conversorService, session) {
    const ID = session.user.id;
    var vm = this;

    vm.dialogUp = false;
    vm.idConvite = 0;
    vm.imageSelected = '';

    vm.thumbs = [{
        ID: 1,
        url: 'image/convites/thumb/thumb1.png',
        nome: 'Laranja'
      },
      {
        ID: 2,
        url: 'image/convites/thumb/thumb2.png',
        nome: 'Arabescos'
      },
      {
        ID: 3,
        url: 'image/convites/thumb/thumb3.png',
        nome: 'Ramos'
      },
      {
        ID: 4,
        url: 'image/convites/thumb/thumb4.png',
        nome: 'Plain'
      },
      {
        ID: 5,
        url: 'image/convites/thumb/thumb5.png',
        nome: 'Orquidea'
      },
      {
        ID: 6,
        url: 'image/convites/thumb/thumb6.png',
        nome: 'Gold'
      },
      {
        ID: 7,
        url: 'image/convites/thumb/thumb7.png',
        nome: 'Floral'
      },
      {
        ID: 9,
        url: 'image/convites/thumb/thumb9.png',
        nome: 'Árvore'
      }
    ];

    vm.SelectConvite = SelectConvite;


    Activate();

    ////////////////

    function Activate() {}

    function SelectConvite(id, url) {
      vm.imageSelected = url;
      vm.idConvite = id;
      vm.dialogUp = true;
    }

  }
})();