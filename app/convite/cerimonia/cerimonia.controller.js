(function () {
  'use strict';

  angular
    .module('dashboard')
    .controller('CerimoniaController', CerimoniaController);

  CerimoniaController.$inject = ['serverService', 'conversorService', 'session', 'toastr', 'consultCEP'];

  function CerimoniaController(serverService, conversorService, session, toastr, consultCEP) {
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
        'Msg1': 'null',
        'Msg2': 'null',
        'Msg3': 'null',
        'Msg4': 'null',
        'Msg5': 'null',
        'Msg6': 'null',
        'Numero': '',
        'Obs': 'null',
        'Pai_noiva': '',
        'Pai_noiva_in_memoriam': 'false',
        'Pai_noivo': '',
        'Pai_noivo_in_memoriam': 'false',
        'Pais': 'null',
        'TemplateConviteApp': '0',
        'Tracar_rota_local': 'true'
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
    vm.ConsultCEP = ConsultCEP;
    vm.Salvar = SetDados;

    Activate();

    ////////////////

    function Activate() {
      GetDados();
    }

    function ConsultCEP() {
      consultCEP.consultar(vm.dados.ConfiguracaoConvite.Cep).then(function (resp) {
        vm.dados.ConfiguracaoConvite.Endereco = resp.logradouro;
        vm.dados.ConfiguracaoConvite.Bairro = resp.bairro;
        vm.dados.ConfiguracaoConvite.Cidade = resp.cidade;
        vm.dados.ConfiguracaoConvite.Estado = resp.estado;
      });
    }

    function GetDados() {
      vm.carregando = true;

      serverService.Get('RetornarConfiguracaoConvite', ID).then(function (resp) {
        resp = angular.fromJson(conversorService.Xml2Json(resp.data, ''));

        console.log(resp);

        try {
          var horario = resp.ConfiguracaoConvite.Horario_cerimonia.split(":");
          resp.ConfiguracaoConvite.Tracar_rota_local = 'true';
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