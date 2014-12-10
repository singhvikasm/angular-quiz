
ngQuizApp.controller("ngQuizController", function ($scope, $http, $sce) {
    var EOLRootPath = "http://localhost:8081";  //updated locally
    //var EOLRootPath = "http://dev-cdp.educate-online.local/CDPdev/";
    //var EOLRootPath = "http://qa-cdp.educate-online.local/CDPQA/";   
    var varToReplace = /\$IMS-CC-FILEBASE\$/g
    var varToReplaceHtml = /%24IMS_CC_FILEBASE%24/g
    var filesRootPath = "http://dev-cdp.educate-online.local/CDPParserDev/";
    //var filesRootPath = "http://qa-cdp.educate-online.local/CDPParserqa/";
	$scope.varToReplace = varToReplace;
	$scope.filesRootPath = filesRootPath;
	
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
	$scope.attemptScreen = false;
	$scope.isFeedbackScreen = false;	
	$scope.showgifLoading = true;
	$scope.ifQuiz = false;
	$scope.isAdmin = false;	
	var unAnsweredQuestions = "",assessment_id, CDP_Item_ID, user_id, userRole, ifInfinteAttempts, skipAuthentication, skipAttemptScreen, myPlayer, pageInProgressNoCache = [];
	$scope.videoIdNo = 1;
	
    $scope.getAllQuestions = function (val) {
    	//$('#popMe').popover('show');
        var assessment_id = val;
        //$http.get(EOLRootPath + "api/EOL/" + assessment_id + '/').success(function (data, status, headers, config) {
        $scope.showgifLoading = true;
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
			}	*/	
/*
<audio controls class='displayBlock'><source src='" + strMediaPath + "' type='audio/mpeg'>Your browser does not support the audio element.</audio>

<video>
    <source src="http://www.mediacollege.com/video-gallery/testclips/20051210-w50s_56K.flv" type='video/flv' />
</video>
<audio>
    <source src="http://www.mediacollege.com/video-gallery/testclips/20051210-w50s_56K.flv" type='video/flv' />
</audio>

<video id="example_video_1" class='video-js vjs-default-skin' controls preload='auto' width='640' height='264' poster='' data-setup=''>
    <source src="http://www.mediacollege.com/video-gallery/testclips/20051210-w50s_56K.flv" type='video/flv' />
</video>

<video controls id='myVideo1' class='video-js vjs-default-skin vjs-big-play-centered' preload='auto' width='640' height='264' data-ng-init='callVideojs(this.id)'><br/><source src='http://www.mediacollege.com/video-gallery/testclips/20051210-w50s_56K.flv' type='video/flv'><br/></video>

*/

		data = {
			"IsAuthorized": true,
			"IsAccessCodeRequired": false,
			"IsAccessCodeCorrect": false,
			"ResourceID": null,
			"ResourceType": 2,
			"MaxAttempt": 4,
			"NoOfAttempt": 4,
			"HidePrevious": false,
			"IsTimed": true,
			"TimeDuration": 5,
			"MaxScore": 0,
			"LastQuestionAnswered": "", //"812981d7-ff78-4cf8-a007-3bb83755080c",
			"LearningObject": [{
					"Id": "20290a82-13fc-43e9-88e3-8505793fc32c",
					"SectionName": null,
					"GeneralFeedback": null,
					"CorrectAnswerFeedback": null,
					"IncorrectAnswerFeedback": null,
					"MaxScore": 10,
					"MinScore": 0,
					"QuestionTypeID": 1,
					"Title": "Question <video controls><source src='http://www.mediacollege.com/video-gallery/testclips/20051210-w50s_56K.flv' type='video/flv'/></video>text 2",
					"responseEntered": "sdf",
					"ManualScore": null
				},
				{
					"Sr_No": 0,	
					"Id": "e5bd6f0b-2b3b-4a95-85cc-98bf41d8333f",
					"SectionName": "",
					"SectionPerPointScore": null,
					"Title": "The following<video controls><source src='http://www.mediacollege.com/video-gallery/testclips/20051210-w50s_56K.flv' type='video/flv' /></video><br/><video controls><source src='http://www.mediacollege.com/video-gallery/testclips/20051210-w50s_56K.flv' type='video/flv' /></video><br/> items <br/><br/>are used in the open entry / open<a href='http://www.dummies.com/how-to/computers-software/programming/HTML.html'>hyperlink</a>exit format in place of classroom lectures and must be viewed by students as indicated in their module checklist. These items are found in the following places.",
					"QuestionTypeID": "4",
					"FileUploadPath": null,
					"GeneralFeedback": "General Feedback comes here",
					"CorrectAnswerFeedback": "Correct feedback comes here",
					"IncorrectAnswerFeedback": "Incorrect feedback comes here",
					"MaxScore": "3",
					"ManualScore": null,
					"Options": [{
						"Id": "88753f91-e8e9-43c4-9638-7536d3413911",
						"Title": "Video CD/DVD (hard copy to be played in the classroom)",
						"QuestionId": "e5bd6f0b-2b3b-4a95-85cc-98bf41d8333f",
						"IsCorrect": false,
						"ScorePercentage": "0",
						"OptionGroup": "",
						"isUserAnswer": false,
						"response": '',
						"responseEntered": null,
						"IsMatchingLabel": true,
						"MatchingLabelID": "0",
						"MatchingOptions": [{
							"Id": "6580435d-b1b6-48ca-9a3c-e582bc0b5d78",
							"Title": "Correct Answer            In the Media Center - CD&apos;s/DVD&apos;s (most are available online through Canvas in the Video Resource Link)",
							"QuestionId": null,
							"IsCorrect": false,
							"ScorePercentage": null,
							"OptionGroup": null,
							"isUserAnswer": false,
							"response": null,
							"responseEntered": null,
							"IsMatchingLabel": false,
							"MatchingLabelID": null,
							"MatchingOptions": null,
							"$$hashKey": "01H"
						},
						{
							"Id": "d28383ad-7227-4eb2-b4f5-d2493d2d8023",
							"Title": "Correct Answer            In the Media Center - Videos, CD, DVD",
							"QuestionId": null,
							"IsCorrect": false,
							"ScorePercentage": null,
							"OptionGroup": null,
							"isUserAnswer": false,
							"response": null,
							"responseEntered": null,
							"IsMatchingLabel": false,
							"MatchingLabelID": null,
							"MatchingOptions": null,
							"$$hashKey": "01I"
						},
						{
							"Id": "08992b32-d0ac-4806-8250-2fa9187253ab",
							"Title": "Correct Answer            Online in Canvas under Video Resources",
							"QuestionId": null,
							"IsCorrect": false,
							"ScorePercentage": null,
							"OptionGroup": null,
							"isUserAnswer": false,
							"response": null,
							"responseEntered": null,
							"IsMatchingLabel": false,
							"MatchingLabelID": null,
							"MatchingOptions": null,
							"$$hashKey": "01J"
						},
						{
							"Id": "18d32fd7-da1f-42ca-9408-09784c8f20b3",
							"Title": "Correct Answer            Online in Canvas in Chapter Resources or login to Evolve website",
							"QuestionId": null,
							"IsCorrect": true,
							"ScorePercentage": null,
							"OptionGroup": null,
							"isUserAnswer": false,
							"response": null,
							"responseEntered": null,
							"IsMatchingLabel": false,
							"MatchingLabelID": null,
							"MatchingOptions": null,
							"$$hashKey": "01K"
						},
						{
							"Id": "959ed919-786b-47c7-9146-a10fe90518fa",
							"Title": "Within Canvas under Chapter Resources or login Evolve website",
							"QuestionId": null,
							"IsCorrect": false,
							"ScorePercentage": null,
							"OptionGroup": null,
							"isUserAnswer": true,
							"response": null,
							"responseEntered": null,
							"IsMatchingLabel": false,
							"MatchingLabelID": null,
							"MatchingOptions": null,
							"$$hashKey": "01L"
						}],
						"$$hashKey": "017"
					},
					{
						"Id": "5215f76e-5fdf-4f86-8848-8cbb59d2e3a3",
						"Title": "Video played on the televisions in the classroom only",
						"QuestionId": "e5bd6f0b-2b3b-4a95-85cc-98bf41d8333f",
						"IsCorrect": false,
						"ScorePercentage": "0",
						"OptionGroup": "",
						"isUserAnswer": false,
						"response": '',
						"responseEntered": null,
						"IsMatchingLabel": true,
						"MatchingLabelID": "0",
						"MatchingOptions": [{
							"Id": "15245599-43cb-4bcf-9906-31b357f1c442",
							"Title": "Correct Answer            In the Media Center - CD&apos;s/DVD&apos;s (most are available online through Canvas in the Video Resource Link)",
							"QuestionId": null,
							"IsCorrect": false,
							"ScorePercentage": null,
							"OptionGroup": null,
							"isUserAnswer": false,
							"response": null,
							"responseEntered": null,
							"IsMatchingLabel": false,
							"MatchingLabelID": null,
							"MatchingOptions": null,
							"$$hashKey": "01R"
						},
						{
							"Id": "112f5a6b-ac2a-4dc2-9273-4491db0f568e",
							"Title": "Correct Answer            In the Media Center - Videos, CD, DVD",
							"QuestionId": null,
							"IsCorrect": false,
							"ScorePercentage": null,
							"OptionGroup": null,
							"isUserAnswer": false,
							"response": null,
							"responseEntered": null,
							"IsMatchingLabel": false,
							"MatchingLabelID": null,
							"MatchingOptions": null,
							"$$hashKey": "01S"
						},
						{
							"Id": "143602a9-8fc6-46ab-82f6-e3aad1797647",
							"Title": "Correct Answer            Online in Canvas under Video Resources",
							"QuestionId": null,
							"IsCorrect": false,
							"ScorePercentage": null,
							"OptionGroup": null,
							"isUserAnswer": false,
							"response": null,
							"responseEntered": null,
							"IsMatchingLabel": false,
							"MatchingLabelID": null,
							"MatchingOptions": null,
							"$$hashKey": "01T"
						},
						{
							"Id": "a3b62a98-f853-485b-a446-26ae19239e4d",
							"Title": "Correct Answer            Online in Canvas in Chapter Resources or login to Evolve website",
							"QuestionId": null,
							"IsCorrect": false,
							"ScorePercentage": null,
							"OptionGroup": null,
							"isUserAnswer": false,
							"response": null,
							"responseEntered": null,
							"IsMatchingLabel": false,
							"MatchingLabelID": null,
							"MatchingOptions": null,
							"$$hashKey": "01U"
						},
						{
							"Id": "6500d715-7952-4468-8ca6-8cc805a591f0",
							"Title": "Within Canvas under Chapter Resources or login Evolve website",
							"QuestionId": null,
							"IsCorrect": true,
							"ScorePercentage": null,
							"OptionGroup": null,
							"isUserAnswer": false,
							"response": null,
							"responseEntered": null,
							"IsMatchingLabel": false,
							"MatchingLabelID": null,
							"MatchingOptions": null,
							"$$hashKey": "01V"
						}],
						"$$hashKey": "018"
					},
					{
						"Id": "4a38b23d-3d25-4708-a698-c5582686fae6",
						"Title": "Medical Assisting Skills and Critical Thinking Videos",
						"QuestionId": "e5bd6f0b-2b3b-4a95-85cc-98bf41d8333f",
						"IsCorrect": false,
						"ScorePercentage": "0",
						"OptionGroup": "",
						"isUserAnswer": false,
						"response": '',
						"responseEntered": null,
						"IsMatchingLabel": true,
						"MatchingLabelID": "0",
						"MatchingOptions": [{
							"Id": "19d9304a-064f-4c8e-b89d-4c83b26b13b9",
							"Title": "Correct Answer            In the Media Center - CD&apos;s/DVD&apos;s (most are available online through Canvas in the Video Resource Link)",
							"QuestionId": null,
							"IsCorrect": true,
							"ScorePercentage": null,
							"OptionGroup": null,
							"isUserAnswer": true,
							"response": null,
							"responseEntered": null,
							"IsMatchingLabel": false,
							"MatchingLabelID": null,
							"MatchingOptions": null,
							"$$hashKey": "021"
						},
						{
							"Id": "ebbb5558-6754-48b2-9396-c28dac72c568",
							"Title": "Correct Answer            In the Media Center - Videos, CD, DVD",
							"QuestionId": null,
							"IsCorrect": false,
							"ScorePercentage": null,
							"OptionGroup": null,
							"isUserAnswer": false,
							"response": null,
							"responseEntered": null,
							"IsMatchingLabel": false,
							"MatchingLabelID": null,
							"MatchingOptions": null,
							"$$hashKey": "022"
						},
						{
							"Id": "fe51218c-e8d8-40a3-a9e3-e2bd740fee46",
							"Title": "Correct Answer            Online in Canvas under Video Resources",
							"QuestionId": null,
							"IsCorrect": false,
							"ScorePercentage": null,
							"OptionGroup": null,
							"isUserAnswer": false,
							"response": null,
							"responseEntered": null,
							"IsMatchingLabel": false,
							"MatchingLabelID": null,
							"MatchingOptions": null,
							"$$hashKey": "023"
						},
						{
							"Id": "d582dfcb-6efa-4672-ad66-2aca41b0406c",
							"Title": "Correct Answer            Online in Canvas in Chapter Resources or login to Evolve website",
							"QuestionId": null,
							"IsCorrect": false,
							"ScorePercentage": null,
							"OptionGroup": null,
							"isUserAnswer": false,
							"response": null,
							"responseEntered": null,
							"IsMatchingLabel": false,
							"MatchingLabelID": null,
							"MatchingOptions": null,
							"$$hashKey": "024"
						},
						{
							"Id": "69274077-bce1-44eb-9aee-b55ebf39b522",
							"Title": "Within Canvas under Chapter Resources or login Evolve website",
							"QuestionId": null,
							"IsCorrect": false,
							"ScorePercentage": null,
							"OptionGroup": null,
							"isUserAnswer": false,
							"response": null,
							"responseEntered": null,
							"IsMatchingLabel": false,
							"MatchingLabelID": null,
							"MatchingOptions": null,
							"$$hashKey": "025"
						}],
						"$$hashKey": "019"
					},
					{
						"Id": "84d8a1c7-b4fd-4c40-bbf2-8ae453d33610",
						"Title": "Medical Assisting Skills Videos in Evolve as part of your textbook",
						"QuestionId": "e5bd6f0b-2b3b-4a95-85cc-98bf41d8333f",
						"IsCorrect": false,
						"ScorePercentage": "0",
						"OptionGroup": "",
						"isUserAnswer": false,
						"response": '',
						"responseEntered": null,
						"IsMatchingLabel": true,
						"MatchingLabelID": "0",
						"MatchingOptions": [{
							"Id": "3a536ddb-a510-4aa3-bc85-8ed98792411d",
							"Title": "Correct Answer            In the Media Center - CD&apos;s/DVD&apos;s (most are available online through Canvas in the Video Resource Link)",
							"QuestionId": null,
							"IsCorrect": false,
							"ScorePercentage": null,
							"OptionGroup": null,
							"isUserAnswer": false,
							"response": null,
							"responseEntered": null,
							"IsMatchingLabel": false,
							"MatchingLabelID": null,
							"MatchingOptions": null,
							"$$hashKey": "02B"
						},
						{
							"Id": "df3faf7a-ea39-4fb0-9626-0fb55bfaf912",
							"Title": "Correct Answer            In the Media Center - Videos, CD, DVD",
							"QuestionId": null,
							"IsCorrect": true,
							"ScorePercentage": null,
							"OptionGroup": null,
							"isUserAnswer": false,
							"response": null,
							"responseEntered": null,
							"IsMatchingLabel": false,
							"MatchingLabelID": null,
							"MatchingOptions": null,
							"$$hashKey": "02C"
						},
						{
							"Id": "b1921d27-fb4e-46b1-a80a-e1efe1490539",
							"Title": "Correct Answer            Online in Canvas under Video Resources",
							"QuestionId": null,
							"IsCorrect": false,
							"ScorePercentage": null,
							"OptionGroup": null,
							"isUserAnswer": false,
							"response": null,
							"responseEntered": null,
							"IsMatchingLabel": false,
							"MatchingLabelID": null,
							"MatchingOptions": null,
							"$$hashKey": "02D"
						},
						{
							"Id": "6c8369de-d6f4-4f63-8b92-da84f59a92fc",
							"Title": "Correct Answer            Online in Canvas in Chapter Resources or login to Evolve website",
							"QuestionId": null,
							"IsCorrect": false,
							"ScorePercentage": null,
							"OptionGroup": null,
							"isUserAnswer": false,
							"response": null,
							"responseEntered": null,
							"IsMatchingLabel": false,
							"MatchingLabelID": null,
							"MatchingOptions": null,
							"$$hashKey": "02E"
						},
						{
							"Id": "df3f2ee5-972b-4e89-9578-c4c84048fe3a",
							"Title": "Within Canvas under Chapter Resources or login Evolve website",
							"QuestionId": null,
							"IsCorrect": false,
							"ScorePercentage": null,
							"OptionGroup": null,
							"isUserAnswer": false,
							"response": null,
							"responseEntered": null,
							"IsMatchingLabel": false,
							"MatchingLabelID": null,
							"MatchingOptions": null,
							"$$hashKey": "02F"
						}],
						"$$hashKey": "01A"
					},
					{
						"Id": "af9a5d30-73cd-49ed-b5e2-be1642340e2b",
						"Title": "Additional Evolve Online Resources",
						"QuestionId": "e5bd6f0b-2b3b-4a95-85cc-98bf41d8333f",
						"IsCorrect": false,
						"ScorePercentage": "0",
						"OptionGroup": "",
						"isUserAnswer": false,
						"response": '',
						"responseEntered": null,
						"IsMatchingLabel": true,
						"MatchingLabelID": "0",
						"MatchingOptions": [{
							"Id": "e316911a-7c48-45d4-a8ec-8379db480eb1",
							"Title": "Correct Answer            In the Media Center - CD&apos;s/DVD&apos;s (most are available online through Canvas in the Video Resource Link)",
							"QuestionId": null,
							"IsCorrect": true,
							"ScorePercentage": null,
							"OptionGroup": null,
							"isUserAnswer": false,
							"response": null,
							"responseEntered": null,
							"IsMatchingLabel": false,
							"MatchingLabelID": null,
							"MatchingOptions": null,
							"$$hashKey": "02L"
						},
						{
							"Id": "58116037-7bee-44fa-ab7f-a1906cd29106",
							"Title": "Correct Answer            In the Media Center - Videos, CD, DVD",
							"QuestionId": null,
							"IsCorrect": false,
							"ScorePercentage": null,
							"OptionGroup": null,
							"isUserAnswer": true,
							"response": null,
							"responseEntered": null,
							"IsMatchingLabel": false,
							"MatchingLabelID": null,
							"MatchingOptions": null,
							"$$hashKey": "02M"
						},
						{
							"Id": "3fc6a6b9-d8b5-44c4-b011-ed96a47f420b",
							"Title": "Correct Answer            Online in Canvas under Video Resources",
							"QuestionId": null,
							"IsCorrect": false,
							"ScorePercentage": null,
							"OptionGroup": null,
							"isUserAnswer": false,
							"response": null,
							"responseEntered": null,
							"IsMatchingLabel": false,
							"MatchingLabelID": null,
							"MatchingOptions": null,
							"$$hashKey": "02N"
						},
						{
							"Id": "8f5179d2-5a2f-40d7-850f-6c3a2a9cb9a6",
							"Title": "Correct Answer            Online in Canvas in Chapter Resources or login to Evolve website",
							"QuestionId": null,
							"IsCorrect": false,
							"ScorePercentage": null,
							"OptionGroup": null,
							"isUserAnswer": false,
							"response": null,
							"responseEntered": null,
							"IsMatchingLabel": false,
							"MatchingLabelID": null,
							"MatchingOptions": null,
							"$$hashKey": "02O"
						},
						{
							"Id": "68301bc6-c055-4130-ba8c-dd053c145fc7",
							"Title": "Within Canvas under Chapter Resources or login Evolve website",
							"QuestionId": null,
							"IsCorrect": false,
							"ScorePercentage": null,
							"OptionGroup": null,
							"isUserAnswer": false,
							"response": null,
							"responseEntered": null,
							"IsMatchingLabel": false,
							"MatchingLabelID": null,
							"MatchingOptions": null,
							"$$hashKey": "02P"
						}],
						"$$hashKey": "01B"
					}],
					"responseEntered": null
				},
				{
					"Sr_No": 0,
					"Id": "6128192c-92f0-43ee-b27e-b2915cce388f",
					"SectionName": null,
					"SectionPerPointScore": null,
					"Title": "Time is on<video controls><source src='http://www.mediacollege.com/video-gallery/testclips/20051210-w50s_56K.flv' type='video/flv' /></video>e of the phy<a href='http://www.dummies.com/how-to/computers-software/programming/HTML.html'>hyperlink</a>sician\'s most <audio controls class='displayBlock'><source src='/media/audio/choice.mp3' type='audio/mpeg'></audio>valuable&apos; commodities.",
					"QuestionTypeID": "8",
					"FileUploadPath": null,
					"GeneralFeedback": "Time is a valuable commodity for the physician and office staff, and the schedule is the tool that helps make sure that the day runs smoothly.",
					"CorrectAnswerFeedback": "Correct Answer Time is one of the physician\'s mo",
					"IncorrectAnswerFeedback": "Incorrect Answer",
					"MaxScore": "4",
					"ManualScore": null,
					"Options": [{
						"Id": "496ed7b5-42d7-46f5-b8b8-7ede701db50d",
						"Title": "true",
						"QuestionId": "6128192c-92f0-43ee-b27e-b2915cce388f",
						"IsCorrect": true,
						"ScorePercentage": null,
						"OptionGroup": null,
						"isUserAnswer": false,
						"responseEntered": null,
						"IsMatchingLabel": false,
						"MatchingLabelID": "",
						"MatchingOptions": null
					},
					{
						"Id": "000b24e6-5f20-454b-9d21-dfc078f3960f",
						"Title": "false",
						"QuestionId": "6128192c-92f0-43ee-b27e-b2915cce388f",
						"IsCorrect": false,
						"ScorePercentage": null,
						"OptionGroup": null,
						"isUserAnswer": true,
						"responseEntered": null,
						"IsMatchingLabel": false,
						"MatchingLabelID": "",
						"MatchingOptions": null
					}]
				},
				{
					"Sr_No": 0,
					"Id": "6128192c-92f0-43ee-b27e-b2915cce388f",
					"SectionName": null,
					"SectionPerPointScore": null,
					"Title": "Time is one of <video controls><source src='http://www.mediacollege.com/video-gallery/testclips/20051210-w50s_56K.flv' type='video/flv' /></video>the physician\'s most <audio controls class='displayBlock'><source src='/media/audio/choice.mp3' type='audio/mpeg'></audio>valuable&apos; commodities.",
					"QuestionTypeID": "8",
					"FileUploadPath": null,
					"GeneralFeedback": "Time is a valuable commodity for the physician and office staff, and the schedule is the tool that helps make sure that the day runs smoothly.",
					"CorrectAnswerFeedback": "Correct Answer",
					"IncorrectAnswerFeedback": "Incorrect answer",
					"MaxScore": "4",
					"ManualScore": null,
					"Options": [{
						"Id": "496ed7b5-42d7-46f5-b8b8-7ede701db50d",
						"Title": "true",
						"QuestionId": "6128192c-92f0-43ee-b27e-b2915cce388f",
						"IsCorrect": true,
						"ScorePercentage": null,
						"OptionGroup": null,
						"isUserAnswer": true,
						"responseEntered": null,
						"IsMatchingLabel": false,
						"MatchingLabelID": "",
						"MatchingOptions": null
					},
					{
						"Id": "000b24e6-5f20-454b-9d21-dfc078f3960f",
						"Title": "false",
						"QuestionId": "6128192c-92f0-43ee-b27e-b2915cce388f",
						"IsCorrect": false,
						"ScorePercentage": null,
						"OptionGroup": null,
						"isUserAnswer": false,
						"responseEntered": null,
						"IsMatchingLabel": false,
						"MatchingLabelID": "",
						"MatchingOptions": null
					}]
				},
				{
					"Sr_No": 0,
					"Id": "06280ef5-863c-49a9-b8d6-51525878dd58",
					"SectionName": null,
					"SectionPerPointScore": null,
					"Title": "Stephanie found a small lump in her left breast but has no history of any type of tumor. She should be seen:",
					"QuestionTypeID": "5",
					"FileUploadPath": null,
					"GeneralFeedback": "Although a lump in the breast is not an emergency, the patient should definitely be seen in the same week that the lump was discovered. If the patient has a history of breast cancer, the appointment should be made for the same day.",
					"CorrectAnswerFeedback": "asdf",
					"IncorrectAnswerFeedback": "ghjfgjgj",
					"MaxScore": "4",
					"ManualScore": 6,
					"Options": [{
						"Id": "71469357-ed9b-4543-a91e-cd45d93bbc65",
						"Title": "immediately.",
						"QuestionId": "06280ef5-863c-49a9-b8d6-51525878dd58",
						"IsCorrect": false,
						"ScorePercentage": null,
						"OptionGroup": null,
						"isUserAnswer": false,
						"responseEntered": null,
						"IsMatchingLabel": false,
						"MatchingLabelID": "",
						"MatchingOptions": null
					},
					{
						"Id": "309c1bf0-ab54-4496-8cb5-a40cd99efb69",
						"Title": "today.",
						"QuestionId": "06280ef5-863c-49a9-b8d6-51525878dd58",
						"IsCorrect": false,
						"ScorePercentage": null,
						"OptionGroup": null,
						"isUserAnswer": true,
						"responseEntered": null,
						"IsMatchingLabel": false,
						"MatchingLabelID": "",
						"MatchingOptions": null
					},
					{
						"Id": "87a279d1-3e81-4e0c-85dd-af0656971554",
						"Title": "this week.",
						"QuestionId": "06280ef5-863c-49a9-b8d6-51525878dd58",
						"IsCorrect": true,
						"ScorePercentage": null,
						"OptionGroup": null,
						"isUserAnswer": false,
						"responseEntered": null,
						"IsMatchingLabel": false,
						"MatchingLabelID": "",
						"MatchingOptions": null
					},
					{
						"Id": "0a849e01-71a9-4e66-b533-78c006853a60",
						"Title": "this month.",
						"QuestionId": "06280ef5-863c-49a9-b8d6-51525878dd58",
						"IsCorrect": false,
						"ScorePercentage": null,
						"OptionGroup": null,
						"isUserAnswer": false,
						"responseEntered": null,
						"IsMatchingLabel": false,
						"MatchingLabelID": "",
						"MatchingOptions": null
					}]
				},{
					"Sr_No": 0,
					"Id": "06280ef5-863c-49a9-b8d6-51525878dd58",
					"SectionName": null,
					"SectionPerPointScore": null,
					"Title": "Radio1: Stephanie found a small lump<a href='http://www.dummies.com/how-to/computers-software/programming/HTML.html'>hyperlink</a> in her left breast but has no history of any type of tumor. She should be seen:",
					"QuestionTypeID": "6",
					"FileUploadPath": null,
					"GeneralFeedback": "Although a lump in the breast is not an emergency, the patient should definitely be seen in the same week that the lump was discovered. If the patient has a history of breast cancer, the appointment should be made for the same day.",
					"CorrectAnswerFeedback": "",
					"IncorrectAnswerFeedback": "",
					"MaxScore": "4",
					"ManualScore": 2,
					"Options": [{
						"Id": "71469357-ed9b-4543-a91e-cd45d93bbc65",
						"Title": "immediately.",
						"QuestionId": "06280ef5-863c-49a9-b8d6-51525878dd58",
						"IsCorrect": true,
						"ScorePercentage": null,
						"OptionGroup": null,
						"isUserAnswer": false,
						"responseEntered": null,
						"IsMatchingLabel": false,
						"MatchingLabelID": "",
						"MatchingOptions": null
					},
					{
						"Id": "309c1bf0-ab54-4496-8cb5-a40cd99efb69",
						"Title": "today.",
						"QuestionId": "06280ef5-863c-49a9-b8d6-51525878dd58",
						"IsCorrect": false,
						"ScorePercentage": null,
						"OptionGroup": null,
						"isUserAnswer": true,
						"responseEntered": null,
						"IsMatchingLabel": false,
						"MatchingLabelID": "",
						"MatchingOptions": null
					},
					{
						"Id": "87a279d1-3e81-4e0c-85dd-af0656971554",
						"Title": "this week.",
						"QuestionId": "06280ef5-863c-49a9-b8d6-51525878dd58",
						"IsCorrect": false,
						"ScorePercentage": null,
						"OptionGroup": null,
						"isUserAnswer": false,
						"responseEntered": null,
						"IsMatchingLabel": false,
						"MatchingLabelID": "",
						"MatchingOptions": null
					},
					{
						"Id": "0a849e01-71a9-4e66-b533-78c006853a60",
						"Title": "this month.",
						"QuestionId": "06280ef5-863c-49a9-b8d6-51525878dd58",
						"IsCorrect": false,
						"ScorePercentage": null,
						"OptionGroup": null,
						"isUserAnswer": false,
						"responseEntered": null,
						"IsMatchingLabel": false,
						"MatchingLabelID": "",
						"MatchingOptions": null
					}]
				},{
					"Sr_No": 0,
					"Id": "06280ef5-863c-49a9-b8d6-51525878dd58",
					"SectionName": null,
					"SectionPerPointScore": null,
					"Title": "Radio2: Stephanie found a small lump<a href='http://www.dummies.com/how-to/computers-software/programming/HTML.html'>hyperlink</a> in her left breast but has no history of any type of tumor. She should be seen:",
					"QuestionTypeID": "6",
					"FileUploadPath": null,
					"GeneralFeedback": "Although a lump in the breast is not an emergency, the patient should definitely be seen in the same week that the lump was discovered. If the patient has a history of breast cancer, the appointment should be made for the same day.",
					"CorrectAnswerFeedback": "",
					"IncorrectAnswerFeedback": "",
					"MaxScore": "4",
					"ManualScore": 2,
					"Options": [{
						"Id": "71469357-ed9b-4543-a91e-cd45d93bbc65",
						"Title": "immediately.",
						"QuestionId": "06280ef5-863c-49a9-b8d6-51525878dd58",
						"IsCorrect": true,
						"ScorePercentage": null,
						"OptionGroup": null,
						"isUserAnswer": false,
						"responseEntered": null,
						"IsMatchingLabel": false,
						"MatchingLabelID": "",
						"MatchingOptions": null
					},
					{
						"Id": "309c1bf0-ab54-4496-8cb5-a40cd99efb69",
						"Title": "today.",
						"QuestionId": "06280ef5-863c-49a9-b8d6-51525878dd58",
						"IsCorrect": false,
						"ScorePercentage": null,
						"OptionGroup": null,
						"isUserAnswer": true,
						"responseEntered": null,
						"IsMatchingLabel": false,
						"MatchingLabelID": "",
						"MatchingOptions": null
					},
					{
						"Id": "87a279d1-3e81-4e0c-85dd-af0656971554",
						"Title": "this week.",
						"QuestionId": "06280ef5-863c-49a9-b8d6-51525878dd58",
						"IsCorrect": false,
						"ScorePercentage": null,
						"OptionGroup": null,
						"isUserAnswer": false,
						"responseEntered": null,
						"IsMatchingLabel": false,
						"MatchingLabelID": "",
						"MatchingOptions": null
					},
					{
						"Id": "0a849e01-71a9-4e66-b533-78c006853a60",
						"Title": "this month.",
						"QuestionId": "06280ef5-863c-49a9-b8d6-51525878dd58",
						"IsCorrect": false,
						"ScorePercentage": null,
						"OptionGroup": null,
						"isUserAnswer": false,
						"responseEntered": null,
						"IsMatchingLabel": false,
						"MatchingLabelID": "",
						"MatchingOptions": null
					}]
				},
				{
					"Id": "812981d7-ff78-4cf8-a007-3bb83755080c",
					"SectionName": "Section A",
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
					"QuestionTypeID": "2",
					"Title": "fimb<a href='http://www.dummies.com/how-to/computers-software/programming/HTML.html'>hyperlink</a> textbox1 [answer1] textbox2 [answer2] textbox3 [answer3] end of sentence",
					"responseEntered": {
						"answer1": "sadf",
						"answer2": "fgh",
						"answer3": "asdf"
					},
					"correctResponse":{						
						"answer2": "my correct answer"						
					},
					"ManualScore": null,
					"GeneralFeedback": "General feedback",
					"CorrectAnswerFeedback": "correct feedback",
					"IncorrectAnswerFeedback": "incorrect feedback"
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
				}]
			};

            console.log(data);
            $scope.config = {};
            $scope.config = data;
            
            $scope.getRole(1);
			
            if ($scope.config['ResourceType'] == 2) {
            	ifInfinteAttempts = $scope.config['MaxAttempt']==null || $scope.config['MaxAttempt'] < 0                
                $scope.ifQuiz = true                
                if ($scope.config['IsAccessCodeRequired']) {
                	var askAuthentication = true
                	if(!ifInfinteAttempts && ($scope.config['NoOfAttempt']>$scope.config['MaxAttempt'])){
		       		 	askAuthentication = false
		       		}
                    if((!ifInfinteAttempts && ($scope.config['NoOfAttempt']>$scope.config['MaxAttempt']))||(skipAuthentication)){
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
        }).finally(function () {
        	$scope.showgifLoading = false;
        });
    };

    $scope.nextPage = function nextPage() {    	
    	var enableNext = true    	
    	if($scope.showScoring == true){
    		enableNext = scoreValidate("next") 	
    	}
    	if(enableNext == true){
    		$('loadTemplate').html('');
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
    		$('loadTemplate').html('');
    		$scope.pageInProgress--;    		
        	$scope.safeHtml();
    	}
    };

    $scope.safeHtml = function safeHtml() {    	
        if ($scope.config['ResourceType'] == 2) {
        	if (!pageInProgressNoCache[$scope.pageInProgress]){
        		pageInProgressNoCache[$scope.pageInProgress] = (Math.floor((Math.random() * 100000) + 1));
        	}
            $scope.config['LastQuestionAnsweredID'] = $scope.config['LearningObject'][$scope.pageInProgress]['Id']
            //$scope.trustedHtmlQTextupdate = $scope.updateflvTag($scope.updateAnchorTag($scope.config['LearningObject'][$scope.pageInProgress]['Title'].replace(varToReplace, filesRootPath)))
            //$scope.trustedHtmlQText = $sce.trustAsHtml(($scope.pageInProgress + 1) + '. ' + $scope.trustedHtmlQTextupdate);
        } else if ($scope.config['ResourceType'] == 4) {
            $scope.trustedHtmlQText = $sce.trustAsHtml("<a href='" + $sce.trustAsResourceUrl($scope.config['LearningObject']['WebLinkURL'].replace(varToReplace, filesRootPath)) + "'>" + $scope.config['LearningObject']['WebLinkTitle'].replace(varToReplace, filesRootPath) + "</a>");            
        } else if ($scope.config['ResourceType'] == 3) {            
            if ($scope.config['LearningObject']['WebContentType'] == 8) {
                $scope.trustedHtmlQText = $sce.trustAsHtml("<a href='" + $sce.trustAsResourceUrl($scope.config['LearningObject']['WebContentPath'].replace(varToReplace, filesRootPath)) + "' target='_blank'>Click here to open this file</a>");
            } else {
                if ($scope.config['LearningObject']['WebContentType'] == 1) {

                    var replacedHtml;
					//EOLRootPath + "api/eol/geturlcontent?url=" + $scope.config['LearningObject']['WebContentPath'].replace(varToReplace, filesRootPath)
                    $http.get("http://localhost:8081/webResourceDummy.html").success(function (responseHtml) {

                        $scope.config['LearningObject']['PackageName'] = $scope.config['LearningObject']['WebContentPath'].split("/")[2]; //tmp code which can be removed when PackageName is passed from data

                        replacedHtml = responseHtml.replace(varToReplaceHtml, filesRootPath + "Unpackage/" + $scope.config['LearningObject']['PackageName'] + "/web_resources/");
                        console.log(replacedHtml[0] + "asdf" + replacedHtml[replacedHtml.length - 1]);
                        replacedHtml = replacedHtml.replace(/\\"/g, '"');

                        if ((replacedHtml[0] == '"') && (replacedHtml[replacedHtml.length - 1] == '"')) {
                            replacedHtml = replacedHtml.slice(1, replacedHtml.length - 1)
                        }
						
						replacedHtml = $scope.updateAnchorTag(replacedHtml)
						
                        $scope.trustedHtmlQText = $sce.trustAsHtml(replacedHtml);
                        
                        console.log(replacedHtml);
                    }).error(function (data, status, headers, config) {
                        console.log("can't read html");
                    });

                } else if($scope.config['LearningObject']['WebContentType'] == 2){
                	$scope.trustedHtmlQText = $sce.trustAsHtml("<object data='" + $sce.trustAsResourceUrl($scope.config['LearningObject']['WebContentPath'].replace(varToReplace, filesRootPath)) + "' type='" + $scope.typeToMimeType[$scope.config['LearningObject']['WebContentType']] + "'  width='95%' height='400'></object>");
                } else {
                    $scope.trustedHtmlQText = $sce.trustAsHtml("<center><object data='" + $sce.trustAsResourceUrl($scope.config['LearningObject']['WebContentPath'].replace(varToReplace, filesRootPath)) + "' type='" + $scope.typeToMimeType[$scope.config['LearningObject']['WebContentType']] + "'  width='auto' height='auto'></object></center>");
                }
            }
        }
    };

    $scope.getTrustedHtml = function getTrustedHtml(textToBeTrusted) {
        var textToBeTrustedtmp = textToBeTrusted.replace(varToReplace, filesRootPath);
        return $sce.trustAsHtml($scope.updateAnchorTag(textToBeTrustedtmp));
    };

    $scope.ansSelect = function ansSelect(option, qType) {
        if (qType=='1') {
        	for (var i=0; i<$scope.config['LearningObject'][$scope.pageInProgress]['Options'].length; i++){
        		if($scope.config['LearningObject'][$scope.pageInProgress]['Options'][i]['Id']==option){
        			$scope.config['LearningObject'][$scope.pageInProgress]['Options'][i]['isUserAnswer'] = true
        		}else{
        			$scope.config['LearningObject'][$scope.pageInProgress]['Options'][i]['isUserAnswer'] = false
        		}	
        	}
            /*$scope.config['LearningObject'][$scope.pageInProgress]['responseEntered'] = {};
            $scope.config['LearningObject'][$scope.pageInProgress]['responseEntered'][option] = true;*/
            return;
        }else if(qType=='2'){
        	for (var i=0; i<$scope.config['LearningObject'][$scope.pageInProgress]['Options'].length; i++){
				if($scope.config['LearningObject'][$scope.pageInProgress]['Options'][i]['Id']==option){
					$scope.config['LearningObject'][$scope.pageInProgress]['Options'][i]['isUserAnswer']=!$scope.config['LearningObject'][$scope.pageInProgress]['Options'][i]['isUserAnswer']				
				}	
			}	
        }else if(qType=='3'){
			if(option==true){
				$scope.config['LearningObject'][$scope.pageInProgress]['Options'][0]['isUserAnswer']=true
				$scope.config['LearningObject'][$scope.pageInProgress]['Options'][1]['isUserAnswer']=false				
			}
			if(option==false){
				$scope.config['LearningObject'][$scope.pageInProgress]['Options'][1]['isUserAnswer']=true
				$scope.config['LearningObject'][$scope.pageInProgress]['Options'][0]['isUserAnswer']=false
			}
        }
        /*if ($scope.config['LearningObject'][$scope.pageInProgress]['responseEntered'][option]) {
            delete $scope.config['LearningObject'][$scope.pageInProgress]['responseEntered'][option];
        }
        else {
            $scope.config['LearningObject'][$scope.pageInProgress]['responseEntered'][option] = true;
        }*/
    };

    $scope.getURL = function getURL(resourceType, typeID, pageInProgress) {
        if (resourceType == 2) {        	
            if (typeID) {            	
            	console.log(EOLRootPath + "/Home/" + $scope.typeToIDMap[typeID]+".html?"+pageInProgressNoCache[pageInProgress])
                return $sce.trustAsResourceUrl(EOLRootPath + "/Home/" + $scope.typeToIDMap[typeID]+".html?"+pageInProgressNoCache[pageInProgress]); //updated locally
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
		            //loop runs until the end without break so that all the question nos are captured
		            //flagAllAnswered is set to false even if one question in quiz remains partially answered or not answered at all
		        }
		        if (flagAllAnswered == false) {
	                $('#modalOKCancelTitle').html('Are you sure to Submit!!');
	                $('#modalOKCancelBody').html("<div style='padding: 20px;'>You have <b>skipped one or more question(s)</b>. You may click on 'Cancel' to go back and answer the previous question(s).<br/><br/>Click on 'Submit' if you still want to proceed submitting your answers anyway.<br/><br/>Question(s) not(or partially not) answered: <b>"+replace_last_comma_with_and(unAnsweredQuestions.replace(/, $/,''))+"</b></div>");
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
	                $('#modalOKCancelBody').html("<div style='padding: 20px;'>You have <b>skipped one or more question(s)</b> yet to be scored. You may click on 'Cancel' to go back and score those question(s).<br/><br/>Click on 'Submit' if you still want to proceed submitting anyway.<br/><br/>Question(s) not scored: <b>"+replace_last_comma_with_and(unAnsweredQuestions.replace(/, $/,''))+"</b></div>");
	            } else {
	                $('#modalOKCancelTitle').html('Thank-you!!');
	                $('#modalOKCancelBody').html("<div style='padding: 20px;'>Thanks for scoring the quiz. If you wish to have a look again at the scores entered by you before sumitting the quiz, you may click 'Cancel'.<br/><br/>Click on 'Submit' if you want to proceed submitting.</div>");
	            }
			}				
            
            $('#modalOKCancelSubmitButton').off('click').on('click', function () {
                $scope.isFeedbackScreen = true; //window.location.href = "http://dev-cdp.educate-online.local/CDPdev/Feedback/Index";
            });

            $('#modalOKCancel').modal('show');
            
            /*if(!ifInfinteAttempts && ($scope.config['NoOfAttempt']>$scope.config['MaxAttempt'])){
       		 	$scope.isFeedbackScreen = true
       		}*/
		       		
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

        TimerClass.startTimer(0, $scope.config['TimeDuration']*60, function () {
            linkNav = true;
            if(!$scope.isFeedbackScreen){
            	TimerClass.stopTimer(function () { });
            	window.location.href = "http://dev-cdp.educate-online.local/CDPdev/Feedback/Index";
            }            
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
                	break;
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
        			break;
        		}
        	}
        }else{
        	var flagRadioCheckbox = false;
        	for (var j=0; j<$scope.config['LearningObject'][i]['Options'].length; j++){
				if($scope.config['LearningObject'][i]['Options'][j]['isUserAnswer']==true){
					flagRadioCheckbox = true;        			
        			break;
				}				
        	}
        	if(!flagRadioCheckbox){
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
        	$scope.isAdmin = true
            $scope.disableInputs = true;
            skipAuthentication = true;
            skipAttemptScreen = true;
        }
    };

	$scope.skipToNextPage = function skipToNextPage(){
		$scope.pageInProgress++;
		$scope.safeHtml();	
	}

	$scope.postAuthentication = function postAuthentication(){
		if(!$('#accessCode').val()){
			$scope.ifAuthentication = true
			$("#authenticationAlert").show();
   			/*$('#modalOKInfoTitle').html('Invalid entry!');
        	$('#modalOKInfoBody').html("<div style='padding: 20px;'>Please enter your access code.</div>");
        	$('#modalOKInfoCancelButton').html("OK");
        	$('#modalOKInfoProceedButton').hide();
        	$('#modalOKInfo').modal('show');*/
		}else{
			$http.get("").success(function (data, status, headers, config) {
				$scope.config['IsAccessCodeCorrect'] = true //static remove this line
				if($scope.config['IsAccessCodeCorrect']){
	       			ifSkipAttemptScreen();
	       		}else{
	       			$scope.ifAuthentication = true
	       			$("#authenticationAlert").show();
	       			/*$('#modalOKInfoTitle').html('Invalid access code!');
	            	$('#modalOKInfoBody').html("<div style='padding: 20px;'>The access code you entered is not valid</div>");
	            	$('#modalOKInfoCancelButton').html("OK");
	            	$('#modalOKInfoProceedButton').hide();
	            	$('#modalOKInfo').modal('show');*/
	       		}
			});		
		}	
	}

	$scope.quizLoad = function quizLoad(){//merge var quizLoad to $scope.quizLoad and attemptScreen for all its instances in quizController and index file
		$scope.attemptScreen = false
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

        if($scope.isStudent){
	        if ($scope.config['IsTimed'] == true) {
	            $scope.showQuizTimer = true
	            $scope.timerForQuiz()
	        }
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
    			$('#modalOKInfoTitle').html("You didn't enter score");
            	$('#modalOKInfoBody').html("<div style='padding: 20px;'>You have not entered any score. Please consider scoring this question later.<br/><br/>Please click on 'Cancel' if you want to score this question now.</div>");
            	$('#modalOKInfoCancelButton').html("Cancel");
            	$('#modalOKInfoProceedButton').show();
            	$('#modalOKInfo').modal('show');
    		}else if(!($scope.config['LearningObject'][$scope.pageInProgress]['ManualScore']>= 0) || !($scope.config['LearningObject'][$scope.pageInProgress]['ManualScore'] <= $scope.config['LearningObject'][$scope.pageInProgress]['MaxScore'])){    				
				enableNav = false
    			$('#modalOKInfoTitle').html('Invalid entry!');
            	$('#modalOKInfoBody').html("<div style='padding: 20px;'>Please enter a value between <b>0 and "+$scope.config['LearningObject'][$scope.pageInProgress]['MaxScore']+"</b> as a score!</div>");
            	$('#modalOKInfoCancelButton').html("OK");
            	$('#modalOKInfoProceedButton').hide();
            	$('#modalOKInfo').modal('show');
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
	    if(pos!=-1){
	    	return x.substring(0, pos) + ' and ' + x.substring(pos + 1)
	    }else{
	    	return x
	    }
	}

	var ifSkipAttemptScreen = function(){
		if(skipAttemptScreen){
			$scope.quizLoad()
		}else{
			if(ifInfinteAttempts){
            	$scope.quizLoad()
            }else{
            	$scope.attemptScreen = true	
            }
		}
	}

	$scope.feedbackQuestion = function feedbackQuestion(pageInProgress) {
		/*if (!pageInProgressNoCache[pageInProgress]){
        		pageInProgressNoCache[pageInProgress] = (Math.floor((Math.random() * 100000) + 1));
        }*/
        //$scope.trustedHtmlQText = $sce.trustAsHtml((pageInProgress + 1) + '. ' + $scope.updateflvTag($scope.updateAnchorTag($scope.config['LearningObject'][pageInProgress]['Title'].replace(varToReplace, filesRootPath))));            
    }

	$scope.feedbackMAT = function feedbackMAT(option){
		$scope.correctOptMATFb = false
		for (var i=0; i<option['MatchingOptions'].length; i++){
    		if(option['MatchingOptions'][i]['IsCorrect'] && option['MatchingOptions'][i]['isUserAnswer']){
				$scope.correctOptMATFb = true
    		}
    	}
	}
	
	$scope.setInCorrectFeedback = function setInCorrectFeedback(pageInProgress){
		$scope.config['LearningObject'][pageInProgress]['InCorrect'] = true
	}

	$scope.ifAutoGradedQuest = function ifAutoGradedQuest(QTypeID){
		if($.inArray(QTypeID,["2","4","5","6","8"])!=-1){			
			return true
		}else{
			return false
		}
	}	
	
	var postReviewedContent = function(){
    	$http.get(EOLRootPath + "api/eol/webcomplete").success(function (data, status, headers, config) {
            window.location.href = EOLRootPath + "/Feedback/Index";
        });
    };
    
    $scope.fileUploadQuiz = function fileUploadQuiz(){
    	var jqXHRData;
	
        $('#fu-my-simple-upload').fileupload({
        	maxFileSize: 5000000,
        	acceptFileTypes: /(\.|\/)(doc|docx|xls|xlsx|ppt|pptx|gif|jpe?g|png|bmp)$/i,
            url: EOLRootPath + '/Home/PostFile?id=' + identifier + '&userId=' + user_id + '&NoOfAttempt=' + $scope.config['NoOfAttempt'],
            dataType: 'json',
            add: function (e, data) {
                jqXHRData = data
            },
            done: function (event, data) {
                if (data.result.UploadStatus) {                    
                    $('#submitSuccessMessage').html(data.result.Message);
                    $scope.config['LearningObject'][$scope.pageInProgress]['FileUploadPath'] = data.result.UploadedFilePath                
                }
            },
            fail: function (event, data) {
                if (data.files[0].error) {
                    alert(data.files[0].error);
                }
            }
        });
	
	    $("#hl-start-upload").on('click', function () {
	        if (jqXHRData) {
	            jqXHRData.submit();
	        }
	        return false;
	    });
	
	    $("#fu-my-simple-upload").on('change', function () {
	        $("#tbx-file-path").val(this.files[0].name);
	    });
    }
    
    $scope.reviewedWebContent = function reviewedWebContent(){
    	if(!$scope.config['IsWebContentComplete']){
        	$scope.config['IsWebContentComplete'] = true
       	}else{
       		$scope.config['IsWebContentComplete'] = false
       	}
        postReviewedContent();
    };

    $scope.reviewedWebLink = function reviewedWebLink(){
    	if(!$scope.config['IsWebLinkComplete']){
        	$scope.config['IsWebLinkComplete'] = true
       	}else{
       		$scope.config['IsWebLinkComplete'] = false
       	}        
        postReviewedContent();
    };

    //function to add leading and traling space with anchor tag and open in new window 
    $scope.updateAnchorTag = function updateAnchorTag(textToReplace){
    	replacedTextDiv = $('<div></div>')

		replacedTextDiv.html(textToReplace).find('a').each(function(i){
			$(this).before('&nbsp;');
			$(this).after('&nbsp;');
			$(this).attr('target','_blank');								
		});

		updatedText = replacedTextDiv.html().toString()
		return updatedText
    }
    
    $scope.updateflvTag = function updateflvTag(trustedHtmlQText){
    	var updateToFlvDiv = $('<div></div>')

		updateToFlvDiv.html(trustedHtmlQText).find('video').each(function(i){
			if(($(this).find('source').attr('type') == 'video/flv') || ($(this).find('source').attr('type') == 'video/x-flv')){
				if(!$(this).attr('id')){				
					$(this).attr('id', 'video'+$scope.videoIdNo);
					console.log($(this).attr('id'))
					$(this).addClass('video-js vjs-default-skin vjs-big-play-centered');
					$(this).attr('videodir','');
					$scope.videoIdNo++;	
				}
			}
					
		});

		return updateToFlvDiv.html().toString()
    }
   
   $scope.showAllScores = function showAllScores(){

		var i, scoreFeedbackText = "", allScoresLength = $scope.config['LearningObject']['AllAttemptScores'].length;
		
		if(!ifInfinteAttempts){
			i = 1
		}else if ($scope.config['NoOfAttempt']>2){
			i = $scope.config['NoOfAttempt']-2
		}else{
			i = 1
		}

		for (var i = 1; i < $scope.config['NoOfAttempt']; i++) {
	        for (var j = 0; j < allScoresLength; j++) {	        	
	            if ($scope.config['LearningObject']['AllAttemptScores'][j]['key'] == i) {
	                scoreFeedbackText = scoreFeedbackText + "<div>Attempt "+$scope.config['NoOfAttempt']+":"+$scope.config['LearningObject']['AllAttemptScores'][j]['value']+"</div>"
	            }
	        }
		}
		
		$('#modalOKInfoTitle').html('Previous Score details below!');
    	$('#modalOKInfoBody').html("<div style='padding: 20px;'>"+ scoreFeedbackText +"</div>");
    	$('#modalOKInfoCancelButton').html("OK");
    	$('#modalOKInfoProceedButton').hide();
    	$('#modalOKInfo').modal('show');
   }

});