angular.module('dashboard').directive("navigation", [function() {
  return {
    restrict: 'E',
    replace: true,
    scope: {
      menu: '='
    },
    templateUrl: '/dashboard/templates/navigation.html'
  };
}]);
angular.module('dashboard').directive('onFinishRender', function($timeout) {
  return {
    restrict: 'A',
    link: function(scope, element, attr) {
      if (scope.$last === true) {
        $timeout(function() {
          scope.$emit('ngRepeatFinished');
        });
      }
    }
  }
});