Bluebird.controller("Bluebird.Controllers.Search",["$scope","$state",function(a,b){a.searchQuery="",a.placeholder="Search",a.clearSearch=function(){a.searchQuery=""},a.handleSearch=function(){if(!_.isEmpty(a.searchQuery)){var c=a.searchQuery;b.go("search",{query:c})}},a.openSidebar=function(){angular.element("#sidebar").toggleClass("open")}}]);