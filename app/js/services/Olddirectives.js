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
    	link: function(scope, element) { 
    		scope.text = config['questionList'][scope.questionInProgress]['Qtext'];
    		var arr = scope.text.match(/\[answer[1-9]\]/g), count=0;
    		while (scope.text.match(/\[answer[1-9]\]/)) {
    			var id = arr[count].substring(1,arr[count].length-1);
    			scope.text = scope.text.replace(/\[answer[1-9]\]/,'<input type=text id="' + id +'" />');
    			count++;
    		}
    		element.html(scope.text);
    		var inputs = element.find('input');
    		for(var i=0; i< inputs.length; i++) {
    			inputs[i].setAttribute('data-ng-model',"config['questionList'][questionInProgress]['responseEntered']["+ i +"] ");
    		}
            $compile(element.contents())(scope);
    	},
        template: ""
    }
});