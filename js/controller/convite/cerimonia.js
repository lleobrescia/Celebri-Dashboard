/**
 * Configurar Convite Controller
 * @namespace Controllers
 */
(function () {
  'use strict';
  angular
    .module('dashboard')
    .controller('CerimoniaCtrl', CerimoniaCtrl);

  CerimoniaCtrl.$inject = ['UserService', 'ServiceCasamento', 'ipService', 'consultCEP', 'PageService'];

  /**
   * @namespace CerimoniaCtrl
   * @desc Configura os dados dos pais dos noivos
   * @memberOf Controllers
   */
  function CerimoniaCtrl(UserService, ServiceCasamento, ipService, consultCEP, PageService) {
    var self  = this;
    var ID    = UserService.dados.ID;//ID do usuario logado

    self.ConsultarCep     = ConsultarCep;
    self.GetLocal         = GetLocal;
    self.SetDadosConvite  = SetDadosConvite;

    //Verifica se ja existe dados, para nao solicitar ao servidor
    if (UserService.dados.conviteCheck) {
      self.GetLocal();
    } else {
      GetDadosConvite();
      UserService.dados.conviteCheck = true;
    }

    //Set Title 
    PageService.SetTitle('Configurar Convite');

    /**
     * @name ConsultarCep
     * @desc Consulta o cep fornecido pelo usuario e preenche os dados no formulario
     * @memberOf Controllers.CerimoniaCtrl
     */
    function ConsultarCep(cep) {
      try {
        consultCEP.consultar(cep).then(function (data) {
          self.cerimoniaEnd     = data.logradouro;
          self.cerimoniaBairro  = data.bairro;
          self.cerimoniaCidade  = data.cidade;
          self.cerimoniaUf      = data.estado;
        });
      } catch (error) { }
    }

    /**
     * @name GetDadosConvite
     * @desc Carrega os dados no formulario do servirdor
     * @memberOf Controllers.CerimoniaCtrl
     */
    function GetDadosConvite() {
      var urlVar = 'http://' + ipService.ip + '/ServiceCasamento.svc/RetornarConfiguracaoConvite';
      var xmlVar = '<IdentificaocaoCasal xmlns="http://schemas.datacontract.org/2004/07/WcfServiceCasamento"><Id_casal>' + ID + '</Id_casal></IdentificaocaoCasal>';

      ServiceCasamento.SendData(urlVar, xmlVar).then(function (resp) {
        var respXml = $.parseXML(resp);
        var hora = $(respXml).find('Horario_cerimonia').text().split(':');

        self.cerimoniaLocal   = $(respXml).find('Local_cerimonia').text();
        self.cerimoniaEnd     = $(respXml).find('Endereco').text();
        self.cerimoniaNumero  = $(respXml).find('Numero').text();
        self.cerimoniaBairro  = $(respXml).find('Bairro').text();
        self.cerimoniaCidade  = $(respXml).find('Cidade').text();
        self.cerimoniaUf      = $(respXml).find('Estado').text();
        self.cerimoniaRota    = $(respXml).find('Tracar_rota_local').text();
        self.cerimoniaCep     = $(respXml).find('Cep').text();
        self.cerimoniaHora    = hora[0];

        if (hora[1] === '00') {
          self.cerimoniaMin = '0';
        } else {
          self.cerimoniaMin = hora[1];
        }

        self.noivaMae           = $(respXml).find('Mae_noiva').text();
        self.noivaPai           = $(respXml).find('Pai_noiva').text();
        self.noivoMae           = $(respXml).find('Mae_noivo').text();
        self.noivoPai           = $(respXml).find('Pai_noivo').text();
        self.noivaMaeMmemorian  = $(respXml).find('Mae_noiva_in_memoriam').text();
        self.noivaPaiMemorian   = $(respXml).find('Pai_noiva_in_memoriam').text();
        self.noivoMaeMemorian   = $(respXml).find('Mae_noivo_in_memoriam').text();
        self.noivoPaiMemorian   = $(respXml).find('Pai_noivo_in_memoriam').text();

        SalvarLocal();
      }).catch(function (error) {
        console.error('GetDadosConvite -> ', error);
        console.warn('Dados enviados:', xmlVar);
      });
    }

    /**
     * @name GetLocal
     * @desc Carrega os dados no formulario do session
     * @memberOf Controllers.CerimoniaCtrl
     */
    function GetLocal() {
      self.cerimoniaLocal   = UserService.dados.cerimoniaLocal;
      self.cerimoniaEnd     = UserService.dados.cerimoniaEnd;
      self.cerimoniaNumero  = UserService.dados.cerimoniaNumero;
      self.cerimoniaBairro  = UserService.dados.cerimoniaBairro;
      self.cerimoniaCidade  = UserService.dados.cerimoniaCidade;
      self.cerimoniaUf      = UserService.dados.cerimoniaUf;
      self.cerimoniaRota    = UserService.dados.cerimoniaRota;
      self.cerimoniaCep     = UserService.dados.cerimoniaCep;
      self.cerimoniaHora    = UserService.dados.cerimoniaHora;
      self.cerimoniaMin     = UserService.dados.cerimoniaMin;

      self.noivaMae           = UserService.dados.noivaMae;
      self.noivaPai           = UserService.dados.noivaPai;
      self.noivoMae           = UserService.dados.noivoMae;
      self.noivoPai           = UserService.dados.noivoPai;
      self.noivaMaeMmemorian  = UserService.dados.noivaMaeMmemorian;
      self.noivaPaiMemorian   = UserService.dados.noivaPaiMemorian;
      self.noivoMaeMemorian   = UserService.dados.noivoMaeMemorian;
      self.noivoPaiMemorian   = UserService.dados.noivoPaiMemorian;
    }

    /**
     * @name SalvarLocal
     * @desc Salva os dados do formulario no session
     * @memberOf Controllers.CerimoniaCtrl
     */
    function SalvarLocal() {
      UserService.dados.cerimoniaLocal  = self.cerimoniaLocal;
      UserService.dados.cerimoniaEnd    = self.cerimoniaEnd;
      UserService.dados.cerimoniaNumero = self.cerimoniaNumero;
      UserService.dados.cerimoniaBairro = self.cerimoniaBairro;
      UserService.dados.cerimoniaCidade = self.cerimoniaCidade;
      UserService.dados.cerimoniaUf     = self.cerimoniaUf;
      UserService.dados.cerimoniaRota   = self.cerimoniaRota;
      UserService.dados.cerimoniaCep    = self.cerimoniaCep;
      UserService.dados.cerimoniaHora   = self.cerimoniaHora;
      UserService.dados.cerimoniaMin    = self.cerimoniaMin;

      UserService.dados.noivaMae          = self.noivaMae;
      UserService.dados.noivaPai          = self.noivaPai;
      UserService.dados.noivoMae          = self.noivoMae;
      UserService.dados.noivoPai          = self.noivoPai;
      UserService.dados.noivaMaeMmemorian = self.noivaMaeMmemorian;
      UserService.dados.noivaPaiMemorian  = self.noivaPaiMemorian;
      UserService.dados.noivoMaeMemorian  = self.noivoMaeMemorian;
      UserService.dados.noivoPaiMemorian  = self.noivoPaiMemorian;
    }

    /**
     * @name SetDadosConvite
     * @desc Salva os dados do formulario no servirdor
     * @memberOf Controllers.CerimoniaCtrl
     */
    function SetDadosConvite() {
      var hora = self.cerimoniaHora + ':' + self.cerimoniaMin;
      var urlVar = 'http://' + ipService.ip + '/ServiceCasamento.svc/ConfiguracaoConvite';
      var xmlVar = '<ConfiguracaoConvite xmlns="http://schemas.datacontract.org/2004/07/WcfServiceCasamento"><Bairro>' + self.cerimoniaBairro + '</Bairro><Cep>' + self.cerimoniaCep + '</Cep><Cidade>' + self.cerimoniaCidade + '</Cidade><Endereco>' + self.cerimoniaEnd + '</Endereco><Estado>' + self.cerimoniaUf + '</Estado><Horario_cerimonia>' + hora + '</Horario_cerimonia><Id_usuario_logado>' + ID + '</Id_usuario_logado><Local_cerimonia>' + self.cerimoniaLocal + '</Local_cerimonia><Mae_noiva>' + self.noivaMae + '</Mae_noiva><Mae_noiva_in_memoriam>' + self.noivaMaeMmemorian + '</Mae_noiva_in_memoriam><Mae_noivo>' + self.noivoMae + '</Mae_noivo><Mae_noivo_in_memoriam>' + self.noivoMaeMemorian + '</Mae_noivo_in_memoriam><Msg1></Msg1><Msg2></Msg2><Msg3></Msg3><Msg4></Msg4><Msg5></Msg5><Msg6></Msg6><Numero>' + self.cerimoniaNumero + '</Numero><Obs></Obs><Pai_noiva>' + self.noivaPai + '</Pai_noiva><Pai_noiva_in_memoriam>' + self.noivaPaiMemorian + '</Pai_noiva_in_memoriam><Pai_noivo>' + self.noivoPai + '</Pai_noivo><Pai_noivo_in_memoriam>' + self.noivoPaiMemorian + '</Pai_noivo_in_memoriam><Pais></Pais><Tracar_rota_local>' + self.cerimoniaRota + '</Tracar_rota_local></ConfiguracaoConvite>';

      ServiceCasamento.SendData(urlVar, xmlVar).catch(function (error) {
        console.error('GetDadosConvite -> ', error);
        console.warn('Dados enviados:', xmlVar);
      });
      SalvarLocal();
    }
  }
})();