(function () {
  'use strict';

  angular
    .module('dashboard')
    .service('Controlador', Controlador);

  Controlador.inject = [];

  /**
   * @memberof dashboard
   * @ngdoc service
   * @name Controlador
   * @author Leo Brescia <leonardo@leobrescia.com.br>
   * @desc Controla qual bloco de style do convite foi selecionado pelo o usuario
   * @see Veja [Angular DOC]    {@link https://docs.angularjs.org/guide/services} Para mais informações
   * @see Veja [John Papa DOC]  {@link https://github.com/johnpapa/angular-styleguide/tree/master/a1#services} Para melhores praticas
   */
  function Controlador() {
    this.styleSelected = [];

    this.SelectStyle = SelectStyle;
    this.HasSelected = HasSelected;

    ////////////////

    /**
     * @function HasSelected
     * @desc Verifica se o style atual eh o mesmo que o selecionado. Usado para trocar a classe do bloco
     * para marcar qual esta selecionado no momento
     * @param {json} style - estilo do bloco
     * @return {boolean}
     * @memberof Controlador
     */
    function HasSelected(style) {
      return (this.styleSelected === style);
    }


    /**
     * @function SelectStyle
     * @desc Seleciona o estilo do bloco.
     * @param {json} style - estilo do bloco
     * @memberof Controlador
     */
    function SelectStyle(style) {
      this.styleSelected = style;
    }
  }
})();