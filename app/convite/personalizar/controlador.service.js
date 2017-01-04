(function () {
  'use strict';

  angular
    .module('dashboard')
    .service('Controlador', Controlador);

  Controlador.inject = [];
  function Controlador() {
    this.styleSelected = [];

    this.SelectStyle = SelectStyle;
    this.HasSelected = HasSelected;

    ////////////////
    function HasSelected(style) {
      return (this.styleSelected === style);
    }

    function SelectStyle(style) {
      this.styleSelected = style;
    }
  }
})();