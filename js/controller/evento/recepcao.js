(function () {
  'use strict';

  angular
    .module('dashboard')
    .controller('RecepcaoCtrl', RecepcaoCtrl);

  RecepcaoCtrl.$inject = ['ServiceCasamento', 'ipService', 'UserService', 'PageService', 'consultCEP'];
  function RecepcaoCtrl(ServiceCasamento, ipService, UserService, PageService, consultCEP) {
    var self = this;
    var ID   = UserService.dados.ID;

    self.confirRecepcao         = false;
    self.recepcaoIgualCerimonia = 'true';

    self.bairro = ' ';
    self.cep    = ' ';
    self.cidade = ' ';
    self.end    = ' ';
    self.local  = ' ';
    self.numero = ' ';
    self.uf     = ' ';
    self.rota   = ' ';

    self.Cancelar       = GetDadosLocal;
    self.ConsultCEP     = ConsultCEP;
    self.SetDadosEvento = SetDadosEvento;

    Init();

  /**
   * @name ConsultCEPFesta
   * @desc Consulta o CEP da cerimonia e armazena os dados
   * @memberOf Controllers.RecepcaoCtrl
   */
    function ConsultCEP(cep) {
      try {
        consultCEP.consultar(cep).then(function (data) {
          self.end    = data.logradouro;
          self.bairro = data.bairro;
          self.cidade = data.cidade;
          self.uf     = data.estado;
        });
      } catch (error) {
        console.warn('Erro ao consultar CEP:' + error);
      }
    }

  /**
   * @name GetDadosLocal
   * @desc Pega os dados armazenados localmente
   * @memberOf Controllers.RecepcaoCtrl
   */
    function GetDadosLocal() {
      self.recepcaoIgualCerimonia = UserService.dados.festaIgualCerimonia;
      self.local                  = UserService.dados.festaLocal;
      self.end                    = UserService.dados.festaEnd;
      self.numero                 = UserService.dados.festaNumero;
      self.bairro                 = UserService.dados.festaBairro;
      self.cidade                 = UserService.dados.festaUf;
      self.uf                     = UserService.dados.festaCidade;
      self.rota                   = UserService.dados.festaRota;
      self.cep                    = UserService.dados.festaCep;

      if(self.local !== null && self.local !== ''){
        self.confirRecepcao = true;
      }
    }

  /**
   * @name GetDadosRecepcao
   * @desc Pega os dados da recepcao do servidor
   * @memberOf Controllers.RecepcaoCtrl
   */
    function GetDadosRecepcao(){
      var urlVar = 'http://' + ipService.ip + '/ServiceCasamento.svc/RetornarConfiguracaoEvento';
      var xmlVar = '<IdentificaocaoCasal xmlns="http://schemas.datacontract.org/2004/07/WcfServiceCasamento"><Id_casal>' + ID + '</Id_casal></IdentificaocaoCasal>';

      ServiceCasamento.SendData(urlVar, xmlVar).then(function (resp) {
        var respXml = $.parseXML(resp);

        self.recepcaoIgualCerimonia = $(respXml).find('Mesmo_local_cerimonia').text();
        self.local                  = $(respXml).find('Local_festa').text();
        self.end                    = $(respXml).find('Endereco').text();
        self.numero                 = $(respXml).find('Numero').text();
        self.bairro                 = $(respXml).find('Bairro').text();
        self.cidade                 = $(respXml).find('Cidade').text();
        self.uf                     = $(respXml).find('Estado').text();
        self.rota                   = $(respXml).find('Tracar_rota_local').text();
        self.cep                    = $(respXml).find('Cep').text();

        if(self.local  !== null){
          self.confirRecepcao = true;
        }

        //Salva informacao no local
        RecepcaoRemotoToLocal();
      }).catch(function (error) {
        console.error('GetDadosEvento -> ', error);
        console.warn('Dados enviados:', xmlVar);
      });
    }


    function Init() {
      //Set Title 
      PageService.SetTitle('Recepção');

      if (!UserService.dados.festaCheck) {
        GetDadosRecepcao();
        UserService.dados.festaCheck = true;
      }else{
        GetDadosLocal();
      }
    }

  /**
   * @name RecepcaoRemotoToLocal
   * @desc Pega os dados da serimonia do servidor e armazena localmente
   * @memberOf Controllers.RecepcaoCtrl
   */
    function RecepcaoRemotoToLocal() {
      UserService.dados.festaIgualCerimonia = self.recepcaoIgualCerimonia;
      UserService.dados.festaLocal          = self.local;
      UserService.dados.festaEnd            = self.end;
      UserService.dados.festaNumero         = self.numero;
      UserService.dados.festaBairro         = self.bairro;
      UserService.dados.festaCidade         = self.cidade;
      UserService.dados.festaUf             = self.uf;
      UserService.dados.festaRota           = self.rota;
      UserService.dados.festaCep            = self.cep;
      UserService.SaveState();
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
        numero    = 0,
        rota      = 'true';

      if (self.confirRecepcao === true && self.recepcaoIgualCerimonia === 'true') {
        bairro  = UserService.dados.cerimoniaBairro;
        cep     = UserService.dados.cerimoniaCep;
        cidade  = UserService.dados.cerimoniaCidade;
        end     = UserService.dados.cerimoniaEnd;
        local   = UserService.dados.cerimoniaLocal;
        numero  = UserService.dados.cerimoniaNumero;
        rota    = UserService.dados.cerimoniaRota;
        uf      = UserService.dados.cerimoniaUf;

      } else if(self.confirRecepcao === true && self.recepcaoIgualCerimonia === 'false') {
        bairro  = self.bairro;
        cep     = self.cep;
        cidade  = self.cidade;
        end     = self.end;
        local   = self.local;
        numero  = self.numero;
        rota    = self.rota;
        uf      = self.uf;
      }else{
        self.bairro  = bairro;
        self.cep     = cep;
        self.cidade  = cidade;
        self.end     = end;
        self.local   = local;
        self.numero  = numero;
        self.rota    = rota;
        self.uf      = uf;

        RecepcaoRemotoToLocal()
      }

      var xmlVar = '<ConfiguracaoEvento xmlns="http://schemas.datacontract.org/2004/07/WcfServiceCasamento"><Bairro>' + bairro + '</Bairro><Cep>' + cep + '</Cep><Cidade>' + cidade + '</Cidade><Endereco>' + end + '</Endereco><Estado>' + uf + '</Estado><Horario_festa></Horario_festa><Id_usuario_logado>' + ID + '</Id_usuario_logado><Local_festa>' + local + '</Local_festa><Mesmo_local_cerimonia>' + self.recepcaoIgualCerimonia + '</Mesmo_local_cerimonia><Numero>' + numero + '</Numero><Obs></Obs><Pais></Pais><Tracar_rota_local>' + rota + '</Tracar_rota_local></ConfiguracaoEvento>';

      console.log(xmlVar);
 
      //envia para o servico
      ServiceCasamento.SendData(urlVar, xmlVar).then(function(resp){
        console.log(resp);
      }).catch(function (error) {
        console.error('SetDadosEvento -> ', error);
      });

      //add informacao local
      RecepcaoRemotoToLocal();
    }
  }
})();
