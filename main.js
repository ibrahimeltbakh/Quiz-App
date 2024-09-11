//select Elements
let questionsNumber = document.querySelector(".count span");
let bulletsSpans = document.querySelector(".bullets .spans");
let bullets = document.querySelector(".bullets");
let quizArea = document.querySelector(".quiz-area");
let answersArea = document.querySelector(".answers-area");
let submitButton = document.querySelector(".submit-button");
let results = document.querySelector(".results");
let countdownelement = document.querySelector(".countdown");

let qIndex = 0;
let rightAnswersCounter = 0;
let countdownInterval;
function getQuestions() {
  let myRequest = new XMLHttpRequest();
  myRequest.onreadystatechange = function () {
    if (this.readyState === 4 && this.status === 200) {
      let questionObject = JSON.parse(this.responseText);
      let questioncount = questionObject.length;
      //creat Bullets and Set Questions Count
      creatBullets(questioncount);
      //add Quetions Data
      addQuestiondata(questionObject[qIndex], questioncount);
      //start countdown
      countdown(3, questioncount);
      //when Sumbit
      submitButton.onclick = () => {
        //get the Right Answer
        let rightAnswer = questionObject[qIndex].right_answer;
        //increase index
        qIndex++;
        //check The Answer
        checkAnswer(rightAnswer);
        //remove previous question
        quizArea.innerHTML = "";
        answersArea.innerHTML = "";
        //add new Quetions Data
        addQuestiondata(questionObject[qIndex], questioncount);
        //handel bullets
        handelBullets();
        //clear interval
        clearInterval(countdownInterval);
        //start countdown
        countdown(3, questioncount);
        //show results
        showResults(questioncount);
      };
    }
  };

  myRequest.open("Get", "Html_Questions.json", true);
  myRequest.send();
}
getQuestions();

function creatBullets(nums) {
  questionsNumber.innerHTML = nums;
  for (let i = 0; i < nums; i++) {
    let thisQuestion = document.createElement("span");
    if (i === 0) {
      thisQuestion.className = "on";
    }
    bulletsSpans.appendChild(thisQuestion);
  }
}
function addQuestiondata(obj, count) {
  if (qIndex < count) {
    //creat h2 question title
    let h2 = document.createElement("h2");
    //creat text of question title
    let qTiteleText = document.createTextNode(obj["title"]);
    //append text to h2
    h2.appendChild(qTiteleText);
    //append h2 to quiz-area
    quizArea.appendChild(h2);
    //Creat Answers Area
    for (let i = 1; i <= 4; i++) {
      //creat div
      let answerDiv = document.createElement("div");
      //div class Name
      answerDiv.className = "answer";
      //creat radio element
      let radio = document.createElement("input");
      //radio Attributes
      radio.type = "radio";
      radio.name = "Questions";
      radio.id = `answer_${i}`;
      radio.dataset.answer = obj[`answer_${i}`];
      //make first radio checked
      if (i === 1) radio.checked = true;
      //creat label
      let label = document.createElement("label");
      //label Attributes
      label.htmlFor = `answer_${i}`;
      //creat text of label
      let labelText = document.createTextNode(obj[`answer_${i}`]);
      //append text to label
      label.appendChild(labelText);
      //append radio and label to main Div
      answerDiv.appendChild(radio);
      answerDiv.appendChild(label);
      //append Answer Div to answersArea
      answersArea.appendChild(answerDiv);
    }
  }
}
function checkAnswer(rAnswer) {
  let answers = document.getElementsByName("Questions");
  let theChoosenAnswer;
  for (let i = 0; i < answers.length; i++) {
    if (answers[i].checked) theChoosenAnswer = answers[i].dataset.answer;
  }
  if (theChoosenAnswer === rAnswer) rightAnswersCounter++;
}
function handelBullets() {
  let bullets = document.querySelectorAll(".bullets .spans span");
  let arrayofBullets = Array.from(bullets);
  arrayofBullets.forEach((span, index) => {
    if (qIndex === index) {
      span.className = "on";
    }
  });
}
function showResults(count) {
  let theResult;
  if (qIndex === count) {
    quizArea.remove();
    answersArea.remove();
    submitButton.remove();
    bullets.remove();
    if (rightAnswersCounter > count / 2 && rightAnswersCounter < count)
      theResult = `<span class= "good">Good</span>, You Answerd ${rightAnswersCounter} from ${count}`;
    else if (rightAnswersCounter === count)
      theResult = `<span class= "perfect">Perfect</span>, You Answerd ${rightAnswersCounter} from ${count}`;
    else
      theResult = `<span class= "bad">Bad</span>, You Answerd ${rightAnswersCounter} from ${count}`;

    results.innerHTML = theResult;
  }
}
function countdown(duration, count) {
  if (qIndex < count) {
    let minutes, seconds;
    countdownInterval = setInterval(function () {
      minutes = parseInt(duration / 60);
      seconds = parseInt(duration % 60);

      minutes = minutes < 10 ? `0${minutes}` : minutes;
      seconds = seconds < 10 ? `0${seconds}` : seconds;

      countdownelement.innerHTML = `<span>${minutes}</span>:<span>${seconds}</span>`;

      if (--duration < 0) {
        clearInterval(countdownInterval);
        submitButton.click();
      }
    }, 1000);
  }
}
