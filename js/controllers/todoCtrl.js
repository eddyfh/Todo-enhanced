/*global todomvc, angular */
'use strict';

/**
 * The main controller for the app. The controller:
 * - retrieves and persists the model via the todoStorage service
 * - exposes the model to the template and provides event handlers
 */
todomvc.controller('TodoCtrl', function TodoCtrl($scope, $location, todoStorage, filterFilter, $http) {
	var todos = $scope.todos = todoStorage.get();

	$scope.newTodo = '';
	$scope.editedTodo = null;

	$scope.$watch('todos', function (newValue, oldValue) {
		$scope.remainingCount = filterFilter(todos, { completed: false }).length;
		$scope.completedCount = todos.length - $scope.remainingCount;
		$scope.allChecked = !$scope.remainingCount;
		if (newValue !== oldValue) { // This prevents unneeded calls to the local storage
			todoStorage.put(todos);
		}
	}, true);

	if ($location.path() === '') {
		$location.path('/');
	}

	$scope.location = $location;

	$scope.$watch('location.path()', function (path) {
		$scope.statusFilter = (path === '/active') ?
			{ completed: false } : (path === '/completed') ?
			{ completed: true } : null;
	});
	// $scope.players = {};
	// var tag = document.createElement('script');

  // tag.src = "https://www.youtube.com/iframe_api";
  // var firstScriptTag = document.getElementsByTagName('script')[0];
  // firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
	// var players = {};
	// $scope.player = 'player';
	// function onYouTubeIframeAPIReady() {
	// 	players['one'] = new YT.Player('player', {
 //      height: '270',
 //      width: '480',
 //      playerVars: { 'autoplay': 0 },
 //      videoId: 'zlwUB4lisyk',
 //      events: {
 //        'onReady': onPlayerReady,
 //        'onStateChange': onPlayerStateChange
 //      }
 //    });
	// };
	// var players = {};
  // function onPlayerReady(event) {
  //   event.target.playVideo();
  // }
  // var done = false;
  // function onPlayerStateChange(event) {
  //   if (event.data == YT.PlayerState.PLAYING && !done) {
  //     setTimeout(stopVideo, 6000);
  //     done = true;
  //   }
  // }
  // function stopVideo() {
  //   player.stopVideo();
  // }


	$scope.addTodo = function () {
		var newTodo = $scope.newTodo.trim();
		if (!newTodo.length) {
			return;
		}
		// var param = /youtube/g;
		// if (param.test(newTodo)){
		//   var video_id = newTodo.split('v=')[1];
		//   var ampersandPosition = video_id.indexOf('&');
		// 	if(ampersandPosition != -1) {
		// 	  video_id = video_id.substring(0, ampersandPosition);
		// 	}
		// 	todos.push({
		// 		title: newTodo,
		// 		video_id: video_id,
		// 		completed: false
		// 	});
		// }
		$http({method: 'GET', url: '/api/url', params: {url: newTodo}}).success(function(resp){
				todos.push({
				title: newTodo,
				urlTitle: resp.title,
				urlImage: resp.imageUrl,
				video_id: resp.video_id,
				completed: false
			});
		});


		$scope.newTodo = '';

		// players[todos.length] = new YT.Player('player', {
	 //    height: '270',
	 //    width: '480',
	 //    playerVars: { 'autoplay': 0 },
	 //    videoId: 'zlwUB4lisyk',
	 //    events: {
	 //      'onReady': onPlayerReady,
	 //      'onStateChange': onPlayerStateChange
	 //    }
	 //  });



		// var player;
  //   // 4. The API will call this function when the video player is ready.
  //   var onPlayerReady = function(event) {
  //     event.target.playVideo();
  //   };
  //   var done = false;
  //   var stopVideo = function() {
  //     player.stopVideo();
  //   };
  //   var onPlayerStateChange = function(event) {
  //     if (event.data == YT.PlayerState.PLAYING && !done) {
  //       setTimeout(stopVideo, 6000);
  //       done = true;
  //     }
  //   }
  //   var onYouTubeIframeAPIReady = function() {
  //     player = new YT.Player('player', {
  //       height: '270',
  //       width: '480',
  //       videoId: 'M7lc1UVf-VE',
  //       events: {
  //         'onReady': onPlayerReady,
  //         'onStateChange': onPlayerStateChange
  //       }
  //     });
  //   };
  //   onYouTubeIframeAPIReady();

    // 5. The API calls this function when the player's state changes.
    //    The function indicates that when playing a video (state=1),
    //    the player should play for six seconds and then stop.
		// for (var i = 0; i < $scope.todos.length; i++){
	 //  	var objkey = 'player'+i;
		//   var onYouTubeIframeAPIReady = function() {
		//     $scope.players[objkey] = new YT.Player(objkey, {
		//       height: '270',
		//       width: '480',
		//       videoId: 'zlwUB4lisyk',
		//       events: {
		//         'onReady': onPlayerReady,
		//         'onStateChange': onPlayerStateChange
		//       }
		//     });
		//   }
		//   onYouTubeIframeAPIReady();
		//   var stopVideo = function() {
		//     $scope.players[objkey].stopVideo();
		//   }
		//   stopVideo();
		// }
	};
	$scope.newPlayer = function(index){
	};

	$scope.editTodo = function (todo) {
		$scope.editedTodo = todo;
		// Clone the original todo to restore it on demand.
		$scope.originalTodo = angular.extend({}, todo);
	};

	$scope.doneEditing = function (todo) {
		$scope.editedTodo = null;
		todo.title = todo.title.trim();

		if (!todo.title) {
			$scope.removeTodo(todo);
		}
	};

	$scope.revertEditing = function (todo) {
		todos[todos.indexOf(todo)] = $scope.originalTodo;
		$scope.doneEditing($scope.originalTodo);
	};

	$scope.removeTodo = function (todo) {
		todos.splice(todos.indexOf(todo), 1);
	};

	$scope.clearCompletedTodos = function () {
		$scope.todos = todos = todos.filter(function (val) {
			return !val.completed;
		});
	};

	$scope.markAll = function (completed) {
		todos.forEach(function (todo) {
			todo.completed = completed;
		});
	};
});
