
ngQuizApp.controller("ngQuizController", function ($scope, $http, $sce) {
    var EOLRootPath = "http://localhost:8081";  //updated locally
    //var EOLRootPath = "http://dev-cdp.educate-online.local/CDPdev/";
    //var EOLRootPath = "http://qa-cdp.educate-online.local/CDPQA/";   
    var varToReplace = /\$IMS-CC-FILEBASE\$/g
    var varToReplace1 = /%24IMS_CC_FILEBASE%24/g
    var filesRootPath = "http://dev-cdp.educate-online.local/CDPParserDev/";
    //var filesRootPath = "http://qa-cdp.educate-online.local/CDPParserqa/";

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

    $scope.typeToMimeType = {
        1: 'text/html',
        2: 'application/pdf',
        3: 'image/jpeg',
        4: 'image/gif',
        5: 'text/css',
        6: 'audio/mpeg',
        7: 'video/mp4',
        8: '',
        9: 'image/png',
        10: 'image/bmp'
    };

    $scope.pageInProgress = 0;
    $scope.uploadForm = { 'ext': null };
       
    //role specific variables
	$scope.disableInputs = false;
	$scope.showScoring = false;
	$scope.isInstructor = false;		
	var unAnsweredQuestions = ""

    $scope.getAllQuestions = function (val) {
        var assessment_id = val;
        //$http.get(EOLRootPath + "api/EOL/" + assessment_id + '/').success(function (data, status, headers, config) {
        $http.get("").success(function (data, status, headers, config) {//updated locally
            //updated locally
			/*data = {
				"ResourceID": null,
				"ResourceType": "3",
				"HidePrevious": true,
				"LearningObject": {
					"WebContentId": null,
					"WebContentType": 1,
					"WebContentPath": "http://www.dummies.com/how-to/computers-software/programming/HTML.html"
				}
			}*/		

			data = {
				"IsAccessCodeRequired": true,
				"IsAccessCodeCorrect": false,
				"ResourceID": null,
				"ResourceType": 2,
				"MaxAttempt": 0,
				"NoOfAttempt": 0,
				"HidePrevious": false,
				"IsTimed": true,
				"TimeDuration": 99999,
				"MaxScore": 0,
				"LastQuestionAnswered": "812981d7-ff78-4cf8-a007-3bb83755080c",
				"LearningObject": [{
					"Id": "812981d7-ff78-4cf8-a007-3bb83755080c",
					"SectionName": null,
					"GeneralFeedback": null,
					"CorrectAnswerFeedback": null,
					"IncorrectAnswerFeedback": null,
					"MaxScore": 3,
					"MinScore": 0,					
					"QuestionTypeID": 1,
					"Title": "Question text 1",
					"responseEntered": "dsfg",
					"ManualScore": 1
				},
				{
					"Id": "93b81e92-9d2e-4c3d-8e1a-52df4c0ae417",
					"SectionName": null,
					"GeneralFeedback": null,
					"CorrectAnswerFeedback": null,
					"IncorrectAnswerFeedback": null,
					"MaxScore": 14,
					"MinScore": 0,
					"QuestionTypeID": 2,
					"Title": "fimb textbox1 [answer1] textbox2 [answer2] textbox3 [answer3] end of sentence",
					"responseEntered": {
						"answer1": "sadf",
						"answer2": "fgh",
						"answer3": "asdf"
					},
					"ManualScore": null
				},
				{
					"Id": "20290a82-13fc-43e9-88e3-8505793fc32c",
					"SectionName": null,
					"GeneralFeedback": null,
					"CorrectAnswerFeedback": null,
					"IncorrectAnswerFeedback": null,
					"MaxScore": 10,
					"MinScore": 0,
					"QuestionTypeID": 1,
					"Title": "Question text 2",
					"responseEntered": "sdf",
					"ManualScore": null
				},
				{
					"Id": "484726f0-69a6-49c9-b408-c882e5006748",
					"SectionName": null,
					"GeneralFeedback": null,
					"CorrectAnswerFeedback": null,
					"IncorrectAnswerFeedback": null,
					"MaxScore": 10,
					"MinScore": 0,
					"QuestionTypeID": 1,
					"Title": "Question text 3",
					"responseEntered": "asdf",
					"ManualScore": null
				},
				{
					"Id": "31d546eb-2d51-4db3-9129-27b572be637b",
					"SectionName": null,
					"GeneralFeedback": null,
					"CorrectAnswerFeedback": null,
					"IncorrectAnswerFeedback": null,
					"MaxScore": 100,
					"MinScore": 0,
					"QuestionTypeID": 4,
					"Title": "Question text 4",
					"Options": [{
						"Title": "Option1",
						"MatchingOptions": [{
							"Title":"Matching Option 1"
						},
						{
							"Title":"Matching Option 2"
						},
						{
							"Title":"Matching Option 3"
						},
						{
							"Title":"Matching Option 4"
						},
						{
							"Title":"Matching Option 5"
						}],
						"response": "Matching Option 1"
					},
					{
						"Title": "Option2",
						"MatchingOptions": [{
							"Title":"Matching Option 1"
						},
						{
							"Title":"Matching Option 2"
						},
						{
							"Title":"Matching Option 3"
						},
						{
							"Title":"Matching Option 4"
						},
						{
							"Title":"Matching Option 5"
						}],
						"response": "asdf"
					},
					{
						"Title": "Option3",
						"MatchingOptions": [{
							"Title":"Matching Option 1"
						},
						{
							"Title":"Matching Option 2"
						},
						{
							"Title":"Matching Option 3"
						},
						{
							"Title":"Matching Option 4"
						},
						{
							"Title":"Matching Option 5"
						}],
						"response": "Matching Option 1"
					}]
				}]
			};

            console.log(data);
            $scope.config = {};
            $scope.config = data;			
			
            if ($scope.config['ResourceType'] == 2) {
            	//$scope.ifAuthentication = config['IsAccessCodeRequired'];
				/*Below to be uncommented if need to skip to unanswered question 
				var flagAllAnswered = true;
				for (var i = 0; i < $scope.config['LearningObject'].length; i++) {								
		            flagAllAnswered = $scope.ifAnswered(i,flagAllAnswered)
		            if(!flagAllAnswered){
		            	break;
		            }else{
		            	$scope.pageInProgress++;
		            }
		        }*/
		       
		       if($scope.config['IsAccessCodeRequired']){
		       		if($scope.config['IsAccessCodeCorrect']){		       			
		       			quizLoad();
		       		}else{
		       			$scope.ifAuthentication = true	
		       		}
		       }else{		       
		       		quizLoad();
		       }
                
            } else if (($scope.config['ResourceType'] == 3) || ($scope.config['ResourceType'] == 4)) {
                $scope.showSubmit = false
                $scope.safeHtml();
            }
                        
        }).error(function (data, status, headers, config) {
            $scope.title = 'Oops... something went wrong';
            $scope.working = false;
        });
    };

    $scope.nextPage = function nextPage() {
    	var enableNext = true
    	if($scope.showScoring == true){
    		enableNext = scoreValidate("next") 	
    	}
    	if(enableNext == true){
    		$scope.pageInProgress++;
        	$scope.safeHtml();
    	}
    };

    $scope.prevPage = function prevPage() {
    	var enablePrev = true
    	if($scope.showScoring == true){
    		enablePrev = scoreValidate("prev") 	
    	}
    	if(enablePrev == true){
    		$scope.pageInProgress--;
        	$scope.safeHtml();
    	}
    };

    $scope.safeHtml = function safeHtml() {
    	    	
        if ($scope.config['ResourceType'] == 2) {
            $scope.trustedHtmlQText = $sce.trustAsHtml(($scope.pageInProgress+1)+'. '+$scope.config['LearningObject'][$scope.pageInProgress]['Title'].replace(varToReplace, filesRootPath));         
        } else if ($scope.config['ResourceType'] == 4) {
            $scope.trustedHtmlQText = $sce.trustAsHtml("<a href='" + $sce.trustAsResourceUrl($scope.config['LearningObject']['WebLinkURL'].replace(varToReplace, filesRootPath)) + "'>" + $scope.config['LearningObject']['WebLinkTitle'].replace(varToReplace, filesRootPath) + "</a>");
        } else if ($scope.config['ResourceType'] == 3) {
            if ($scope.config['LearningObject']['WebContentType'] == 8) {
                $scope.trustedHtmlQText = $sce.trustAsHtml("<a href='" + $sce.trustAsResourceUrl($scope.config['LearningObject']['WebContentPath'].replace(varToReplace, filesRootPath)) + "' target='_blank'>Click here to open this file</a>");
            } else {
                if ($scope.config['LearningObject']['WebContentType'] == 1 || $scope.config['LearningObject']['WebContentType'] == 2) {

                    var flagReplaced = false;
                    var replacedHtml;

                    if ($scope.config['LearningObject']['WebContentType'] == 1) {
                        $http.get(EOLRootPath + "api/eol/geturlcontent?url=" + $scope.config['LearningObject']['WebContentPath'].replace(varToReplace, filesRootPath)).success(function (responseHtml) {

							$scope.config['LearningObject']['PackageName'] = $scope.config['LearningObject']['WebContentPath'].split("/")[2]//tmp code to be removed 
							console.log("check this:" + $scope.config['LearningObject']['PackageName']);
                            replacedHtml = responseHtml.replace(varToReplace1, filesRootPath + "Unpackage/" + $scope.config['LearningObject']['PackageName'] + "/web_resources/");
                            console.log(replacedHtml[0] + "asdf" + replacedHtml[replacedHtml.length - 1]);
                            replacedHtml = replacedHtml.replace(/\\"/g, '"');

                            if ((replacedHtml[0] == '"') && (replacedHtml[replacedHtml.length - 1] == '"')) {
                                replacedHtml = replacedHtml.slice(1, replacedHtml.length - 1)
                            }

                            if (replacedHtml != responseHtml) {
                                flagReplaced = true
                                $scope.trustedHtmlQText = $sce.trustAsHtml(replacedHtml);
                            }
                            console.log(replacedHtml);
                        }).error(function (data, status, headers, config) {
                            console.log("can't read html");
                        });
                    }

                    if (flagReplaced) {
                        $scope.trustedHtmlQText = $sce.trustAsHtml(replacedHtml);
                    } else {
                        $scope.trustedHtmlQText = $sce.trustAsHtml("<object data='" + $sce.trustAsResourceUrl($scope.config['LearningObject']['WebContentPath'].replace(varToReplace, filesRootPath)) + "' type='" + $scope.typeToMimeType[$scope.config['LearningObject']['WebContentType']] + "'  width='95%' height='400'></object>");
                    }

                } else {
                    $scope.trustedHtmlQText = $sce.trustAsHtml("<center><object data='" + $sce.trustAsResourceUrl($scope.config['LearningObject']['WebContentPath'].replace(varToReplace, filesRootPath)) + "' type='" + $scope.typeToMimeType[$scope.config['LearningObject']['WebContentType']] + "'  width='auto' height='auto'></object></center>");
                }
            }
        }
    };

    $scope.getTrustedHtml = function getTrustedHtml(textToBeTrusted) {
        var textToBeTrustedTmp = textToBeTrusted.replace(varToReplace, filesRootPath);
        return $sce.trustAsHtml(textToBeTrustedTmp);
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
        if (resourceType == 2) {
            if (typeID) {
                return $sce.trustAsResourceUrl(EOLRootPath + "/Home/" + $scope.typeToIDMap[typeID]+".html"); //updated locally
            } else {
                return '';
            }
        } else if (resourceType == 3) {
            return $sce.trustAsResourceUrl(EOLRootPath + "/Home/WebContent.html");
        } else if (resourceType == 4) {
            return $sce.trustAsResourceUrl(EOLRootPath + "/Home/WebLink.html");
        }
    };

    $scope.submit = function submit() {

        var flagAllAnswered = true; unAnsweredQuestions = ""
        if ($scope.config['ResourceType'] == 2) {

			if($scope.isInstructor == false){
				for (var i = 0; i < $scope.config['LearningObject'].length; i++) {
		            flagAllAnswered = ifAnswered(i,flagAllAnswered)
		            //if(!flagAllAnswered){break;}
		        }
		        if (flagAllAnswered == false) {
	                $('#modalOKCancelTitle').html('Are you sure to Submit!!');
	                $('#modalOKCancelBody').html("<div style='padding: 20px;'>You have <b>skipped one or more question(s)</b>. You may click on 'Cancel' to go back and answer the previous question(s).<br/><br/>Click on 'Submit' if you still want to proceed submitting your answers anyway.<br/><br/>Question(s) not(or partially not) answered:<b>"+replace_last_comma_with_and(unAnsweredQuestions.replace(/, $/,''))+"</b></div>");
	            } else {
	                $('#modalOKCancelTitle').html('Thank-you!!');
	                $('#modalOKCancelBody').html("<div style='padding: 20px;'>Thanks for your responses. If you want to have a look at your responses again before sumitting the quiz, you may click 'Cancel'.<br/><br/>Click on 'Submit' if you want to proceed submitting your answers.</div>");
	            }
			}else if($scope.isInstructor == true){
		        for (var i = 0; i < $scope.config['LearningObject'].length; i++) {
		        	if($.inArray($scope.config['LearningObject'][i]['QuestionTypeID'],[1,3,7])!==-1){
			            flagAllAnswered = ifScored(i,flagAllAnswered)
			         //if(!flagAllAnswered){break;}
					}
		        }
		        if (flagAllAnswered == false) {
	                $('#modalOKCancelTitle').html('Are you sure to Submit!!');
	                $('#modalOKCancelBody').html("<div style='padding: 20px;'>You have <b>skipped one or more question(s)</b> yet to be scored. You may click on 'Cancel' to go back and score those question(s).<br/><br/>Click on 'Submit' if you still want to proceed submitting anyway.<br/><br/>Question(s) not scored:<b>"+replace_last_comma_with_and(unAnsweredQuestions.replace(/, $/,''))+"</b></div>");
	            } else {
	                $('#modalOKCancelTitle').html('Thank-you!!');
	                $('#modalOKCancelBody').html("<div style='padding: 20px;'>Thanks for scoring the quiz. If you wish to have a look again at the scores entered by you before sumitting the quiz, you may click 'Cancel'.<br/><br/>Click on 'Submit' if you want to proceed submitting.</div>");
	            }
			}				
            
            $('#modalOKCancelSubmitButton').off('click').on('click', function () {
                window.location.href = "http://dev-cdp.educate-online.local/CDPdev/Feedback/Index";
            });

            $('#modalOKCancelSubmitButton').html('Submit');
            $('#modalOKCancelCancelButton').html('Cancel');
            
            $('#modalOKCancel').modal('show');
        }
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
    
   $scope.timerForQuiz = function timerForQuiz() {
        var TimerClass = (function () {
            Number.prototype.toHHMMSS = function () {
                var sec_num = parseInt(this, 10); // don't forget the second parm
                var hours = Math.floor(sec_num / 3600);
                var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
                var seconds = sec_num - (hours * 3600) - (minutes * 60);

                if (hours < 10) { hours = "0" + hours; }
                if (minutes < 10) { minutes = "0" + minutes; }
                if (seconds < 10) { seconds = "0" + seconds; }
                var time = hours + ':' + minutes + ':' + seconds;
                return time;
            }
            var secondCounter = 0;
            var startTime = 0, totalSeconds = 0, threshold = 0;
            var timerToken;
            var initializeTimer = function (startTime, totSeconds, callback) {

                secondCounter = totSeconds - startTime;
                startTime = startTime;
                totalSeconds = totSeconds;
                setThreshold();
                var currentDisplayTime = (totalSeconds * 1000) - (startTime * 1000);
                timerToken = setInterval(function () {
                    secondCounter = secondCounter - 1;
                    if (secondCounter == threshold) {                        
                        $("#timer").css({ 'color': 'red' });
                    }
                    $("#timer").html(secondCounter.toHHMMSS());
                }, 1000);
                setTimeout(function () { callback.call(totalSeconds); }, currentDisplayTime);
            }
            var setThreshold = function () {
                threshold = totalSeconds - Math.round((totalSeconds * 80) / 100);
            }
            var stopTime = function (callback) {
                clearInterval(timerToken);
                var pendingTime = totalSeconds - secondCounter;
                callback.call(pendingTime);
            }
            return {
                startTimer: initializeTimer,
                stopTimer: stopTime
            };
        })();

        TimerClass.startTimer(0, $scope.config['TimeDuration'], function () {
            linkNav = true;
            TimerClass.stopTimer(function () { });
            window.location.href = "http://dev-cdp.educate-online.local/CDPdev/Feedback/Index";
        });
    };

	//function to check if current quiz page is completely answered
	 var ifAnswered = function ifAnswered(i, flagAllAnswered){
		var questionNo = i+1
		if ($scope.config['LearningObject'][i]['QuestionTypeID'] == 1 || $scope.config['LearningObject'][i]['QuestionTypeID'] == 7) {
            if(!$scope.config['LearningObject'][i]['responseEntered']){
            	flagAllAnswered = false;
            	unAnsweredQuestions = unAnsweredQuestions + questionNo + ", "
            }
        }else if($scope.config['LearningObject'][i]['QuestionTypeID'] == 4) {
            for (var j = 0; j < $scope.config['LearningObject'][i]['Options'].length; j++) {
                if(!$scope.config['LearningObject'][i]['Options'][j]['response']){
                	flagAllAnswered = false;
                	unAnsweredQuestions = unAnsweredQuestions + questionNo + ", "
                }
            }
            
        }else if($scope.config['LearningObject'][i]['QuestionTypeID'] == 2){
        	var lengthFimb = 0;
        	for(key in $scope.config['LearningObject'][i]['responseEntered']){
        		lengthFimb++
        	}
        	
        	for (var j = 1; j <= lengthFimb; j++) {
        		if(!$scope.config['LearningObject'][i]['responseEntered']['answer'+j]){
        			flagAllAnswered = false;
        			unAnsweredQuestions = unAnsweredQuestions + questionNo + ", "
        		}
        	}
        }else{
        	if (!$scope.config['LearningObject'][i]['responseEntered']){
        		flagAllAnswered = false;
        		unAnsweredQuestions = unAnsweredQuestions + questionNo + ", "
        	}	
        }
        return flagAllAnswered
	}

	var ifScored = function ifScored(i, flagAllAnswered){
		if(!$scope.config['LearningObject'][i]['ManualScore']){
			flagAllAnswered = false;
            unAnsweredQuestions = unAnsweredQuestions + (i+1) + ", "
		}
		return flagAllAnswered
	}
		
	$scope.getRole = function getRole(val){
		if(val=='urn:lti:role:ims/lis/instructor')
		{			
			$scope.showScoring = true;
			$scope.disableInputs = true;
			$scope.isInstructor = true;
		}			
	};

	$scope.skipToNextPage = function skipToNextPage(){
		$scope.pageInProgress++;
		$scope.safeHtml();	
	}

	$scope.postAuthentication = function postAuthentication(){
		//"urlFromGetAllQuestions&accesscode="+$("#accessCode").val()
		$http.get("").success(function (data, status, headers, config) {
			$scope.config['IsAccessCodeCorrect'] = t //static remove this line
			if($scope.config['IsAccessCodeCorrect']){       			
       			quizLoad();
       		}else{
       			$scope.ifAuthentication = true
       			
       		}
		});		
	}

	var quizLoad = function quizLoad(){
   		$scope.ifAuthentication = false
	
   		for (var i = 0; i < $scope.config['LearningObject'].length; i++) {
			if($scope.config['LastQuestionAnswered']){
				if($scope.config['LearningObject'][$scope.pageInProgress]['Id']==$scope.config['LastQuestionAnswered']){
					break;
				}else{
					$scope.pageInProgress++;
				}
			}					
       }
       
        if($scope.config['IsTimed']==true){
	        $scope.showQuizTimer = true
			$scope.timerForQuiz()			        
        }
        $scope.showSubmit = true
        $scope.safeHtml();	
   	}

	var scoreValidate = function scoreValidate(val){
		var navtype = val;
		var enableNav = true
		if($.inArray($scope.config['LearningObject'][$scope.pageInProgress]['QuestionTypeID'],[1,3,7])!==-1){
			console.log($scope.config['LearningObject'][$scope.pageInProgress]['ManualScore']);
			if(navtype=="next" && !$scope.config['LearningObject'][$scope.pageInProgress]['ManualScore']){
    			enableNav = false
    			$('#modalOKCancelTitle').html("You didn't enter score");
            	$('#modalOKCancelBody').html("<div style='padding: 20px;'>You have not entered any score. Please consider scoring this question later.<br/><br/>Please click on 'Cancel' if you want to score this question now.</div>");
            	$('#modalOKCancelCancelButton').html("Cancel");
            	$('#modalOKCancelSubmitButton').html('Proceed anyway');
            	$('#modalOKCancelSubmitButton').show();
            	$('#modalOKCancel').modal('show');
    		}else if(!($scope.config['LearningObject'][$scope.pageInProgress]['ManualScore']>= 0) || !($scope.config['LearningObject'][$scope.pageInProgress]['ManualScore'] <= $scope.config['LearningObject'][$scope.pageInProgress]['MaxScore'])){    				
				enableNav = false
    			$('#modalOKCancelTitle').html('Invalid entry!');
            	$('#modalOKCancelBody').html("<div style='padding: 20px;'>Please enter a value between <b>0 and "+$scope.config['LearningObject'][$scope.pageInProgress]['MaxScore']+"</b> as a score!</div>");
            	$('#modalOKCancelCancelButton').html("OK");
            	$('#modalOKCancelSubmitButton').hide();
            	$('#modalOKCancel').modal('show');
    		}
    	}
    	if(enableNav == false){
    		return false
    	}else{
    		return true
    	}	    	
	}

	var replace_last_comma_with_and = function replace_last_comma_with_and(x) {
	    var pos = x.lastIndexOf(',');
	    return x.substring(0, pos) + ' and ' + x.substring(pos + 1);
	}
    	
});