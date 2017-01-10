(function () {
  'use strict';

  angular
    .module('dashboard')
    .controller('LoginController', LoginController);

  LoginController.$inject = ['serverService', 'conversorService', 'session', '$rootScope', '$state'];

  function LoginController(serverService, conversorService, session, $rootScope, $state) {
    var vm = this;

    vm.carregando = false;
    vm.confirmacao = false;
    vm.dados = {
      'Autenticacao': {
        '@xmlns': 'http://schemas.datacontract.org/2004/07/WcfServiceCasamento',
        'Email': '',
        'Senha': ''
      }
    };
    vm.erro = false; //usadado para avisa ao usuario que nao foi possivel acessar o servidor
    vm.errorMessage = null;
    vm.recuperar = {
      'EmailCasal': {
        '@xmlns': 'http://schemas.datacontract.org/2004/07/WcfServiceCasamento',
        'Email': ''
      }
    };

    vm.Autenticar = Autenticar;
    vm.RecuperarSenha = RecuperarSenha;

    Activate();

    ////////////////

    function Activate() {
      $rootScope.pagante = true;
      session.user.id = null;
      session.SaveState();
    }

    function Autenticar() {
      vm.carregando = true;
      var xml = conversorService.Json2Xml(vm.dados, '');
      serverService.Request('AutenticacaoNoivos', xml).then(function (resp) {
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
            session.user.casal.nomeUser = resp.ResultadoAutenticacaoNoivos.NomeNoiva;
            session.user.casal.senhaApp = resp.ResultadoAutenticacaoNoivos.SenhaNoivaConvidado;
          } else {
            session.user.casal.emailUsuario = resp.ResultadoAutenticacaoNoivos.EmailNoivo;
            session.user.casal.nomeUser = resp.ResultadoAutenticacaoNoivos.NomeNoivo;
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

          CheckPagamento(resp);

        } else {
          vm.errorMessage = resp.ResultadoAutenticacaoNoivos.ErrorMessage;
          vm.carregando = false;
        }
      }).catch(function (error) {
        console.error('AutenticacaoNoivos', error);
        vm.carregando = false;
        vm.erro = true;
      });
    }

    function RegistrarPagamnto(id, origem) {
      var dado = {
        'StatusPagamentoCelebri': {
          '@xmlns': 'http://schemas.datacontract.org/2004/07/WcfServiceCasamento',
          'IdCasal': id,
          'Origem': origem,
          'PagtoAprovado': 'true',
          'Valor': '185.00'
        }
      };

      var xml = conversorService.Json2Xml(dado, '');
      serverService.Request('RegistrarPagamentoCelebri', xml).then(function (resp) {

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

    function CheckPagamento(resp) {
      var dados = {
        'EmailCasal': {
          '@xmlns': 'http://schemas.datacontract.org/2004/07/WcfServiceCasamento',
          'Email': vm.dados.Autenticacao.Email
        }
      };

      if (resp.ResultadoAutenticacaoNoivos.Pagamento_realizado === 'false') {
        var xml = conversorService.Json2Xml(dados, '');
        serverService.Request('RetornarExisteEmailIsentoPagtoCelebri', xml).then(function (dado) {
          dado = angular.fromJson(conversorService.Xml2Json(dado.data, ''));

          if (dado.RetornoExisteEmailIsentoPagtoCelebri.Result === 'false') {
            var dias = CheckVencimento(resp.ResultadoAutenticacaoNoivos.DataCadastro) + 1;

            if (dias < 16) {
              session.user.usuarioLiberado = $rootScope.liberado = true;
              session.user.diasCadastros = $rootScope.dias = dias;
              session.user.pagante = $rootScope.pagante = false;
              session.SaveState();

              GetDataCasamento();
            } else {
              vm.errorMessage = 'Seu período de degustação acabou';
              vm.carregando = false;
            }
          } else {
            RegistrarPagamnto(resp.ResultadoAutenticacaoNoivos.Id_usuario_logado, dado.RetornoExisteEmailIsentoPagtoCelebri.Origem);
            session.user.pagante = $rootScope.pagante = true;
            GetDataCasamento();
          }
        });
      } else {
        session.user.pagante = $rootScope.pagante = true;
        GetDataCasamento();
      }
    }

    function GetDataCasamento() {
      serverService.Get('RetornarDadosCadastroNoivos', session.user.id).then(function (resp) {
        var dados = angular.fromJson(conversorService.Xml2Json(resp.data, ''));
        session.user.casal.dataCasamento = dados.Casal.DataCasamento;

        session.SaveState();

        vm.carregando = false;
        $state.go('casal');
      });
    }

    function RecuperarSenha() {
      vm.carregando = true;
      var xml = conversorService.Json2Xml(vm.recuperar, '');
      serverService.Request('EnviarEmailRecuperacaoSenha', xml).then(function (resp) {
        resp = angular.fromJson(conversorService.Xml2Json(resp.data, ''));

        if (resp.ResultadoRecuperacaoSenha.Result === 'False') {
          vm.errorMessage = 'E-mail não consta na base de dados';
        } else {
          vm.confirmacao = true;
          vm.recuperar.EmailCasal.Email = '';
        }

        vm.carregando = false;
      }).catch(function (error) {
        console.error('EnviarEmailRecuperacaoSenha', error);
        vm.carregando = false;
        vm.erro = true;
      });
    }
  }
})();