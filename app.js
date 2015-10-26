
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
                       $http.get("https://ashwin-playlist-app.herokuapp.com/"+selectedArtist).success(function(response){
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
                  restrict: 'E',
                  transclude: true,
                  replace:true,
                  scope:true,
                  link: function postLink(scope, element, attrs) {
                  scope.title = attrs.title;
                  
                  scope.$watch(attrs.visible, function(value){
                               if(value == true)
                               $(element).modal('show');
                               else
                               $(element).modal('hide');
                               });
                  
                  $(element).on('shown.bs.modal', function(){
                                scope.$apply(function(){
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

