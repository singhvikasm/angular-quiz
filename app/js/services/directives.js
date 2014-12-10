ngQuizApp.directive("fileread", [function () {
    return {
        scope: {
            fileread: "="
        },
        link: function (scope, element, attributes) {
            element.bind("change", function (changeEvent) {
                scope.$apply(function () {
                    scope.fileread = changeEvent.target.files[0];
                });
            });
        }
    }
}]);

ngQuizApp.directive("replacefimb", function ($compile) {
    return {
        link: function (scope, element) {
            scope.text = (scope.pageInProgress + 1) + '. ' + scope.updateflvTag(scope.updateAnchorTag(scope.config['LearningObject'][scope.pageInProgress]['Title'].replace(scope.varToReplace, scope.filesRootPath)));
            var arr = scope.text.match(/\[answer[1-9]\]/gi), count = 0, id;
            while (scope.text.match(/\[answer[1-9]\]/i)) {
                id = arr[count].substring(1, arr[count].length - 1);
                scope.text = scope.text.replace(/\[answer[1-9]\]/i, '<input type=text id="' + id + '" data-ng-disabled="' + scope.disableInputs + '" />');//merge disable inputs
                count++;
            }
            element.html(scope.text);
            var inputs = element.find('input');
            if (!(scope.config['LearningObject'][scope.pageInProgress]['responseEntered'])) {
                scope.config['LearningObject'][scope.pageInProgress]['responseEntered'] = {}
            }
            for (var i = 0; i < count; i++) {
                inputs[i].setAttribute('data-ng-model', "config['LearningObject'][pageInProgress]['responseEntered']['" + inputs[i].id + "'] ");
                if (!(scope.config['LearningObject'][scope.pageInProgress]['responseEntered'][inputs[i].id])) {
                    scope.config['LearningObject'][scope.pageInProgress]['responseEntered'][inputs[i].id] = ''
                }
            }
            if (scope.isFeedbackScreen) {
                for (var i = 0; i < count; i++) {
                    var keyCorrectResponseFound = false;
                    for (var j = 0; j < scope.config['LearningObject'][scope.pageInProgress]['correctResponse'].length; j++) {
                        if (scope.config['LearningObject'][scope.pageInProgress]['correctResponse'][j]['key'] == inputs[i].id) {
                            scope.setInCorrectFeedback(scope.pageInProgress)
                            $("#" + inputs[i].id).addClass('wrongAnsfimbFeedback');
                            $("#" + inputs[i].id).after("<span style='color:red'>(" + scope.config['LearningObject'][scope.pageInProgress]['correctResponse'][j]['value'] + ")&nbsp;</span>");
                            keyCorrectResponseFound = true
                            break;
                        }
                    }

                    if (!keyCorrectResponseFound) {
                        $("#" + inputs[i].id).addClass('correctAnsfimbFeedback');
                    }
                }
            }
            $compile(element.contents())(scope);
        },
        template: ""
    }
});

ngQuizApp.directive('videodir',function(){
        var linkFn;

        linkFn = function (scope, element, attr){        	
        	var myPlayer;        	
        	
			scope.$on('$destroy', function(myPlayer) {
			   // Destroy the object if it exists so that videoJs works on navigation
			    if ((myPlayer !== undefined) && (myPlayer !== null)) {
			        myPlayer.dispose();
			    }
			});
			
			
			// Manually loading the videojs
			console.log('id in directive' + attr.id)
			videojs(attr.id).ready(function(myPlayer) {				
			    myPlayer = this; // Store the object on a variable
			})

           videojs(attr.id,{"techOrder": ["html5","flash"]},function(){
                //this.src({type: "video/flv", src: scope.video.videoURL});
                console.log(scope.video.videoURL);
            });
            
            
		};

    return { 
        link: linkFn
    }
});

ngQuizApp.directive("compilemeagain", function($compile) {
    return {
    	link: function(scope, element, attr) {    		
	        //scope.$watch(attr.ngBindHtml, function() {
            	scope.text = (scope.pageInProgress + 1) + '. ' + scope.updateflvTag(scope.updateAnchorTag(scope.config['LearningObject'][scope.pageInProgress]['Title'].replace(scope.varToReplace, scope.filesRootPath)));
		        element.html(scope.text);
		        //element.html(element.context.innerHtml);
		        $compile(element.contents())(scope);
	        //});	        
		}        
    }
 });

/*ngQuizApp.run(function($rootScope, $templateCache) {
   $rootScope.$on('$viewContentLoaded', function() {
      $templateCache.removeAll();
   });
});*/

/*ngQuizApp.directive("compilemeagain", function($compile) {
    return {
    	link: function (scope, element) {
    		debugger;
            scope.text = "<video id='myVideo' videodir controls class='video-js vjs-default-skin vjs-big-play-centered'><source src='http://www.mediacollege.com/video-gallery/testclips/20051210-w50s_56K.flv' type='video/flv' /></video>"
            
            element.html(scope.text);
            
            $compile(element.contents())(scope);
        },
        template: ""
    }
 });*/
        
/*ngQuizApp.directive('dir', function($compile) {
    return {
      restrict: 'E',
      link: function(scope, element, attr) {
      	debugger;
        scope.$watch(attr.htmlContent, function() {
        	debugger;
          element.html($parse(attr.htmlContent)(scope));
          $compile(element.contents())(scope);
        }, true);
      }
    }
  })
  */
/*
ngQuizApp.directive('compile', function($compile) {
      // directive factory creates a link function
      return function(scope, element, attrs) {
        scope.$watch(
          function(scope) {
             // watch the 'compile' expression for changes
            return scope.$eval(attrs.compile);
          },
          function(value) {
            // when the 'compile' expression changes
            // assign it into the current DOM
            element.html(value);

            // compile the new DOM and link it to the current
            // scope.
            // NOTE: we only compile .childNodes so that
            // we don't get into infinite loop compiling ourselves
            $compile(element.contents())(scope);
          }
        );
      };
});*/

/*
 ngQuizApp.directive("replacefimb", function ($compile) {
    return {
        link: function (scope, element) {
            scope.text = (scope.pageInProgress + 1) + '. ' + scope.updateAnchorTag(scope.config['LearningObject'][scope.pageInProgress]['Title']);
            var arr = scope.text.match(/\[answer[1-9]\]/gi), count = 0, id;
            while (scope.text.match(/\[answer[1-9]\]/i)) {
                id = arr[count].substring(1, arr[count].length - 1);
                scope.text = scope.text.replace(/\[answer[1-9]\]/i, '<input type=text id="' + id + '" data-ng-disabled="' + scope.disableInputs + '" />');//merge disable inputs
                count++;
            }
            element.html(scope.text);
            
            var inputs = element.find('input');
            if (!(scope.config['LearningObject'][scope.pageInProgress]['responseEntered'])) {
                scope.config['LearningObject'][scope.pageInProgress]['responseEntered'] = {}
            }
            for (var i = 0; i < count; i++) {
                inputs[i].setAttribute('data-ng-model', "config['LearningObject'][pageInProgress]['responseEntered']['" + inputs[i].id + "'] ");
                if (!(scope.config['LearningObject'][scope.pageInProgress]['responseEntered'][inputs[i].id])) {
                    scope.config['LearningObject'][scope.pageInProgress]['responseEntered'][inputs[i].id] = ''
                }
            }
			
			*//*if (!(scope.config['LearningObject'][scope.pageInProgress]['responseEntered'])) {
                scope.config['LearningObject'][scope.pageInProgress]['responseEntered'] = new Array[count]
            }            
            
			for (var i = 0; i < count; i++) {
                for (var j = 0; j < scope.config['LearningObject'][scope.pageInProgress]['responseEntered'].length; j++) {
                	if(!scope.config['LearningObject'][scope.pageInProgress]['responseEntered'][j]['key']){
                		scope.config['LearningObject'][scope.pageInProgress]['responseEntered'][j]['key'] =  inputs[i].id
                	}
                	if(!scope.config['LearningObject'][scope.pageInProgress]['responseEntered'][j]['value']){
                		scope.config['LearningObject'][scope.pageInProgress]['responseEntered'][j]['value'] =  ''
                	}
                    if (scope.config['LearningObject'][scope.pageInProgress]['responseEntered'][j]['key'] == inputs[i].id) {
						inputs[i].setAttribute('data-ng-model', "config['LearningObject'][scope.pageInProgress]['responseEntered'][" + j + "]['value']");
                    }
                }
            }*//*
			
            if (scope.isFeedbackScreen) {
                for (var i = 0; i < count; i++) {
                    var keyCorrectResponseFound = false;
                    for (var j = 0; j < scope.config['LearningObject'][scope.pageInProgress]['correctResponse'].length; j++) {
                        if (scope.config['LearningObject'][scope.pageInProgress]['correctResponse'][j]['key'] == inputs[i].id) {
                            scope.setInCorrectFeedback(scope.pageInProgress)
                            $("#" + inputs[i].id).addClass('wrongAnsfimbFeedback');
                            $("#" + inputs[i].id).after("<span style='color:red'>(" + scope.config['LearningObject'][scope.pageInProgress]['correctResponse'][j]['value'] + ")&nbsp;</span>");
                            keyCorrectResponseFound = true
                            break;
                        }
                    }

                    if (!keyCorrectResponseFound) {
                        $("#" + inputs[i].id).addClass('correctAnsfimbFeedback');
                    }
                }
            }
            $compile(element.contents())(scope);
        },
        template: ""
    }
});
 */
/*ngQuizApp.directive("replacefimb", function ($compile) {
    return {
        link: function (scope, element) {
            scope.text = (scope.pageInProgress+1)+'. '+scope.config['LearningObject'][scope.pageInProgress]['Title'];
            replaceMeCount = /\[(answer|blank)[1-9]\]/gi //text to replace must come in bracket with a single vertical bar eg..(replaceText1|replaceText2|replaceText3)
            replaceMe = /\[(answer|blank)[1-9]\]/i //text to replace must come in bracket with a single vertical bar eg..(replaceText1|replaceText2|replaceText3)
            var arr = scope.text.match(replaceMeCount), count = 0, id;
            while (scope.text.match(replaceMe)) {
                id = arr[count].substring(1, arr[count].length - 1);
                scope.text = scope.text.replace(replaceMe, '<input type=text id="' + id + '" data-ng-disabled="'+ scope.disableInputs + '" />');//merge disable inputs
                count++;
            }
            element.html(scope.text);
            var inputs = element.find('input');
            if(!(scope.config['LearningObject'][scope.pageInProgress]['responseEntered'])){
            	scope.config['LearningObject'][scope.pageInProgress]['responseEntered'] = {}
            }
            for (var i = 0; i < count; i++) {
                inputs[i].setAttribute('data-ng-model', "config['LearningObject'][pageInProgress]['responseEntered']['" + inputs[i].id + "'] ");                
                if(!(scope.config['LearningObject'][scope.pageInProgress]['responseEntered'][inputs[i].id])){
                	scope.config['LearningObject'][scope.pageInProgress]['responseEntered'][inputs[i].id] = ''
                }
            }
            if(scope.isFeedbackScreen){
            	for (var i = 0; i < count; i++) {	                
	                if(!(scope.config['LearningObject'][scope.pageInProgress]['correctResponse'][inputs[i].id])){
	                	inputs[i].setAttribute('class', "correctAnsfimbFeedback");
	                }else{
	                	scope.setInCorrectFeedback(scope.pageInProgress)
	                	inputs[i].setAttribute('class', "wrongAnsfimbFeedback");
	                	$("#"+inputs[i].id).after("<span style='color:red'>("+scope.config['LearningObject'][scope.pageInProgress]['correctResponse'][inputs[i].id]+")&nbsp;</span>")
	                }
	            }
            }
            
            $compile(element.contents())(scope);
        },
        template: ""
    }
});*/






//ngQuizApp.directive("fileread", [function () {
//    return {
//        scope: {
//            fileread: "="
//        },
//        link: function (scope, element, attributes) {
//            element.bind("change", function (changeEvent) {
//                scope.$apply(function () {
//                    scope.fileread = changeEvent.target.files[0];
//                });
//            });
//        }
//    }
//}]);

//ngQuizApp.directive("replacefimb", function ($compile) {
//    return {
//        link: function (scope, element) {
//            scope.text = scope.config['questionList'][scope.questionInProgress]['Title'];
//    		var arr = scope.text.match(/\[answer[1-9]\]/gi), count=0, id;
//    		while (scope.text.match(/\[answer[1-9]\]/i)) {
//    		    id = arr[count].substring(1, arr[count].length - 1);
//    			scope.text = scope.text.replace(/\[answer[1-9]\]/i,'<input type=text id="' + id +'" />');
//    			count++;
//    		}
//    		element.html(scope.text);
//    		var inputs = element.find('input');
//    		for (var i = 0; i < inputs.length; i++) {
//    		    inputs[i].setAttribute('data-ng-model', "config['questionList'][questionInProgress]['responseEntered']['" + inputs[i].id + "'] ");
//    		}
//            $compile(element.contents())(scope);
//    	},
//        template: ""
//    }
//});