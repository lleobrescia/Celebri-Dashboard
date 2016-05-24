angular.module('dashboard').directive("navigation", [function () {
  return {
    restrict: 'E',
    replace: true,
    scope: {
      menu: '='
    },
    templateUrl: '/dashboard/templates/navigation.html'
  };
}]);
angular.module('dashboard').directive('onFinishRender', function ($timeout) {
  return {
    restrict: 'A',
    link: function (scope, element, attr) {
      if (scope.$last === true) {
        $timeout(function () {
          scope.$emit('ngRepeatFinished');
        });
      }
    }
  };
});
angular.module('dashboard').filter('twoDigits', function () {
  return function (n) {
    var num = parseInt(n, 10);

    if (isNaN(num)) {
      return n;
    }

    if (num / 10 < 1 ) {
      num = '0' + num;
    }

    return num;
  };
});