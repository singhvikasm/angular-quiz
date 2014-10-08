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

ngQuizApp.directive("replacefimb", [function () {
    return {
    	link: function(scope, element) { 
    		scope.text = config['questionList'][scope.questionInProgress]['Qtext'];
    		var arr = scope.text.match(/\[answer[1-9]\]/g), count=0;
    		while (scope.text.match(/\[answer[1-9]\]/)) {
    			scope.text = scope.text.replace(/\[answer[1-9]\]/,'<input type=text id="' +arr[count].substring(1,arr[count].length-1) +'"/>');
    			count++;
    		}
    		element.html(scope.text);
    	},
        template: ""
    }
}]);