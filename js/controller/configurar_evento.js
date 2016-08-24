/**
 * Configurar Evento Controller
 * @namespace Controllers
 */
(function () {
  'use strict';
  angular
    .module('dashboard')
    .controller('configurarEventoCtrl', ConfigurarEventoCtrl);

  ConfigurarEventoCtrl.$inject = ['ServiceCasamento', 'UserService', 'ipService', 'consultCEP'];
  /**
   * @namespace ConfigurarEventoCtrl
   * @desc Controla os dados referente ao evento (hoteis,listas de presentes,cardapio,local da cerimonia)
   * @memberOf Controllers
   */
  function ConfigurarEventoCtrl(ServiceCasamento, UserService, ipService, consultCEP) {
    var self = this;
    var ID = UserService.dados.ID;

    self.cardapio = {
      'titulo'    : '',
      'descricao' : ''
    };
    self.festaIgualCerimonia = true;
    self.hotel = {
      'bairro'  : '',
      'cep'     : '',
      'cidade'  : '',
      'email'   : '',
      'end'     : '',
      'numero'  : '',
      'local'   : '',
      'uf'      : '',
      'rota'    : 'nao',
      'site'    : '',
      'telefone': ''
    };
    self.loja = {
      'nome': '',
      'url' : ''
    };
    self.salao = {
      'bairro'  : '',
      'cep'     : '',
      'cidade'  : '',
      'email'   : '',
      'end'     : '',
      'numero'  : '',
      'local'   : '',
      'uf'      : '',
      'rota'    : 'nao',
      'site'    : '',
      'telefone': ''
    };
    self.showCardapio   = false;
    self.showCerimonia  = false;
    self.showHotel      = false;
    self.showPresente   = false;
    self.showSalao      = false;

    Init();

  /**
   * @name AdicionarHotel
   * @desc Adiciona um hotel a lista e envia os dados para o servidor
   * @memberOf Controllers.ConfigurarEventoCtrl
   */
    function AdicionarHotel() {
      if (
        self.hotel.bairro &&
        self.hotel.cidade &&
        self.hotel.end    &&
        self.hotel.local  &&
        self.hotel.uf     &&
        self.hotel.telefone) {

        self.showHotel = false;

        if (self.hotel.local !== '' || self.hotel.local != null) {
          var rota = true;

          if (self.hotel.rota === 'nao') {
            rota = false;
          }

          var urlVar = 'http://' + ipService.ip + '/ServiceCasamento.svc/ConfigAdicionalEvento_ListaHoteis';

          var xmlVar = '<ConfiguracaoGenericaEndereco xmlns="http://schemas.datacontract.org/2004/07/WcfServiceCasamento"><Bairro>' + self.hotel.bairro + '</Bairro><Cidade>' + self.hotel.cidade + '</Cidade><CodigoArea></CodigoArea><Email>' + self.hotel.email + '</Email><Endereco>' + self.hotel.end + '</Endereco><Estado>' + self.hotel.uf + '</Estado><Id>0</Id><Id_usuario_logado>' + ID + '</Id_usuario_logado><Nome>' + self.hotel.local + '</Nome><Numero>' + self.hotel.numero + '</Numero><Obs></Obs><Pais></Pais><Site>' + self.hotel.site + '</Site><Telefone>' + self.hotel.telefone + '</Telefone><TipoLogradouro></TipoLogradouro><Tracar_rota_local>' + rota + '</Tracar_rota_local></ConfiguracaoGenericaEndereco>';

          ServiceCasamento.SendData(urlVar, xmlVar).then(function (resp) {
            /**
             * Eh necessario puxar o conteudo do servico novamente
             * pq o ID do novo hotel eh gerado no servico.
             */
            GetHoteis();

            //limpa dos dados do formulario
            self.hotel.bairro   = '';
            self.hotel.cep      = '';
            self.hotel.cidade   = '';
            self.hotel.end      = '';
            self.hotel.email    = '';
            self.hotel.local    = '';
            self.hotel.numero   = '';
            self.hotel.site     = '';
            self.hotel.telefone = '';
            self.hotel.uf       = '';

            self.showHotel = true;
          }).catch(function (error) {
            console.error('AdicionarHotel -> ', error);
            console.warn('Dados enviados:', xmlVar);
          });
        }
      }
    }

  /**
   * @name AdicionarSalao
   * @desc Adiciona um salao a lista e envia os dados para o servidor
   * @memberOf Controllers.ConfigurarEventoCtrl
   */
    function AdicionarSalao() {
      if (
        self.salao.bairro &&
        self.salao.cidade &&
        self.salao.end    &&
        self.salao.local  &&
        self.salao.uf     &&
        self.salao.telefone) {

        self.showSalao = false;
        if (self.salao.local !== '' && self.salao.local != null) {
          var rota = true;
          if (self.salao.rota === 'nao') {
            rota = false;
          }
          var urlVar = 'http://' + ipService.ip + '/ServiceCasamento.svc/ConfigAdicionalEvento_ListaSaloes';
          var xmlVar = '<ConfiguracaoGenericaEndereco xmlns="http://schemas.datacontract.org/2004/07/WcfServiceCasamento"><Bairro>' + self.salao.bairro + '</Bairro><Cidade>' + self.salao.cidade + '</Cidade><CodigoArea></CodigoArea><Email>' + self.salao.email + '</Email><Endereco>' + self.salao.end + '</Endereco><Estado>' + self.salao.uf + '</Estado><Id>0</Id><Id_usuario_logado>' + ID + '</Id_usuario_logado><Nome>' + self.salao.local + '</Nome><Numero>' + self.salao.numero + '</Numero><Obs></Obs><Pais></Pais><Site>' + self.salao.site + '</Site><Telefone>' + self.salao.telefone + '</Telefone><TipoLogradouro></TipoLogradouro><Tracar_rota_local>' + rota + '</Tracar_rota_local></ConfiguracaoGenericaEndereco>';

          ServiceCasamento.SendData(urlVar, xmlVar).then(function (resp) {
            /**
             * Eh necessario puxar o conteudo do servico novamente
             * pq o ID do novo salao eh gerado no servico.
             */
            GetSaloes();

            //limpa os dados do formulario
            self.salao.bairro   = '';
            self.salao.cep      = '';
            self.salao.cidade   = '';
            self.salao.end      = '';
            self.salao.email    = '';
            self.salao.local    = '';
            self.salao.numero   = '';
            self.salao.site     = '';
            self.salao.telefone = '';
            self.salao.uf       = '';

            self.showSalao = true;
          }).catch(function (error) {
            console.error('AdicionarSalao -> ', error);
            console.warn('Dados enviados:', xmlVar);
          });
        }
      }
    }

  /**
   * @name AdicionarUrl
   * @desc Adiciona uma url da lista de casamento e envia os dados para o servidor
   * @memberOf Controllers.ConfigurarEventoCtrl
   */
    function AdicionarUrl() {
      if (self.loja.nome && self.loja.url) {
        self.showPresente = false;
        var urlVar = 'http://' + ipService.ip + '/ServiceCasamento.svc/ConfigAdicionalEvento_LojaPresentes';
        var xmlVar = '<ConfiguracaoLojaPresentes xmlns="http://schemas.datacontract.org/2004/07/WcfServiceCasamento"><Id>0</Id><Id_usuario_logado>' + ID + '</Id_usuario_logado><Nome>' + self.loja.nome + '</Nome><Url>' + self.loja.url + '</Url></ConfiguracaoLojaPresentes>';

        ServiceCasamento.SendData(urlVar, xmlVar).then(function (resp) {
          /**
           * Eh necessario puxar o conteudo do servico novamente
           * pq o ID do novo presente eh gerado no servico.
           */
          GetPresentes();

          //limpa so dados do formulario
          self.loja.nome    = '';
          self.loja.url     = '';

          self.showPresente = true;
        }).catch(function (error) {
          console.error('AdicionarUrl -> ', error);
          console.warn('Dados enviados:', xmlVar);
        });
      }
    }

  /**
   * @name CerimoniaRemotoToLocal
   * @desc Pega os dados da serimonia do servidor e armazena localmente
   * @memberOf Controllers.ConfigurarEventoCtrl
   */
    function CerimoniaRemotoToLocal() {
      UserService.dados.festaIgualCerimonia = self.festaIgualCerimonia;
      UserService.dados.festaLocal          = self.festaLocal;
      UserService.dados.festaEnd            = self.festaEnd;
      UserService.dados.festaNumero         = self.festaNumero;
      UserService.dados.festaBairro         = self.festaBairro;
      UserService.dados.festaCidade         = self.festaCidade;
      UserService.dados.festaUf             = self.festaUf;
      UserService.dados.festaRota           = self.festaRota;
      UserService.dados.festaCep            = self.festaCep;
      UserService.SaveState();
    }

  /**
   * @name ConsultCEPFesta
   * @desc Consulta o CEP da cerimonia e armazena os dados
   * @memberOf Controllers.ConfigurarEventoCtrl
   */
    function ConsultCEPFesta(cepFesta) {
      try {
        consultCEP.consultar(cepFesta).then(function (data) {
          self.festaEnd    = data.logradouro;
          self.festaBairro = data.bairro;
          self.festaCidade = data.cidade;
          self.festaUf     = data.estado;
        });
      } catch (error) {
        console.warn('Erro ao consultar CEP:' + error);
      }
    }

  /**
   * @name ConsultCEPHotel
   * @desc Consulta o CEP do hotel e armazena os dados
   * @memberOf Controllers.ConfigurarEventoCtrl
   */
    function ConsultCEPHotel(cepHotel) {
      try {
        consultCEP.consultar(cepHotel).then(function (data) {
          self.hotel.end    = data.logradouro;
          self.hotel.bairro = data.bairro;
          self.hotel.cidade = data.cidade;
          self.hotel.uf     = data.estado;
        });
      } catch (error) {
        console.warn('Erro ao consultar CEP:' + error);
      }
    }

  /**
   * @name ConsultCEPSalao
   * @desc Consulta o CEP do salao e armazena os dados
   * @memberOf Controllers.ConfigurarEventoCtrl
   */
    function ConsultCEPSalao(cepSalao) {
      try {
        consultCEP.consultar(cepSalao).then(function (data) {
          self.salao.end    = data.logradouro;
          self.salao.bairro = data.bairro;
          self.salao.cidade = data.cidade;
          self.salao.uf     = data.estado;
        });
      } catch (error) {
        console.warn('Erro ao consultar CEP:' + error);
      }
    }

  /**
   * @name Init
   * @desc Setup do controlador
   * @memberOf Controllers.ConfigurarEventoCtrl
   */
    function Init() {
      /**
       * Adiciona as funcoes ao scopo do controlador
       */
      self.AdicionarHotel   = AdicionarHotel;
      self.AdicionarSalao   = AdicionarSalao;
      self.AdicionarUrl     = AdicionarUrl;
      self.ConsultCEPFesta  = ConsultCEPFesta;
      self.ConsultCEPHotel  = ConsultCEPHotel;
      self.ConsultCEPSalao  = ConsultCEPSalao;
      self.GetDadosLocal    = GetDadosLocal;
      self.RemoverCardapio  = RemoverCardapio;
      self.RemoverHotel     = RemoverHotel;
      self.RemoverSalao     = RemoverSalao;
      self.RemoverUrl       = RemoverUrl;
      self.SetCardapio      = SetCardapio;
      self.SetDadosEvento   = SetDadosEvento;

      if (!UserService.dados.festaCheck) {
        GetDadosServico();
        UserService.dados.festaCheck = true;
      } else {
        self.GetDadosLocal();
        self.lojaLista     = UserService.dados.listaPresente;
        self.hotelLista    = UserService.dados.listaHotel;
        self.salaoLista    = UserService.dados.listaSalao;
        self.listaCardapio = UserService.dados.listaCardapio;

        self.showCerimonia  = true;
        self.showHotel      = true;
        self.showSalao      = true;
        self.showPresente   = true;
        self.showCardapio   = true;
      }
    }

  /**
   * @name GetDadosServico
   * @desc Chama todas as funções que pegam dados do servidor
   * @memberOf Controllers.ConfigurarEventoCtrl
   */
    function GetDadosServico() {
      GetDadosEvento();
      GetHoteis();
      GetSaloes();
      GetPresentes();
      GetListaCardapio();
    }

  /**
   * @name GetDadosEvento
   * @desc Pega os dados da festa do servidor
   * @memberOf Controllers.ConfigurarEventoCtrl
   */
    function GetDadosEvento() {
      var urlVar = 'http://' + ipService.ip + '/ServiceCasamento.svc/RetornarConfiguracaoEvento';
      var xmlVar = '<IdentificaocaoCasal xmlns="http://schemas.datacontract.org/2004/07/WcfServiceCasamento"><Id_casal>' + ID + '</Id_casal></IdentificaocaoCasal>';

      ServiceCasamento.SendData(urlVar, xmlVar).then(function (resp) {
        var respXml               = $.parseXML(resp);
        self.festaIgualCerimonia  = $(respXml).find('Mesmo_local_cerimonia').text();
        self.festaLocal           = $(respXml).find('Local_festa').text();
        self.festaEnd             = $(respXml).find('Endereco').text();
        self.festaNumero          = $(respXml).find('Numero').text();
        self.festaBairro          = $(respXml).find('Bairro').text();
        self.festaCidade          = $(respXml).find('Cidade').text();
        self.festaUf              = $(respXml).find('Estado').text();
        self.festaRota            = $(respXml).find('Tracar_rota_local').text();
        self.festaCep             = $(respXml).find('Cep').text();

        //Salva informacao no local
        self.showCerimonia = true;
        CerimoniaRemotoToLocal();
      }).catch(function (error) {
        console.error('GetDadosEvento -> ', error);
        console.warn('Dados enviados:', xmlVar);
      });
    }

  /**
   * @name GetDadosLocal
   * @desc Pega os dados armazenados localmente
   * @memberOf Controllers.ConfigurarEventoCtrl
   */
    function GetDadosLocal() {
      self.festaIgualCerimonia  = UserService.dados.festaIgualCerimonia;
      self.festaLocal           = UserService.dados.festaLocal;
      self.festaEnd             = UserService.dados.festaEnd;
      self.festaNumero          = UserService.dados.festaNumero;
      self.festaBairro          = UserService.dados.festaBairro;
      self.festaUf              = UserService.dados.festaUf;
      self.festaCidade          = UserService.dados.festaCidade;
      self.festaRota            = UserService.dados.festaRota;
      self.festaCep             = UserService.dados.festaCep;

      self.hotelLista     = UserService.dados.listaHotel;
      self.salaoLista     = UserService.dados.listaSalao;
      self.lojaLista      = UserService.dados.listaPresente;
      self.listaCardapio  = UserService.dados.listaCardapio;
    }

  /**
   * @name GetHoteis
   * @desc Pega os hoteis no servidor
   * @memberOf Controllers.ConfigurarEventoCtrl
   */
    function GetHoteis() {
      var urlVar = 'http://' + ipService.ip + '/ServiceCasamento.svc/RetornarConfiguracaoListaHoteis';
      var xmlVar = '<IdentificaocaoCasal xmlns="http://schemas.datacontract.org/2004/07/WcfServiceCasamento"><Id_casal>' + ID + '</Id_casal></IdentificaocaoCasal>';

      ServiceCasamento.SendData(urlVar, xmlVar).then(function (resp) {
        var respXml = $.parseXML(resp);
        self.hotelLista = [];

        $(respXml).find('ConfiguracaoGenericaEndereco').each(function () {
          self.hotelLista.push(
            {
              'Id'    : $(this).find('Id').text(),
              'Local' : $(this).find('Nome').text()
            }
          );
        });

        //Armazena localmente
        self.showHotel                = true;
        UserService.dados.listaHotel  = self.hotelLista;
        UserService.SaveState();
      }).catch(function (error) {
        console.error('GetHoteis -> ', error);
        console.warn('Dados enviados:', xmlVar);
      });
    }

  /**
   * @name GetListaCardapio
   * @desc Pega os dados do cardapio do servidor
   * @memberOf Controllers.ConfigurarEventoCtrl
   */
    function GetListaCardapio() {
      var urlVar = 'http://' + ipService.ip + '/ServiceCasamento.svc/RetornarCardapio';
      var xmlVar = '<IdentificaocaoCasal xmlns="http://schemas.datacontract.org/2004/07/WcfServiceCasamento"><Id_casal>' + ID + '</Id_casal></IdentificaocaoCasal>';

      ServiceCasamento.SendData(urlVar, xmlVar).then(function (resp) {
        var respXml = $.parseXML(resp);
        self.listaCardapio = [];
        $(respXml).find('Cardapio').each(function () {

          self.listaCardapio.push(
            {
              'Id'        : $(this).find('Id').text(),
              'Nome'      : $(this).find('Nome').text(),
              'Descricao' : $(this).find('Descricao').text()
            }
          );
        });

        //Salva local
        self.showCardapio               = true;
        UserService.dados.listaCardapio = self.listaCardapio;
        UserService.SaveState();
      }).catch(function (error) {
        console.error('GetListaCardapio -> ', error);
        console.warn('Dados enviados:', xmlVar);
      });
    }

  /**
   * @name GetPresentes
   * @desc Pega os urls das listas de presentes do servidor
   * @memberOf Controllers.ConfigurarEventoCtrl
   */
    function GetPresentes() {
      var urlVar = 'http://' + ipService.ip + '/ServiceCasamento.svc/RetornarConfiguracaoLojaPresentes';
      var xmlVar = '<IdentificaocaoCasal xmlns="http://schemas.datacontract.org/2004/07/WcfServiceCasamento"><Id_casal>' + ID + '</Id_casal></IdentificaocaoCasal>';

      ServiceCasamento.SendData(urlVar, xmlVar).then(function (resp) {
        var respXml = $.parseXML(resp);
        self.lojaLista = [];

        $(respXml).find('ConfiguracaoLojaPresentes').each(function () {
          self.lojaLista.push(
            {
              'Id'  : $(this).find('Id').text(),
              'Nome': $(this).find('Nome').text()
            }
          );
        });

        //armazena localmente
        self.showPresente               = true;
        UserService.dados.listaPresente = self.lojaLista;
        UserService.SaveState();
      }).catch(function (error) {
        console.error('GetPresentes -> ', error);
        console.warn('Dados enviados:', xmlVar);
      });
    }

  /**
   * @name GetSaloes
   * @desc Pega os saloes do servidor
   * @memberOf Controllers.ConfigurarEventoCtrl
   */
    function GetSaloes() {
      var urlVar = 'http://' + ipService.ip + '/ServiceCasamento.svc/RetornarConfiguracaoListaSaloes';
      var xmlVar = '<IdentificaocaoCasal xmlns="http://schemas.datacontract.org/2004/07/WcfServiceCasamento"><Id_casal>' + ID + '</Id_casal></IdentificaocaoCasal>';

      ServiceCasamento.SendData(urlVar, xmlVar).then(function (resp) {
        var respXml = $.parseXML(resp);
        self.salaoLista = [];
        $(respXml).find('ConfiguracaoGenericaEndereco').each(function () {

          self.salaoLista.push(
            {
              'Id'    : $(this).find('Id').text(),
              'Local' : $(this).find('Nome').text()
            }
          );
        });

        //armazena localmente
        self.showSalao                = true;
        UserService.dados.listaSalao  = self.salaoLista;
        UserService.SaveState();
      }).catch(function (error) {
        console.error('GetSaloes -> ', error);
        console.warn('Dados enviados:', xmlVar);
      });
    }

  /**
   * @name RemoverCardapio
   * @desc Remove os dados do cardapio fornecido
   * @memberOf Controllers.ConfigurarEventoCtrl
   */
    function RemoverCardapio(dataId, key) {
      self.listaCardapio.splice(key, 1);
      var urlVar = 'http://' + ipService.ip + '/ServiceCasamento.svc/ExcluirCardapio';
      var xmlVar = '<ListaRegistrosExcluir xmlns="http://schemas.datacontract.org/2004/07/WcfServiceCasamento"><Id_casal>' + ID + '</Id_casal><Id_registro><int xmlns="http://schemas.microsoft.com/2003/10/Serialization/Arrays">' + dataId + '</int></Id_registro></ListaRegistrosExcluir>';

      ServiceCasamento.SendData(urlVar, xmlVar).then(function (resp) {

        UserService.dados.listaCardapio = self.listaCardapio;
        UserService.SaveState();
      }).catch(function (error) {
        console.error('RemoverCardapio -> ', error);
        console.warn('Dados enviados:', xmlVar);
      });
    }

  /**
   * @name RemoverHotel
   * @desc Remove o hotel fornecido
   * @memberOf Controllers.ConfigurarEventoCtrl
   */
    function RemoverHotel(dataId, key) {
      self.hotelLista.splice(key, 1);

      var urlVar = 'http://' + ipService.ip + '/ServiceCasamento.svc/ExcluirHoteis';
      var xmlVar = '<ListaRegistrosExcluir xmlns="http://schemas.datacontract.org/2004/07/WcfServiceCasamento"><Id_casal>' + ID + '</Id_casal><Id_registro><int xmlns="http://schemas.microsoft.com/2003/10/Serialization/Arrays">' + dataId + '</int></Id_registro></ListaRegistrosExcluir>';

      ServiceCasamento.SendData(urlVar, xmlVar).then(function () {
        UserService.dados.listaHotel = self.hotelLista;
        UserService.SaveState();
      }).catch(function (error) {
        console.error('RemoverHotel -> ', error);
        console.warn('Dados enviados:', xmlVar);
      });
    }

  /**
   * @name RemoverSalao
   * @desc Remove o salao fornecido
   * @memberOf Controllers.ConfigurarEventoCtrl
   */
    function RemoverSalao(dataId, key) {
      self.salaoLista.splice(key, 1);

      var urlVar = 'http://' + ipService.ip + '/ServiceCasamento.svc/ExcluirSaloes';
      var xmlVar = '<ListaRegistrosExcluir xmlns="http://schemas.datacontract.org/2004/07/WcfServiceCasamento"><Id_casal>' + ID + '</Id_casal><Id_registro><int xmlns="http://schemas.microsoft.com/2003/10/Serialization/Arrays">' + dataId + '</int></Id_registro></ListaRegistrosExcluir>';

      ServiceCasamento.SendData(urlVar, xmlVar).then(function (resp) {
        //atualiza localmente
        UserService.dados.listaSalao = self.salaoLista;
        UserService.SaveState();
      }).catch(function (error) {
        console.error('RemoverSalao -> ', error);
        console.warn('Dados enviados:', xmlVar);
      });
    }

  /**
   * @name RemoverUrl
   * @desc Remove o url fornecido
   * @memberOf Controllers.ConfigurarEventoCtrl
   */
    function RemoverUrl(dataId, key) {
      self.lojaLista.splice(key, 1);
      var urlVar = 'http://' + ipService.ip + '/ServiceCasamento.svc/ExcluirLojasPresentes';
      var xmlVar = '<ListaRegistrosExcluir xmlns="http://schemas.datacontract.org/2004/07/WcfServiceCasamento"><Id_casal>' + ID + '</Id_casal><Id_registro><int xmlns="http://schemas.microsoft.com/2003/10/Serialization/Arrays">' + dataId + '</int></Id_registro></ListaRegistrosExcluir>';

      ServiceCasamento.SendData(urlVar, xmlVar).then(function (resp) {
        //atualiza localmente
        UserService.dados.listaPresente = self.lojaLista;
        UserService.SaveState();
      }).catch(function (error) {
        console.error('RemoverUrl -> ', error);
        console.warn('Dados enviados:', xmlVar);
      });
    }

  /**
   * @name SetCardapio
   * @desc Envia os dados do cardapio para o servidor
   * @memberOf Controllers.ConfigurarEventoCtrl
   */
    function SetCardapio() {
      if (self.cardapio.titulo && self.cardapio.descricao) {
        self.showCardapio = false;
        var urlVar = 'http://' + ipService.ip + '/ServiceCasamento.svc/CadastrarCardapio';
        var xmlVar = '<Cardapio xmlns="http://schemas.datacontract.org/2004/07/WcfServiceCasamento"><Descricao>' + self.cardapio.descricao + '</Descricao><Id>0</Id><Id_usuario_logado>' + ID + '</Id_usuario_logado><Nome>' + self.cardapio.titulo + '</Nome></Cardapio>';

        ServiceCasamento.SendData(urlVar, xmlVar).then(function (resp) {
          /**
           * Eh necessario puxar o conteudo do servico novamente
           * pq o ID do novo cardapio eh gerado no servico.
           */
          GetListaCardapio();

          //limpa dados do formulario
          self.cardapio.titulo    = '';
          self.cardapio.descricao = '';
          self.showCardapio       = true;
        }).catch(function (error) {
          console.error('SetCardapio -> ', error);
          console.warn('Dados enviados:', xmlVar);
        });
      }
    }

  /**
   * @name SetDadosEvento
   * @desc Envia os dados da festa para o servidor
   * @memberOf Controllers.ConfigurarEventoCtrl
   */
    function SetDadosEvento() {
      var urlVar  = 'http://' + ipService.ip + '/ServiceCasamento.svc/ConfiguracaoEvento';
      var bairro  = '',
        cep       = '',
        cidade    = '',
        end       = '',
        uf        = '',
        local     = '',
        numero    = '',
        rota      = '';

      if (self.festaIgualCerimonia === true) {
        bairro  = UserService.dados.cerimoniaBairro;
        cep     = UserService.dados.cerimoniaCep;
        cidade  = UserService.dados.cerimoniaCidade;
        end     = UserService.dados.cerimoniaEnd;
        local   = UserService.dados.cerimoniaLocal;
        numero  = UserService.dados.cerimoniaNumero;
        rota    = UserService.dados.cerimoniaRota;
        uf      = UserService.dados.cerimoniaUf;

      } else {
        bairro  = self.festaBairro;
        cep     = self.festaCep;
        cidade  = self.festaCidade;
        end     = self.festaEnd;
        local   = self.festaLocal;
        numero  = self.festaNumero;
        rota    = self.festaRota;
        uf      = self.festaUf;
      }

      var xmlVar = '<ConfiguracaoEvento xmlns="http://schemas.datacontract.org/2004/07/WcfServiceCasamento"><Bairro>' + bairro + '</Bairro><Cep>' + cep + '</Cep><Cidade>' + cidade + '</Cidade><Endereco>' + end + '</Endereco><Estado>' + uf + '</Estado><Horario_festa></Horario_festa><Id_usuario_logado>' + ID + '</Id_usuario_logado><Local_festa>' + local + '</Local_festa><Mesmo_local_cerimonia>' + self.festaIgualCerimonia + '</Mesmo_local_cerimonia><Numero>' + numero + '</Numero><Obs></Obs><Pais></Pais><Tracar_rota_local>' + rota + '</Tracar_rota_local></ConfiguracaoEvento>';

      //envia para o servico
      ServiceCasamento.SendData(urlVar, xmlVar).catch(function (error) {
        console.error('SetDadosEvento -> ', error);
        console.warn('Dados enviados:', xmlVar);
      });

      //add informacao local
      CerimoniaRemotoToLocal();
    }
  }
} ());