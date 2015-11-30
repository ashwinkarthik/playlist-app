
var playlistApp = angular.module('playlistApp',[])
.config(function($sceDelegateProvider) {
        $sceDelegateProvider.resourceUrlWhitelist([
                                                   'self',
                                                   '*://www.youtube.com/**'
                                                   ]);
        });


playlistApp.controller('mainController',function($scope,$http){
		var vm = this;
		vm.artists = [ 'Calvin Harris','AR Rahman','Ilayaraja','Anirudh','Taylor Swift','Ed Sheeran','Rihanna','David Guetta','Adele'];
        vm.selectedArtist = vm.artists[0];
        vm.results= [];
        getResults(vm.selectedArtist);
        
        $scope.changedArtist = function(selectedArtist){
                       vm.selectedArtist = selectedArtist;
                       vm.results = getResults(vm.selectedArtist);
                       
        }
        
        $scope.getURL = function (id) {
                       return 'https://www.youtube.com/embed/'+id+'?rel=0'
        }
                       
        $scope.showModal = false;
        $scope.selectedResult =  null;
        $scope.toggleModal = function(selectedResult){
                       $scope.showModal = !$scope.showModal;
                      $scope.selectedResult = selectedResult;
        };

        function getResults(selectedArtist){
                       $http.get("/"+selectedArtist).success(function(response){
                                                                                  vm.results = response;                                             });
        }
            
	});


playlistApp.directive('modal', function () {
                  return {
                  template: '<div class="modal fade">' +
                  '<div class="modal-dialog" >' +
                  '<div class="modal-content" width="800">' +
                  '<div class="modal-header">' +
                  '<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>' +
                  '<h4 class="modal-title">{{ title }}</h4>' +
                  '</div>' +
                  '<div id="player-modal" class="modal-body" ng-transclude></div>' +
                  '</div>' +
                  '</div>' +
                  '</div>',
                  restrict: 'E', // 'E' - represents the custom element <modal></modal>. Other valus : 'A' - attribute, 'C' - class and 'M' - comment.
                  transclude: true,  // Insert custom content(inside modal) using the ng-transclude directive in the template
                  replace:true,   // Replaces with the above template
                  scope:true,
                  link: function postLink(scope, element, attrs) {     // The Linking function where we describe the behavior for the directive. postLink - executes after the template has been cloned.
                  scope.title = attrs.title;
                  
                  scope.$watch(attrs.visible, function(value){     // Watches for change in the value of a variable.
                               if(value == true)
                               $(element).modal('show');
                               else
                               $(element).modal('hide');
                               });
                  
                  $(element).on('shown.bs.modal', function(){
                                scope.$apply(function(){         // Checks for updates to binding values and updates accordingly.
                                             scope.$parent[attrs.visible] = true;
                                             });
                                });
                  
                  $(element).on('hidden.bs.modal', function(){
                                $("#player-modal iframe").attr("src", $("#player-modal iframe").attr("src"));
                                scope.$apply(function(){
                                             scope.$parent[attrs.visible] = false;
                                             });
                                });
                  }
                  };
                  });

