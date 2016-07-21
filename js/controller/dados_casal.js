/**
 * Dados Casal Controller
 * controllerAs: 'dadosCasalCtrl'
 * @namespace Controllers
 */
(function () {
  'use strict';
  angular
    .module('dashboard')
    .controller('dados_casal', DadosCasal);

  /**
   * Upload - Responsavel pelo o upload da imagem
   * $filter - Usado para filtrar o hora atual
   * $route - Usado para atualizar a pag depois de fazer o upload da foto
   * ServiceCasamento - Enviar os dados para o servidor
   * ipService - Pega o IP do servidor
   * UserService - Armazena os dados do usuario
   * $scope - scopo para input file
   * $rootScope - Usado para a imagem do casal
   */
  DadosCasal.$inject = ['Upload', '$filter', '$route', 'ServiceCasamento', 'ipService', 'UserService', '$scope', '$rootScope'];

  /**
   * @namespace DadosCasal
   * @desc Controla todos os itens Referente aos dados do casal.(Nome, data e foto)
   * @memberOf Controllers
   */
  function DadosCasal(Upload, $filter, $route, ServiceCasamento, ipService, UserService, $scope, $rootScope) {

    var self = this;
    var ID = UserService.dados.ID;
    var fotoNoivos = UserService.dados.fotoUrl;
    var dataNoivos = UserService.dados.dataCasamento;

    // O nome dos noivos e a imagem ja foi pega no login.
    self.nomeNoiva = UserService.dados.nomeNoiva;
    self.nomeNoivo = UserService.dados.nomeNoivo;

    /**
     * Dados iniciais para o ngImageEditor
     * Nao eh aceito valor null
     */
    self.fotoEditor = './image/user_login.png';
    self.selected = { width: 50, height: 50, top: 0, left: 0 };

    self.editar = false;//Esconde o popup da edicao da imagem
    self.carregando = false;//Esconde gif de loding

    self.UploadFoto = UploadFoto;
    self.CasalGetDados = CasalGetDados;
    self.SetDadosCasal = SetDadosCasal;
    $scope.OpenFile = OpenFile;

    if (fotoNoivos === 'image/user_login.png') {
      self.foto = null;
    } else {
      self.foto = fotoNoivos;
    }

    /**
     * Se a data do casamento estiver null, significa que eh a primeira vez que entra
     * pois os nomes dos noivos sao armazenados no login.
     * Nesse caso eh feita uma requisiçao ao servidor.
     * Caso contrario, apenas insere a data no html
     */
    // if (dataNoivos == null) {
    //   self.CasalGetDados();
    // } else {
    //   self.dataCasamento = new Date(dataNoivos);
    // }
self.CasalGetDados();
    /**
     * @name UploadFoto
     * @desc Envia o foto do casal recortada para o servidor na base64
     * @memberOf Controllers.DadosCasal
     */
    function UploadFoto() {
      self.carregando = true;  //Esconde foto atual e mostra gif de loding

      /**
       * Pega a foto recordada
       * Transforma em jpg
       * Passa para a base64
       */
      var imagemCortada = self.imageEditor.toDataURL({ useOriginalImg: true, imageType: 'image/jpg' });

      //Envia para o servidor
      var Upload = Upload.upload({
        url: 'https://celebri.com.br/dashboard/php/enviarFoto.php',
        data: { image: imagemCortada, name: ID }
      });

      //Retorno do servidor
      Upload.then(function (resp) {
        /**
         * O nome da imagem nunca muda,portanto
         * ela fica no cache. Para evitar o cache
         * eh preciso colocar ?+a hora atual
         */

        var novaImg = fotoNoivos.split('?'); //Retira a hora antiga
        var time = new Date(); //Pega a data e hora atual

        /**
         * Armazena o nome da imagem com a hora atual
         * O filtro [$filter('date')] mostra so a hora
         */
        fotoNoivos = novaImg[0] + '?' + $filter('date')(time, 'H:mm', '-0300');
        self.foto = $rootScope.fotoCasal = fotoNoivos; //Salva a foto no scopo global e na pagina atual
        UserService.dados.fotoUrl = fotoNoivos; //Salva a foto local
        self.carregando = false; //seconde o gif de loding e mostra a nova imagem

        //refresh a pagina para atualizar a imagem no site
        // $route.reload();
      });
    }

    /**
     * @name OpenFile
     * @param {File} elem File do input[type=file]
     * @desc Renderiza a imagem vinda do input para ser recortada
     * @memberOf Controllers.DadosCasal
     */
    function OpenFile(elem) {
      var reader = new FileReader();

      reader.onload = function () {
        var dataURL = reader.result;
        self.fotoEditor = dataURL;
        self.editar = true;

        // configura os valores para a area de corte inicial
        self.selected.width = 200;
        self.selected.height = 200;
        self.selected.left = 0;
        self.selected.top = 0;
      };
      reader.readAsDataURL(elem.files[0]);
    }

    /**
     * @name CasalGetDados
     * @desc Pega os dados do servidor
     * @memberOf Controllers.DadosCasal
     */
    function CasalGetDados() {
      var urlVar = 'http://' + ipService.ip + '/ServiceCasamento.svc/RetornarDadosCadastroNoivos';
      var xmlVar = '<IdentificaocaoCasal xmlns="http://schemas.datacontract.org/2004/07/WcfServiceCasamento"><Id_casal>' + ID + '</Id_casal></IdentificaocaoCasal>';

      ServiceCasamento.SendData(urlVar, xmlVar).then(function (resp) {
        var respXml = $.parseXML(resp);
        var status = $(respXml).find('Result').text();

        if (status === 'false') {
          console.error('Erro ao enviar os dados. Erro:', $(respXml).find('ErrorMessage').text());
          console.warn('Dados enviados:', xmlVar);
        }

        self.nomeNoivo = $(respXml).find('NomeNoivo').text();
        self.nomeNoiva = $(respXml).find('NomeNoiva').text();

        var data = $(respXml).find('DataCasamento').text().split('/');
        self.dataCasamento = new Date(data[1] + '/' + data[0] + '/' + data[2]);

        UserService.dados.dataCasamento = data[1] + '/' + data[0] + '/' + data[2];
        UserService.SaveState();
      }).catch(function (error) {
        console.error('CasalGetDados -> ', error);
        console.warn('Dados enviados:', xmlVar);
      });
    }

    /**
     * @name SetDadosCasal
     * @desc Envia os dados para o servidor
     * @memberOf Controllers.DadosCasal
     */
    function SetDadosCasal() {
      //Formata a data para o padrao americano.
      var casamento = (self.dataCasamento.getMonth() + 1) + '/' + self.dataCasamento.getDate() + '/' + self.dataCasamento.getFullYear();

      var xmlVar = '<DadosCasal xmlns="http://schemas.datacontract.org/2004/07/WcfServiceCasamento"><Id_casal>' + ID + '</Id_casal><AtualizarSenha>false</AtualizarSenha><DataCasamento>' + casamento + '</DataCasamento><NomeNoiva>' + self.nomeNoiva + '</NomeNoiva><NomeNoivo>' + self.nomeNoivo + '</NomeNoivo><Senha></Senha></DadosCasal>';
      var urlVar = 'http://' + ipService.ip + '/ServiceCasamento.svc/AtualizarDadosCadastroNoivos';

      //Enviar para o serviço na nuvem
      ServiceCasamento.SendData(urlVar, xmlVar).then(function (resp) {
        var respXml = $.parseXML(resp);
        var status = $(respXml).find('Result').text();

        if (status === 'False') {
          console.error('Erro ao enviar os dados.Erro:', $(respXml).find('ErrorMessage').text());
          console.warn('Dados enviados:', xmlVar);
        }
      }).catch(function (error) {
        console.error('SetDadosCasal -> ', error);
        console.warn('Dados enviados:', xmlVar);
      });

      //Armazena localmente e salva
      UserService.dados.dataCasamento = self.dataCasamento;
      UserService.dados.nomeNoiva = self.nomeNoiva;
      UserService.dados.nomeNoivo = self.nomeNoivo;
      UserService.SaveState();
    }
  }
})();