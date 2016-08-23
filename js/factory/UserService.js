/**
 * User Service Factory
 * @namespace Factories
 */
(function () {
  'use strict';
  angular
    .module('dashboard')
    .factory('UserService', UserService);

  UserService.$inject = ['$rootScope'];

  /**
    * @namespace UserService
    * @memberOf Factories
    */
  function UserService($rootScope) {

    //Todos os dados do usuario
    var padrao = {
      //Login
      ID: null,
      nomeUsuario: '',
      emailUsuario: '',
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
      festaIgualCerimonia: '',
      festaLocal: '',
      festaEnd: '',
      festaNumero: '',
      festaBairro: '',
      festaUf: '',
      festaCidade: '',
      festaRota: '',
      festaCep: '',
      listaHotel: '',
      listaSalao: '',
      listaPresente: '',
      listaCardapio: '',

      //Convidados
      convidadoLista: null,

      //Save the Date
      dateCheck: false,
      modeloDate: '',
      msgDate: ''
    };

    /**
      * @namespace UserService
      * @desc Gerencia todos os dados do usuario. Utiliza local session.
      * @memberOf Factories.UserService
      */
    var service = {
      dados: null,

      //Sava os dados
      SaveState: function () {
        sessionStorage.UserService = angular.toJson(service.dados);
      },

      //Carrega os dados
      RestoreState: function () {
        try {
          service.dados = angular.fromJson(sessionStorage.UserService);
        } catch (error) {
          service.dados = padrao;
        }
      },

      //Remove os dados
      Remove: function () {
        sessionStorage.UserService = null;
        service.dados = padrao;
      }
    };

    //Eh usando para quando o usuario muda de pagina para salvar e restaurar os dados
    $rootScope.$on('savestate', service.SaveState);
    $rootScope.$on('restorestate', service.RestoreState);

    return service;
  }
} ());