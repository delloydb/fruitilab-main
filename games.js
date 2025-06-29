// ===== GLOBAL VARIABLES =====
let totalPoints = 0;

// ===== QUIZ GAME =====
function initQuizGame() {
    const quizData = [
        {
            question: "I'm yellow and curved, monkeys love me. What am I?",
            options: ["Apple", "Banana", "Orange", "Grape"],
            answer: "Banana"
        },
        {
            question: "I'm red, crunchy, and keep doctors away. What am I?",
            options: ["Strawberry", "Cherry", "Apple", "Tomato"],
            answer: "Apple"
        },
        // Add more questions...
    ];

    let currentQuestion = 0;
    let score = 0;
    const questionElement = document.getElementById('quiz-question');
    const optionsContainer = document.querySelector('.quiz-options');
    const scoreElement = document.getElementById('quiz-score');
    const progressBar = document.getElementById('quiz-progress');

    function loadQuestion() {
        if (currentQuestion >= quizData.length) {
            endQuiz();
            return;
        }

        const question = quizData[currentQuestion];
        questionElement.textContent = question.question;
        optionsContainer.innerHTML = '';

        question.options.forEach(option => {
            const button = document.createElement('button');
            button.className = 'quiz-option';
            button.textContent = option;
            button.addEventListener('click', () => checkAnswer(option));
            optionsContainer.appendChild(button);
        });

        progressBar.value = currentQuestion;
    }

    function checkAnswer(selectedOption) {
        const correctAnswer = quizData[currentQuestion].answer;
        if (selectedOption === correctAnswer) {
            score++;
            totalPoints += 10;
            updatePoints();
        }

        currentQuestion++;
        loadQuestion();
    }

    function endQuiz() {
        questionElement.textContent = `Quiz Complete! Your score: ${score}/${quizData.length}`;
        optionsContainer.innerHTML = '';
        scoreElement.textContent = `Score: ${score}`;
    }

    loadQuestion();
}

// ===== MEMORY GAME =====
function initMemoryGame() {
    const fruits = ['🍎', '🍌', '🍊', '🍇', '🍓', '🍉', '🍍', '🥭'];
    const cards = [...fruits, ...fruits];
    let flippedCards = [];
    let matchedPairs = 0;
    let timeLeft = 60;
    let timer;

    const board = document.getElementById('memory-board');
    const timeElement = document.getElementById('time');
    const matchesElement = document.getElementById('matches');
    const restartBtn = document.getElementById('memory-restart');

    function startGame() {
        // Shuffle cards
        cards.sort(() => Math.random() - 0.5);
        
        // Create board
        board.innerHTML = '';
        cards.forEach((fruit, index) => {
            const card = document.createElement('div');
            card.className = 'memory-card';
            card.dataset.index = index;
            card.dataset.fruit = fruit;
            card.addEventListener('click', flipCard);
            board.appendChild(card);
        });

        // Reset game state
        flippedCards = [];
        matchedPairs = 0;
        timeLeft = 60;
        matchesElement.textContent = '0';
        
        // Start timer
        clearInterval(timer);
        timer = setInterval(updateTimer, 1000);
    }

    function flipCard() {
        if (flippedCards.length >= 2 || this.classList.contains('flipped')) return;

        this.classList.add('flipped');
        this.textContent = this.dataset.fruit;
        flippedCards.push(this);

        if (flippedCards.length === 2) {
            checkMatch();
        }
    }

    function checkMatch() {
        const [card1, card2] = flippedCards;
        
        if (card1.dataset.fruit === card2.dataset.fruit) {
            // Match found
            card1.classList.add('matched');
            card2.classList.add('matched');
            matchedPairs++;
            matchesElement.textContent = matchedPairs;
            totalPoints += 5;
            updatePoints();

            if (matchedPairs === fruits.length) {
                clearInterval(timer);
                totalPoints += 20; // Bonus for completing
                updatePoints();
            }
        } else {
            // No match
            setTimeout(() => {
                card1.classList.remove('flipped');
                card2.classList.remove('flipped');
                card1.textContent = '';
                card2.textContent = '';
            }, 1000);
        }

        flippedCards = [];
    }

    function updateTimer() {
        timeLeft--;
        timeElement.textContent = timeLeft;

        if (timeLeft <= 0) {
            clearInterval(timer);
            board.querySelectorAll('.memory-card:not(.matched)').forEach(card => {
                card.classList.add('flipped');
                card.textContent = card.dataset.fruit;
            });
        }
    }

    restartBtn.addEventListener('click', startGame);
    startGame();
}

// ===== VIRTUAL FARM =====
function initVirtualFarm() {
    const PLANT_GROW_TIME = 5000; // 5 seconds
    let seeds = 5;
    let coins = 0;
    
    const seedsElement = document.getElementById('seeds');
    const coinsElement = document.getElementById('coins');
    const farmLand = document.getElementById('farm-land');
    const plantBtn = document.getElementById('plant-seed');
    const harvestBtn = document.getElementById('harvest-all');

    // Create farm plots
    for (let i = 0; i < 10; i++) {
        const plot = document.createElement('div');
        plot.className = 'farm-plot empty';
        plot.dataset.index = i;
        plot.dataset.state = 'empty';
        farmLand.appendChild(plot);
    }

    plantBtn.addEventListener('click', plantSeed);
    harvestBtn.addEventListener('click', harvestAll);

    function plantSeed() {
        if (seeds <= 0) return;

        const emptyPlots = Array.from(farmLand.children)
            .filter(plot => plot.dataset.state === 'empty');

        if (emptyPlots.length === 0) return;

        seeds--;
        seedsElement.textContent = seeds;

        const randomPlot = emptyPlots[Math.floor(Math.random() * emptyPlots.length)];
        randomPlot.dataset.state = 'growing';
        randomPlot.style.setProperty('--growth', '0%');
        randomPlot.classList.remove('empty');
        randomPlot.classList.add('growing');

        setTimeout(() => {
            randomPlot.dataset.state = 'ready';
            randomPlot.classList.remove('growing');
            randomPlot.classList.add('ready');
            randomPlot.innerHTML = '🪴';
        }, PLANT_GROW_TIME);
    }

    function harvestAll() {
        const readyPlots = Array.from(farmLand.children)
            .filter(plot => plot.dataset.state === 'ready');

        if (readyPlots.length === 0) return;

        coins += readyPlots.length;
        coinsElement.textContent = coins;
        totalPoints += readyPlots.length * 2;
        updatePoints();

        readyPlots.forEach(plot => {
            plot.dataset.state = 'empty';
            plot.classList.remove('ready');
            plot.classList.add('empty');
            plot.innerHTML = '';
            plot.style.removeProperty('--growth');
        });
    }
}

// ===== COLORING PAGES =====
function loadColoringPages() {
    const coloringPages = [
        { name: "Juicy Apple", image: "apple-coloring.jpg" },
        { name: "Sweet Banana", image: "banana-coloring.jpg" },
        { name: "Orange Citrus", image: "orange-coloring.jpg" },
        { name: "Bunch of Grapes", image: "grapes-coloring.jpg" },
        { name: "Strawberry", image: "strawberry-coloring.jpg" },
        { name: "Watermelon Slice", image: "watermelon-coloring.jpg" },
    ];

    const gallery = document.querySelector('.coloring-gallery');
    gallery.innerHTML = '';

    coloringPages.forEach(page => {
        const item = document.createElement('div');
        item.className = 'coloring-item';
        item.innerHTML = `
            <img src="../images/coloring/${page.image}" alt="${page.name} Coloring Page">
            <div class="coloring-info">
                <h3>${page.name}</h3>
                <a href="../images/coloring/${page.image}" download class="download-btn">
                    Download <i class="fas fa-download"></i>
                </a>
            </div>
        `;
        gallery.appendChild(item);
    });
}

// ===== POINTS SYSTEM =====
function updatePoints() {
    const pointsElement = document.getElementById('user-points');
    const rankElement = document.getElementById('user-rank');
    
    pointsElement.textContent = totalPoints;
    
    // Update rank based on points
    if (totalPoints >= 100) {
        rankElement.textContent = "Fruit Master";
    } else if (totalPoints >= 50) {
        rankElement.textContent = "Fruit Expert";
    } else if (totalPoints >= 20) {
        rankElement.textContent = "Fruit Lover";
    } else {
        rankElement.textContent = "Beginner";
    }
}

// ===== INITIALIZE ALL GAMES =====
document.addEventListener('DOMContentLoaded', function() {
    initQuizGame();
    initMemoryGame();
    initVirtualFarm();
    loadColoringPages();
});