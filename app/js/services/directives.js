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
            scope.text = (scope.pageInProgress+1)+'. '+scope.config['LearningObject'][scope.pageInProgress]['Title'];
            var arr = scope.text.match(/\[answer[1-9]\]/gi), count = 0, id;
            while (scope.text.match(/\[answer[1-9]\]/i)) {
                id = arr[count].substring(1, arr[count].length - 1);
                scope.text = scope.text.replace(/\[answer[1-9]\]/i, '<input type=text id="' + id + '" data-ng-disabled="'+ scope.disableInputs + '" />');//merge disable inputs
                count++;
            }
            element.html(scope.text);
            var inputs = element.find('input');
            for (var i = 0; i < count; i++) {
                inputs[i].setAttribute('data-ng-model', "config['LearningObject'][pageInProgress]['responseEntered']['" + inputs[i].id + "'] ");
            }
            $compile(element.contents())(scope);
        },
        template: ""
    }
});






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