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
    noivaMae: '',
    noivaMaeMmemorian: '',
    noivaPai: '',
    noivaPaiMemorian: '',
    noivoMae: '',
    noivoMaeMemorian: '',
    noivoPai: '',
    noivoPaiMemorian: '',
    cerimoniaCep: '',
    cerimoniaEnd: '',
    cerimoniaNumero: '',
    cerimoniaBairro: '',
    cerimoniaUf: '',
    cerimoniaCidade: '',
    cerimoniaLocal: '',
    cerimoniaRota: '',
    cerimoniaHora: '',
    cerimoniaMin: '',

    //Formatacao do Convite
    modeloConvite: 0,
    listaFonts: null,
    listaConvites: null,
    conviteCriado: true,
    blocoMsg1: {
      'font-family': null,
      'text-align': 'right',
      'color': 'black',
      'font-id': '29',
      'font-size': '16px'
    },
    blocoMsg2: {
      'font-family': null,
      'text-align': 'right',
      'color': 'black',
      'font-id': '29',
      'font-size': '16px'
    },
    blocoMsgPersonalizadaStyle: {
      'font-family': null,
      'text-align': 'right',
      'color': 'black',
      'font-id': '29',
      'font-size': '16px',
      'conteudo': null
    },
    blocoCerimonia: {
      'font-family': null,
      'text-align': 'right',
      'color': 'black',
      'font-id': '29',
      'font-size': '16px'
    },
    blocoNomeNoivos: {
      'font-family': null,
      'text-align': 'right',
      'color': 'black',
      'font-id': '29',
      'font-size': '16px'
    },
    blocoPaisNoiva: {
      'font-family': null,
      'text-align': 'right',
      'color': 'black',
      'font-id': '29',
      'font-size': '16px'
    },
    blocoPaisNoivo: {
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