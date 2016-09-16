'use strict';

app.directive('searchBar', function() {
    return {
       restrict: 'E',
       templateUrl: '/js/common/directives/search-bar/search-bar.html',
       link: function(scope){
       		console.log(scope);
       }

    }
})
