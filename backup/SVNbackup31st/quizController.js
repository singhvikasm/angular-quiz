
ngQuizApp.controller("ngQuizController", function ($scope, $http, $sce) {
   // var EOLRootPath = "http://dev-cdp.educate-online.local/CDPdev/";
     var EOLRootPath = "http://localhost:55257/";
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

    $scope.disableInputs = false;
    $scope.showScoring = false;
    $scope.isInstructor = false;

    $scope.getAllQuestions = function (valActivityId, valItemId, valUserId,valStudentId) {
        var assessment_id = valActivityId;
        var CDP_Item_ID = valItemId;
        var user_id = valUserId;
        var student_ID = valStudentId;
        $http.get(EOLRootPath + "api/EOL?id=" + assessment_id + '&cdp_item_id=' + CDP_Item_ID + '&userId=' + user_id + '&studentID=' + student_ID).success(function (data, status, headers, config) {
            console.log(data);
            $scope.config = {};
            $scope.config = data;

            if ($scope.config['ResourceType'] == 2) {
                /*for (var i = 0; i < $scope.config['LearningObject'].length; i++) {
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
                }*/
                $scope.timerForQuiz();
                $scope.showQuizTimer = true;
            }


            //$http.post(EOLRootPath + "api/EOL/PostNext/", { "sdflkj": "laksdf" }).success(function (data, status, headers, config) {
            //    debugger;
            //});


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

    $scope.nextPage = function nextPage() {
        
        $scope.pageInProgress++;
        $scope.safeHtml();
    };

    $scope.prevPage = function prevPage() {
        $scope.pageInProgress--;
        $scope.safeHtml();
    };

    $scope.safeHtml = function safeHtml() {

        if ($scope.isInstructor) {
            if ($.inArray($scope.config['LearningObject'][$scope.pageInProgress]['QuestionTypeID'], [1, 2, 3, 7]) == -1) {
                $scope.showScoring = false;
            } else {
                $scope.showScoring = true;
            }
        }

        if ($scope.config['ResourceType'] == 2) {
            $scope.trustedHtmlQText = $sce.trustAsHtml($scope.config['LearningObject'][$scope.pageInProgress]['Title'].replace(varToReplace, filesRootPath))
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

                            $scope.config['LearningObject']['PackageName'] = $scope.config['LearningObject']['WebContentPath'].split("/")[2];

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

        var flagAllAnswered = true;
        if ($scope.config['ResourceType'] == 2) {

            for (var i = 0; i < $scope.config['LearningObject'].length; i++) {
                if ($scope.config['LearningObject'][i]['QuestionTypeID'] == 1 || $scope.config['LearningObject'][i]['QuestionTypeID'] == 7) {
                    if ($scope.config['LearningObject'][i]['responseEntered'] == "") {
                        flagAllAnswered = false;
                    }
                } else if ($scope.config['LearningObject'][i]['QuestionTypeID'] == 4) {
                    for (var j = 0; j < $scope.config['LearningObject'][i]['Options'].length; j++) {
                        if ($scope.config['LearningObject'][i]['Options'][j]['response'] == '') {
                            flagAllAnswered = false;
                        }
                    }                    
                } else {
                    if ($scope.config['LearningObject'][i]['responseEntered'] == {}) {
                        flagAllAnswered = false;
                    }
                }
            }
            if (flagAllAnswered == false) {
                $('#modalOKCancelTitle').html('Are you sure to Submit!!');
                $('#modalOKCancelBody').html("<div style='padding: 20px;'>You have <b>skipped one or more question(s)</b>. You may click on 'Cancel' to go back and answer the previous question(s).<br/><br/>Click on 'Submit' if you still want to proceed submitting your answers anyway.</div>");
            } else {
                $('#modalOKCancelTitle').html('Thank-you!!');
                $('#modalOKCancelBody').html("<div style='padding: 20px;'>Thanks for your responses. If you want to have a look at your responses again before sumitting the quiz, you may click 'Cancel'.<br/><br/>Click on 'Submit' if you want to proceed submitting your answers.</div>");
            }
            $('#modalOKCancelSubmitButton').off('click').on('click', function () {
                window.location.href = "http://dev-cdp.educate-online.local/CDPdev/Feedback/Index";
            });

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

        TimerClass.startTimer(0, 2000, function () {
            linkNav = true;
            TimerClass.stopTimer(function () { });//+
            //$("input").prop('disabled', true);
            window.location.href = "http://dev-cdp.educate-online.local/CDPdev/Feedback/Index";
        });
    };

    $scope.getRole = function getRole(val) {
        console.log("role:" + val);
        if (val == 'urn:lti:role:ims/lis/instructor') {
            $scope.showScoring = true;
            $scope.disableInputs = true;
            $scope.isInstructor = true;
        }
    };

});