(function () {
  'use strict';

  angular
    .module('dashboard')
    .controller('MoipCtrl', MoipCtrl);

  MoipCtrl.$inject = ['ServiceCasamento', 'UserService', 'ipService', '$http', 'consultCEP'];
  function MoipCtrl(ServiceCasamento, UserService, ipService, $http, consultCEP) {
    var self = this;
    var ID = UserService.dados.ID;

    self.bairro = '';
    self.cadastrado = false;
    self.cep = '';
    self.cidade = '';
    self.cpf = '';
    self.email = '';
    self.estado = '';
    self.estados = [];
    self.erro = false;
    self.link = '';
    self.logradouro = '';
    self.nome = '';
    self.numero = '';
    self.nascimento = '';
    self.produtos = [];
    self.produtosSelecionados = [];
    self.tel = '';
    self.ultimoNome = '';

    self.ConsultarCep = ConsultarCep;
    self.Cadastrar = Cadastrar;
    self.ToggleProduto = ToggleProduto;
    self.EnviarProdutosSelecionados = EnviarProdutosSelecionados;

    Init();

    function Init() {
      //carrega as fonts
      $http.get('data/estados.json')
        .then(function (res) {
          self.estados = res.data;
        });

      VerificarConta();
      GetProdutosEscolhidos();
    }

    function Cadastrar() {
      if (
        self.nome &&
        self.ultimoNome &&
        self.cpf &&
        self.nascimento &&
        self.email &&
        self.tel &&
        self.cep &&
        self.logradouro &&
        self.bairro &&
        self.numero &&
        self.estado &&
        self.cidade) {

        var cep = self.cep.replace(/\./g, '');
        var codigoArea = self.tel[1] + self.tel[2];
        var sigla = self.estados[self.estado].Sigla;
        var estado = self.estados[self.estado].Nome;
        var split = self.nascimento.split('/');
        var nascimento = split[2] + '-' + split[1] + '-' + split[0];
        var tel = self.tel.replace(/\(/g, '');
        tel = tel.replace(/\)/g, '');
        tel = tel.replace(/\ /g, '');
        tel = tel.replace(/\-/g, '');

        tel = tel.replace(tel[0], '');
        tel = tel.replace(tel[0], '');

        var urlVar = 'http://' + ipService.ip + '/ServiceCasamento.svc/CriacaoContaVendedorMoip';
        var xmlVar = '<ContaMoip xmlns="http://schemas.datacontract.org/2004/07/WcfServiceCasamento"><Cep>' + cep + '</Cep><Cidade>' + self.cidade + '</Cidade><CodigoAreaTelefone>' + codigoArea + '</CodigoAreaTelefone><Cpf>' + self.cpf + '</Cpf><DataNascimento>' + nascimento + '</DataNascimento><Email>' + self.email + '</Email><Endereco>' + self.logradouro + '</Endereco><Estado>' + estado + '</Estado><Id>0</Id><Id_usuario_logado>' + ID + '</Id_usuario_logado><Nome>' + self.nome + '</Nome><Numero>' + self.numero + '</Numero><NumeroTelefone>' + tel + '</NumeroTelefone><Sigla_Estado>' + sigla + '</Sigla_Estado><UltimoNome>' + self.ultimoNome + '</UltimoNome></ContaMoip>';

        ServiceCasamento.SendData(urlVar, xmlVar).then(function (resp) {
          console.log(resp);
          var respXml = $.parseXML(resp);
          var confirmacao = $(respXml).find('Result').text();

          if (confirmacao === 'true') {
            self.link = $(respXml).find('LinkSetPassword').text();
            self.cadastrado = true;
          } else {
            self.erro = true;
          }

        }).catch(function (error) {
          console.error('Cadastrar -> ', error);
          console.warn('Dados enviados:', xmlVar);
        });
      }
    }

    function ConsultarCep(cep) {
      try {
        consultCEP.consultar(cep).then(function (data) {
          self.estado = RetornarIndexEstado(data.estado);
          self.cidade = data.cidade;
          self.logradouro = data.logradouro;
          self.bairro = data.bairro;
        });
      } catch (error) {
        console.warn('Erro ao consultar CEP:' + error);
      }
    }

    function EnviarProdutosSelecionados() {
      var urlVar = 'http://' + ipService.ip + '/ServiceCasamento.svc/ConfigurarPresentesEscolhidos';
      var xmlVar = '<ListaPresentesEscolhidos xmlns="http://schemas.datacontract.org/2004/07/WcfServiceCasamento"><Id_casal>' + ID + '</Id_casal><Id_item>';

      angular.forEach(self.produtosSelecionados, function (item) {
        xmlVar += '<int xmlns="http://schemas.microsoft.com/2003/10/Serialization/Arrays">' + item.Id + '</int>';
      });

      xmlVar += '</Id_item></ListaPresentesEscolhidos>';

      ServiceCasamento.SendData(urlVar, xmlVar).then(function (resp) {
        console.log(resp);
      });
    }

    function GetProdutos() {
      var urlVar = 'http://' + ipService.ip + '/ServiceCasamento.svc/RetornarTodosProdutosLuaDeMel';
      var xmlVar = '<IdentificaocaoCasal xmlns="http://schemas.datacontract.org/2004/07/WcfServiceCasamento">  <Id_casal>' + ID + '</Id_casal></IdentificaocaoCasal>';

      ServiceCasamento.SendData(urlVar, xmlVar).then(function (resp) {
        var respXml = $.parseXML(resp);

        $(respXml).find('PresentesLuaDeMel').each(function () {
          var marcado = false;
          var vm = $(this);

          angular.forEach(self.produtosSelecionados, function (item) {
            if (item.Id === vm.find('Id').text()) {
              marcado = true;
            }
          });
          self.produtos.push(
            {
              'Id': $(this).find('Id').text(),
              'descricao': $(this).find('Descricao').text(),
              'url': $(this).find('Url').text(),
              'valor': $(this).find('Valor').text(),
              'marcado': marcado
            }
          );
        });
      });
    }

    function GetProdutosEscolhidos() {
      var urlVar = 'http://' + ipService.ip + '/ServiceCasamento.svc/RetornarPresentesLuaDeMel';
      var xmlVar = '<IdentificaocaoCasal xmlns="http://schemas.datacontract.org/2004/07/WcfServiceCasamento">  <Id_casal>' + ID + '</Id_casal></IdentificaocaoCasal>';

      ServiceCasamento.SendData(urlVar, xmlVar).then(function (resp) {
        var respXml = $.parseXML(resp);

        $(respXml).find('PresentesLuaDeMel').each(function () {
          self.produtosSelecionados.push(
            {
              'Id': $(this).find('Id').text()
            }
          );
        });
      });
      GetProdutos();
    }

    function VerificarConta() {
      var urlVar = 'http://' + ipService.ip + '/ServiceCasamento.svc/RetornarContaVendedorMoip';
      var xmlVar = '<IdentificaocaoCasal xmlns="http://schemas.datacontract.org/2004/07/WcfServiceCasamento">  <Id_casal>' + ID + '</Id_casal></IdentificaocaoCasal>';

      ServiceCasamento.SendData(urlVar, xmlVar).then(function (resp) {
        var respXml = $.parseXML(resp);
        var confirmacao = $(respXml).find('Result').text();

        if (confirmacao === 'true') {
          self.cadastrado = true;
        }
      });
    }

    function ToggleProduto(produto) {
      var count = 0;
      var removido = false;
      produto.marcado = !produto.marcado;

      angular.forEach(self.produtosSelecionados, function (item) {
        if (item.Id === produto.Id) {
          self.produtosSelecionados.splice(count, 1);
          removido = true;
        }
        count++;
      });

      if (!removido) {
        self.produtosSelecionados.push(
          {
            'Id': produto.Id
          }
        );
      }
    }

    function RetornarIndexEstado(sigla) {
      var count = 0;
      var retorno = '0';

      angular.forEach(self.estados, function (item) {
        if (item.Sigla === sigla) {

          retorno = count;
        }
        count++;
      });

      return retorno.toString();
    }
  }
} ());
