(function () {
  'use strict';

  angular
    .module('dashboard')
    .controller('CerimoniaController', CerimoniaController);

  CerimoniaController.$inject = ['serverService', 'conversorService', 'session', 'toastr'];

  function CerimoniaController(serverService, conversorService, session, toastr) {
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
        'Mae_noiva': '',
        'Mae_noiva_in_memoriam': 'false',
        'Mae_noivo': '',
        'Mae_noivo_in_memoriam': 'false',
        'Msg1': '',
        'Msg2': '',
        'Msg3': '',
        'Msg4': '',
        'Msg5': '',
        'Msg6': '',
        'Numero': '',
        'Obs': '',
        'Pai_noiva': '',
        'Pai_noiva_in_memoriam': 'false',
        'Pai_noivo': '',
        'Pai_noivo_in_memoriam': 'false',
        'Pais': '',
        'TemplateConviteApp': '0',
        'Tracar_rota_local': 'false'
      }
    };
    vm.erro = false;
    vm.genero = {
      'noiva': session.user.casal.generoNoiva,
      'noivo': session.user.casal.generoNoivo
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

      serverService.Get('RetornarConfiguracaoConvite', ID).then(function (resp) {
        resp = angular.fromJson(conversorService.Xml2Json(resp.data, ''));
        try {
          var horario = resp.ConfiguracaoConvite.Horario_cerimonia.split(":");
          vm.dados = resp;
          vm.hora = horario[0];
          vm.min = horario[1];
        } catch (error) {}

        session.user.cerimonia = vm.dados;
        session.SaveState();

        vm.carregando = false;
      }).catch(function (error) {
        console.error('RetornarConfiguracaoConvite -> ', error);
        vm.carregando = false;
        vm.erro = true;
        toastr.error('Ocorreu um erro ao tentar acessar o servidor', 'Erro');
      });
    }

    function SetDados() {
      vm.carregando = true;
      vm.dados.ConfiguracaoConvite.Horario_cerimonia = vm.hora + ':' + vm.min;
      var dados = conversorService.Json2Xml(vm.dados, '');

      session.user.cerimonia = vm.dados;
      session.SaveState();

      serverService.Request('ConfiguracaoConvite', dados).then(function (resp) {
        vm.carregando = false;
        toastr.success('Alterações Salvas!');
      }).catch(function (error) {
        console.error('RetornarConfiguracaoConvite -> ', error);
        vm.carregando = false;
        vm.erro = true;
        toastr.error('Ocorreu um erro ao tentar acessar o servidor', 'Erro');
      });
    }
  }
})();