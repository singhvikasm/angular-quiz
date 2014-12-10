
ngQuizApp.controller("ngQuizController", function ($scope, $http, $sce) {
  //  var EOLRootPath = "http://dev-cdp.educate-online.local/CDPdev/";
    var EOLRootPath = "http://localhost:55257/";
    var varToReplace = /\$IMS-CC-FILEBASE\$/g
    var varToReplaceHtml = /%24IMS_CC_FILEBASE%24/g
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

    $scope.disableInputs = false;
    $scope.showScoring = false;
    $scope.isInstructor = false;
    $scope.isStudent = false;
    $scope.attemptScreen = false;
    $scope.isFeedbackScreen = false;
    $scope.ifQuiz = false;
    var unAnsweredQuestions = "", assessment_id, CDP_Item_ID, user_id, student_id, userRole, ifInfinteAttempts, skipAuthentication, skipAttemptScreen, pathInitialGet, assessmentTimeOut = false, isAdmin = false;

    //to fetch initial JSON of any assessment/web content/web link... this is called from index.cshtml 
    $scope.getAllQuestions = function (valActivityId, valItemId, valUserId, role, studentId) {
        assessment_id = valActivityId;
        CDP_Item_ID = valItemId;
        user_id = valUserId;
        student_id = studentId;
        userRole = role
        if (userRole == 1) {
            pathInitialGet = EOLRootPath + "api/EOL/getresource?id=" + assessment_id + '&cdp_item_id=' + CDP_Item_ID + '&userId=' + user_id
        } else if (userRole == 2) {
            pathInitialGet = EOLRootPath + "api/EOL/getresourceforinstructor?id=" + assessment_id + '&cdp_item_id=' + CDP_Item_ID + '&instructorId=' + user_id + '&studentId=' + student_id
        } else if (userRole == 3) {
            pathInitialGet = EOLRootPath + "api/EOL/getresourceforadmin?id=" + assessment_id + '&cdp_item_id=' + CDP_Item_ID + '&userId=' + user_id
        }
        else { }
        $http.get(pathInitialGet).success(function (data, status, headers, config) {
            console.log(data);

            $scope.config = {};
            $scope.config = data;

            $scope.config['UserRole'] = userRole;
            $scope.getRole(userRole);

            $scope.config['LearningActivityID'] = assessment_id;
            if ($scope.isStudent) {
                $scope.config['StudentID'] = user_id;
            }
            if ($scope.isInstructor) {
                $scope.config['InstructorID'] = user_id;
                $scope.config['StudentID'] = student_id;
            }

            if ($scope.config['ResourceType'] == 2) {
                ifInfinteAttempts = $scope.config['MaxAttempt'] == null || $scope.config['MaxAttempt'] < 0
                $scope.ifQuiz = true
                if ($scope.config['IsAccessCodeRequired']) {
                    var askAuthentication = true
                    if ((!ifInfinteAttempts && ($scope.config['NoOfAttempt'] > $scope.config['MaxAttempt'])) || (skipAuthentication)) {
                        askAuthentication = false
                    }
                    if ($scope.config['IsAccessCodeCorrect'] || askAuthentication == false) {
                        ifSkipAttemptScreen();
                    } else {
                        $scope.ifAuthentication = true
                    }
                } else {
                    ifSkipAttemptScreen();
                }

            } else if (($scope.config['ResourceType'] == 3) || ($scope.config['ResourceType'] == 4)) {
                $scope.ifQuiz = false
                $scope.ifAuthentication = false
                $scope.showSubmit = false
                $scope.safeHtml();
            }
        }).error(function (data, status, headers, config) {
            $scope.title = 'Oops... something went wrong';
            $scope.working = false;
        });
    };

    //next button, saving data and validating instructor score entered
    $scope.nextPage = function nextPage() {
        var enableNext = true
        if ($scope.showScoring == true) {
            enableNext = scoreValidate("next")
        }
        if (enableNext == true) {
            if ($scope.isStudent) {//later on this condition may also include $scope.isInstructor
                var postNavData = JSON.parse(JSON.stringify($scope.config));
                postNavData['LearningObject'] = postNavData['LearningObject'][$scope.pageInProgress];
                $http.post(EOLRootPath + "api/eol/postnext", postNavData).success(function (data, status, headers, config) {

                    $scope.pageInProgress++;
                    $scope.safeHtml();
                }).error(function (data, status, headers, config) {
                    $scope.title = 'Oops... something went wrong';
                    $scope.working = false;
                });
            } else {
                $scope.pageInProgress++;
                $scope.safeHtml();
            }
        }
    };

    //previous button and validating instructor score entered if outside range. blank score is allowed to move on previous
    $scope.prevPage = function prevPage() {
        var enablePrev = true
        if ($scope.showScoring == true) {
            enablePrev = scoreValidate("prev")
        }
        if (enablePrev == true) {
            $scope.pageInProgress--;
            $scope.safeHtml();
        }
    };

    //always called while view changes - handles rendering
    $scope.safeHtml = function safeHtml() {
        if ($scope.config['ResourceType'] == 2) {
            $scope.config['LastQuestionAnsweredID'] = $scope.config['LearningObject'][$scope.pageInProgress]['Id']
            $scope.trustedHtmlQText = $sce.trustAsHtml(($scope.pageInProgress + 1) + '. ' + $scope.config['LearningObject'][$scope.pageInProgress]['Title'].replace(varToReplace, filesRootPath));
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

                            $scope.config['LearningObject']['PackageName'] = $scope.config['LearningObject']['WebContentPath'].split("/")[2]; //tmp code which can be removed when PackageName is passed from data

                            replacedHtml = responseHtml.replace(varToReplaceHtml, filesRootPath + "Unpackage/" + $scope.config['LearningObject']['PackageName'] + "/web_resources/");
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

    //called when an html is to be escaped as trusted to angular
    $scope.getTrustedHtml = function getTrustedHtml(textToBeTrusted) {
        var textToBeTrustedtmp = textToBeTrusted.replace(varToReplace, filesRootPath);
        return $sce.trustAsHtml(textToBeTrustedtmp);
    };

    //for questions with radio button/checkbox
    $scope.ansSelect = function ansSelect(option, qType) {
        if (qType == '1') {
            for (var i = 0; i < $scope.config['LearningObject'][$scope.pageInProgress]['Options'].length; i++) {
                if ($scope.config['LearningObject'][$scope.pageInProgress]['Options'][i]['Id'] == option) {
                    $scope.config['LearningObject'][$scope.pageInProgress]['Options'][i]['isUserAnswer'] = true
                } else {
                    $scope.config['LearningObject'][$scope.pageInProgress]['Options'][i]['isUserAnswer'] = false
                }
            }
            return;
        } else if (qType == '2') {
            for (var i = 0; i < $scope.config['LearningObject'][$scope.pageInProgress]['Options'].length; i++) {
                if ($scope.config['LearningObject'][$scope.pageInProgress]['Options'][i]['Id'] == option) {
                    $scope.config['LearningObject'][$scope.pageInProgress]['Options'][i]['isUserAnswer'] = !$scope.config['LearningObject'][$scope.pageInProgress]['Options'][i]['isUserAnswer']
                }
            }
        } else if (qType == '3') {
            if (option == true) {
                $scope.config['LearningObject'][$scope.pageInProgress]['Options'][0]['isUserAnswer'] = true
                $scope.config['LearningObject'][$scope.pageInProgress]['Options'][1]['isUserAnswer'] = false
            }
            if (option == false) {
                $scope.config['LearningObject'][$scope.pageInProgress]['Options'][1]['isUserAnswer'] = true
                $scope.config['LearningObject'][$scope.pageInProgress]['Options'][0]['isUserAnswer'] = false
            }
        }
    };

    //load template corresponding to QuestionTypeID in quiz
    $scope.getURL = function getURL(resourceType, typeID) {
        if (resourceType == 2) {
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

        var flagAllAnswered = true; unAnsweredQuestions = ""
        if ($scope.config['ResourceType'] == 2) {
            if (assessmentTimeOut) {
                $('#modalOKCancelTitle').html('Time up!!');
                $('#modalOKCancelBody').html("<div style='padding: 20px;'>You have been timed out!!</div>");

                $('#modalOKCancelSubmitButton').html("Submit and end quiz");
                $('#modalOKCancelSubmitButton').removeClass("btn-default");
                $('#modalOKCancelSubmitButton').addClass("btn-primary");

                $('#modalOKCancelCancelButton').hide();
                
            }else if ($scope.isStudent == true) {
                for (var i = 0; i < $scope.config['LearningObject'].length; i++) {
                    flagAllAnswered = ifAnswered(i, flagAllAnswered)
                    //if(!flagAllAnswered){break;}
                    //loop runs until the end without break so that all the question nos are captured
                    //flagAllAnswered is set to false even if one question in quiz remains partially answered or not answered at all
                }
                if (flagAllAnswered == false) {
                    $('#modalOKCancelTitle').html('Are you sure you want to end the quiz?');
                    $('#modalOKCancelBody').html("<div style='padding: 20px;'>You have not answered all the questions. Submitting now will end the quiz. Are you sure you want to continue?<br/><br/>Questions not answered: <b>" + replace_last_comma_with_and(unAnsweredQuestions.replace(/, $/, '')) + "</b></div>");

                    $('#modalOKCancelSubmitButton').html("Submit and end quiz");
                    $('#modalOKCancelSubmitButton').removeClass("btn-primary");
                    $('#modalOKCancelSubmitButton').addClass("btn-default");

                    $('#modalOKCancelCancelButton').html("Cancel");
                    $('#modalOKCancelCancelButton').removeClass("btn-default");
                    $('#modalOKCancelCancelButton').addClass("btn-primary");

                } else {
                    $('#modalOKCancelTitle').html('Good job!');
                    $('#modalOKCancelBody').html('<div style="padding: 20px;">You have completed all the questions. If you are done click “Submit and end quiz”. If you would like to review or revise your answers click “Review the quiz”</div>');

                    $('#modalOKCancelSubmitButton').html("Submit and end quiz");
                    $('#modalOKCancelSubmitButton').removeClass("btn-default");
                    $('#modalOKCancelSubmitButton').addClass("btn-primary");

                    $('#modalOKCancelCancelButton').html("Review the quiz");
                    $('#modalOKCancelCancelButton').removeClass("btn-primary");
                    $('#modalOKCancelCancelButton').addClass("btn-default");

                }
            } else if ($scope.isInstructor == true) {
                for (var i = 0; i < $scope.config['LearningObject'].length; i++) {
                    if ($.inArray($scope.config['LearningObject'][i]['QuestionTypeID'], ["1", "3", "7"]) !== -1) {
                        flagAllAnswered = ifScored(i, flagAllAnswered)
                        //if(!flagAllAnswered){break;}
                    }
                }
                if (flagAllAnswered == false) {
                    $('#modalOKCancelTitle').html('Are you sure you want to end scoring?');
                    $('#modalOKCancelBody').html("<div style='padding: 20px;'>Some questions in this quiz have not been scored. You will need to finish scoring this at a later date for this quiz to be properly graded.  Are you sure you want to submit partial scores?<br/><br/>Questions not scored: <b>" + replace_last_comma_with_and(unAnsweredQuestions.replace(/, $/, '')) + "</b></div>");

                    $('#modalOKCancelSubmitButton').html("Submit partial scores");
                    $('#modalOKCancelSubmitButton').removeClass("btn-primary");
                    $('#modalOKCancelSubmitButton').addClass("btn-default");

                    $('#modalOKCancelCancelButton').html("Continue scoring");
                    $('#modalOKCancelCancelButton').removeClass("btn-default");
                    $('#modalOKCancelCancelButton').addClass("btn-primary");

                } else {
                    $('#modalOKCancelTitle').html('Submit your quiz scores?');
                    $('#modalOKCancelBody').html('<div style="padding: 20px;">All questions have been scored. If you would like to complete the scoring process click “Submit scores”. If you would like to review your scores click “Cancel” and submit after you have completed your review.</div>');

                    $('#modalOKCancelSubmitButton').html("Submit scores");
                    $('#modalOKCancelSubmitButton').removeClass("btn-default");
                    $('#modalOKCancelSubmitButton').addClass("btn-primary");

                    $('#modalOKCancelCancelButton').html("Cancel");
                    $('#modalOKCancelCancelButton').removeClass("btn-primary");
                    $('#modalOKCancelCancelButton').addClass("btn-default");

                }
            } else if (isAdmin==true) {
            	$('#modalOKCancelTitle').html('Submit quiz');
                $('#modalOKCancelBody').html('<div style="padding: 20px;">Admin view doesn\'t has any data to be stored.</div>');

                $('#modalOKCancelSubmitButton').html("Ok");
                $('#modalOKCancelSubmitButton').removeClass("btn-default");
                $('#modalOKCancelSubmitButton').addClass("btn-primary");
               
               	$('#modalOKCancelCancelButton').hide();
            }

            $('#modalOKCancelSubmitButton').off('click').on('click', function () {
                if ($scope.isStudent || $scope.isInstructor) {
                    $http.post(EOLRootPath + "api/eol/postsubmit", $scope.config).success(function (data, status, headers, config) {
                        $scope.config = data;
                        console.log($scope.config);
                        $scope.isFeedbackScreen = true
                        /*
                        every submit button attempt is redirected to feedback page and hence this is commented... just incase any revision further    
                        if (!ifInfinteAttempts && ($scope.config['NoOfAttempt'] > $scope.config['MaxAttempt'])) {
                            $scope.isFeedbackScreen = true
                        } else {
                            window.location.href = EOLRootPath + "/Feedback/Index";
                        }*/
                    }).error(function (data, status, headers, config) {
                        $scope.title = 'Oops... something went wrong';
                        $scope.working = false;
                    });
                }/* else {
                    window.location.href = EOLRootPath + "/Feedback/Index";
                }*/
            });

            $('#modalOKCancel').modal('show');
        }
    };

    //for file upload questions
    $scope.validateUpload = function validateUpload() {

        /*if ($scope.config['LearningObject'][$scope.pageInProgress]['acceptableExtensions'].indexOf(ext) == -1) {
            alert('invalid extension!');
        } else {*/
            var fd = new FormData();
            fd.append('file', $('#fileselect')[0].files[0]);

            $http({
                'method': 'POST',
                'url': EOLRootPath + 'api/EOL/uploadfile',
                'data': fd
            })
			.success(function (data) { console.log('File submitted'); })
			.error(function (data) { console.error('File Submit Error'); });
        //}
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

        TimerClass.startTimer(0, $scope.config['TimeDuration'] * 60, function () {
            linkNav = true;
            TimerClass.stopTimer(function () { });
            assessmentTimeOut = true;
            $scope.submit();
            //window.location.href = EOLRootPath + "/Feedback/Index";
        });
    };

    //function to check if current quiz question is completely answered
    var ifAnswered = function ifAnswered(i, flagAllAnswered) {
        var questionNo = i + 1
        if ($scope.config['LearningObject'][i]['QuestionTypeID'] == 1 || $scope.config['LearningObject'][i]['QuestionTypeID'] == 7) {
            if (!$scope.config['LearningObject'][i]['responseEntered']) {
                flagAllAnswered = false;
                unAnsweredQuestions = unAnsweredQuestions + questionNo + ", "
            }
        } else if ($scope.config['LearningObject'][i]['QuestionTypeID'] == 4) {
            for (var j = 0; j < $scope.config['LearningObject'][i]['Options'].length; j++) {
                if (!$scope.config['LearningObject'][i]['Options'][j]['response']) {
                    flagAllAnswered = false;
                    unAnsweredQuestions = unAnsweredQuestions + questionNo + ", "
                    break;
                }
            }

        } else if ($scope.config['LearningObject'][i]['QuestionTypeID'] == 2) {
            var lengthFimb = 0;
            for (key in $scope.config['LearningObject'][i]['responseEntered']) {
                lengthFimb++
            }

            for (var j = 1; j <= lengthFimb; j++) {
                if (!$scope.config['LearningObject'][i]['responseEntered']['answer' + j]) {
                    flagAllAnswered = false;
                    unAnsweredQuestions = unAnsweredQuestions + questionNo + ", "
                    break;
                }
            }
        } else {
            var flagRadioCheckbox = false;
            for (var j = 0; j < $scope.config['LearningObject'][i]['Options'].length; j++) {
                if ($scope.config['LearningObject'][i]['Options'][j]['isUserAnswer'] == true) {
                    flagRadioCheckbox = true;
                    break;
                }
            }
            if (!flagRadioCheckbox) {
                flagAllAnswered = false;
                unAnsweredQuestions = unAnsweredQuestions + questionNo + ", "
            }
        }
        return flagAllAnswered
    }

    //function to check if current quiz question is scored
    var ifScored = function ifScored(i, flagAllAnswered) {
        if (!$scope.config['LearningObject'][i]['ManualScore']) {
            flagAllAnswered = false;
            unAnsweredQuestions = unAnsweredQuestions + (i + 1) + ", "
        }
        return flagAllAnswered
    }

    // besides setting role skip for authentication/attempt screens are handled for each role		
    $scope.getRole = function getRole(val) {
        //console.log("role:" + val);
        if (val == 1) {
            $scope.isStudent = true;
            skipAuthentication = false;
            skipAttemptScreen = false;
        }
        if (val == 2) {
            $scope.showScoring = true;
            $scope.disableInputs = true;
            $scope.isInstructor = true;
            skipAuthentication = true;
            skipAttemptScreen = true;
        }
        if (val == 3) {
            $scope.disableInputs = true;
            isAdmin = true;
            skipAuthentication = true;
            skipAttemptScreen = true;
        }
    };

    //called on a modal pop-up proceed anyways button when instructor can skip without scoring a question to come back and score later	
    $scope.skipToNextPage = function skipToNextPage() {
        $scope.pageInProgress++;
        $scope.safeHtml();
    }

    //posts access code and updates data based if correct access code is provided
    $scope.postAuthentication = function postAuthentication() {
        if (!$('#accessCode').val()) {
            $scope.ifAuthentication = true;
            $("#authenticationAlert").show();
        } else {
            $http.get(EOLRootPath + "api/eol/checkaccesscode?id=" + assessment_id + '&cdp_item_id=' + CDP_Item_ID + '&userId=' + user_id + '&accessCode=' + $("#accessCode").val()).success(function (data, status, headers, config) {
                $scope.config = data;
                if ($scope.config['IsAccessCodeCorrect']) {
                    ifSkipAttemptScreen();
                } else {
                    $scope.ifAuthentication = true
                    $("#authenticationAlert").show();
                }
            });
        }
    }

    //hides attempt screen and access code page and loads quiz 	
    $scope.quizLoad = function quizLoad() {
        $scope.attemptScreen = false
        $scope.ifAuthentication = false

        //skipping to last question which was answered when re-entry is handled here
        for (var i = 0; i < $scope.config['LearningObject'].length; i++) {
            if ($scope.config['LastQuestionAnsweredID']) {
                if ($scope.config['LearningObject'][$scope.pageInProgress]['Id'] == $scope.config['LastQuestionAnsweredID']) {
                    break;
                } else {
                    $scope.pageInProgress++;
                }
            }
        }

        if ($scope.isStudent) {
            if ($scope.config['IsTimed'] == true) {
                $scope.showQuizTimer = true
                $scope.timerForQuiz()
            }
        }

        $scope.showSubmit = true
        $scope.safeHtml();
    }

    //to validate Score given by an instructor
    var scoreValidate = function scoreValidate(val) {
        var navtype = val;
        var enableNav = true
        if ($.inArray($scope.config['LearningObject'][$scope.pageInProgress]['QuestionTypeID'], ["1", "3", "7"]) !== -1) {
            console.log($scope.config['LearningObject'][$scope.pageInProgress]['ManualScore']);
            if (navtype == "next" && !$scope.config['LearningObject'][$scope.pageInProgress]['ManualScore']) {
                enableNav = false
                $('#modalOKInfoTitle').html("This item hasn’t been scored.");
                $('#modalOKInfoBody').html('<div style="padding: 20px;">You haven\’t score this item.  If you would like to skip this question and score later click “Skip this question”.</div>');

                $('#modalOKInfoProceedButton').html("Skip this question");
                $('#modalOKInfoProceedButton').show();
                $('#modalOKInfoProceedButton').removeClass("btn-primary");
                $('#modalOKInfoProceedButton').addClass("btn-default");

                $('#modalOKInfoCancelButton').html("Cancel");
                $('#modalOKInfoCancelButton').removeClass("btn-default");
                $('#modalOKInfoCancelButton').addClass("btn-primary");

                $('#modalOKInfo').modal('show');

            } else if (!($scope.config['LearningObject'][$scope.pageInProgress]['ManualScore'] >= 0) || !($scope.config['LearningObject'][$scope.pageInProgress]['ManualScore'] <= $scope.config['LearningObject'][$scope.pageInProgress]['MaxScore'])) {
                enableNav = false
                $('#modalOKInfoTitle').html('Invalid entry!');
                $('#modalOKInfoBody').html("<div style='padding: 20px;'>Please enter a value between <b>0 and " + $scope.config['LearningObject'][$scope.pageInProgress]['MaxScore'] + "</b> as a score.</div>");

                $('#modalOKInfoProceedButton').hide();

                $('#modalOKInfoCancelButton').html("OK");
                $('#modalOKInfoCancelButton').removeClass("btn-default");
                $('#modalOKInfoCancelButton').addClass("btn-primary");

                $('#modalOKInfo').modal('show');
            }
        }
        if (enableNav == false) {
            return false
        } else {
            return true
        }
    }

    //used in submit modal pop-up where all the questions list is shown 
    var replace_last_comma_with_and = function replace_last_comma_with_and(x) {
        var pos = x.lastIndexOf(',');
        if (pos != -1) {
            return x.substring(0, pos) + ' and ' + x.substring(pos + 1)
        } else {
            return x
        }
    }

    //handles if attempt screen needs to be skipped as in the case of instructor/admin or infinte attempt quiz 
    var ifSkipAttemptScreen = function () {
        if (skipAttemptScreen) {
            $scope.quizLoad()
        } else {
            if (ifInfinteAttempts) {
                $scope.quizLoad()
            } else {
                $scope.attemptScreen = true
            }
        }
    }

    //text for each question which appears on feedback page is handled
    $scope.feedbackQuestion = function feedbackQuestion(pageInProgress) {
        $scope.trustedHtmlQText = $sce.trustAsHtml((pageInProgress + 1) + '. ' + $scope.config['LearningObject'][pageInProgress]['Title'].replace(varToReplace, filesRootPath));
    }

    //to set feedback icon for each option in MAT quesion type
    $scope.feedbackMAT = function feedbackMAT(option) {
        $scope.correctOptMATFb = false
        for (var i = 0; i < option['MatchingOptions'].length; i++) {
            if (option['MatchingOptions'][i]['IsCorrect'] && option['MatchingOptions'][i]['isUserAnswer']) {
                $scope.correctOptMATFb = true
            }
        }
    }

    //to judge whether correct/incorrect feedback needs to be shown
    $scope.setInCorrectFeedback = function setInCorrectFeedback(pageInProgress) {
        $scope.config['LearningObject'][pageInProgress]['InCorrect'] = true
    }

    //to filter correct/incorrect feedback texts only for auto-graded questions types 
    $scope.ifAutoGradedQuest = function ifAutoGradedQuest(QTypeID) {
        if ($.inArray(QTypeID, ["2", "4", "5", "6", "8"]) != -1) {
            return true
        } else {
            return false
        }
    }
});