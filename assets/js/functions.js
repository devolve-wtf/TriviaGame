var category = '18';
var dataURL = `https://opentdb.com/api.php?amount=10&category=${category}&difficulty=medium&type=multiple`;

function categorySelect() {
	category = $('.category:checked').val();
	dataURL = `https://opentdb.com/api.php?amount=10&category=${category}&difficulty=medium&type=multiple`;

	startGame();
}

function startGame() {
	$.ajax({
		url: dataURL,
		method: 'GET'
	}).done(function(res) {
		$('.page-header').html('Trivia Game - ' + $('.category:checked').parent().text());
		$('#GameSetup').addClass('hidden');
		$('#TriviaGame').removeClass('hidden');
		var evalInterval;
		var timerInterval;
		var questionNumber = 0;
		var time = 20;
		var gameLength = res.results.length;
		var totalCorrect = 0;

		askQuestion();

		function askQuestion() {
			let question = res.results[questionNumber].question;
			let incorrect_answers = res.results[questionNumber].incorrect_answers;
			let correct_answer = res.results[questionNumber].correct_answer;

			//setup answers array with correct & incorrect answers, then sort
			let answers = [correct_answer];
			for(let answer in incorrect_answers) {
				answers.push(incorrect_answers[answer]);
			}
			answers.sort();

			//setup questions form elements
			let formFields = '';
			for(let answer in answers) {
				formFields += `<div class="radio"><label><input class="answer" type="radio" name="answersRadio" value="${answers[answer]}"> <span class="h4">${answers[answer]}</span></label></div>`;
			}

			//build #TriviaGame
			$('#Time').html('20');
			$('#QuestionNumber').html(questionNumber + 1 + ')')
			$('#Question').html(question);
			$('#Answers form').html(formFields);

			//clear and hide alerts
			$('.alert').each(function() {
				if(!$(this).hasClass('hide')) {
					$(this).addClass('hide');
				}
			});

			//get answer and bind eval function
			$('#Submit').click(eval).removeClass('btn-default disabled').addClass('btn-primary');
			$('#Continue').unbind('click').removeClass('btn-primary').addClass('btn-default disabled');

			//set timer for auto evaluation
			time = 20;
			timerInterval = setInterval(timer, 1000);
			evalInterval = setInterval(eval, 20010);
		}

		function eval() {
			let answer = $('.answer:checked').next('.h4').text();
			let correct_answer = res.results[questionNumber].correct_answer;

			if(answer == correct_answer) {
				$('.alert-info').html(answer + ' is correct!').removeClass('hide');
				totalCorrect++;
			}else{
				$('.alert-danger').html('The correct answer is ' + correct_answer).removeClass('hide');
			}

			questionNumber++;

			clearInterval(evalInterval);
			clearInterval(timerInterval);

			if(questionNumber < gameLength) {
				$('#Submit').removeClass('btn-primary').addClass('btn-default disabled').unbind('click');
				$('#Continue').removeClass('btn-primary disabled').addClass('btn-primary').click(askQuestion);
			}else{
				$('#Submit').removeClass('btn-primary').addClass('btn-default disabled').unbind('click');
				$('#Continue').removeClass('btn-primary disabled').addClass('btn-primary').click(reset);
				$('.alert-success').html(`${totalCorrect} / ${gameLength} correct`).removeClass('hide');
			}
		}

		function timer() {
			if(time > 0) {
				time--;
				$('#Time').html(time);
			}
		}

		function reset() {
			$('#TriviaGame').addClass('hidden');
			$('#GameSetup').removeClass('hidden');
			$('.alert').addClass('hide').empty();
			$('.page-header').html('Trivia Game');
		}
	});
}

$(document).ready(function() {
	$('#ConfirmCategory').click(categorySelect);
});