
ngQuizApp.controller("ngQuizController", function($scope, $http, $sce){
	
	/*var file = new Blob(['http://www.education.gov.yk.ca/pdf/pdf-test.pdf'], {type: 'application/pdf'});
    var fileURL = URL.createObjectURL(file);*/
	
	//$scope.content = $sce.trustAsResourceUrl('http://www.education.gov.yk.ca/pdf/pdf-test.pdf');
	
	$http({
		'method': 'GET',
		'url' : 'config/AllQuestionTypes.json'
	})
	.success(function(data) { 
			$scope.config= data;						
			$scope.safeHtml();
			window.config= $scope.config; 
		})
	.error(function(data) { console.error('Config Load Error'); });

	if($scope.config.ResourceType==2){
		$scope.pageInProgress = 0; //needs to be renamed as pageInProgress
		$scope.uploadForm = {'ext': null};
			
		$scope.nextPage = function nextPage() {
			$scope.pageInProgress++;
			$scope.safeHtml();		
		};
		
		$scope.prevPage = function prevPage() {
			$scope.pageInProgress--;
			$scope.safeHtml();
		};
		
		$scope.safeHtml = function unsafeHtml(){
			if($scope.config['LearningObject'][$scope.pageInProgress]['Qtext']){$scope.trustedHtmlQText = $sce.trustAsHtml($scope.config['questionList'][$scope.pageInProgress]['Qtext'])}		
		} 
		
		$scope.getTrustedHtml = function getTrustedHtml(textToBeTrusted){
			return $sce.trustAsHtml(textToBeTrusted);
		}
		
		$scope.ansSelect = function ansSelect(option, isRadio) {
			
			if(isRadio) {
				$scope.config['LearningObject'][$scope.pageInProgress]['responseEntered'] = {};
				$scope.config['LearningObject'][$scope.pageInProgress]['responseEntered'][option] = true;
				return;
			} 
			
			if($scope.config['LearningObject'][$scope.pageInProgress]['responseEntered'][option]){
				delete $scope.config['LearningObject'][$scope.pageInProgress]['responseEntered'][option];
			} 
			else {
				$scope.config['LearningObject'][$scope.pageInProgress]['responseEntered'][option] = true;
			}
		};
		
		$scope.getTemplate = function getTemplate(){
			if (config.resoureType = 2){
				return getURL(config['LearningObject'][pageInProgress]['Qtype'])		
			}else{
				return 'views/'+ allWebContent + '.html'
			}
		}
			
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
			if($scope.config['questionList'][$scope.pageInProgress]['acceptableExtensions'].indexOf(ext) == -1) {
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
	}


});