
ngQuizApp.controller("ngQuizController", function($scope, $http){
	
	$scope.questionInProgress = 0;
	$scope.uploadForm = {'ext': null};
	$http({
		'method': 'GET',
		'url' : 'config/AllQuestionTypes.json'
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
	
	$scope.ansSelect = function ansSelect(option, isRadio) {
		
		if(isRadio) {
			$scope.config['questionList'][$scope.questionInProgress]['responseEntered'] = {};
			$scope.config['questionList'][$scope.questionInProgress]['responseEntered'][option] = true;
			return;
		} 
		
		if($scope.config['questionList'][$scope.questionInProgress]['responseEntered'][option]){
			delete $scope.config['questionList'][$scope.questionInProgress]['responseEntered'][option];
		} 
		else {
			$scope.config['questionList'][$scope.questionInProgress]['responseEntered'][option] = true;
		}
	};
	
	$scope.getURL = function getURL(type) {
		if(type) {
			return 'views/'+ type + '.html';
		} else {
			return '';
		}
	};
	
	$scope.submit = function submit() {
		alert('');
	};
	
	$scope.validateUpload = function validateUpload() {
		var ext = $scope.uploadForm.ext.name.split('.')[1];
		if($scope.config['questionList'][$scope.questionInProgress]['acceptableExtensions'].indexOf(ext) == -1) {
		    alert('invalid extension!');
		} else {
			$http({
				'method': 'POST',
				'url' : '/a.php',
				'data': { 'file': $scope.uploadForm.ext}
			})
			.success(function(data) { console.log('File submitted');   })
			.error(function(data) { console.error('File Submit Error'); });
		}
	};
});