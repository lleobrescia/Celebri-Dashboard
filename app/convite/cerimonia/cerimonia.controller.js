(function() {
  'use strict';

  angular
    .module('dashboard')
    .controller('CerimoniaController', CerimoniaController);

  CerimoniaController.$inject = ['serverService', 'conversorService', 'session'];

  function CerimoniaController(serverService, conversorService, session) {
    const ID = session.user.id;
    var vm = this;

    vm.carregando = true;
    vm.dados = {
      'ConfiguracaoConvite': {
        '@xmlns': 'http://schemas.datacontract.org/2004/07/WcfServiceCasamento',
        '@xmlns:i': 'http://www.w3.org/2001/XMLSchema-instance',
        'Bairro': '',
        'Cep': '',
        'Cidade': '',
        'Endereco': '',
        'Estado': '',
        'Horario_cerimonia': '',
        'Id_usuario_logado': ID,
        'Local_cerimonia': '',
        'Mae_noiva': 'mae',
        'Mae_noiva_in_memoriam': 'false',
        'Mae_noivo': 'mae',
        'Mae_noivo_in_memoriam': 'false',
        'Msg1': '',
        'Msg2': '',
        'Msg3': '',
        'Msg4': '',
        'Msg5': '',
        'Msg6': '',
        'Numero': '12',
        'Obs': '',
        'Pai_noiva': 'pai',
        'Pai_noiva_in_memoriam': 'false',
        'Pai_noivo': 'pai',
        'Pai_noivo_in_memoriam': 'false',
        'Pais': '',
        'TemplateConviteApp': '0',
        'Tracar_rota_local': 'false'
      }
    };
    vm.hora = '';
    vm.min = '';

    vm.Cancelar = GetDados;
    vm.Salvar = SetDados;

    Activate();

    ////////////////

    function Activate() {
      GetDados();
    }

    function GetDados() {
      vm.carregando = true;

      serverService.Get('RetornarConfiguracaoConvite', ID).then(function(resp) {
        vm.dados = angular.fromJson(conversorService.Xml2Json(resp.data, ''));
        var horario = vm.dados.ConfiguracaoConvite.Horario_cerimonia.split(":");

        session.user.cerimonia = vm.dados;
        session.SaveState();

        vm.hora = horario[0];
        vm.min = horario[1];

        vm.carregando = false;
      });
    }

    function SetDados() {
      vm.dados.ConfiguracaoConvite.Horario_cerimonia = vm.hora + ':' + vm.min;
      var dados = conversorService.Json2Xml(vm.dados, '');

      session.user.cerimonia = vm.dados;
      session.SaveState();

      serverService.Request('ConfiguracaoConvite', dados).then(function(resp) {});
    }
  }
})();