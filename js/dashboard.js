// INIT
angular.module("dashboard", ['ngRoute', 'ngFileUpload', 'ngMask', 'rzModule', 'ngAnimate', 'ui.bootstrap', 'chart.js', 'ngCookies']);

angular.module("dashboard").run(['$rootScope', '$location', '$cookies', 'user', function ($rootScope, $location, $cookies, user) {

  $rootScope.$on('$routeChangeStart', function (event, next) {

    var usuario = $cookies.getObject('user');
    var userAuthenticated = false;

    if (usuario != null) {
      userAuthenticated = true;
      user = usuario;
    }

    if (!userAuthenticated && !next.isLogin) {
      $location.path('/login');
    }
  });
}]);

// Variavel Global. Armazena todos os dados do usuario
angular.module("dashboard")
  .value("user", {
    id: null,
    nomeUsuario: '',
    foto: '',
    dadosCasal: {
      nome_noiva: '',
      nome_noivo: '',
      data_casamento: ''
    },
    convite_dados: {
      cerimonia_local: '',
      cerimonia_end: '',
      cerimonia_numero: '',
      cerimonia_bairro: '',
      cerimonia_cidade: '',
      cerimonia_rota: '',
      cerimonia_cep: '',
      cerimonia_hora: '',
      cerimonia_min: '',
      noiva_mae: '',
      noiva_pai: '',
      noivo_mae: '',
      noivo_pai: '',
      noiva_mae_memorian: '',
      noiva_pai_memorian: '',
      noivo_mae_memorian: '',
      noivo_pai_memorian: '',
    },
    convite_formatacao: {
      bloco_msg_1: {
        'font-family': 1
      },
      bloco_msg_2: {
        'font-family': 1
      },
      bloco_msg_personalizada_style: {
        'font-family': 1
      },
      bloco_cerimonia: {
        'font-family': 1
      },
      bloco_nome_dos_noivos: {
        'font-family': 1
      },
      bloco_pais_noiva: {
        'font-family': 1
      },
      bloco_pais_noivo: {
        'font-family': 1
      }
    },
    recepcao: {
      festa_igual_cerimonia: '',
      festa_local: '',
      festa_end: '',
      festa_numero: '',
      festa_bairro: '',
      festa_cidade: '',
      festa_rota: '',
      festa_cep: '',
      haveMoip: false
    },
    lista_hotel: [],
    lista_salao: [],
    lista_presente: [],
    lista_convidados: [],
    lista_cardapio: [],
    lista_presentes_lua_mel: []
  });

//Controllers
angular.module('dashboard').controller('sidebar', ['$scope', '$location', '$cookies', 'user', function ($scope, $location, $cookies, user) {
  if (user.id == null) {
    user = $cookies.getObject('user');
    $scope.fotoCasal = user.foto;
    $scope; usuarioLogado = user.nomeUsuario;
  }

  //Verifica em qual pag esta
  $scope.isActive = function (viewLocation) {
    var retorno = false;
    if (viewLocation === $location.path() || viewLocation + "/2" === $location.path()) {
      retorno = true
    }
    return retorno;
  };

  $scope.sair = function () {
    //Remove o cookie
    $cookies.remove('user');

    //garante que os dados serao apagados
    user = null;

    //direciona para a pagina de login
    $location.path('/login');
  };

  //Lista do menu
  $scope.menu =
    [
      {
        Id: 1,
        Name: "Dados do Casal",
        url: 'dados-do-casal'
      },
      {
        Id: 2,
        Name: 'Configurar Convite',
        url: 'configurar-convite'
      },
      {
        Id: 3,
        Name: 'Configurar Evento',
        url: 'configurar-evento'
      },
      {
        Id: 4,
        Name: 'Cadastrar Convidados',
        url: 'cadastrar-convidados'
      },
      {
        Id: 5,
        Name: 'Save the Date',
        url: 'save-the-date'
      },
      {
        Id: 6,
        Name: 'Enviar Convite',
        url: 'enviar-convite'
      },
      {
        Id: 7,
        Name: 'Estatísticas do Convite',
        url: 'estatisticas'
      }
    ];
}]);

angular.module("dashboard").controller('mainController', ['$scope', '$location', 'user', '$cookies', function ($scope, $location, user, $cookies) {

  $scope.checkTemplate = function () {
    var usuario = $cookies.getObject('user');

    if ("/login" === $location.path()) {
      $scope.login = "login";
      $scope.cabecalho = "";
    } else {
      if (usuario != null) {
        user = usuario;
      }
      $scope.login = "";
      $scope.cabecalho = "templates/parts/sidebar.html";
    }
  }

  //for ng-repeat
  $scope.getTimes = function (n) {
    return new Array(n);
  };
}]);

angular.module("dashboard").controller('dados_casal', ['$scope', 'Upload', 'DadosCasal', 'user', '$cookies', function ($scope, Upload, DadosCasal, user, $cookies) {

  // evita conflito dentro das funcoes
  var self = this;

  //salva as informações do form dentro de user
  self.setLocalDados = function () {
    var casamento = $scope.data_casamento.getMonth() + "/" + $scope.data_casamento.getDate() + "/" + $scope.data_casamento.getFullYear();

    user.dadosCasal.nome_noivo = $scope.nome_noivo;
    user.dadosCasal.nome_noiva = $scope.nome_noiva;
    user.dadosCasal.data_casamento = casamento;
  };

  //pega as informações de user e coloca no $scope
  self.getLocalDados = function () {
    var data = user.dadosCasal.data_casamento.split('/');

    $scope.nome_noivo = user.dadosCasal.nome_noivo;
    $scope.nome_noiva = user.dadosCasal.nome_noiva;
    $scope.data_casamento = new Date(data[2], data[1], data[0]);
  }

  //pega os dados do servidor
  $scope.casalGetDados = function () {
    DadosCasal.getData(user.id).then(function (resp) {
      var respXml = $.parseXML(resp);
      $scope.nome_noivo = $(respXml).find('NomeNoivo').text();
      $scope.nome_noiva = $(respXml).find('NomeNoiva').text();

      var data = $(respXml).find('DataCasamento').text().split('/');
      $scope.data_casamento = new Date(data[2], data[1], data[0]);

      self.setLocalDados();
    });
  };

  //salva no servidor os dados
  $scope.setDadosCasal = function () {
    var casamento = $scope.data_casamento.getMonth() + "/" + $scope.data_casamento.getDate() + "/" + $scope.data_casamento.getFullYear();
    var xml = '<DadosCasal xmlns="http://schemas.datacontract.org/2004/07/WcfServiceCasamento"><Id_casal>' + user.id + '</Id_casal><AtualizarSenha>false</AtualizarSenha><DataCasamento>' + casamento + '</DataCasamento><NomeNoiva>' + $scope.nome_noiva + '</NomeNoiva><NomeNoivo>' + $scope.nome_noivo + '</NomeNoivo><Senha></Senha></DadosCasal>';

    self.setLocalDados();
    DadosCasal.setData(xml);
  };

  // Setup/construtor
  if (user.dadosCasal.nome_noivo === '') {
    if (user.id == null) {
      user = $cookies.getObject('user');
      $scope.foto = user.foto;
      $scope.casalGetDados();
    }
  } else {
    self.getLocalDados();
  }
}]);

angular.module("dashboard").controller('configurar_convite', ['$scope', 'ConfiguracaoConvite', 'user', '$cookies', function ($scope, ConfiguracaoConvite, user, $cookies) {

  // evita conflito dentro das funcoes
  var self = this;

  //salva as informações do form dentro de user
  self.setLocalDados = function () {
    user.convite_dados.cerimonia_local = $scope.cerimonia_local;
    user.convite_dados.cerimonia_end = $scope.cerimonia_end;
    user.convite_dados.cerimonia_numero = $scope.cerimonia_numero;
    user.convite_dados.cerimonia_bairro = $scope.cerimonia_bairro;
    user.convite_dados.cerimonia_cidade = $scope.cerimonia_cidade;
    user.convite_dados.cerimonia_rota = $scope.cerimonia_rota;
    user.convite_dados.cerimonia_cep = $scope.cerimonia_cep;
    user.convite_dados.cerimonia_hora = $scope.cerimonia_hora;
    user.convite_dados.cerimonia_min = $scope.cerimonia_min;
    user.convite_dados.noiva_mae = $scope.noiva_mae;
    user.convite_dados.noiva_pai = $scope.noiva_pai;
    user.convite_dados.noivo_mae = $scope.noivo_mae;
    user.convite_dados.noivo_pai = $scope.noivo_pai;
    user.convite_dados.noiva_mae_memorian = $scope.noiva_mae_memorian;
    user.convite_dados.noiva_pai_memorian = $scope.noiva_pai_memorian;
    user.convite_dados.noivo_mae_memorian = $scope.noivo_mae_memorian;
    user.convite_dados.noivo_pai_memorian = $scope.noivo_pai_memorian;
  };

  //pega as informações de user e coloca no $scope
  self.getLocalDados = function () {
    $scope.cerimonia_local = user.convite_dados.cerimonia_local;
    $scope.cerimonia_end = user.convite_dados.cerimonia_end;
    $scope.cerimonia_numero = user.convite_dados.cerimonia_numero;
    $scope.cerimonia_bairro = user.convite_dados.cerimonia_bairro;
    $scope.cerimonia_cidade = user.convite_dados.cerimonia_cidade;
    $scope.cerimonia_rota = user.convite_dados.cerimonia_rota;
    $scope.cerimonia_cep = user.convite_dados.cerimonia_cep;
    $scope.cerimonia_hora = user.convite_dados.cerimonia_hora;
    $scope.cerimonia_min = user.convite_dados.cerimonia_min;
    $scope.noiva_mae = user.convite_dados.noiva_mae;
    $scope.noiva_pai = user.convite_dados.noiva_pai;
    $scope.noivo_mae = user.convite_dados.noivo_mae;
    $scope.noivo_pai = user.convite_dados.noivo_pai;
    $scope.noiva_mae_memorian = user.convite_dados.noiva_mae_memorian;
    $scope.noiva_pai_memorian = user.convite_dados.noiva_pai_memorian;
    $scope.noivo_mae_memorian = user.convite_dados.noivo_mae_memorian;
    $scope.noivo_pai_memorian = user.convite_dados.noivo_pai_memorian;
  }

  //pega o CEP, usando um servico na internet (postmon)
  $scope.consultCEP = function () {
    var cep = $scope.cerimonia_cep.replace(/\./g, '');
    cep = cep.replace(/\-/g, '');
    $.ajax({
      url: "http://api.postmon.com.br/v1/cep/" + cep.toString(),
      success: function (data) {
        $scope.cerimonia_end = data.logradouro;
        $scope.cerimonia_bairro = data.bairro;
        $scope.cerimonia_cidade = data.cidade;
      }
    });
  };

  //pega os dados do servidor
  $scope.getDadosConvite = function () {
    ConfiguracaoConvite.getData(user.id).then(function (resp) {

      var respXml = $.parseXML(resp);
      var hora = $(respXml).find('Horario_cerimonia').text().split(':');

      $scope.cerimonia_local = $(respXml).find('Local_cerimonia').text();
      $scope.cerimonia_end = $(respXml).find('Endereco').text();
      $scope.cerimonia_numero = $(respXml).find('Numero').text();
      $scope.cerimonia_bairro = $(respXml).find('Bairro').text();
      $scope.cerimonia_cidade = $(respXml).find('Cidade').text();
      $scope.cerimonia_rota = $(respXml).find('Tracar_rota_local').text();
      $scope.cerimonia_cep = $(respXml).find('Cep').text();
      $scope.cerimonia_hora = hora[0];

      if (hora[1] == "00") {
        $scope.cerimonia_min = "0";
      } else {
        $scope.cerimonia_min = hora[1];
      }

      $scope.noiva_mae = $(respXml).find('Mae_noiva').text();
      $scope.noiva_pai = $(respXml).find('Pai_noiva').text();
      $scope.noivo_mae = $(respXml).find('Mae_noivo').text();
      $scope.noivo_pai = $(respXml).find('Pai_noivo').text();
      $scope.noiva_mae_memorian = $(respXml).find('Mae_noiva_in_memoriam').text();
      $scope.noiva_pai_memorian = $(respXml).find('Pai_noiva_in_memoriam').text();
      $scope.noivo_mae_memorian = $(respXml).find('Mae_noivo_in_memoriam').text();
      $scope.noivo_pai_memorian = $(respXml).find('Pai_noivo_in_memoriam').text();

      self.setLocalDados();
    });
  };

  // salva os dados no servidor
  $scope.setDadosConvite = function () {
    var hora = $scope.cerimonia_hora + ":" + $scope.cerimonia_min;
    var xml = '<ConfiguracaoConvite xmlns="http://schemas.datacontract.org/2004/07/WcfServiceCasamento"><Bairro>' + $scope.cerimonia_bairro + '</Bairro><Cep>' + $scope.cerimonia_cep + '</Cep><Cidade>' + $scope.cerimonia_cidade + '</Cidade><Endereco>' + $scope.cerimonia_end + '</Endereco><Estado></Estado><Horario_cerimonia>' + hora + '</Horario_cerimonia><Id_usuario_logado>' + user.id + '</Id_usuario_logado><Local_cerimonia>' + $scope.cerimonia_local + '</Local_cerimonia><Mae_noiva>' + $scope.noiva_mae + '</Mae_noiva><Mae_noiva_in_memoriam>' + $scope.noiva_mae_memorian + '</Mae_noiva_in_memoriam><Mae_noivo>' + $scope.noivo_mae + '</Mae_noivo><Mae_noivo_in_memoriam>' + $scope.noivo_mae_memorian + '</Mae_noivo_in_memoriam><Msg1></Msg1><Msg2></Msg2><Msg3></Msg3><Msg4></Msg4><Msg5></Msg5><Msg6></Msg6><Numero>' + $scope.cerimonia_numero + '</Numero><Obs></Obs><Pai_noiva>' + $scope.noiva_pai + '</Pai_noiva><Pai_noiva_in_memoriam>' + $scope.noiva_pai_memorian + '</Pai_noiva_in_memoriam><Pai_noivo>' + $scope.noivo_pai + '</Pai_noivo><Pai_noivo_in_memoriam>' + $scope.noivo_pai_memorian + '</Pai_noivo_in_memoriam><Pais></Pais><Tracar_rota_local>' + $scope.cerimonia_rota + '</Tracar_rota_local></ConfiguracaoConvite>';

    ConfiguracaoConvite.setData(xml);
    self.setLocalDados();
  };

  // setup/Contonstrutor
  if (user.convite_dados.cerimonia_local === '') {
    if (user.id == null) {
      user = $cookies.getObject('user');
      $scope.getDadosConvite();
    }
  } else {
    self.getLocalDados();
  }
}]);

angular.module("dashboard").controller('configurar_convite2', ['$scope', '$http', 'ConfiguracaoTemplateConvite', 'user', '$sce', '$cookies', function ($scope, $http, ConfiguracaoTemplateConvite, user, $sce, $cookies) {

  var self = this;

  // Esconde o painel lateral quando chega perto do radepe
  $(window).scroll(function () {
    var elementoffset = $('#convites_layout').offset();
    if ($(this).scrollTop() < elementoffset.top - 500) {
      $('.controll').fadeIn(10);

    } else {
      $('.controll').fadeOut(10);
    }
  });

  // gerencia qual bloco esta ativo para edicao
  $scope.showBlocos = [
    { "ativo": true },
    { "ativo": false },
    { "ativo": false },
    { "ativo": false },
    { "ativo": false },
    { "ativo": false },
    { "ativo": false }
  ];

  // ativa o bloco quando clicado
  $scope.setBlocoActive = function (index) {
    for (var i = 0; i < $scope.showBlocos.length; i++) {
      $scope.showBlocos[i]["ativo"] = false;
    };
    $scope.showBlocos[index]["ativo"] = true;
  };

  //iniciliza o vetor dos convites
  $scope.convites = [];

  //carrega as informações dos blocos(altura,largura, posicao) de cada convite
  $http.get('data/convites.json')
    .then(function (res) {
      $scope.convites = res.data;
    });

  //carrega as fonts
  $http.get('data/fonts.json')
    .then(function (res) {
      $scope.fonts = res.data;
    });

  //imagem do convite
  $scope.layoutSelecionado;

  //recebe o style dos blocos;
  $scope.bloco_pais_noiva;
  $scope.bloco_pais_noivo;
  $scope.bloco_msg_1;
  $scope.bloco_nome_dos_noivos;
  $scope.bloco_msg_2;
  $scope.bloco_msg_personalizada_style;
  $scope.bloco_cerimonia;

  //mensagens

  $scope.bloco_msg_personalizada = "Este é um texto de referência para a mensagem do seu convite. Para editá-lo basta clicar aqui e reescrever. Se você optar por não ter nenhuma mensagem, basta deixar em branco.";

  self.setMsg = function () {
    $scope.conteudo_msg1 = $sce.trustAsHtml("convidam para a cerimônia de casamento dos seus filhos");
    $scope.conteudo_msg2 = $sce.trustAsHtml("à realizar-se às " + user.convite_dados.cerimonia_hora + " : " + user.convite_dados.cerimonia_min + " horas no dia " + user.dadosCasal.data_casamento + ", " + user.convite_dados.cerimonia_local);

    $scope.conteudo_msg4 = $sce.trustAsHtml(user.convite_dados.cerimonia_local + " " + user.convite_dados.cerimonia_end + ", " + user.convite_dados.cerimonia_numero + " - " + user.convite_dados.cerimonia_bairro + " " + user.convite_dados.cerimonia_cidade);

    $scope.conteudo_nomecasal = $sce.trustAsHtml(user.dadosCasal.nome_noiva + " &#38; " + user.dadosCasal.nome_noivo);
    $scope.conteudo_pais_noiva = $sce.trustAsHtml(user.convite_dados.noiva_pai + "<br>" + user.convite_dados.noiva_mae);
    $scope.conteudo_pais_noivo = $sce.trustAsHtml(user.convite_dados.noivo_pai + "<br>" + user.convite_dados.noivo_mae);
  }

  //O servico so aceita numero para o alinhamento. Essa funcao faz a conversao
  self.getTextAlingIndice = function (texto) {
    var retorno = '';

    switch (texto) {
      case "right": retorno = 2; break;
      case "left": retorno = 0; break;
      case "center": retorno = 1; break;
      default: retorno = 0; break;
    }
    return retorno;
  };

  self.getTextAling = function (index) {
    var retorno = '';

    switch (index) {
      case '2': retorno = "right"; break;
      case '0': retorno = "left"; break;
      case '1': retorno = "center"; break;
      default: retorno = "left"; break;
    }

    return retorno;
  };

  //pega a font baseado no id fornecido
  self.getFonte = function (id) {

    try {
      var serif = $scope.fonts['SERIF'][id]['font-name'];
      return serif;
    } catch (e) {
      try {
        var sansserif = $scope.fonts['SANSSERIF'][id]['font-name'];
        return sansserif;
      } catch (e) {
        try {
          var display = $scope.fonts['DISPLAY'][id]['font-name'];
          return display;
        } catch (e) {
          try {
            var handwriting = $scope.fonts['HANDWRITING'][id]['font-name'];
            return handwriting;
          } catch (e) {
            return null;
          }
        }
      }
    }
  };

  $scope.styleHold = [];

  // set font family do bloco
  $scope.setFontToBloco = function (font, idFont) {
    $('.' + $scope.styleHold).css('font-family', font);
    user.convite_formatacao[$scope.styleHold]['font-family'] = idFont;
  }

  //O servico nao reconhece px. Essa funcao retira o px, para poder enviar ao servidor
  self.removePx = function (texto) {
    var retorno = '';

    retorno = texto.toString().split('px');

    return retorno[0];
  }

  /*indice da lista de convites.
  * Define qual convite o sistema vai pegar as informacoes dos blocos
  */
  $scope.convite_individual;

  //configura a imagem do convite,pega a posicao dos blocos e aplica
  $scope.setConvite = function (convite, imagem) {
    $scope.layoutSelecionado = imagem;
    $scope.convite_individual = convite;
    var bloco = $scope.convites[convite];

    $scope.bloco_pais_noiva = bloco.bloco_pais_noiva;
    $scope.bloco_pais_noivo = bloco.bloco_pais_noivo;
    $scope.bloco_msg_1 = bloco.bloco_msg_1;
    $scope.bloco_nome_dos_noivos = bloco.bloco_nome_dos_noivos;
    $scope.bloco_msg_2 = bloco.bloco_msg_2;
    $scope.bloco_msg_personalizada_style = bloco.bloco_msg_personalizada_style;
    $scope.bloco_cerimonia = bloco.bloco_cerimonia;

  };

  // pega os dados do servidor
  $scope.getConfiguracaoConvite = function () {
    if (user.id == null) {
      user = $cookies.getObject('user');
    }

    ConfiguracaoTemplateConvite.getData(user.id).then(function (resp) {
      var modelo = $(resp).find('id_modelo').text();

      self.setMsg();

      if (modelo == '' || modelo == null || modelo == ' ') {
        $scope.setConvite('convite1', './image/convites/convite1.png');
        $scope.setConfiguracaoConvite();
      } else {
        $scope.setConvite('convite' + modelo + '', './image/convites/convite' + modelo + '.png');

        $scope.bloco_msg_1["text-align"] = self.getTextAling($(resp).find('alinhamento_msg1').text());
        $scope.bloco_msg_2["text-align"] = self.getTextAling($(resp).find('alinhamento_msg2').text());
        $scope.bloco_msg_personalizada_style["text-align"] = self.getTextAling($(resp).find('alinhamento_msg3').text());
        $scope.bloco_cerimonia["text-align"] = self.getTextAling($(resp).find('alinhamento_msg4').text());
        $scope.bloco_nome_dos_noivos["text-align"] = self.getTextAling($(resp).find('alinhamento_nomecasal').text());
        $scope.bloco_pais_noiva["text-align"] = self.getTextAling($(resp).find('alinhamento_pais_noiva').text());
        $scope.bloco_pais_noivo["text-align"] = self.getTextAling($(resp).find('alinhamento_pais_noivo').text());
        $scope.bloco_msg_1["color"] = $(resp).find('cor_msg1').text();
        $scope.bloco_msg_2["color"] = $(resp).find('cor_msg2').text();
        $scope.bloco_msg_personalizada_style["color"] = $(resp).find('cor_msg3').text();
        $scope.bloco_cerimonia["color"] = $(resp).find('cor_msg4').text();
        $scope.bloco_nome_dos_noivos["color"] = $(resp).find('cor_nomecasal').text();
        $scope.bloco_pais_noiva["color"] = $(resp).find('cor_pais_noiva').text();
        $scope.bloco_pais_noivo["color"] = $(resp).find('cor_pais_noivo').text();
        $scope.bloco_msg_1["font-family"] = self.getFonte($(resp).find('fonte_msg1').text());
        $scope.bloco_msg_2["font-family"] = self.getFonte($(resp).find('fonte_msg2').text());
        $scope.bloco_msg_personalizada_style["font-family"] = self.getFonte($(resp).find('fonte_msg3').text());
        $scope.bloco_cerimonia["font-family"] = self.getFonte($(resp).find('fonte_msg4').text());
        $scope.bloco_nome_dos_noivos["font-family"] = self.getFonte($(resp).find('fonte_nomecasal').text());
        $scope.bloco_pais_noiva["font-family"] = self.getFonte($(resp).find('fonte_pais_noiva').text());
        $scope.bloco_pais_noivo["font-family"] = self.getFonte($(resp).find('fonte_pais_noivo').text());
        $scope.bloco_msg_1["font-size"] = $(resp).find('tamanho_fonte_msg1').text() + "px";
        $scope.bloco_msg_2["font-size"] = $(resp).find('tamanho_fonte_msg2').text() + "px";
        $scope.bloco_msg_personalizada_style["font-size"] = $(resp).find('tamanho_fonte_msg3').text() + "px";
        $scope.bloco_cerimonia["font-size"] = $(resp).find('tamanho_fonte_msg4').text() + "px";
        $scope.bloco_nome_dos_noivos["font-size"] = $(resp).find('tamanho_fonte_pais_noiva').text() + "px";
        $scope.bloco_pais_noiva["font-size"] = $(resp).find('tamanho_fonte_pais_noivo').text() + "px";
        $scope.bloco_pais_noivo["font-size"] = $(resp).find('tamanho_nomecasal').text() + "px";

        $scope.bloco_msg_personalizada = $(resp).find('conteudo_msg3').text();

        user.convite_formatacao.bloco_msg_1['font-family'] = $(resp).find('fonte_msg1').text();
        user.convite_formatacao.bloco_msg_2['font-family'] = $(resp).find('fonte_msg2').text();
        user.convite_formatacao.bloco_msg_personalizada_style['font-family'] = $(resp).find('fonte_msg3').text();
        user.convite_formatacao.bloco_cerimonia['font-family'] = $(resp).find('fonte_msg4').text();
        user.convite_formatacao.bloco_nome_dos_noivos['font-family'] = $(resp).find('fonte_nomecasal').text();
        user.convite_formatacao.bloco_pais_noiva['font-family'] = $(resp).find('fonte_pais_noiva').text();
        user.convite_formatacao.bloco_pais_noivo['font-family'] = $(resp).find('fonte_pais_noivo').text();
      }
    });
  };

  $scope.setConfiguracaoConvite = function () {
    var aux = $scope.convite_individual.split("convite");
    var modelo = aux[1];

    var xml = '<DadosFormatacaoConvite xmlns="http://schemas.datacontract.org/2004/07/WcfServiceCasamento"><alinhamento_msg1>' + self.getTextAlingIndice($scope.bloco_msg_1["text-align"]) + '</alinhamento_msg1><alinhamento_msg2>' + self.getTextAlingIndice($scope.bloco_msg_2["text-align"]) + '</alinhamento_msg2><alinhamento_msg3>' + self.getTextAlingIndice($scope.bloco_msg_personalizada_style["text-align"]) + '</alinhamento_msg3><alinhamento_msg4>' + self.getTextAlingIndice($scope.bloco_cerimonia["text-align"]) + '</alinhamento_msg4><alinhamento_nomecasal>' + self.getTextAlingIndice($scope.bloco_nome_dos_noivos["text-align"]) + '</alinhamento_nomecasal><alinhamento_pais_noiva>' + self.getTextAlingIndice($scope.bloco_pais_noiva["text-align"]) + '</alinhamento_pais_noiva><alinhamento_pais_noivo>' + self.getTextAlingIndice($scope.bloco_pais_noivo["text-align"]) + '</alinhamento_pais_noivo><conteudo_msg1>' + $scope.conteudo_msg1 + '</conteudo_msg1><conteudo_msg2>' + $scope.conteudo_msg2 + '</conteudo_msg2><conteudo_msg3>' + $scope.bloco_msg_personalizada + '</conteudo_msg3><conteudo_msg4>' + $scope.conteudo_msg4 + '</conteudo_msg4><conteudo_nomecasal>' + user.dadosCasal.nome_noiva + ' &#38; ' + user.dadosCasal.nome_noivo + '</conteudo_nomecasal><conteudo_pais_noiva>' + user.convite_dados.noiva_pai + '#' + user.convite_dados.noiva_mae + '</conteudo_pais_noiva><conteudo_pais_noivo>' + user.convite_dados.noivo_pai + '#' + user.convite_dados.noivo_mae + '</conteudo_pais_noivo><cor_msg1>' + $scope.bloco_msg_1["color"] + '</cor_msg1><cor_msg2>' + $scope.bloco_msg_2["color"] + '</cor_msg2><cor_msg3>' + $scope.bloco_msg_personalizada_style["color"] + '</cor_msg3><cor_msg4>' + $scope.bloco_cerimonia["color"] + '</cor_msg4><cor_nomecasal>' + $scope.bloco_nome_dos_noivos["color"] + '</cor_nomecasal><cor_pais_noiva>' + $scope.bloco_pais_noiva["color"] + '</cor_pais_noiva><cor_pais_noivo>' + $scope.bloco_pais_noivo["color"] + '</cor_pais_noivo><fonte_msg1>' + user.convite_formatacao.bloco_msg_1['font-family'] + '</fonte_msg1><fonte_msg2>' + user.convite_formatacao.bloco_msg_2['font-family'] + '</fonte_msg2><fonte_msg3>' + user.convite_formatacao.bloco_msg_personalizada_style['font-family'] + '</fonte_msg3><fonte_msg4>' + user.convite_formatacao.bloco_cerimonia['font-family'] + '</fonte_msg4><fonte_nomecasal>' + user.convite_formatacao.bloco_nome_dos_noivos['font-family'] + '</fonte_nomecasal><fonte_pais_noiva>' + user.convite_formatacao.bloco_pais_noiva['font-family'] + '</fonte_pais_noiva><fonte_pais_noivo>' + user.convite_formatacao.bloco_pais_noivo['font-family'] + '</fonte_pais_noivo><id_casal>' + user.id + '</id_casal><id_modelo>' + modelo + '</id_modelo><tamanho_fonte_msg1>' + self.removePx($scope.bloco_msg_1["font-size"]) + '</tamanho_fonte_msg1><tamanho_fonte_msg2>' + self.removePx($scope.bloco_msg_2["font-size"]) + '</tamanho_fonte_msg2><tamanho_fonte_msg3>' + self.removePx($scope.bloco_msg_personalizada_style["font-size"]) + '</tamanho_fonte_msg3><tamanho_fonte_msg4>' + self.removePx($scope.bloco_cerimonia["font-size"]) + '</tamanho_fonte_msg4><tamanho_fonte_pais_noiva>' + self.removePx($scope.bloco_nome_dos_noivos["font-size"]) + '</tamanho_fonte_pais_noiva><tamanho_fonte_pais_noivo>' + self.removePx($scope.bloco_pais_noiva["font-size"]) + '</tamanho_fonte_pais_noivo><tamanho_nomecasal>' + self.removePx($scope.bloco_pais_noivo["font-size"]) + '</tamanho_nomecasal></DadosFormatacaoConvite>';

    ConfiguracaoTemplateConvite.setData(xml);
  };

  $scope.getConfiguracaoConvite();

  // $scope.priceSlide = 12;
}]);

angular.module('dashboard').controller('configurar_evento', ['$scope', 'ConfiguracaoEvento', 'ListaHoteis', 'ListaSaloes', 'LojaPresentes', 'user', 'Cardapio', 'Moip', '$cookies', 'PresentesLuaDeMel', function ($scope, ConfiguracaoEvento, ListaHoteis, ListaSaloes, LojaPresentes, user, Cardapio, Moip, $cookies, PresentesLuaDeMel) {

  /** #REGION VARIAVEIS */
  var self = this;
  $scope.produtos = [];

  $scope.getProdutos = function () {
    PresentesLuaDeMel.getData(user.id).then(function (resp) {
      var respXml = $.parseXML(resp);

      var produtos = $(respXml).find('PresentesLuaDeMel');

      $.each(produtos, function (i, item) {
        $scope.produtos.push({
          'nome': $(item).find('Descricao').text(),
          'urlImage': $(item).find('Url').text(),
          'valor': 'R$ ' + $(item).find('Valor').text()
        });
      });
      console.log($scope.produtos);
    });
  }
  /** #ENDREGION VARIAVEIS */


  /**
   * pega todos os dados dos servicos;
   * dados do evento;hoteis;saloes;presentes;cardapio
   */
  self.getDadosServico = function () {

    if (user.id == null) {
      user = $cookies.getObject('user');
    }

    $scope.getDadosEvento();
    $scope.getHoteis();
    $scope.getSaloes();
    $scope.getPresentes();
    $scope.getListaCardapio();
    $scope.verificaMoip();
    $scope.getProdutos();
  };

  //Armazena localmente as informações do serviço da Cerimonia
  self.cerimoniaRemotoToLocal = function () {
    user.recepcao.festa_igual_cerimonia = $scope.festa_igual_cerimonia;
    user.recepcao.festa_local = $scope.festa_local;
    user.recepcao.festa_end = $scope.festa_end;
    user.recepcao.festa_numero = $scope.festa_numero;
    user.recepcao.festa_bairro = $scope.festa_bairro;
    user.recepcao.festa_cidade = $scope.festa_cidade;
    user.recepcao.festa_rota = $scope.festa_rota;
    user.recepcao.festa_cep = $scope.festa_cep;

    user.lista_presentes_lua_mel = $scope.produtos;
  };

  //Pega os dados que estao armezados localmente e coloca no site
  self.getDadosLocal = function () {
    $scope.festa_igual_cerimonia = user.recepcao.festa_igual_cerimonia;
    $scope.festa_local = user.recepcao.festa_local;
    $scope.festa_end = user.recepcao.festa_end;
    $scope.festa_numero = user.recepcao.festa_numero;
    $scope.festa_bairro = user.recepcao.festa_bairro;
    $scope.festa_cidade = user.recepcao.festa_cidade;
    $scope.festa_rota = user.recepcao.festa_rota;
    $scope.festa_cep = user.recepcao.festa_cep;

    $scope.hotel_lista = user.lista_hotel;
    $scope.salao_lista = user.lista_salao;
    $scope.loja_lista = user.lista_presente;
    $scope.lista_cardapio = user.lista_cardapio;

    $scope.produtos = user.lista_presentes_lua_mel;

    if (user.recepcao.haveMoip == true) {
      $scope.moip__form = { 'display': 'none' };
    }
  }

  /** #REGION DADOS DA CERIMONIA */

  $scope.getDadosEvento = function () {
    ConfiguracaoEvento.getData(user.id).then(function (resp) {

      var respXml = $.parseXML(resp);
      $scope.festa_igual_cerimonia = $(respXml).find('Mesmo_local_cerimonia').text();
      $scope.festa_local = $(respXml).find('Local_festa').text();
      $scope.festa_end = $(respXml).find('Endereco').text();
      $scope.festa_numero = $(respXml).find('Numero').text();
      $scope.festa_bairro = $(respXml).find('Bairro').text();
      $scope.festa_cidade = $(respXml).find('Cidade').text();
      $scope.festa_rota = $(respXml).find('Tracar_rota_local').text();
      $scope.festa_cep = $(respXml).find('Cep').text();

      //add informacao local
      self.cerimoniaRemotoToLocal();
    });
  };
  $scope.setDadosEvento = function () {

    var xmlVar = '<ConfiguracaoEvento xmlns="http://schemas.datacontract.org/2004/07/WcfServiceCasamento"><Bairro>' + $scope.festa_bairro + '</Bairro><Cep>' + $scope.festa_cep + '</Cep><Cidade>' + $scope.festa_cidade + '</Cidade><Endereco>' + $scope.festa_end + '</Endereco><Estado></Estado><Horario_festa></Horario_festa><Id_usuario_logado>' + user.id + '</Id_usuario_logado><Local_festa>' + $scope.festa_local + '</Local_festa><Mesmo_local_cerimonia>' + $scope.festa_igual_cerimonia + '</Mesmo_local_cerimonia><Numero>' + $scope.festa_numero + '</Numero><Obs></Obs><Pais></Pais><Tracar_rota_local>' + $scope.festa_rota + '</Tracar_rota_local></ConfiguracaoEvento>';

    //envia para o servico
    ConfiguracaoEvento.setData(xmlVar);

    //add informacao local
    self.cerimoniaRemotoToLocal();
  };

  $scope.consultCEP = function () {
    var cep = $scope.festa_cep.replace(/\./g, '');
    cep = cep.replace(/\-/g, '');
    $.ajax({
      url: "http://api.postmon.com.br/v1/cep/" + cep.toString(),
      success: function (data) {
        $scope.festa_end = data.logradouro;
        $scope.festa_bairro = data.bairro;
        $scope.festa_cidade = data.cidade;
      }
    });
  };

  /** #ENDREGION DADOS DA CERIMONIA */

  /** #REGION HOTEL */
  $scope.consultCEPHotel = function () {
    $scope.hotel_cep;
    var cep = $scope.hotel_cep.replace(/\./g, '');
    cep = cep.replace(/\-/g, '');
    $.ajax({
      url: "http://api.postmon.com.br/v1/cep/" + cep.toString(),
      success: function (data) {
        $scope.hotel_end = data.logradouro;
        $scope.hotel_bairro = data.bairro;
        $scope.hotel_cidade = data.cidade;
      }
    });
  };

  $scope.getHoteis = function () {
    ListaHoteis.getData(user.id).then(function (resp) {
      var respXml = $.parseXML(resp);
      $scope.hotel_lista = [];
      $(respXml).find('ConfiguracaoGenericaEndereco').each(function () {
        $scope.hotel_lista.push(
          {
            'Id': $(this).find('Id').text(),
            'Local': $(this).find('Nome').text(),
            'Endereco': $(this).find('Endereco').text(),
            'Numero': $(this).find('Numero').text(),
            'Bairro': $(this).find('Bairro').text(),
            'Cidade': $(this).find('Cidade').text()
          }
        );
      });
      //Armazena localmente
      user.lista_hotel = $scope.hotel_lista;
    });
  };

  $scope.removeHotel = function (id, key) {

    ListaHoteis.remove(user.id, id).then(function () {
      $scope.hotel_lista.splice(key, 1);

      //Atualiza localmente
      user.lista_hotel = $scope.hotel_lista;
    });

  };
  $scope.adicionarHotel = function () {
    if ($scope.hotel_local != "" && $scope.hotel_local != null) {

      var xmlVar = '<ConfiguracaoGenericaEndereco xmlns="http://schemas.datacontract.org/2004/07/WcfServiceCasamento"><Bairro>' + $scope.hotel_bairro + '</Bairro><Cidade>' + $scope.hotel_cidade + '</Cidade><CodigoArea></CodigoArea><Email></Email><Endereco>' + $scope.hotel_end + '</Endereco><Estado></Estado><Id>0</Id><Id_usuario_logado>' + user.id + '</Id_usuario_logado><Nome>' + $scope.hotel_local + '</Nome><Numero>' + $scope.hotel_numero + '</Numero><Obs></Obs><Pais></Pais><Site></Site><Telefone></Telefone><TipoLogradouro></TipoLogradouro><Tracar_rota_local>' + $scope.hotel_rota + '</Tracar_rota_local></ConfiguracaoGenericaEndereco>';

      ListaHoteis.setData(xmlVar).then(function (resp) {
        /**
         * Eh necessario puxar o conteudo do servico novamente
         * pq o ID do novo hotel eh gerado no servico.
         */
        $scope.getHoteis();

        //limpa dos dados do formulario
        $scope.hotel_local = "";
        $scope.hotel_cep = "";
        $scope.hotel_end = "";
        $scope.hotel_numero = "";
        $scope.hotel_bairro = "";
        $scope.hotel_cidade = "";
      });
    }
  };
  /** #ENDREGION HOTEL */

  /** #REGION SALAO */
  $scope.consultCEPSalao = function () {
    var cep = $scope.salao_cep.replace(/\./g, '');
    cep = cep.replace(/\-/g, '');
    $.ajax({
      url: "http://api.postmon.com.br/v1/cep/" + cep.toString(),
      success: function (data) {
        $scope.salao_end = data.logradouro;
        $scope.salao_bairro = data.bairro;
        $scope.salao_cidade = data.cidade;
      }
    });
  };
  $scope.getSaloes = function () {
    ListaSaloes.getData(user.id).then(function (resp) {
      var respXml = $.parseXML(resp);
      $scope.salao_lista = [];
      $(respXml).find('ConfiguracaoGenericaEndereco').each(function () {

        $scope.salao_lista.push(
          {
            'Id': $(this).find('Id').text(),
            'Local': $(this).find('Nome').text(),
            'Endereco': $(this).find('Endereco').text(),
            'Numero': $(this).find('Numero').text(),
            'Bairro': $(this).find('Bairro').text(),
            'Cidade': $(this).find('Cidade').text()
          }
        );
      });

      //armazena localmente
      user.lista_salao = $scope.salao_lista;
    });
  };

  $scope.removeSalao = function (id, key) {
    ListaSaloes.remove(user.id, id).then(function (resp) {
      $scope.salao_lista.splice(key, 1);

      //atualiza localmente
      user.lista_salao = $scope.salao_lista;
    });
  };
  $scope.adicionarSalao = function () {
    if ($scope.salao_local != "" && $scope.salao_local != null) {
      var xmlVar = '<ConfiguracaoGenericaEndereco xmlns="http://schemas.datacontract.org/2004/07/WcfServiceCasamento"><Bairro>' + $scope.salao_bairro + '</Bairro><Cidade>' + $scope.salao_cidade + '</Cidade><CodigoArea>String content</CodigoArea><Email>String content</Email><Endereco>' + $scope.salao_end + '</Endereco><Estado>String content</Estado><Id>0</Id><Id_usuario_logado>15</Id_usuario_logado><Nome>' + $scope.salao_local + '</Nome><Numero>' + $scope.salao_numero + '</Numero><Obs>String content</Obs><Pais>String content</Pais><Site>String content</Site><Telefone>String content</Telefone><TipoLogradouro>String content</TipoLogradouro><Tracar_rota_local>' + $scope.salao_rota + '</Tracar_rota_local></ConfiguracaoGenericaEndereco>';

      ListaSaloes.setData(xmlVar).then(function (resp) {
        /**
         * Eh necessario puxar o conteudo do servico novamente
         * pq o ID do novo salao eh gerado no servico.
         */
        $scope.getSaloes();

        //limpa os dados do formulario
        $scope.salao_local = "";
        $scope.salao_cep = "";
        $scope.salao_end = "";
        $scope.salao_numero = "";
        $scope.salao_bairro = "";
        $scope.salao_cidade = "";
      });

    }
  };
  /** #ENDREGION SALAO */

  /** #REGION LISTA DE PRESENTE */
  $scope.getPresentes = function () {
    LojaPresentes.getData(user.id).then(function (resp) {
      var respXml = $.parseXML(resp);
      $scope.loja_lista = [];
      $(respXml).find('ConfiguracaoLojaPresentes').each(function () {
        $scope.loja_lista.push(
          {
            'Id': $(this).find('Id').text(),
            'Nome': $(this).find('Nome').text(),
            'URL': $(this).find('Url').text()
          }
        );
      });

      //armazena localmente
      user.lista_presente = $scope.loja_lista;
    });
  };

  $scope.removeUrl = function (id, key) {
    LojaPresentes.remove(user.id, id).then(function (resp) {
      $scope.loja_lista.splice(key, 1);

      //atualiza localmente
      user.lista_presente = $scope.loja_lista;
    });
  };
  $scope.adicionarUrl = function () {
    if ($scope.loja_nome != "" && $scope.loja_nome != null) {
      var xmlVar = '<ConfiguracaoLojaPresentes xmlns="http://schemas.datacontract.org/2004/07/WcfServiceCasamento"><Id>0</Id><Id_usuario_logado>' + user.id + '</Id_usuario_logado><Nome>' + $scope.loja_nome + '</Nome><Url>' + $scope.loja_url + '</Url></ConfiguracaoLojaPresentes>';

      LojaPresentes.setData(xmlVar).then(function (resp) {
        /**
         * Eh necessario puxar o conteudo do servico novamente
         * pq o ID do novo presente eh gerado no servico.
         */
        $scope.getPresentes();

        //limpa so dados do formulario
        $scope.loja_nome = "";
        $scope.loja_url = "";
      });


    }
  };
  /** #ENDREGION LISTA DE PRESENTE */

  /** #REGION CARDAPIO */
  $scope.getListaCardapio = function () {
    Cardapio.getData(user.id).then(function (resp) {
      var respXml = $.parseXML(resp);
      user.lista_cardapio = [];
      $(respXml).find('Cardapio').each(function () {

        user.lista_cardapio.push(
          {
            'Id': $(this).find('Id').text(),
            'Nome': $(this).find('Nome').text(),
            'Descricao': $(this).find('Descricao').text()
          }
        );
      });
      $scope.lista_cardapio = user.lista_cardapio;
    });
  };

  $scope.setCardapio = function () {

    if ($scope.cardapio_descricao != "" && $scope.cardapio_descricao != null) {
      var xmlVar = '<Cardapio xmlns="http://schemas.datacontract.org/2004/07/WcfServiceCasamento"><Descricao>' + $scope.cardapio_descricao + '</Descricao><Id>0</Id><Id_usuario_logado>' + user.id + '</Id_usuario_logado><Nome>' + $scope.cardapio_title + '</Nome></Cardapio>';

      Cardapio.setData(xmlVar).then(function (resp) {
        /**
         * Eh necessario puxar o conteudo do servico novamente
         * pq o ID do novo cardapio eh gerado no servico.
         */
        $scope.getListaCardapio();

        //limpa dados do formulario
        $scope.cardapio_title = "";
        $scope.cardapio_descricao = "";
      });
    }
  };

  $scope.removerCardapio = function (id, key) {
    Cardapio.remove(user.id, id).then(function (resp) {
      user.lista_cardapio.splice(key, 1);

      $scope.lista_cardapio = user.lista_cardapio;
    });
  };
  /** #ENDREGION LISTA DE PRESENTE */

  /** #REGION MOIP */
  $scope.verificaMoip = function () {
    Moip.verificar(user.id).then(function (resp) {
      if ($(this).find('Result').text() == true) {
        $scope.moip__form = { 'display': 'none' };
      }
      user.recepcao.haveMoip = $(this).find('Result').text();
    });
  };

  $scope.cadastrarMoip = function () {
    var nome = $scope.moip_nome.split(' ');
    var estado = $scope.moip_estado.split(' ');

    var xml = '<ContaMoip xmlns="http://schemas.datacontract.org/2004/07/WcfServiceCasamento">  <Cep>' + $scope.moip_cep + '</Cep>  <Cidade>' + $scope.moip_cidade + '</Cidade>  <CodigoAreaTelefone>31</CodigoAreaTelefone>  <Cpf>' + $scope.moip_cpf + '</Cpf>  <DataNascimento>' + $scope.moip_nascimento + '</DataNascimento> <Email>' + $scope.moip_email + '</Email>  <Endereco>' + $scope.moip_rua + ' - ' + $scope.moip_bairro + '</Endereco>  <Estado>' + $scope.moip_estado + '</Estado>  <Id>0</Id>  <Id_usuario_logado>' + user.id + '</Id_usuario_logado>  Nome>' + nome[0] + '</Nome>  <Numero>' + $scope.moip_numero + '</Numero>  <NumeroTelefone>993684545</NumeroTelefone>  <Sigla_Estado>' + (estado[0])[0] + '</Sigla_Estado>  <UltimoNome>' + nome[nome.length] + '</UltimoNome></ContaMoip>';
  };

  /** SETUP */
  if (user.recepcao.festa_igual_cerimonia == ''
    || user.recepcao.festa_igual_cerimonia == null) {
    self.getDadosServico();

  } else {
    self.getDadosLocal();
  }
}]);

angular.module("dashboard").controller('cadastrar_convidados', ['$scope', 'Convidados', 'Upload', function ($scope, Convidados, Upload) {

  $scope.uploadFile = function () {

  };
  $scope.getConvidados = function () {
    Convidados.getData($scope.id).then(function (resp) {
      var respXml = $.parseXML(resp);
      $scope.convidado_lista = [];
      $(respXml).find('Convidado').each(function () {
        $scope.convidado_lista.push(
          {
            'Id': $(this).find('Id').text(),
            'nome': $(this).find('Nome').text(),
            'email': $(this).find('Email').text(),
            'convidados': $(this).find('Qtde_Acompanhantes').text(),
            'telefone': $(this).find('Bairro').text()
          }
        );
      });
    });
  };
  $scope.getConvidados();
  $scope.removeConvidado = function (id, key) {
    Convidados.remove($scope.id, id).then(function () {
      $scope.convidado_lista.splice(key, 1);
    });
  }

  $scope.adicionarConvidado = function () {
    if ($scope.convidado_nome != "" && $scope.convidado_nome != null) {
      var xmlVar = '<Convidado xmlns="http://schemas.datacontract.org/2004/07/WcfServiceCasamento"><Email>' + $scope.convidado_email + '</Email><Id>0</Id><Id_usuario_logado>' + $scope.id + '</Id_usuario_logado><Nome>' + $scope.convidado_nome + '</Nome><Padrinho>false</Padrinho><Qtde_Acompanhantes>' + $scope.convidado_acompanhantes + '</Qtde_Acompanhantes><Senha></Senha></Convidado>';

      Convidados.setData(xmlVar).then(function (resp) {
        $scope.getConvidados();
        $scope.convidado_nome = "";
        $scope.convidado_acompanhantes = "";
        $scope.convidado_email = "";
        $scope.convidado_telefone = "";
      });
    }
  }

}]);

angular.module("dashboard").controller('enviar_convite', ['$scope', function ($scope) { }]);

angular.module("dashboard").controller('enviar_convite2', ['$scope', function ($scope) { }]);

angular.module("dashboard").controller('save_date', ['$scope', 'Upload', function ($scope, Upload) { }]);

angular.module("dashboard").controller('save_date2', ['$scope', 'Upload', function ($scope, Upload) {

  $scope.selectedAll = false;

  $scope.checkAll = function () {
    if ($scope.selectedAll) {
      $scope.selectedAll = true;
    } else {
      $scope.selectedAll = false;
    }
    angular.forEach($scope.convidado_lista, function (item, key) {
      $scope.item0 = $scope.selectedAll;
    });

  };
}]);

angular.module("dashboard").controller('estatistica', ['$scope', 'user', 'EstatisticaServ', function ($scope, user, EstatisticaServ) {

  $scope.getEstatistica = function () {
    EstatisticaServ.getData(user.id).then(function (resp) {
      var respXml = $.parseXML(resp);

      //emails enviados
      $scope.total_convites_enviados = $(respXml).find('total_convites_enviados_cerimonia_e_festa').text();

      //convidados cadastrados
      $scope.total_convidados = $(respXml).find('total_convidados').text();

      //convidados + acompanhantes
      $scope.total_geral_convidados = $(respXml).find('total_geral_convidados').text();

      //baixou o app
      $scope.total_confirmados = $(respXml).find('total_convidados_confirmados').text();

      $scope.total_acompanhantes = $(respXml).find('total_acompanhantes').text();


      $scope.convidados_geral_labels = ["Convidados Direto", "Acompanhantes"];
      $scope.convidados_geral_data = [$scope.total_convidados, $scope.total_acompanhantes];
    });
  };
  $scope.getEstatistica();

}]);


angular.module("dashboard").controller('login', ['$scope', 'AutenticacaoNoivos', 'user', '$location', '$cookies', function ($scope, AutenticacaoNoivos, user, $location, $cookies) {
  $scope.nomeUsuario = '';
  $scope.senhaUsuario = '';

  var usuario = $cookies.getObject('user');
  /**
   * se existir cookie nao ha necessidade de logar
   */
  if (usuario != null) {
    user = usuario;
    $location.path('/dados-do-casal');
  }

  $scope.autenticar = function () {
    AutenticacaoNoivos.autenticar($scope.nomeUsuario, $scope.senhaUsuario).then(function (resp) {
      var respXml = $.parseXML(resp);
      var check = $(respXml).find('Result').text();

      //autenticado
      if (check == 'true') {
        //limpa o box de erro, caso houve erro de login anteriormente
        $scope.Result = true;
        $scope.ErrorMessage = "";

        //armazena o ID
        user.id = $(respXml).find('Id_usuario_logado').text();

        /**
         * Verifica qual email esta logando e armazena o nome de acordo.
         */
        var emailNoivo = $(respXml).find('EmailNoivo').text();
        if ($scope.nomeUsuario == emailNoivo) {
          user.nomeUsuario = $(respXml).find('NomeNoivo').text();
        } else {
          user.nomeUsuario = $(respXml).find('NomeNoiva').text();
        }

        //Armazena os nomes dos noivos localmente
        user.nome_noiva = $(respXml).find('NomeNoiva').text();
        user.nome_noivo = $(respXml).find('NomeNoivo').text();

        //Armazena a url da foto do casal localmente
        user.foto = $(respXml).find('Url_foto').text();

        //Salva no cookie o Objeto user (que contem as informacoes globais)
        $cookies.putObject('user', user);

        //Direciona para a primeira pagina do dashboard
        $location.path('/dados-do-casal');

      }
      //nao autenticado
      else {
        //Mostra a mensagem de erro
        $scope.Result = check;
        $scope.ErrorMessage = $(respXml).find('ErrorMessage').text();
      }
    });
  };
  // $scope.autenticar("filipenhimi@gmail.com", "123456");
}]);