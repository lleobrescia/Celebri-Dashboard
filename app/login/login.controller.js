(function() {
  'use strict';

  angular
    .module('dashboard')
    .controller('LoginController', LoginController);

  LoginController.$inject = ['serverService', 'conversorService', 'session', '$rootScope', '$state'];

  function LoginController(serverService, conversorService, session, $rootScope, $state) {
    var vm = this;

    vm.carregando = false;
    vm.dados = {
      'Autenticacao': {
        '@xmlns': 'http://schemas.datacontract.org/2004/07/WcfServiceCasamento',
        'Email': '',
        'Senha': ''
      }
    };
    vm.errorMessage = null;

    vm.Autenticar = Autenticar;

    Activate();

    ////////////////

    function Activate() {
      $rootScope.pagante = true;
      session.Remove();
    }

    function Autenticar() {
      vm.carregando = true;
      var xml = conversorService.Json2Xml(vm.dados, '');
      serverService.Request('AutenticacaoNoivos', xml).then(function(resp) {
        resp = angular.fromJson(conversorService.Xml2Json(resp.data, ''));

        if (!resp.ResultadoAutenticacaoNoivos.ErrorMessage) {
          session.user.id = resp.ResultadoAutenticacaoNoivos.Id_usuario_logado;
          session.user.casal.nomeNoivo = resp.ResultadoAutenticacaoNoivos.NomeNoivo;
          session.user.casal.nomeNoiva = resp.ResultadoAutenticacaoNoivos.NomeNoiva;
          session.user.casal.generoNoiva = resp.ResultadoAutenticacaoNoivos.GeneroNoiva;
          session.user.casal.generoNoivo = resp.ResultadoAutenticacaoNoivos.GeneroNoivo;
          session.user.casal.urlFoto = resp.ResultadoAutenticacaoNoivos.Url_foto;

          if (resp.ResultadoAutenticacaoNoivos.EmailNoiva === vm.dados.Autenticacao.Email) {
            session.user.casal.emailUsuario = resp.ResultadoAutenticacaoNoivos.EmailNoiva;
            session.user.casal.senhaApp = resp.ResultadoAutenticacaoNoivos.SenhaNoivaConvidado;
          } else {
            session.user.casal.emailUsuario = resp.ResultadoAutenticacaoNoivos.EmailNoivo;
            session.user.casal.senhaApp = resp.ResultadoAutenticacaoNoivos.SenhaNoivoConvidado;
          }

          if (resp.ResultadoAutenticacaoNoivos.Url_foto === 'NULL') {
            session.user.casal.urlFoto = null;
          } else {
            var d = new Date();
            var h = d.getHours();
            var m = d.getMinutes();
            session.user.casal.urlFoto = resp.ResultadoAutenticacaoNoivos.Url_foto + '?' + h + ':' + m;
          }

          if (!resp.ResultadoAutenticacaoNoivos.Pagamento_realizado) {
            var dias = CheckVencimento(resp.ResultadoAutenticacaoNoivos.DataCadastro);

            console.log(dias);
            console.log(resp.ResultadoAutenticacaoNoivos.DataCadastro);

            if (dias < 16) {
              session.user.usuarioLiberado = $rootScope.liberado = true;
              session.user.diasCadastros = $rootScope.dias = dias;
              $rootScope.pagante = false;
              session.SaveState();

              GetDataCasamento();
            } else {
              vm.errorMessage = 'Seu período de degustação acabou';
              vm.carregando = false;
            }
          } else {
            session.user.pagante = $rootScope.pagante = true;
            GetDataCasamento();
          }
        } else {
          vm.errorMessage = resp.ResultadoAutenticacaoNoivos.ErrorMessage;
          vm.carregando = false;
        }
      });
    }

    function CheckVencimento(data) {
      data = data.split('/');
      var date1 = new Date();
      var date2 = new Date(data[2], data[1] - 1, data[0]);
      var timeDiff = Math.abs(date2.getTime() - date1.getTime());
      var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));

      return diffDays;
    }

    function GetDataCasamento() {
      serverService.Get('RetornarDadosCadastroNoivos', session.user.id).then(function(resp) {
        var dados = angular.fromJson(conversorService.Xml2Json(resp.data, ''));
        session.user.casal.dataCasamento = dados.Casal.DataCasamento;

        session.SaveState();

        vm.carregando = false;
        $state.go('casal');
      });
    }
  }
})();