/**
 * Sidebar Convite Controller
 * controllerAs: 'sidebar'
 * @namespace Controllers
 */
(function () {
  'use strict';
  angular
    .module('dashboard')
    .controller('SidebarCtrl', SidebarCtrl);

  SidebarCtrl.$inject = ['$location', 'UserService', '$scope', '$mdDialog'];

  /**
   * @namespace SidebarCtrl
   * @desc Responsavel pela barra lateral do dashboard
   * @memberOf Controllers
   */
  function SidebarCtrl($location, UserService, $scope, $mdDialog) {

    var self  = this;
    var id    = UserService.dados.ID;
    var originatorEv;

    self.usuarioLogado = UserService.dados.nomeUsuario;
    self.menu          = [ //Lista do menu
      {
        Id: 1,
        Name  : 'Dados do Casal',
        url   : 'dados-do-casal'
      },
      {
        Id: 2,
        Name  : 'Configurar Convite',
        url   : 'configurar-convite'
      },
      {
        Id: 3,
        Name  : 'Configurar Evento',
        url   : 'configurar-evento'
      },
      {
        Id: 4,
        Name  : 'Cadastrar Convidados',
        url   : 'cadastrar-convidados'
      },
      {
        Id: 5,
        Name  : 'Save the Date',
        url   : 'save-the-date'
      },
      {
        Id: 6,
        Name  : 'Enviar Convite',
        url   : 'enviar-convite'
      },
      {
        Id: 7,
        Name  : 'Lista de Confirmados',
        url   : 'confirmados'
      },
      {
        Id: 8,
        Name  : 'Estatísticas do Convite',
        url   : 'estatisticas'
      }
    ];

    $scope.IsActive = IsActive;
    self.Sair       = Sair;
    self.OpenMenu   = OpenMenu;

  /**
   * @name IsActive
   * @param {String} menu que o usuario clicou
   * @desc Ativa o menu conrrespondente ao local que o usuario esta
   * @memberOf Controllers.SidebarCtrl
   */
    function IsActive(viewLocation) {
      var retorno = false;
      if (viewLocation === $location.path() || viewLocation + '/2' === $location.path()) {
        retorno = true;
      }
      return retorno;
    }

  /**
   * @name Sair
   * @desc Remove os dados local e envia o susuario para o login
   * @memberOf Controllers.SidebarCtrl
   */
    function Sair() {
      UserService.dados.ID = null;
      UserService.Remove();

      //direciona para a pagina de login
      $location.path('/login');
    }

    function OpenMenu($mdOpenMenu, ev){
      originatorEv = ev;
      $mdOpenMenu(ev);
    }
  }
} ());