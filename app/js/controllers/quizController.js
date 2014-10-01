
ngQuizApp.controller("ngQuizController", function($scope, $http){
	
	$scope.questionInProgress = 0;
	$http({
		'method': 'GET',
		'url' : 'config/config.json'
	})
	.success(function(data) { $scope.config= data; window.config= $scope.config; })
	.error(function(data) { console.error('Config Load Error'); });
	
	
	$scope.nextQuestion = function nextQuestion() {
		//$scope.$apply(function(){  });
		$scope.questionInProgress++;
	};
	
	$scope.prevQuestion = function prevQuestion() {
		$scope.questionInProgress--;
	};
	
	$scope.ansSelect = function ansSelect(optionID) {
		var selectedOptionID = $scope.config['questionList'][$scope.questionInProgress]['selectedOptionID'],
			selectedChekboxes = $scope.config['questionList'][$scope.questionInProgress]['selectedOption']
		if(selectedOptionID || selectedOptionID === null)
			$scope.config['questionList'][$scope.questionInProgress]['selectedOptionID'] = optionID;
		else if(selectedChekboxes)
			$scope.config['questionList'][$scope.questionInProgress]['selectedOption'][optionID] = true;
	};
	
	$scope.submit = function submit() {
		alert('');
	};
});