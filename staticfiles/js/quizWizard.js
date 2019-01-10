$(document).ready(function(){

/*validate form */
	var form = $('#quiz-module');
	var results = $('#quiz-results');
	form.validate({
		errorClass: "validationError",
		errorElement: "li",
		errorPlacement: function errorPlacement(error, element) {
				error.appendTo(element.parents('ul'));
		},
		rules: {
			///tbd
		}
	});
/*steps*/
	form.children("div").steps({
		headerTag: "h3",
		bodyTag: "fieldset",
		transitionEffect: "fade",
		transitionEffectSpeed: 500,
		onInit:function (event, currentIndex)
		{
			labelSelection(currentIndex);
		},
		onStepChanging: function (event, currentIndex, newIndex)
		{
			labelSelection(newIndex);
			form.validate().settings.ignore = ":disabled,:hidden";
			return form.valid();
		},
		onFinishing: function (event, currentIndex)
		{
			form.validate().settings.ignore = ":disabled";
			return form.valid();
		},
		onFinished: function (event, currentIndex)
		{
			var selectionId = $("form#quiz-module input[name='opt']:checked").val();
			var selectionText = $("form#quiz-module input[name='opt']:checked").parent('li').text();
			var pollId = $("form#quiz-module input#pollId").val();
			/*var choiceId= '#choiceId-'+selectionId;*/
			var data = { selectionId };
			var args = { 
				type:"POST", 
				url:"/polls/"+pollId+"/vote/", 
				data:data, 
				success: function( data ) {
					results.children('#ajaxresults').html(selectionText);
					/*results.children(choiceId).html(data.newvotes);*/
					form.hide('fast');
					results.show('fast');
				},
				error: function(xhr, status, error) {
				  alert(error+'<br/>'+"Sorry. Can't submit your vote. Please, reload the page and try again")
				},
			};
			$.ajax(args);
		}
	});
});


/*select radio when click on label*/
function labelSelection(currentIndex){
	var currentQuestion = $('#quiz-module fieldset').eq(currentIndex);

	currentQuestion.find('li').on('click', function(){
		currentQuestion.find('li.selected').removeClass('selected');
		$(this).addClass('selected');
		$(this).children("input[type=radio]").prop('checked', true);
		removeErrorClasses(currentIndex);
	});
}

/*remove error messages and classes when user correct data */
function removeErrorClasses(currentIndex){
	var currentQuestion = $('#quiz-module fieldset').eq(currentIndex);

	var currentQuestionErrorMSG = currentQuestion.find('li:last-child');
	if (currentQuestionErrorMSG.hasClass('validationError')){
		currentQuestionErrorMSG.remove();
	}
	var currentStep = $('#quiz-module .steps li.current');
	if (currentStep.hasClass('error')){
		currentStep.removeClass('error');
	}

};

/*secure voting operation*/
function getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie != '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = jQuery.trim(cookies[i]);
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) == (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}
var csrftoken = getCookie('csrftoken');

function csrfSafeMethod(method) {
    // these HTTP methods do not require CSRF protection
    return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
}
$.ajaxSetup({
    crossDomain: false, // obviates need for sameOrigin test
    beforeSend: function(xhr, settings) {
        if (!csrfSafeMethod(settings.type)) {
            xhr.setRequestHeader("X-CSRFToken", csrftoken);
        }
    }
});