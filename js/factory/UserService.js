angular.module("dashboard").factory('UserService', ['$rootScope', function ($rootScope) {

  var padrao = {
    //Login
    ID: null,
    nomeUsuario: '',
    fotoUrl: '',
    senhaApp: '',

    //Dados do Casal
    nomeNoiva: '',
    nomeNoivo: '',
    dataCasamento: null,

    //Dados Convite
    conviteCheck: false,
    noiva_mae: '',
    noiva_mae_memorian: '',
    noiva_pai: '',
    noiva_pai_memorian: '',
    noivo_mae: '',
    noivo_mae_memorian: '',
    noivo_pai: '',
    noivo_pai_memorian: '',
    cerimonia_cep: '',
    cerimonia_end: '',
    cerimonia_numero: '',
    cerimonia_bairro: '',
    cerimonia_uf: '',
    cerimonia_cidade: '',
    cerimonia_local: '',
    cerimonia_rota: '',
    cerimonia_hora: '',
    cerimonia_min: '',

    //Formatacao do Convite
    modeloConvite: 0,
    listaFonts: null,
    listaConvites: null,
    conviteCriado: true,
    bloco_msg_1: {
      'font-family': null,
      'text-align': 'right',
      'color': 'black',
      'font-id': '29',
      'font-size': '16px'
    },
    bloco_msg_2: {
      'font-family': null,
      'text-align': 'right',
      'color': 'black',
      'font-id': '29',
      'font-size': '16px'
    },
    bloco_msg_personalizada_style: {
      'font-family': null,
      'text-align': 'right',
      'color': 'black',
      'font-id': '29',
      'font-size': '16px',
      'conteudo': null
    },
    bloco_cerimonia: {
      'font-family': null,
      'text-align': 'right',
      'color': 'black',
      'font-id': '29',
      'font-size': '16px'
    },
    bloco_nome_dos_noivos: {
      'font-family': null,
      'text-align': 'right',
      'color': 'black',
      'font-id': '29',
      'font-size': '16px'
    },
    bloco_pais_noiva: {
      'font-family': null,
      'text-align': 'right',
      'color': 'black',
      'font-id': '29',
      'font-size': '16px'
    },
    bloco_pais_noivo: {
      'font-family': null,
      'text-align': 'right',
      'color': 'black',
      'font-id': '29',
      'font-size': '16px'
    },

    //Recepcao
    festaCheck: false,
    festa_igual_cerimonia: '',
    festa_local: '',
    festa_end: '',
    festa_numero: '',
    festa_bairro: '',
    festa_uf: '',
    festa_cidade: '',
    festa_rota: '',
    festa_cep: '',
    lista_hotel: '',
    lista_salao: '',
    lista_presente: '',
    lista_cardapio: '',

    //Convidados
    convidado_lista: null,

    //Save the Date
    dateCheck: false,
    modeloDate: '',
    msgDate: ''
  };

  var service = {

    dados: null,

    SaveState: function () {
      sessionStorage.UserService = angular.toJson(service.dados);
    },

    RestoreState: function () {
      try {
        service.dados = angular.fromJson(sessionStorage.UserService);
      } catch (error) {
        service.dados = padrao;
      }

    },
    Remove: function () {
      sessionStorage.UserService = null;
      service.dados = padrao;
    }
  };

  $rootScope.$on("savestate", service.SaveState);
  $rootScope.$on("restorestate", service.RestoreState);

  return service;
}]);