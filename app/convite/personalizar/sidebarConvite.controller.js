(function () {
  'use strict';

  angular
    .module('dashboard')
    .controller('SideConviteController', SideConviteController);

  SideConviteController.$inject = ['Controlador', '$http', '$filter'];

  /**
   * @memberof dashboard
   * @ngdoc controller
   * @scope {}
   * @name SideConviteController
   * @author Leo Brescia <leonardo@leobrescia.com.br>
   * @desc Responsavel pelos controles na barra lateral quando edita o convite<br>
   * Pasta de origem : app/convite/date <br>
   * State :  <br>
   * Controller As : side <br>
   * Template Url : app/convite/personalizar/sidebar.html <br><br>
   * Usa o serviço(s) do(s) servidor:
   * @param {service} Controlador      - servico para gerenciar a parsonalização do convite. O serviço eh usado como 'ponte' entre esse controlador e o personalizar.controller.js (controlador.service.js)
   * @param {service} $http            - usado para pegar o fonts.json
   * @param {service} $filter          - usado para formatações de texto
   * @see Veja [Angular DOC]    {@link https://docs.angularjs.org/guide/controller} Para mais informações
   * @see Veja [John Papa DOC]  {@link https://github.com/johnpapa/angular-styleguide/tree/master/a1#controllers} Para melhores praticas
   * @see Veja [Servidor Help]  {@link http://52.91.166.105/celebri/ServiceCasamento.svc/help} Para saber sobre os serviços do servidor
   */
  function SideConviteController(Controlador, $http, $filter) {
    var vm = this;

    vm.fonts = []; //Lista de fontes disponiveis para escolha
    vm.fontSize = 0; //Informa o tamanho da fonte do bloco selecionado para o usuario

    vm.Controlador = Controlador; //Atribuição de service ao escopo

    /**
     * Atribuição das funçoes as variaveis do escopo
     */
    vm.AlignSelected = AlignSelected;
    vm.ChangeFontSize = ChangeFontSize;
    vm.FontSelected = FontSelected;
    vm.SetAlign = SetAlign;
    vm.SetFont = SetFont;

    Activate();

    ////////////////

    /**
     * @function Activate
     * @desc Setup docontrolador. Exetuca assim que o controlador inicia
     * @memberof SideConviteController
     */
    function Activate() {
      //Pega todas as fonts
      $http({
        method: 'GET',
        url: 'app/convite/fonts.json'
      }).then(function (data) {
        vm.fonts = data.data;
      });
    }

    /**
     * @function AlignSelected
     * @desc Usado para alterar a classe do botao de seleção de alinhamento. Serve para mostrar visualmente
     * ao usuario qual o alinhamento esta selecionado.
     * @param {string} id - id da fonte
     * @return {boolean}
     * @memberof SideConviteController
     */
    function AlignSelected(id) {
      return (Controlador.styleSelected['text-align'] === $filter('alinhamento')(id));
    }

    /**
     * @function ChangeFontSize
     * @desc Altera o tamanho da fonte do bloco selecionado
     * @memberof SideConviteController
     */
    function ChangeFontSize() {
      Controlador.styleSelected['font-size'] = $filter('sufixPx')(vm.fontSize);
    }

    /**
     * @function FontSelected
     * @desc Usado para alterar a classe o botao da fonte. Para mostrar visualemente qual fonte foi selecionada para aquele bloco
     * @param {string} idFont - id da fonte
     * @return {boolean}
     * @memberof SideConviteController
     */
    function FontSelected(idFont) {
      var font = GetFont(idFont);

      return (Controlador.styleSelected['font-family'] === font);
    }

    /**
     * @function GetFont
     * @desc Pega o nome da fonte baseado no id fornecido
     * @param {string} id - id da fonte
     * @return {string} nome da fonte
     * @memberof SideConviteController
     */
    function GetFont(id) {
      try {
        var serif = vm.fonts.SERIF[id]['font-name'];
        return serif;
      } catch (e) {
        try {
          var sansserif = vm.fonts.SANSSERIF[id]['font-name'];
          return sansserif;
        } catch (e) {
          try {
            var display = vm.fonts.DISPLAY[id]['font-name'];
            return display;
          } catch (e) {
            try {
              var handwriting = vm.fonts.HANDWRITING[id]['font-name'];
              return handwriting;
            } catch (e) {
              return null;
            }
          }
        }
      }
    }

    /**
     * @function SetAlign
     * @desc Define o alinhamento selecionado pelo usuario ao bloco selecionado
     * @param {string} id - id do alinhamento
     * @memberof SideConviteController
     */
    function SetAlign(id) {
      Controlador.styleSelected['text-align'] = $filter('alinhamento')(id);
    }

    /**
     * @function SetFont
     * @desc Define a fonte selecionada pelo usuario ao bloco selecionado
     * @param {string} idFont - id da fonte
     * @memberof SideConviteController
     */
    function SetFont(idFont) {
      Controlador.styleSelected['font-family'] = GetFont(idFont);
    }
  }
})();