// $.ajax({
// 	dataType: 'json',
// 	url: 'https://opentdb.com/api.php?amount=10&category=18&difficulty=medium&type=multiple',
// 	data: data,
// 	success: success
// });
var dataURL = 'https://opentdb.com/api.php?amount=10&category=18&difficulty=medium&type=multiple';
var gameInterval;
var promise = new Promise((done, fail) => {
	var trivia = [];
	$.getJSON(dataURL, function(data) {
		$.each(data, function(key, val) {
			trivia.push({key, val});
		});
		done(trivia);
	});
});

promise.then(arr => {
	var trivia = arr[1].val;

	// (function game(object) {
	// 	interval = setTimeout(function() {
	// 		console.log(object);
	// 		let question = trivia[object].question;
	// 		let incorrect_answers = trivia[object].incorrect_answers;
	// 		let correct_answer = trivia[object].correct_answer;

	// 		ask(question, incorrect_answers, correct_answer);

	// 		object--;
	// 		if(object >= 0) { 
	// 			game(object);
	// 		}

	// 	}, 10000)

	// })(trivia.length - 1);
	let object = 0;
	function game() {
		if(object < trivia.length) {
	 		let question = trivia[object].question;
	 		let incorrect_answers = trivia[object].incorrect_answers;
	 		let correct_answer = trivia[object].correct_answer;

	 		ask(question, incorrect_answers, correct_answer);
	 		object++
	 	}
	}
	game();

	gameInterval = setInterval(game, 10000);

	function ask(question, incorrect_answers, correct_answer) {
		$('#Question').html(question);
		let answers = [correct_answer];
		for(let answer in incorrect_answers) {
			answers.push(incorrect_answers[answer]);
		}
		answers.sort();
		let formFields = '';
		for(let answer in answers) {
			formFields = formFields + `<input class="answer" type="radio" value="${answers[answer]}"> ${answers[answer]} <br>`;
		}
		$('#Answers form').html(formFields);

		$('#Submit').bind('click', function() {
			$(this).unbind('click');
			eval($('.answer:checked').val(), correct_answer);
			clearInterval(gameInterval);
			$('#Continue').bind('click', function() {
				$(this).unbind('click');
				game();
				gameInterval = setInterval(game, 10000);

			});
		});
	}

	function eval(answer, correct_answer) {
		if(answer === correct_answer) {
			alert('Correct!');
		}else{
			alert(`The correct answer is ${correct_answer}`);
		}
	}

});