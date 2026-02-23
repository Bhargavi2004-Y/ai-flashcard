let flashcards = [
  { question: "What is 2 + 2?", answer: "4", category: "Math" },
  { question: "Solve: 9 * 8", answer: "72", category: "Math" },
  { question: "What is the capital of France?", answer: "Paris", category: "Geography" },
  { question: "What is the boiling point of water?", answer: "100°C", category: "Science" },
  { question: "Who discovered gravity?", answer: "Isaac Newton", category: "Science" },
  { question: "Who wrote 'Hamlet'?", answer: "Shakespeare", category: "Literature" },
  { question: "Largest planet?", answer: "Jupiter", category: "Astronomy" },
  { question: "Which ocean is the largest?", answer: "Pacific Ocean", category: "Geography" },
];

let currentIndex = 0;
let showAnswer = false;
let correct = 0;
let total = 0;

const card = document.getElementById("flashcard");
const cardText = document.getElementById("flashcard-text");
const scoreDisplay = document.getElementById("score");
const categoryDisplay = document.getElementById("category");
const categoryFilter = document.getElementById("category-filter");

function flipCard() {
  showAnswer = !showAnswer;
  updateCard();
}

function updateCard() {
  const filtered = getFilteredFlashcards();
  if (filtered.length === 0) {
    cardText.textContent = "No flashcards in this category.";
    categoryDisplay.textContent = "";
    return;
  }
  const current = filtered[currentIndex % filtered.length];
  cardText.textContent = showAnswer ? current.answer : current.question;
  categoryDisplay.textContent = `Category: ${current.category || "General"}`;
}

function nextFlashcard() {
  const filtered = getFilteredFlashcards();
  currentIndex = (currentIndex + 1) % filtered.length;
  showAnswer = false;
  updateCard();
}

function markCorrect() {
  if (showAnswer) {
    correct++;
    total++;
    updateScore();
    nextFlashcard();
  } else {
    alert("Please flip the card and check the answer first!");
  }
}

function markWrong() {
  if (showAnswer) {
    total++;
    updateScore();
    nextFlashcard();
  } else {
    alert("Please flip the card and check the answer first!");
  }
}

function updateScore() {
  scoreDisplay.textContent = `Score: ${correct}/${total}`;
}

function resetScore() {
  correct = 0;
  total = 0;
  updateScore();
}

function toggleDarkMode() {
  document.body.classList.toggle("dark");
}

function downloadFlashcards() {
  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(flashcards));
  const dlAnchor = document.createElement("a");
  dlAnchor.setAttribute("href", dataStr);
  dlAnchor.setAttribute("download", "flashcards.json");
  dlAnchor.click();
}

function importFlashcards(event) {
  const file = event.target.files[0];
  const reader = new FileReader();
  reader.onload = function (e) {
    flashcards = JSON.parse(e.target.result);
    populateCategoryFilter();
    currentIndex = 0;
    showAnswer = false;
    updateCard();
  };
  reader.readAsText(file);
}

function populateCategoryFilter() {
  const categories = new Set(flashcards.map(f => f.category || "General"));
  categoryFilter.innerHTML = `<option value="All">All Categories</option>`;
  categories.forEach(cat => {
    const option = document.createElement("option");
    option.value = cat;
    option.textContent = cat;
    categoryFilter.appendChild(option);
  });
}

function getFilteredFlashcards() {
  const selected = categoryFilter.value;
  return selected === "All" ? flashcards : flashcards.filter(f => f.category === selected);
}

categoryFilter.addEventListener("change", () => {
  currentIndex = 0;
  showAnswer = false;
  updateCard();
});

function addCustomFlashcard() {
  const q = document.getElementById("new-question").value.trim();
  const a = document.getElementById("new-answer").value.trim();
  const c = document.getElementById("new-category").value.trim();

  if (!q || !a || !c) {
    alert("Please fill out all fields.");
    return;
  }

  flashcards.push({ question: q, answer: a, category: c });
  populateCategoryFilter();
  document.getElementById("new-question").value = "";
  document.getElementById("new-answer").value = "";
  document.getElementById("new-category").value = "";
  alert("Flashcard added!");
}

populateCategoryFilter();
updateCard();
