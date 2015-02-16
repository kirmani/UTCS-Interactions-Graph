angular.module('graphApp', [])

.controller('GraphCtrl', function($scope) {
	$scope.name = "World";
	$scope.groupPosts = {};
	$scope.names = [];
	$scope.data = [];
	$scope.getMembers = function() {
					$scope.callback(null, 0, 4);
					console.log($scope.data);
					console.log(JSON.stringify($scope.data));
		(function(d, s, id){
			var js, fjs = d.getElementsByTagName(s)[0];
			if (d.getElementById(id)) {return;}
			js = d.createElement(s); js.id = id;
			js.src = "//connect.facebook.net/en_US/sdk.js";
			fjs.parentNode.insertBefore(js, fjs);
		}(document, 'script', 'facebook-jssdk'));
	}
	$scope.callback = function(feedURL, pass, passes) {
		if (pass > passes) return;
		var temp;
		if (feedURL == null) {
			temp = "/155607091223285/feed?access_token=CAACEdEose0cBAMVlUVpImLigGDpoZBHOZAEZBrqQVZC7SGdOeUBwEMfH4s4y88eZAitg4KEZCIB5snhiUKclnD0ZBLZBIZBAjYVM69mEJuAj4CqH6WynnAhfFVyESFPStY7GjYkNxo6am1EfaKI8h1CdukI9izMC3wPvjeSTEblV1jXT7Bn6N0L2lsLwYDiFGohVApuojSrbhp7ZC7KfVMx47hICEJnqBRpQEZD";
		} else {
			temp = feedURL;
		}
		FB.api(temp, function (response) {
				if (response && !response.error) {
					$scope.groupPosts = response.data;
					var nextPageToken = response.paging.next;
					for (var i = 0; i < 25; i++) {
						var conversationGroup = [];
						conversationGroup.push($scope.groupPosts[i].from.name);
						for (var j = 0; j < $scope.groupPosts[i].comments.data.length; j++) {
							conversationGroup.push($scope.groupPosts[i].comments.data[j].from.name);
						}
						conversationGroup  = conversationGroup.filter(function(elem, pos) {
							return conversationGroup.indexOf(elem) == pos;
						}); 
						for (var j = 0; j < conversationGroup.length; j++) {
							dataPoint = {};
							dataPoint['type'] = "view";
							dataPoint['name'] = conversationGroup[j];
							dataPoint['depends'] = [];
							for (var k = 0; k < conversationGroup.length; k++) {
								if (conversationGroup[j] != conversationGroup[k]) {
									dataPoint['depends'].push(conversationGroup[k]);
								}
							}
							$scope.data.push(dataPoint);
						}
						console.log("Post " + i + " added");
						$scope.callback(nextPageToken, ++pass, passes);
						console.log($scope.data);
						if (pass == passes) {
							console.log(JSON.stringify($scope.data));
						}
					}
				} else {
					console.log('error: ' + response.error);
				}
			});
		}
});