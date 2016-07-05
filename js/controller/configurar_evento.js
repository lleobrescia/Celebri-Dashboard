angular.module('dashboard').controller('configurar_evento', ['ServiceCasamento', 'UserService', 'ipService', 'consultCEP', function (ServiceCasamento, UserService, ipService, consultCEP) {

  var self = this;
  var ID = UserService.dados.ID;
  self.showCerimonia = false;
  self.showHotel = false;
  self.showSalao = false;
  self.showPresente = false;
  self.showCardapio = false;
  self.festa_igual_cerimonia = true;

  /**
   * pega todos os dados dos servicos;
   * dados do evento;hoteis;saloes;presentes;cardapio
   */
  self.getDadosServico = function () {
    self.getDadosEvento();
    self.getHoteis();
    self.getSaloes();
    self.getPresentes();
    self.getListaCardapio();
  };

  /** #REGION DADOS DA RECEPCAO */

  //Armazena localmente as informações do serviço da Cerimonia
  self.cerimoniaRemotoToLocal = function () {
    UserService.dados.festa_igual_cerimonia = self.festa_igual_cerimonia;
    UserService.dados.festa_local = self.festa_local;
    UserService.dados.festa_end = self.festa_end;
    UserService.dados.festa_numero = self.festa_numero;
    UserService.dados.festa_bairro = self.festa_bairro;
    UserService.dados.festa_cidade = self.festa_cidade;
    UserService.dados.festa_rota = self.festa_rota;
    UserService.dados.festa_cep = self.festa_cep;
  };

  //Pega os dados que estao armezados localmente e coloca no site
  self.getDadosLocal = function () {
    self.festa_igual_cerimonia = UserService.dados.festa_igual_cerimonia;
    self.festa_local = UserService.dados.festa_local;
    self.festa_end = UserService.dados.festa_end;
    self.festa_numero = UserService.dados.festa_numero;
    self.festa_bairro = UserService.dados.festa_bairro;
    self.festa_uf = UserService.dados.festa_uf;
    self.festa_cidade = UserService.dados.festa_cidade;
    self.festa_rota = UserService.dados.festa_rota;
    self.festa_cep = UserService.dados.festa_cep;

    self.hotel_lista = UserService.dados.lista_hotel;
    self.salao_lista = UserService.dados.lista_salao;
    self.loja_lista = UserService.dados.lista_presente;
    self.lista_cardapio = UserService.dados.lista_cardapio;
  };

  self.getDadosEvento = function () {
    var urlVar = "http://" + ipService.ip + "/ServiceCasamento.svc/RetornarConfiguracaoEvento";
    var xmlVar = '<IdentificaocaoCasal xmlns="http://schemas.datacontract.org/2004/07/WcfServiceCasamento"><Id_casal>' + ID + '</Id_casal></IdentificaocaoCasal>';

    ServiceCasamento.SendData(urlVar, xmlVar).then(function (resp) {
      var respXml = $.parseXML(resp);
      self.festa_igual_cerimonia = $(respXml).find('Mesmo_local_cerimonia').text();
      self.festa_local = $(respXml).find('Local_festa').text();
      self.festa_end = $(respXml).find('Endereco').text();
      self.festa_numero = $(respXml).find('Numero').text();
      self.festa_bairro = $(respXml).find('Bairro').text();
      self.festa_cidade = $(respXml).find('Cidade').text();
      self.festa_uf = $(respXml).find('Estado').text();
      self.festa_rota = $(respXml).find('Tracar_rota_local').text();
      self.festa_cep = $(respXml).find('Cep').text();

      //Salva informacao no local
      self.showCerimonia = true;
      self.cerimoniaRemotoToLocal();
      UserService.SaveState();
    });
  };

  self.setDadosEvento = function () {

    var urlVar = "http://" + ipService.ip + "/ServiceCasamento.svc/ConfiguracaoEvento";
    var xmlVar = '<ConfiguracaoEvento xmlns="http://schemas.datacontract.org/2004/07/WcfServiceCasamento"><Bairro>' + self.festa_bairro + '</Bairro><Cep>' + self.festa_cep + '</Cep><Cidade>' + self.festa_cidade + '</Cidade><Endereco>' + self.festa_end + '</Endereco><Estado>' + self.festa_uf + '</Estado><Horario_festa></Horario_festa><Id_usuario_logado>' + ID + '</Id_usuario_logado><Local_festa>' + self.festa_local + '</Local_festa><Mesmo_local_cerimonia>' + self.festa_igual_cerimonia + '</Mesmo_local_cerimonia><Numero>' + self.festa_numero + '</Numero><Obs></Obs><Pais></Pais><Tracar_rota_local>' + self.festa_rota + '</Tracar_rota_local></ConfiguracaoEvento>';

    //envia para o servico
    ServiceCasamento.SendData(urlVar, xmlVar);

    //add informacao local
    self.cerimoniaRemotoToLocal();
    UserService.SaveState();
  };

  self.consultFestaCEP = function (cepFesta) {
    try {
      consultCEP.consultar(cepFesta).then(function (data) {
        self.festa_end = data.logradouro;
        self.festa_bairro = data.bairro;
        self.festa_cidade = data.cidade;
        self.festa_uf = data.estado;
      });
    } catch (error) { }
  };

  /** #ENDREGION DADOS DA RECEPCAO */

  /** #REGION HOTEL */
  self.consultCEPHotel = function (cep) {
    try {
      consultCEP.consultar(cep).then(function (data) {
        self.hotel_end = data.logradouro;
        self.hotel_bairro = data.bairro;
        self.hotel_cidade = data.cidade;
        self.hotel_uf = data.estado;
      });
    } catch (error) {

    }
  };

  self.getHoteis = function () {
    var urlVar = "http://" + ipService.ip + "/ServiceCasamento.svc/RetornarConfiguracaoListaHoteis";
    var xmlVar = '<IdentificaocaoCasal xmlns="http://schemas.datacontract.org/2004/07/WcfServiceCasamento"><Id_casal>' + ID + '</Id_casal></IdentificaocaoCasal>';

    ServiceCasamento.SendData(urlVar, xmlVar).then(function (resp) {
      var respXml = $.parseXML(resp);
      self.hotel_lista = [];

      $(respXml).find('ConfiguracaoGenericaEndereco').each(function () {
        self.hotel_lista.push(
          {
            'Id': $(this).find('Id').text(),
            'Local': $(this).find('Nome').text()
          }
        );
      });
      //Armazena localmente
      self.showHotel = true;
      UserService.dados.lista_hotel = self.hotel_lista;
      UserService.SaveState();
    });
  };

  self.removeHotel = function (dataId, key) {
    self.hotel_lista.splice(key, 1);

    var urlVar = "http://" + ipService.ip + "/ServiceCasamento.svc/ExcluirHoteis";
    var xmlVar = '<ListaRegistrosExcluir xmlns="http://schemas.datacontract.org/2004/07/WcfServiceCasamento"><Id_casal>' + ID + '</Id_casal><Id_registro><int xmlns="http://schemas.microsoft.com/2003/10/Serialization/Arrays">' + dataId + '</int></Id_registro></ListaRegistrosExcluir>';

    ServiceCasamento.SendData(urlVar, xmlVar).then(function () {
      UserService.dados.lista_hotel = self.hotel_lista;
      UserService.SaveState();
    });
  };

  self.adicionarHotel = function () {
    if (self.hotel_local &&
      self.hotel_end &&
      self.hotel_numero &&
      self.hotel_bairro &&
      self.hotel_cidade &&
      self.hotel_uf &&
      self.hotel_telefone) {

      self.showHotel = false;

      if (self.hotel_local != "" || self.hotel_local != null) {
        var rota = true;
        if (self.hotel_rota == 'nao') {
          rota = false;
        }
        var urlVar = "http://" + ipService.ip + "/ServiceCasamento.svc/ConfigAdicionalEvento_ListaHoteis";
        var xmlVar = '<ConfiguracaoGenericaEndereco xmlns="http://schemas.datacontract.org/2004/07/WcfServiceCasamento"><Bairro>' + self.hotel_bairro + '</Bairro><Cidade>' + self.hotel_cidade + '</Cidade><CodigoArea></CodigoArea><Email>' + self.hotel_email + '</Email><Endereco>' + self.hotel_end + '</Endereco><Estado>' + self.hotel_uf + '</Estado><Id>0</Id><Id_usuario_logado>' + ID + '</Id_usuario_logado><Nome>' + self.hotel_local + '</Nome><Numero>' + self.hotel_numero + '</Numero><Obs></Obs><Pais></Pais><Site>' + self.hotel_site + '</Site><Telefone>' + self.hotel_telefone + '</Telefone><TipoLogradouro></TipoLogradouro><Tracar_rota_local>' + rota + '</Tracar_rota_local></ConfiguracaoGenericaEndereco>';

        ServiceCasamento.SendData(urlVar, xmlVar).then(function (resp) {
          /**
           * Eh necessario puxar o conteudo do servico novamente
           * pq o ID do novo hotel eh gerado no servico.
           */
          self.getHoteis();

          //limpa dos dados do formulario
          self.hotel_local = "";
          self.hotel_cep = "";
          self.hotel_end = "";
          self.hotel_numero = "";
          self.hotel_bairro = "";
          self.hotel_cidade = "";
          self.hotel_uf = "";
          self.hotel_site = "";
          self.hotel_telefone = "";
          self.hotel_email = "";

          self.showHotel = true;
        });
      }
    }
  };
  /** #ENDREGION HOTEL */

  /** #REGION SALAO */
  self.consultCEPSalao = function (cep) {
    try {
      consultCEP.consultar(cep).then(function (data) {
        self.salao_end = data.logradouro;
        self.salao_bairro = data.bairro;
        self.salao_cidade = data.cidade;
        self.salao_uf = data.estado;
      });
    } catch (error) { }
  };

  self.getSaloes = function () {
    var urlVar = "http://" + ipService.ip + "/ServiceCasamento.svc/RetornarConfiguracaoListaSaloes";
    var xmlVar = '<IdentificaocaoCasal xmlns="http://schemas.datacontract.org/2004/07/WcfServiceCasamento"><Id_casal>' + ID + '</Id_casal></IdentificaocaoCasal>';

    ServiceCasamento.SendData(urlVar, xmlVar).then(function (resp) {
      var respXml = $.parseXML(resp);
      self.salao_lista = [];
      $(respXml).find('ConfiguracaoGenericaEndereco').each(function () {

        self.salao_lista.push(
          {
            'Id': $(this).find('Id').text(),
            'Local': $(this).find('Nome').text()
          }
        );
      });

      //armazena localmente
      self.showSalao = true;
      UserService.dados.lista_salao = self.salao_lista;
      UserService.SaveState();
    });
  };

  self.removeSalao = function (dataId, key) {
    self.salao_lista.splice(key, 1);

    var urlVar = "http://" + ipService.ip + "/ServiceCasamento.svc/ExcluirSaloes";
    var xmlVar = '<ListaRegistrosExcluir xmlns="http://schemas.datacontract.org/2004/07/WcfServiceCasamento"><Id_casal>' + ID + '</Id_casal><Id_registro><int xmlns="http://schemas.microsoft.com/2003/10/Serialization/Arrays">' + dataId + '</int></Id_registro></ListaRegistrosExcluir>';

    ServiceCasamento.SendData(urlVar, xmlVar).then(function (resp) {
      //atualiza localmente
      UserService.dados.lista_salao = self.salao_lista;
      UserService.SaveState();
    });
  };

  self.adicionarSalao = function () {
    if (self.salao_local &&
      self.salao_end &&
      self.salao_numero &&
      self.salao_bairro &&
      self.salao_cidade &&
      self.salao_uf &&
      self.salao_telefone) {

      self.showSalao = false;
      if (self.salao_local != "" && self.salao_local != null) {
        var rota = true;
        if (self.salao_rota == 'nao') {
          rota = false;
        }
        var urlVar = "http://" + ipService.ip + "/ServiceCasamento.svc/ConfigAdicionalEvento_ListaSaloes";
        var xmlVar = '<ConfiguracaoGenericaEndereco xmlns="http://schemas.datacontract.org/2004/07/WcfServiceCasamento"><Bairro>' + self.salao_bairro + '</Bairro><Cidade>' + self.salao_cidade + '</Cidade><CodigoArea></CodigoArea><Email>' + self.salao_email + '</Email><Endereco>' + self.salao_end + '</Endereco><Estado>' + self.salao_uf + '</Estado><Id>0</Id><Id_usuario_logado>' + ID + '</Id_usuario_logado><Nome>' + self.salao_local + '</Nome><Numero>' + self.salao_numero + '</Numero><Obs></Obs><Pais></Pais><Site>' + self.salao_site + '</Site><Telefone>' + self.salao_telefone + '</Telefone><TipoLogradouro></TipoLogradouro><Tracar_rota_local>' + rota + '</Tracar_rota_local></ConfiguracaoGenericaEndereco>';

        ServiceCasamento.SendData(urlVar, xmlVar).then(function (resp) {
          /**
           * Eh necessario puxar o conteudo do servico novamente
           * pq o ID do novo salao eh gerado no servico.
           */
          self.getSaloes();

          //limpa os dados do formulario
          self.salao_local = "";
          self.salao_cep = "";
          self.salao_end = "";
          self.salao_numero = "";
          self.salao_bairro = "";
          self.salao_cidade = "";
          self.salao_uf = "";
          self.salao_site = "";
          self.salao_telefone = "";
          self.salao_email = "";

          self.showSalao = true;
        });
      }
    }
  };
  /** #ENDREGION SALAO */

  /** #REGION LISTA DE PRESENTE */
  self.getPresentes = function () {
    var urlVar = "http://" + ipService.ip + "/ServiceCasamento.svc/RetornarConfiguracaoLojaPresentes";
    var xmlVar = '<IdentificaocaoCasal xmlns="http://schemas.datacontract.org/2004/07/WcfServiceCasamento"><Id_casal>' + ID + '</Id_casal></IdentificaocaoCasal>';

    ServiceCasamento.SendData(urlVar, xmlVar).then(function (resp) {
      var respXml = $.parseXML(resp);
      self.loja_lista = [];

      $(respXml).find('ConfiguracaoLojaPresentes').each(function () {
        self.loja_lista.push(
          {
            'Id': $(this).find('Id').text(),
            'Nome': $(this).find('Nome').text()
          }
        );
      });

      //armazena localmente
      self.showPresente = true;
      UserService.dados.lista_presente = self.loja_lista;
      UserService.SaveState();
    });
  };

  self.removeUrl = function (dataId, key) {
    self.loja_lista.splice(key, 1);
    var urlVar = "http://" + ipService.ip + "/ServiceCasamento.svc/ExcluirLojasPresentes";
    var xmlVar = '<ListaRegistrosExcluir xmlns="http://schemas.datacontract.org/2004/07/WcfServiceCasamento"><Id_casal>' + ID + '</Id_casal><Id_registro><int xmlns="http://schemas.microsoft.com/2003/10/Serialization/Arrays">' + dataId + '</int></Id_registro></ListaRegistrosExcluir>';

    ServiceCasamento.SendData(urlVar, xmlVar).then(function (resp) {
      //atualiza localmente
      UserService.dados.lista_presente = self.loja_lista;
      UserService.SaveState();
    });
  };

  self.adicionarUrl = function () {
    if (self.loja_nome && self.loja_url) {
      self.showPresente = false;
      var urlVar = "http://" + ipService.ip + "/ServiceCasamento.svc/ConfigAdicionalEvento_LojaPresentes";
      var xmlVar = '<ConfiguracaoLojaPresentes xmlns="http://schemas.datacontract.org/2004/07/WcfServiceCasamento"><Id>0</Id><Id_usuario_logado>' + ID + '</Id_usuario_logado><Nome>' + self.loja_nome + '</Nome><Url>' + self.loja_url + '</Url></ConfiguracaoLojaPresentes>';

      ServiceCasamento.SendData(urlVar, xmlVar).then(function (resp) {
        /**
         * Eh necessario puxar o conteudo do servico novamente
         * pq o ID do novo presente eh gerado no servico.
         */
        self.getPresentes();

        //limpa so dados do formulario
        self.loja_nome = "";
        self.loja_url = "";
        self.showPresente = true;
      });


    }
  };
  /** #ENDREGION LISTA DE PRESENTE */

  /** #REGION CARDAPIO */
  self.getListaCardapio = function () {
    var urlVar = "http://" + ipService.ip + "/ServiceCasamento.svc/RetornarCardapio";
    var xmlVar = '<IdentificaocaoCasal xmlns="http://schemas.datacontract.org/2004/07/WcfServiceCasamento"><Id_casal>' + ID + '</Id_casal></IdentificaocaoCasal>';

    ServiceCasamento.SendData(urlVar, xmlVar).then(function (resp) {
      var respXml = $.parseXML(resp);
      self.lista_cardapio = [];
      $(respXml).find('Cardapio').each(function () {

        self.lista_cardapio.push(
          {
            'Id': $(this).find('Id').text(),
            'Nome': $(this).find('Nome').text(),
            'Descricao': $(this).find('Descricao').text()
          }
        );
      });

      //Salva local
      self.showCardapio = true;
      UserService.dados.lista_cardapio = self.lista_cardapio;
      UserService.SaveState();
    });
  };

  self.removerCardapio = function (dataId, key) {
    self.lista_cardapio.splice(key, 1);
    var urlVar = "http://" + ipService.ip + "/ServiceCasamento.svc/ExcluirCardapio";
    var xmlVar = '<ListaRegistrosExcluir xmlns="http://schemas.datacontract.org/2004/07/WcfServiceCasamento"><Id_casal>' + ID + '</Id_casal><Id_registro><int xmlns="http://schemas.microsoft.com/2003/10/Serialization/Arrays">' + dataId + '</int></Id_registro></ListaRegistrosExcluir>';

    ServiceCasamento.SendData(urlVar, xmlVar).then(function (resp) {

      UserService.dados.lista_cardapio = self.lista_cardapio;
      UserService.SaveState();
    });
  };

  self.setCardapio = function () {
    if (self.cardapio_title && self.cardapio_descricao) {
      self.showCardapio = false;
      var urlVar = "http://" + ipService.ip + "/ServiceCasamento.svc/CadastrarCardapio";
      var xmlVar = '<Cardapio xmlns="http://schemas.datacontract.org/2004/07/WcfServiceCasamento"><Descricao>' + self.cardapio_descricao + '</Descricao><Id>0</Id><Id_usuario_logado>' + ID + '</Id_usuario_logado><Nome>' + self.cardapio_title + '</Nome></Cardapio>';

      ServiceCasamento.SendData(urlVar, xmlVar).then(function (resp) {
        /**
         * Eh necessario puxar o conteudo do servico novamente
         * pq o ID do novo cardapio eh gerado no servico.
         */
        self.getListaCardapio();

        //limpa dados do formulario
        self.cardapio_title = "";
        self.cardapio_descricao = "";
        self.showCardapio = true;
      });
    }
  };
  /** #ENDREGION LISTA DE PRESENTE */

  if (!UserService.dados.festaCheck) {
    self.getDadosServico();
    UserService.dados.festaCheck = true;
  } else {
    self.getDadosLocal();
    self.loja_lista = UserService.dados.lista_presente;
    self.hotel_lista = UserService.dados.lista_hotel;
    self.salao_lista = UserService.dados.lista_salao;
    self.lista_cardapio = UserService.dados.lista_cardapio;

    self.showCerimonia = true;
    self.showHotel = true;
    self.showSalao = true;
    self.showPresente = true;
    self.showCardapio = true;
  }
}]);