(function () {
  'use strict';

  angular
    .module('dashboard')
    .controller('LoginController', LoginController);

  LoginController.$inject = ['serverService', 'conversorService', 'session', '$rootScope', '$state'];

  /**
   * @memberof dashboard
   * @ngdoc controller
   * @scope {}
   * @name LoginController
   * @author Leo Brescia <leonardo@leobrescia.com.br>
   * @desc Realiza o processo de login do usuario.<br>
   * Pasta de origem : app/login <br>
   * State : login <br>
   * Controller As : login<br>
   * Template Url : app/login/login.html <br><br>
   * Usa o serviço(s) do(s) servidor:
   *  - AutenticacaoNoivos {@link http://52.91.166.105/celebri/ServiceCasamento.svc/help/operations/AutenticacaoNoivos}
   *  - RegistrarPagamentoCelebri {@link http://52.91.166.105/celebri/ServiceCasamento.svc/help/operations/RegistrarPagamentoCelebri}
   *  - EnviarEmailRecuperacaoSenha {@link http://52.91.166.105/celebri/ServiceCasamento.svc/help/operations/EnviarEmailRecuperacaoSenha}
   * @param {service} serverService    - usado para comunicar com o servidor (server.service.js)
   * @param {service} conversorService - usado para converter xml <-> json (conversor.service.js)
   * @param {service} session          - usado para armazenar e buscar dados no session (session.service.js)
   * @param {service} $rootScope       - scope geral
   * @param {service} $state           - usado para trocar de view
   * @see Veja [Angular DOC]    {@link https://docs.angularjs.org/guide/controller} Para mais informações
   * @see Veja [John Papa DOC]  {@link https://github.com/johnpapa/angular-styleguide/tree/master/a1#controllers} Para melhores praticas
   * @see Veja [Servidor Help]  {@link http://52.91.166.105/celebri/ServiceCasamento.svc/help} Para saber sobre os serviços do servidor
   */
  function LoginController(serverService, conversorService, session, $rootScope, $state) {
    var vm = this;

    vm.carregando = false; //controla o loading
    vm.confirmacao = false; // controla msgs quando o usuario solicita a recuperação de senha
    //Formato de dados do servidor para autenticar
    vm.dados = {
      'Autenticacao': {
        '@xmlns': 'http://schemas.datacontract.org/2004/07/WcfServiceCasamento',
        'Email': '',
        'Senha': ''
      }
    };
    vm.erro = false; //usadado para avisa ao usuario que nao foi possivel acessar o servidor
    vm.errorMessage = null;
    //Formato de dados do servidor para recuperar senha
    vm.recuperar = {
      'EmailCasal': {
        '@xmlns': 'http://schemas.datacontract.org/2004/07/WcfServiceCasamento',
        'Email': ''
      }
    };

    /**
     * Atribuição das funçoes as variaveis do escopo
     */
    vm.Autenticar = Autenticar;
    vm.RecuperarSenha = RecuperarSenha;

    Activate();

    ////////////////

    /**
     * @function Activate
     * @desc Setup docontrolador. Exetuca assim que o controlador inicia
     * @memberof LoginController
     */
    function Activate() {
      $rootScope.pagante = true;
      session.user.id = null;
      session.SaveState();
    }

    /**
     * @function Autenticar
     * @desc Verifica se o usuario esta cadastrado no sistema. Depois verifica se
     * é pagante e se o periodo de degustação acabou
     * @memberof LoginController
     */
    function Autenticar() {
      vm.carregando = true; //Ativa loading
      var xml = conversorService.Json2Xml(vm.dados, '');
      serverService.Request('AutenticacaoNoivos', xml).then(function (resp) {
        resp = angular.fromJson(conversorService.Xml2Json(resp.data, ''));

        //Autenticado
        if (!resp.ResultadoAutenticacaoNoivos.ErrorMessage) {
          //Guarda as informações do casal e usuario
          session.user.id = resp.ResultadoAutenticacaoNoivos.Id_usuario_logado;
          session.user.casal.nomeNoivo = resp.ResultadoAutenticacaoNoivos.NomeNoivo;
          session.user.casal.nomeNoiva = resp.ResultadoAutenticacaoNoivos.NomeNoiva;
          session.user.casal.generoNoiva = resp.ResultadoAutenticacaoNoivos.GeneroNoiva;
          session.user.casal.generoNoivo = resp.ResultadoAutenticacaoNoivos.GeneroNoivo;
          session.user.casal.urlFoto = resp.ResultadoAutenticacaoNoivos.Url_foto;

          /**
           * Verifica qual do casal esta logado.
           * Isso serve para parsonalizar a barra lateral
           */
          if (resp.ResultadoAutenticacaoNoivos.EmailNoiva === vm.dados.Autenticacao.Email) {
            session.user.casal.emailUsuario = resp.ResultadoAutenticacaoNoivos.EmailNoiva;
            session.user.casal.nomeUser = resp.ResultadoAutenticacaoNoivos.NomeNoiva;
            session.user.casal.senhaApp = resp.ResultadoAutenticacaoNoivos.SenhaNoivaConvidado;
          } else {
            session.user.casal.emailUsuario = resp.ResultadoAutenticacaoNoivos.EmailNoivo;
            session.user.casal.nomeUser = resp.ResultadoAutenticacaoNoivos.NomeNoivo;
            session.user.casal.senhaApp = resp.ResultadoAutenticacaoNoivos.SenhaNoivoConvidado;
          }

          //Verifica se o casal ja subiu alguma foto
          if (resp.ResultadoAutenticacaoNoivos.Url_foto === 'NULL') {
            session.user.casal.urlFoto = null;
          } else {
            //Ao adicionar ?+ data atual, efeita que a imagem fique em cache.
            var d = new Date();
            var h = d.getHours();
            var m = d.getMinutes();
            session.user.casal.urlFoto = resp.ResultadoAutenticacaoNoivos.Url_foto + '?' + h + ':' + m;
          }

          CheckPagamento(resp); //Verifica se pagou

        } else { // Nao autenticado
          vm.errorMessage = resp.ResultadoAutenticacaoNoivos.ErrorMessage;
          vm.carregando = false;
        }
      }).catch(function (error) {
        /**
         * Esse bloco eh executado caso haja algum erro no envio de dados para o servidor
         */
        console.error('AutenticacaoNoivos', error);
        vm.carregando = false;
        vm.erro = true;
      });
    }

    /**
     * @function RegistrarPagamnto
     * @desc Registra o casal como pagantes
     * @param {number} id - Id do casal
     * @param {string} origem - origem do pagamento
     * @memberof LoginController
     */
    function RegistrarPagamnto(id, origem) {
      var dado = {
        'DadosPagamentoCelebri': {
          '@xmlns': 'http://schemas.datacontract.org/2004/07/WcfServiceCasamento',
          'IdCasal': id,
          'Origem': origem,
          'PagtoAprovado': 'true',
          'Valor': '185.00'
        }
      };

      var xml = conversorService.Json2Xml(dado, '');
      serverService.Request('RegistrarPagamentoCelebri', xml);
    }

    /**
     * @function CheckVencimento
     * @desc Calcula a diferença, em dias, entre a data fornecida e a atual
     * @param {string} data - data de cadastro do casal
     * @return {number}
     * @memberof LoginController
     */
    function CheckVencimento(data) {
      data = data.split('/');
      var date1 = new Date();
      var date2 = new Date(data[2], data[1] - 1, data[0]);
      var timeDiff = Math.abs(date2.getTime() - date1.getTime());
      var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));

      return diffDays - 1;
    }

    /**
     * @function CheckPagamento
     * @desc Verifica se o usuario pagou
     * @param {object} resp - resposta da autenticação
     * @memberof LoginController
     */
    function CheckPagamento(resp) {
      var dados = {
        'EmailCasal': {
          '@xmlns': 'http://schemas.datacontract.org/2004/07/WcfServiceCasamento',
          'Email': vm.dados.Autenticacao.Email
        }
      };

      //Casal nao pagou dentro do dashboard
      if (resp.ResultadoAutenticacaoNoivos.Pagamento_realizado === 'false') {
        var xml = conversorService.Json2Xml(dados, '');
        serverService.Request('RetornarExisteEmailIsentoPagtoCelebri', xml).then(function (dado) {
          dado = angular.fromJson(conversorService.Xml2Json(dado.data, ''));

          //Casal nao pagou fora do dashboard
          if (dado.RetornoExisteEmailIsentoPagtoCelebri.Result === 'false') {
            var dias = CheckVencimento(resp.ResultadoAutenticacaoNoivos.DataCadastro);

            if (dias < 16) { //Dentro do periodo de degustacao
              session.user.usuarioLiberado = $rootScope.liberado = true;
              session.user.diasCadastros = $rootScope.dias = dias;
              session.user.pagante = $rootScope.pagante = false;
              session.SaveState();

              GetDataCasamento();
            } else { //periodo de degustacao acabou
              vm.errorMessage = 'Seu período de degustação acabou';
              vm.carregando = false;
            }
          } else { //casal pagou
            /**
             * Isso significa que o usuario pagou fora do dashboard
             * Por isso eh preciso registrar o pagamento dentro do dashboard
             */
            RegistrarPagamnto(resp.ResultadoAutenticacaoNoivos.Id_usuario_logado, dado.RetornoExisteEmailIsentoPagtoCelebri.Origem);
            session.user.pagante = $rootScope.pagante = true;
            GetDataCasamento();
          }
        });
      } else { // Casal pagou
        session.user.pagante = $rootScope.pagante = true;
        GetDataCasamento();
      }
    }

    /**
     * @function GetDataCasamento
     * @desc Pega os dados do casal e depois muda para o view casal
     * @memberof LoginController
     */
    function GetDataCasamento() {
      serverService.Get('RetornarDadosCadastroNoivos', session.user.id).then(function (resp) {
        var dados = angular.fromJson(conversorService.Xml2Json(resp.data, ''));
        session.user.casal.dataCasamento = dados.Casal.DataCasamento;

        session.SaveState();

        vm.carregando = false;
        $state.go('casal');
      });
    }

    /**
     * @function RecuperarSenha
     * @desc Envia um email para o usuario recuperar a senha
     * @memberof LoginController
     */
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