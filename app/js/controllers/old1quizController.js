
ngQuizApp.controller("ngQuizController", function ($scope, $http, $sce) {
    var EOLRootPath = "http://dev-cdp.educate-online.local/CdpDev/";
    var varToReplace = "$IMS-CC-FILEBASE$"
    var filesRootPath = "http://dev-cdp.educate-online.local/CDPParserDev/";
    $scope.typeToIDMap = {
        1: 'ESS',
        2: 'FIMB',
        3: 'FU',
        4: 'MAT',
        5: 'MCMS',
        6: 'MCSS',
        7: 'SA',
        8: 'TF',
        9: 'TO'
    };

    $scope.pageInProgress = 0;
    $scope.uploadForm = { 'ext': null };
    /*$http({
		'method': 'GET',
		'url' : 'config/AllQuestionTypes.json'
	})
	.success(function(data) { 
			
		})
	.error(function(data) { console.error('Config Load Error'); });
	
	$scope.config = {
	    "totalTime": 20,
	    "backButton": true,
	    "LearningObject": [
            {
                "Qtext": "Fill in the blanks - multiple blanks blanks<img src='/media/images/choice2.jpg'/> should be mentioned as [answer1] in text which will be [answer2] replaced by text boxes on client size",
                "QuestionTypeID": "1",
                "responseEntered": []
            }
	    ]
	};*/
    
    $scope.getAllQuestions = function (val) {        
        var assessment_id = val;
        $http.get(EOLRootPath + "api/EOL/" + assessment_id + '/').success(function (data, status, headers, config) {
            console.log(data);           
            $scope.config = {};
            //$scope.config['LearningObject'] = data;
            $scope.config = data;
            //window.config = $scope.config;
			
            if ($scope.config['ResourceType']==2){
                for (var i = 0; i < $scope.config['LearningObject'].length; i++) {
                    $scope.config['LearningObject'][i]['responseEntered'] = {};
                    if ($scope.config['LearningObject'][i]['QuestionTypeID'] == 1 || $scope.config['LearningObject'][i]['QuestionTypeID'] == 7) {            
                        $scope.config['LearningObject'][i]['responseEntered'] = "";
                    }
                    if ($scope.config['LearningObject'][i]['QuestionTypeID'] == 4) {
                        for (var j = 0; j < $scope.config['LearningObject'][i]['Options'].length; j++) {
                            $scope.config['LearningObject'][i]['Options'][j]['response'] = '';
                        }
                        //$scope.config['LearningObject'] = [$scope.config['LearningObject'][i], JSON.parse(JSON.stringify($scope.config['LearningObject'][i]))];
                    }
                }
            }
            
            if ($scope.config['ResourceType'] == 2) {
                $scope.showSubmit = true

            } else if (($scope.config['ResourceType'] == 3) || ($scope.config['ResourceType'] == 4)) {
                $scope.showSubmit = false
            }

            $scope.safeHtml();
        }).error(function (data, status, headers, config) {
            $scope.title = 'Oops... something went wrong';
            $scope.working = false;
        });
    };
    //window.config = $scope.config;

    $scope.nextPage = function nextPage() {
        $scope.pageInProgress++;
        $scope.safeHtml();
    };

    $scope.prevPage = function prevPage() {
        $scope.pageInProgress--;        
        $scope.safeHtml();
    };

    $scope.getTypeFromUrl = function getTypeFromUrl(urltrustedHtmlQText) {
        var urltrustedHtmlQText = urltrustedHtmlQText.toString();

        var urltrustedHtmlQText1 = urltrustedHtmlQText.split(".")

        if (urltrustedHtmlQText1[urltrustedHtmlQText1.length-1].toString() == "html") {
            return "text/html"
        }
        if (urltrustedHtmlQText1[urltrustedHtmlQText1.length - 1].toString() == "pdf") {
            return "application/pdf"
        }
    };

    $scope.safeHtml = function safeHtml() {
        if ($scope.config['ResourceType'] == 2) {            
            $scope.trustedHtmlQText = $sce.trustAsHtml($scope.config['LearningObject'][$scope.pageInProgress]['Title'].replace(varToReplace, filesRootPath))
        } else if ($scope.config['ResourceType'] == 4) {            
            $scope.trustedHtmlQText = $sce.trustAsHtml("<a href='" + $sce.trustAsResourceUrl($scope.config['LearningObject']['WebLinkURL'].replace(varToReplace, filesRootPath)) + "'>" + $scope.config['LearningObject']['WebLinkTitle'].replace(varToReplace, filesRootPath) + "</a>");
            //$scope.getTypeFromUrl($scope.config['LearningObject']['WebLinkURL'])
        } else if ($scope.config['ResourceType']==3) {
            $scope.trustedHtmlQText = $sce.trustAsHtml("<object data='" + $sce.trustAsResourceUrl($scope.config['LearningObject']['WebContentPath'].replace(varToReplace, filesRootPath)) + "' type='" + $scope.getTypeFromUrl($scope.config['LearningObject']['WebContentPath']) + "'  width='600' height='800'></object>");
          //  $scope.trustedHtmlQText = $sce.trustAsHtml("<object data='https://bitcoin.org/bitcoin.pdf' type='" + $scope.getTypeFromUrl($scope.config['LearningObject']['WebContentPath']) + "' width='800' height='800'></object>");
            /*$scope.trustedHtmlQText = $sce.trustAsResourceUrl($scope.config['LearningObject']['WebContentPath']);
            $scope.getTypeFromUrl($scope.config['LearningObject']['WebContentPath'])*/
        }
    };

    $scope.getTrustedHtml = function getTrustedHtml(textToBeTrusted) {
        var textToBeTrusted1 = textToBeTrusted.replace(varToReplace, filesRootPath);
        return $sce.trustAsHtml(textToBeTrusted1);
    };

    $scope.ansSelect = function ansSelect(option, isRadio) {
        if (isRadio) {
            $scope.config['LearningObject'][$scope.pageInProgress]['responseEntered'] = {};
            $scope.config['LearningObject'][$scope.pageInProgress]['responseEntered'][option] = true;
            return;
        }

        if ($scope.config['LearningObject'][$scope.pageInProgress]['responseEntered'][option]) {
            delete $scope.config['LearningObject'][$scope.pageInProgress]['responseEntered'][option];
        }
        else {
            $scope.config['LearningObject'][$scope.pageInProgress]['responseEntered'][option] = true;
        }
    };

    $scope.getURL = function getURL(resourceType, typeID) {        
        if (resourceType==2){
            if (typeID) {
                return $sce.trustAsResourceUrl(EOLRootPath + "/Home/" + $scope.typeToIDMap[typeID]);
            } else {
                return '';
            }
        } else if (resourceType == 3) {            
            return $sce.trustAsResourceUrl(EOLRootPath + "/Home/WebContent");
        } else if (resourceType == 4) {            
            return $sce.trustAsResourceUrl(EOLRootPath + "/Home/WebLink");
        }
    };

    $scope.submit = function submit() {
        //alert('');
    };

    $scope.validateUpload = function validateUpload() {
        var ext = $scope.uploadForm.ext.name.split('.')[1];
        if ($scope.config['LearningObject'][$scope.pageInProgress]['acceptableExtensions'].indexOf(ext) == -1) {
            alert('invalid extension!');
        } else {
            $http({
                'method': 'POST',
                'url': '/a.php',
                'data': { 'file': $scope.uploadForm.ext }
            })
			.success(function (data) { console.log('File submitted'); })
			.error(function (data) { console.error('File Submit Error'); });
        }
    };
});