angular.module("template/progressbar/progressbar.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("template/progressbar/progressbar.html",
    "<div class=\"progress\"><div class=\"bar\" ng-class=\"type && 'bar-' + type\" ng-transclude></div></div>");
}]);
