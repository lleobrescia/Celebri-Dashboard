angular.module('dashboard').controller('configurar_evento', ['$scope', 'ConfiguracaoEvento', 'ListaHoteis', 'ListaSaloes', 'LojaPresentes', 'user', 'Cardapio', '$cookies', 'PresentesLuaDeMel', function ($scope, ConfiguracaoEvento, ListaHoteis, ListaSaloes, LojaPresentes, user, Cardapio, $cookies, PresentesLuaDeMel) {

  var self = this;

  $scope.PreencherLocal = function (local) {
    user.recepcao.festa_local = local;
  };
  $scope.PreencherCep = function (cep) {
    user.recepcao.festa_cep = cep;
  };
  $scope.PreencherNum = function (num) {
    user.recepcao.festa_numero = num;
  };

  /** #REGION PRODUTOS */

  $scope.produtos = [];
  $scope.produtosEscolidos = [];

  $scope.getProdutos = function () {
    PresentesLuaDeMel.getData(user.id).then(function (resp) {
      var respXml = $.parseXML(resp);

      var produtos = $(respXml).find('PresentesLuaDeMel');

      $.each(produtos, function (i, item) {
        $scope.produtos.push({
          'nome': $(item).find('Descricao').text(),
          'urlImage': $(item).find('Url').text(),
          'valor': 'R$ ' + $(item).find('Valor').text(),
          'id': $(item).find('Id').text(),
          'marcado': false
        });
      });
    });
  };

  $scope.checkProduto = function (marcado, id) {
    if (marcado) {
      $scope.produtosEscolidos.push(
        { 'id': id }
      );
    } else {
      var one, output = {};
      for (one in $scope.produtosEscolidos) {
        if ($scope.produtosEscolidos[one].id == id) {
          delete $scope.produtosEscolidos[one];
        }
      }
    }
  };

  $scope.salvarProdutos = function () {
    //Salva no cookie o Objeto user (que contem as informacoes globais)
    $cookies.putObject('user', user);

    PresentesLuaDeMel.setData().then(function () {

    });
  };

  /** #ENDREGION PRODUTOS */


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
    $scope.getProdutos();
  };

  //Armazena localmente as informações do serviço da Cerimonia
  self.cerimoniaRemotoToLocal = function () {
    user.recepcao.festa_igual_cerimonia = $scope.festa_igual_cerimonia;
    // user.recepcao.festa_local = $scope.festa_local;
    user.recepcao.festa_end = $scope.festa_end;
    // user.recepcao.festa_numero = $scope.festa_numero;
    user.recepcao.festa_bairro = $scope.festa_bairro;
    user.recepcao.festa_cidade = $scope.festa_cidade;
    user.recepcao.festa_rota = $scope.festa_rota;
    // user.recepcao.festa_cep = $scope.festa_cep;

    user.lista_presentes_lua_mel = $scope.produtos;

    //Salva no cookie o Objeto user (que contem as informacoes globais)
    $cookies.putObject('user', user);
  };

  //Pega os dados que estao armezados localmente e coloca no site
  self.getDadosLocal = function () {
    $scope.festa_igual_cerimonia = user.recepcao.festa_igual_cerimonia;
    $scope.festa_local = user.recepcao.festa_local;
    $scope.festa_end = user.recepcao.festa_end;
    $scope.festa_numero = user.recepcao.festa_numero;
    $scope.festa_bairro = user.recepcao.festa_bairro;
    $scope.festa_uf = user.recepcao.festa_uf;
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
  };

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
      $scope.festa_uf = $(respXml).find('Estado').text();
      $scope.festa_rota = $(respXml).find('Tracar_rota_local').text();
      $scope.festa_cep = $(respXml).find('Cep').text();

      //add informacao local
      self.cerimoniaRemotoToLocal();
    });
  };

  $scope.setDadosEvento = function () {

    var xmlVar = '<ConfiguracaoEvento xmlns="http://schemas.datacontract.org/2004/07/WcfServiceCasamento"><Bairro>' + $scope.festa_bairro + '</Bairro><Cep>' + user.recepcao.festa_cep + '</Cep><Cidade>' + $scope.festa_cidade + '</Cidade><Endereco>' + $scope.festa_end + '</Endereco><Estado>' + $scope.festa_uf + '</Estado><Horario_festa></Horario_festa><Id_usuario_logado>' + user.id + '</Id_usuario_logado><Local_festa>' + user.recepcao.festa_local + '</Local_festa><Mesmo_local_cerimonia>' + $scope.festa_igual_cerimonia + '</Mesmo_local_cerimonia><Numero>' + user.recepcao.festa_numero + '</Numero><Obs></Obs><Pais></Pais><Tracar_rota_local>' + $scope.festa_rota + '</Tracar_rota_local></ConfiguracaoEvento>';

    //envia para o servico
    ConfiguracaoEvento.setData(xmlVar);

    //add informacao local
    self.cerimoniaRemotoToLocal();
  };

  $scope.consultFestaCEP = function (cepFesta) {
    var cep = cepFesta.replace(/\./g, '');
    cep = cep.replace(/\-/g, '');

    if (cep.length > 7) {
      $.ajax({
        url: "http://api.postmon.com.br/v1/cep/" + cep,
        success: function (data) {
          $scope.festa_end = data.logradouro;
          $scope.festa_bairro = data.bairro;
          $scope.festa_cidade = data.cidade;
          $scope.festa_uf = data.estado;
        }
      });
    }
  };

  /** #ENDREGION DADOS DA CERIMONIA */

  /** #REGION HOTEL */
  $scope.consultCEPHotel = function () {
    var cep = $scope.hotel_cep.replace(/\./g, '');
    cep = cep.replace(/\-/g, '');
    if (cep.length > 7) {
      $.ajax({
        url: "http://api.postmon.com.br/v1/cep/" + cep.toString(),
        success: function (data) {
          $scope.hotel_end = data.logradouro;
          $scope.hotel_bairro = data.bairro;
          $scope.hotel_cidade = data.cidade;
          $scope.hotel_uf = data.estado;
        }
      });
    }
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
    if ($scope.hotel_local != "" || $scope.hotel_local != null) {
      var rota = true;
      if ($scope.hotel_rota == 'nao') {
        rota = false;
      }

      var xmlVar = '<ConfiguracaoGenericaEndereco xmlns="http://schemas.datacontract.org/2004/07/WcfServiceCasamento"><Bairro>' + $scope.hotel_bairro + '</Bairro><Cidade>' + $scope.hotel_cidade + '</Cidade><CodigoArea></CodigoArea><Email>' + $scope.hotel_email + '</Email><Endereco>' + $scope.hotel_end + '</Endereco><Estado>' + $scope.hotel_uf + '</Estado><Id>0</Id><Id_usuario_logado>' + user.id + '</Id_usuario_logado><Nome>' + $scope.hotel_local + '</Nome><Numero>' + $scope.hotel_numero + '</Numero><Obs></Obs><Pais></Pais><Site>' + $scope.hotel_site + '</Site><Telefone>' + $scope.hotel_telefone + '</Telefone><TipoLogradouro></TipoLogradouro><Tracar_rota_local>' + rota + '</Tracar_rota_local></ConfiguracaoGenericaEndereco>';

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
        $scope.hotel_uf = "";
        $scope.hotel_site = "";
        $scope.hotel_telefone = "";
        $scope.hotel_email = "";
      });
    }
  };
  /** #ENDREGION HOTEL */

  /** #REGION SALAO */
  $scope.consultCEPSalao = function () {
    try {
      var cep = $scope.salao_cep.replace(/\./g, '');
      cep = cep.replace(/\-/g, '');

      if (cep.length > 7) {
        $.ajax({
          url: "http://api.postmon.com.br/v1/cep/" + cep.toString(),
          success: function (data) {
            $scope.salao_end = data.logradouro;
            $scope.salao_bairro = data.bairro;
            $scope.salao_cidade = data.cidade;
            $scope.salao_uf = data.estado;
          }
        });
      }
    } catch (error) { }
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
      var rota = true;
      if ($scope.salao_rota == 'nao') {
        rota = false;
      }

      var xmlVar = '<ConfiguracaoGenericaEndereco xmlns="http://schemas.datacontract.org/2004/07/WcfServiceCasamento"><Bairro>' + $scope.salao_bairro + '</Bairro><Cidade>' + $scope.salao_cidade + '</Cidade><CodigoArea></CodigoArea><Email>' + $scope.salao_email + '</Email><Endereco>' + $scope.salao_end + '</Endereco><Estado>' + $scope.salao_uf + '</Estado><Id>0</Id><Id_usuario_logado>' + user.id + '</Id_usuario_logado><Nome>' + $scope.salao_local + '</Nome><Numero>' + $scope.salao_numero + '</Numero><Obs></Obs><Pais></Pais><Site>' + $scope.salao_site + '</Site><Telefone>' + $scope.salao_telefone + '</Telefone><TipoLogradouro></TipoLogradouro><Tracar_rota_local>' + rota + '</Tracar_rota_local></ConfiguracaoGenericaEndereco>';

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
        $scope.salao_uf = "";
        $scope.salao_site = "";
        $scope.salao_telefone = "";
        $scope.salao_email = "";
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

  /** SETUP */
  if (user.recepcao.festa_igual_cerimonia == '' ||
    user.recepcao.festa_igual_cerimonia == null) {
    self.getDadosServico();

  } else {
    self.getDadosLocal();
  }
}]);