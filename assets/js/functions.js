// $.ajax({
// 	dataType: 'json',
// 	url: 'https://opentdb.com/api.php?amount=10&category=18&difficulty=medium&type=multiple',
// 	data: data,
// 	success: success
// });
var dataURL = 'https://opentdb.com/api.php?amount=10&category=18&difficulty=medium&type=multiple';

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
	let trivia = arr[1].val;
	for(let object in trivia) {
		console.log(trivia[object].question);
	}
	let question = trivia[0].question;
	let answers = trivia[0].incorrect_answers;
	let correct_answer = trivia[0].correct_answer;
	ask(question, answers, correct_answer);
});

function ask(question, incorrect_answers, correct_answer) {
	$('#Question').append(question);
	let answers = [correct_answer];
	for(let answer in incorrect_answers) {
		answers.push(incorrect_answers[answer]);
	}
	answers.sort();
	for(let answer in answers) {
		$('#Answers form').append(`<input type="radio" value=" ${answers[answer]} "> ${answers[answer]} <br>`);
	}
}
