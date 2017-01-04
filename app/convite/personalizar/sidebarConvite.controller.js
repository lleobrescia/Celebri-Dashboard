(function () {
  'use strict';

  angular
    .module('dashboard')
    .controller('SideConviteController', SideConviteController);

  SideConviteController.$inject = ['Controlador', '$http', '$filter', '$scope'];

  function SideConviteController(Controlador, $http, $filter, $scope) {
    var vm = this;

    vm.fonts = [];
    vm.fontSize = 0;

    vm.Controlador = Controlador; //service

    vm.AlignSelected = AlignSelected;
    vm.ChangeFontSize = ChangeFontSize;
    vm.FontSelected = FontSelected;
    vm.SetAlign = SetAlign;
    vm.SetFont = SetFont;

    Activate();

    ////////////////

    function Activate() {
      //Pega todas as fonts
      $http({
        method: 'GET',
        url: 'app/convite/fonts.json'
      }).then(function (data) {
        vm.fonts = data.data;
      });
    }

    function AlignSelected(id) {
      return (Controlador.styleSelected['text-align'] === $filter('alinhamento')(id));
    }

    function ChangeFontSize() {
      Controlador.styleSelected['font-size'] = $filter('sufixPx')(vm.fontSize);
    }

    function FontSelected(idFont) {
      var font = GetFont(idFont);

      return (Controlador.styleSelected['font-family'] === font);
    }

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

    function SetAlign(id) {
      Controlador.styleSelected['text-align'] = $filter('alinhamento')(id);
    }

    function SetFont(idFont) {
      Controlador.styleSelected['font-family'] = GetFont(idFont);
    }
  }
})();