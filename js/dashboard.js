// INIT
angular.module("dashboard", ['ngRoute', 'ngFileUpload', 'ngMask', 'rzModule', 'ngAnimate', 'ui.bootstrap', 'chart.js', 'ngCookies', 'ngImageEditor']);

angular.module("dashboard").run(['$rootScope', '$location', '$cookies', 'user', function ($rootScope, $location, $cookies, user) {

  $rootScope.$on('$routeChangeStart', function (event, next) {

    var usuario = $cookies.getObject('user');
    var userAuthenticated = false;

    if (usuario != undefined) {
      userAuthenticated = true;
      user = usuario;
    }

    if (!userAuthenticated && !next.isLogin) {
      //Remove o cookie
      $cookies.remove('user');

      //garante que os dados serao apagados
      user = null;
      $location.path('/login');
    }
  });
}]);

// Variavel Global. Armazena todos os dados do usuario
angular.module("dashboard")
  .value("user", {
    id: null,
    nomeUsuario: null,
    foto: null,
    senhaApp: null,
    dadosCasal: {
      nome_noiva: null,
      nome_noivo: null,
      data_casamento: null
    },
    convite_dados: {
      cerimonia_local: null,
      cerimonia_end: null,
      cerimonia_numero: null,
      cerimonia_bairro: null,
      cerimonia_cidade: null,
      cerimonia_uf: null,
      cerimonia_rota: null,
      cerimonia_cep: null,
      cerimonia_hora: null,
      cerimonia_min: null,
      noiva_mae: null,
      noiva_pai: null,
      noivo_mae: null,
      noivo_pai: null,
      noiva_mae_memorian: null,
      noiva_pai_memorian: null,
      noivo_mae_memorian: null,
      noivo_pai_memorian: null,
    },
    convite_formatacao: {
      bloco_msg_1: {
        'font-family': '29'
      },
      bloco_msg_2: {
        'font-family': '29'
      },
      bloco_msg_personalizada_style: {
        'font-family': '29'
      },
      bloco_cerimonia: {
        'font-family': '29'
      },
      bloco_nome_dos_noivos: {
        'font-family': '7'
      },
      bloco_pais_noiva: {
        'font-family': '29'
      },
      bloco_pais_noivo: {
        'font-family': '29'
      }
    },
    recepcao: {
      festa_igual_cerimonia: null,
      festa_local: null,
      festa_end: null,
      festa_numero: null,
      festa_bairro: null,
      festa_uf: null,
      festa_cidade: null,
      festa_rota: null,
      festa_cep: null,
      haveMoip: false
    },
    saveDate: {
      modelo: null,
      mensagem: null,
    },
    lista_hotel: [],
    lista_salao: [],
    lista_presente: [],
    lista_convidados: null,
    lista_cardapio: [],
    lista_presentes_lua_mel: []
  });