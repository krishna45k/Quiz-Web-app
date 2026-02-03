let selectedLevel = "normal";
let questionLimit = 25;

function goToLogin() {
  selectedLevel = document.getElementById("level-select").value;
  questionLimit = parseInt(document.getElementById("question-limit").value);
  document.getElementById("setup-container").classList.add("hide");
  loginContainer.classList.remove("hide");
}


const questions = [
  {
    question: "Which language runs in a web browser?",
    answers: ["Java", "C", "Python", "JavaScript"],
    correct: 3,
    image: "https://upload.wikimedia.org/wikipedia/commons/6/6a/JavaScript-logo.png"
  },
  {
    question: "What does CSS stand for?",
    answers: ["Central Style Sheet", "Cascading Style Sheets", "Coded Style System", "Computer Style Sheet"],
    correct: 1,
    image: "https://upload.wikimedia.org/wikipedia/commons/d/d5/CSS3_logo_and_wordmark.svg"
  },
  {
    question: "What does HTML stand for?",
    answers: ["Hyper Text Markup Language", "Home Tool Markup Language", "Hyperlinks Text Mark Language", "Hyper Text Markdown Language"],
    correct: 0,
    image: "https://upload.wikimedia.org/wikipedia/commons/6/61/HTML5_logo_and_wordmark.svg"
  },
  {
    question: "Which year was JavaScript launched?",
    answers: ["1996", "1995", "1994", "1997"],
    correct: 1,
    image: "https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885_1280.jpg"
  },
  {
    question: "Who is the founder of Microsoft?",
    answers: ["Steve Jobs", "Bill Gates", "Mark Zuckerberg", "Elon Musk"],
    correct: 1,
    image: "https://upload.wikimedia.org/wikipedia/commons/a/a0/Bill_Gates_2018.jpg"
  },
  {
    question: "What is the capital of France?",
    answers: ["London", "Berlin", "Madrid", "Paris"],
    correct: 3,
    image: "https://upload.wikimedia.org/wikipedia/commons/a/a8/Tour_Eiffel_Wikimedia_Commons.jpg"
  },
  {
    question: "Which planet is known as the Red Planet?",
    answers: ["Earth", "Venus", "Mars", "Jupiter"],
    correct: 2,
    image: "https://upload.wikimedia.org/wikipedia/commons/0/02/OSIRIS_Mars_true_color.jpg"
  },
  {
    question: "Which animal is known as the King of the Jungle?",
    answers: ["Tiger", "Elephant", "Lion", "Wolf"],
    correct: 2,
    image: "https://upload.wikimedia.org/wikipedia/commons/7/73/Lion_waiting_in_Namibia.jpg"
  },
  {
    question: "Which is the largest ocean?",
    answers: ["Indian", "Arctic", "Atlantic", "Pacific"],
    correct: 3,
    image: "https://upload.wikimedia.org/wikipedia/commons/4/4f/Pacific_Ocean_-_en.svg"
  },
  {
    question: "Which continent is known as the Dark Continent?",
    answers: ["Asia", "Africa", "Europe", "Australia"],
    correct: 1,
    image: "https://upload.wikimedia.org/wikipedia/commons/7/71/Africa_satellite_plane.jpg"
  }
];

let shuffledQuestions, currentQuestionIndex, score, timer;
const timeLimit = 15;
let timeLeft = timeLimit;
let userName = "";
let totalTime = 0;

const questionEl = document.getElementById("question");
const answersEl = document.getElementById("answers");
const nextBtn = document.getElementById("next-btn");
const resultEl = document.getElementById("result");
const questionImg = document.getElementById("question-img");
const timerEl = document.getElementById("timer");
const quizContainer = document.getElementById("quiz-container");
const loginContainer = document.getElementById("login-container");

function startQuiz() {
  const nameInput = document.getElementById("username");
  if (!nameInput.value.trim()) return alert("Please enter your name");
  userName = nameInput.value.trim();
  loginContainer.classList.add("hide");
  quizContainer.classList.remove("hide");

  shuffledQuestions = questions.sort(() => Math.random() - 0.5);
  currentQuestionIndex = 0;
  score = 0;
  totalTime = 0;
  showQuestion();
}

function showQuestion() {
  resetState();
  startTimer();

  const current = shuffledQuestions[currentQuestionIndex];
  questionEl.textContent = current.question;
  questionImg.src = current.image;

  const randomizedAnswers = current.answers.map((a, i) => ({ text: a, index: i }));
  randomizedAnswers.sort(() => Math.random() - 0.5);

  randomizedAnswers.forEach(({ text, index }) => {
    const btn = document.createElement("button");
    btn.textContent = text;
    btn.classList.add("btn");
    btn.onclick = () => {
      selectAnswer(index, current.correct);
      stopTimer();
    };
    answersEl.appendChild(btn);
  });
}

function resetState() {
  nextBtn.classList.add("hide");
  while (answersEl.firstChild) answersEl.removeChild(answersEl.firstChild);
}

function selectAnswer(selectedIndex, correctIndex) {
  const allButtons = answersEl.querySelectorAll(".btn");
  allButtons.forEach((btn, i) => {
    const actualIndex = questions[currentQuestionIndex].answers.indexOf(btn.textContent);
    if (actualIndex === correctIndex) btn.style.backgroundColor = "#38a169";
    if (actualIndex === selectedIndex && actualIndex !== correctIndex) btn.style.backgroundColor = "#e53e3e";
    btn.disabled = true;
  });

  if (selectedIndex === correctIndex) score++;
  nextBtn.classList.remove("hide");
}

nextBtn.onclick = () => {
  currentQuestionIndex++;
  if (currentQuestionIndex < shuffledQuestions.length) {
    showQuestion();
  } else {
    showResult();
  }
};

function showResult() {
  resetState();
  stopTimer();
  questionEl.textContent = "Quiz Completed!";
  questionImg.classList.add("hide");
  resultEl.classList.remove("hide");
  resultEl.innerHTML = `
    <p>Well done, <strong>${userName}</strong>!</p>
    <p>Your score: <strong>${score}/${questions.length}</strong></p>
    <p>Total Time: <strong>${totalTime}</strong> seconds</p>
  `;
  nextBtn.textContent = "Restart Quiz";
  nextBtn.classList.remove("hide");
  nextBtn.onclick = () => location.reload();
}

function startTimer() {
  timeLeft = timeLimit;
  timerEl.textContent = `${timeLeft}s`;
  timer = setInterval(() => {
    timeLeft--;
    totalTime++;
    timerEl.textContent = `${timeLeft}s`;
    if (timeLeft <= 0) {
      stopTimer();
      autoSkip();
    }
  }, 1000);
}

function stopTimer() {
  clearInterval(timer);
}

function autoSkip() {
  selectAnswer(-1, shuffledQuestions[currentQuestionIndex].correct);
  setTimeout(() => {
    currentQuestionIndex++;
    if (currentQuestionIndex < shuffledQuestions.length) {
      showQuestion();
    } else {
      showResult();
    }
  }, 1000);
}