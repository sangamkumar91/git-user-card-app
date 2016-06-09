var myApp = angular.module('userCardApp', []);
myApp.controller('mainController', ['$scope', '$http', function($scope, $http) {
	$scope.username = '';
	$scope.sortingType = 'login';
	$scope.userArr = [];
	$scope.desc = false;
	$scope.getUserDetails = function() {
		$http.get('https://api.github.com/users/' + $scope.username).then(function(response) {
			if (response.message == 'Not Found') {
				alert('User not found!');
			} else {
				for (var s = 0; s < $scope.userArr.length; s++) {
					if (response.data.id == $scope.userArr[s].id) {
						alert('User has already been added!');
						return;
					}
				}
				$scope.userArr.push(response.data);
				$scope.printUsers(null);
				$scope.username = '';
			}
		}, function(response) {
			console.log('Some Error has occured. Please Try Again Later.');
		})
	}
	$scope.deleteUser = function(ev) {
		var id = Number(ev.target.value);
		for (var s = 0; s < $scope.userArr.length; s++) {
			if (id == $scope.userArr[s].id) {
				$scope.userArr.splice(s, 1);
				return;
			}
		}
	}
	$scope.printUsers = function(ev) {
		if (ev !== null) {
			if ($scope.sortingType === ev.target.value) {
				$scope.desc = !$scope.desc;
			} else {
				$scope.desc = false;
			}
			$scope.sortingType = ev.target.value;
		}
		var sortArray = function(a, b) {
			var st = $scope.sortingType;
			if (st === 'followers') {
				return a[st] - b[st];
			} else {
				var s1 = ((a[st] === null) ? '' : a[st]).toUpperCase();
				var s2 = ((b[st] === null) ? '' : b[st]).toUpperCase();
				return s1 < s2;
			}
		};
		$scope.userArr.sort(sortArray);
		if ($scope.desc) $scope.userArr.reverse();
	};
}]);