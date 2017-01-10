/**
 * Save The Date Controller
 * Usa os seguinte endpoints:
 *  - FormatacaoSaveTheDate
 *  - RetornarFormatacaoSaveTheDate 
 *  - EnvioEmailSaveTheDate
 *  - RetornarConvidados
 * @namespace Controllers
 */
(function () {
  'use strict';

  angular
    .module('dashboard')
    .controller('SaveDateController', SaveDateController);

  SaveDateController.$inject = ['serverService', 'conversorService', 'ListManagerService', 'session', 'toastr', '$rootScope'];

  function SaveDateController(serverService, conversorService, ListManagerService, session, toastr, $rootScope) {
    const enable = $rootScope.pagante;
    const ID = session.user.id;

    var vm = this;

    vm.carregando = true;
    vm.carregandoLista = true;
    vm.convidados = [];
    vm.dados = {
      'DadosFormatacaoSaveTheDate': {
        '@xmlns': 'http://schemas.datacontract.org/2004/07/WcfServiceCasamento',
        '@xmlns:i': 'http://www.w3.org/2001/XMLSchema-instance',
        'ErrorMessage': '',
        'Result': '',
        'id_casal': ID,
        'id_modelo': '1',
        'msg': 'Pessoas especiais como você fazem parte deste momento! O dia ' + session.user.casal.dataCasamento + ' é muito importante para nós, o dia do nosso casamento, e gostaríamos de compartilhá-lo com você. Marque esta data no seu calendário para não se esquecer.  A sua presença é essencial! Em breve você receberá por email, o convite e mais informações do nosso casamento.',
        'nomecasal': session.user.casal.nomeNoiva + ' e ' + session.user.casal.nomeNoivo
      }
    };
    vm.erro = false;
    vm.erroLista = false;
    vm.ListManager = ListManagerService;
    vm.modelos = [{
        'id': '1',
        'image': 'modelo1.png'
      },
      {
        'id': '3',
        'image': 'modelo3.png'
      },
      {
        'id': '8',
        'image': 'modelo8.png'
      }
    ];
    vm.selecionados = [];

    Activate();

    vm.Enviar = Enviar;
    vm.Cancelar = GetDados;
    vm.IsThisSelected = IsThisSelected;
    vm.SelectImage = SelectImage;
    vm.SetDados = SetDados;

    ////////////////

    function Activate() {
      GetDados();
      GetConvidados();
    }

    function Enviar() {
      vm.carregandoLista = true;

      if (enable) {
        var lista = {
          'ListaEmailConvidados': {
            '@xmlns': 'http://schemas.datacontract.org/2004/07/WcfServiceCasamento',
            'Id_casal': ID,
            'Id_convidado': {
              'int': []
            }
          }
        };
        var xml = null;

        angular.forEach(vm.selecionados, function (selecionado) {
          lista.ListaEmailConvidados.Id_convidado.int.push({
            '@xmlns': 'http://schemas.microsoft.com/2003/10/Serialization/Arrays',
            '#text': selecionado.Id
          });
        });
        xml = conversorService.Json2Xml(lista, '');

        serverService.Request('EnvioEmailSaveTheDate', xml).then(function (resp) {
          toastr.success('Save the Date Enviado!');
          GetConvidados();
        });
      } else {
        toastr.error('Você deve efetuar o pagamento para usar essa funcionalidade');
        vm.carregandoLista = false;
      }
    }

    function GetConvidados() {
      vm.convidados = [];
      vm.selecionados = [];

      serverService.Get('RetornarConvidados', ID).then(function (resp) {
        resp = angular.fromJson(conversorService.Xml2Json(resp.data, ''));

        if (resp.ArrayOfConvidado.Convidado.length > 1) {
          vm.convidados = resp.ArrayOfConvidado.Convidado;
        } else {
          vm.convidados.push(resp.ArrayOfConvidado.Convidado);
        }

        delete vm.convidados['@xmlns'];
        delete vm.convidados['@xmlns:i'];

        vm.carregandoLista = false;
      }).catch(function (error) {
        console.error('RetornarConvidados -> ', error);
        vm.carregandoLista = false;
        vm.erroLista = true;
        toastr.error('Ocorreu um erro ao tentar acessar o servidor', 'Erro');
      });
    }

    function GetDados() {
      vm.carregando = true;
      serverService.Get('RetornarFormatacaoSaveTheDate', ID).then(function (resp) {
        /**
         * O servico conversorService retorna uma string
         * O angular converte de string para objeto
         */
        resp = angular.fromJson(conversorService.Xml2Json(resp.data, ''));

        if (resp.DadosFormatacaoSaveTheDate.id_modelo != '0') {
          vm.dados.DadosFormatacaoSaveTheDate.id_modelo = resp.DadosFormatacaoSaveTheDate.id_modelo;
          vm.dados.DadosFormatacaoSaveTheDate.msg = resp.DadosFormatacaoSaveTheDate.msg;
          SelectImage(vm.dados.DadosFormatacaoSaveTheDate.id_modelo); //marca no layout o modelo selecionado
        }
        vm.carregando = false;
      }).catch(function (error) {
        console.error('RetornarFormatacaoSaveTheDate -> ', error);
        vm.carregando = false;
        vm.erro = true;
        toastr.error('Ocorreu um erro ao tentar acessar o servidor', 'Erro');
      });
    }

    function IsThisSelected(id) {
      return (vm.dados.DadosFormatacaoSaveTheDate.id_modelo == id);
    }

    function SelectImage(id) {
      vm.dados.DadosFormatacaoSaveTheDate.id_modelo = id;
    }

    function SetDados() {
      var dados = conversorService.Json2Xml(vm.dados, '');
      serverService.Request('FormatacaoSaveTheDate', dados).then(function (resp) {
        toastr.success('Alterações Salvas!');
      });
    }
  }
})();