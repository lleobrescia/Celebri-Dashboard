(function () {
  'use strict';

  angular
    .module('dashboard')
    .controller('CasalController', CasalController);

  CasalController.$inject = ['serverService', 'conversorService', 'session', '$filter', 'toastr', 'EnviarFoto', '$scope', '$rootScope'];

  function CasalController(serverService, conversorService, session, $filter, toastr, EnviarFoto, $scope, $rootScope) {
    const ID = session.user.id;
    var vm = this;

    vm.carregando = false;
    vm.dados = {
      'Casal': {
        '@xmlns': 'http://schemas.datacontract.org/2004/07/WcfServiceCasamento',
        'Id_casal': 2147483647,
        'AtualizarSenha': false,
        'DataCasamento': '',
        'NomeNoiva': session.user.casal.nomeNoiva,
        'NomeNoivo': session.user.casal.nomeNoivo,
        'Senha': ''
      }
    };
    vm.dateMin = new Date();
    vm.erro = false;
    vm.fotoEditor = false;
    vm.genero = {
      'noiva': session.user.casal.generoNoiva,
      'noivo': session.user.casal.generoNoivo
    };
    vm.imageEditor = '';
    vm.selected = {
      width: 50,
      height: 50,
      top: 0,
      left: 0
    };

    vm.Cancelar = ResetDados;
    vm.Salvar = Salvar;
    vm.UploadFoto = UploadFoto;

    $scope.OpenFile = OpenFile;

    Activate();

    ////////////////

    function Activate() {
      ResetDados();
    }

    function OpenFile(elem) {
      vm.carregando = true;
      var reader = new FileReader();

      reader.onload = function () {
        var dataURL = reader.result;
        vm.fotoEditor = dataURL;
        vm.carregando = false;
        vm.editar = true;

        // configura os valores para a area de corte inicial
        vm.selected.width = 200;
        vm.selected.height = 200;
        vm.selected.left = 0;
        vm.selected.top = 0;
      };
      reader.readAsDataURL(elem.files[0]);
    }

    function ResetDados() {
      var casamento = session.user.casal.dataCasamento.split('/');
      var data = new Date(casamento[2], casamento[1] - 1, casamento[0]);

      vm.dados.Casal.DataCasamento = data;
      vm.dados.Casal.NomeNoiva = session.user.casal.nomeNoiva;
      vm.dados.Casal.NomeNoivo = session.user.casal.nomeNoivo;
    }

    function Salvar() {
      vm.carregando = true;
      var dados = conversorService.Json2Xml(vm.dados, '');

      session.user.casal.nomeNoiva = vm.dados.Casal.NomeNoiva;
      session.user.casal.nomeNoivo = vm.dados.Casal.NomeNoivo;
      session.user.casal.dataCasamento = $filter('date')(vm.dados.Casal.DataCasamento, 'dd/MM/yyyy');

      session.SaveState();

      serverService.Request('AtualizarDadosCadastroNoivos', dados).then(function (resp) {
        vm.carregando = false;
        toastr.success('Alterações Salvas!');
      }).catch(function (error) {
        console.error('AtualizarDadosCadastroNoivos -> ', error);
        vm.carregando = false;
        vm.erro = true;
        toastr.error('Ocorreu um erro ao tentar acessar o servidor', 'Erro');
      });
    }

    function UploadFoto() {
      vm.carregando = true; //Esconde foto atual e mostra gif de loding

      /**
       * Pega a foto recordada
       * Transforma em jpg
       * Passa para a base64
       */
      var imagemCortada = vm.imageEditor.toDataURL({
        useOriginalImg: true,
        imageType: 'image/jpg'
      });

      EnviarFoto.Request(ID, imagemCortada).then(function (resp) {
        var novaImg = '';
        var time = new Date(); //Pega a data e hora atual
        console.log(resp);
        /**
         * O nome da imagem nunca muda,portanto
         * ela fica no cache. Para evitar o cache
         * eh preciso colocar ?+a hora atual
         */

        try {
          novaImg = $rootScope.foto.split('?'); //Retira a hora antiga
          novaImg = novaImg[0] + '?' + $filter('date')(time, 'H:mm', '-0300');
        } catch (error) {
          novaImg = imagemCortada;
        }

        /**
         * Armazena o nome da imagem com a hora atual
         * O filtro [$filter('date')] mostra so a hora
         */

        $rootScope.foto = novaImg; //Salva a foto no scopo global e na pagina atual
        session.user.casal.urlFoto = novaImg; //Salva a foto local
        session.SaveState();
        vm.carregando = false; //seconde o gif de loding e mostra a nova imagem
      }).catch(function (error) {
        console.error('UploadFoto -> ', error);
        vm.carregando = false;
        vm.erro = true;
        toastr.error('Ocorreu um erro ao tentar acessar o servidor', 'Erro');
      });
    }
  }
})();