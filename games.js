/**
 * ========== GAMES PAGE FUNCTIONALITY ==========
 * Run only on games page
 */
if (document.querySelector('.games-hero')) {
    initGames();
}

function initGames() {
    initQuiz();
    initMemoryMatch();
    initVirtualFarm();
    initColoringPages();
    loadRewards();
}

// ==================== REWARDS SYSTEM ====================
let userPoints = 0;
let userRank = 'Beginner';

function loadRewards() {
    const saved = localStorage.getItem('frutilabs-points');
    if (saved) {
        userPoints = parseInt(saved) || 0;
    }
    updateRewards();
}

function updateRewards() {
    const pointsSpan = document.getElementById('user-points');
    const rankSpan = document.getElementById('user-rank');
    if (pointsSpan) pointsSpan.textContent = userPoints;
    if (rankSpan) {
        if (userPoints < 10) userRank = 'Beginner';
        else if (userPoints < 30) userRank = 'Fruit Explorer';
        else if (userPoints < 60) userRank = 'Fruit Master';
        else userRank = 'Fruit Legend';
        rankSpan.textContent = userRank;
    }
    localStorage.setItem('frutilabs-points', userPoints);
}

function addPoints(amount) {
    userPoints += amount;
    updateRewards();
    showNotification(`You earned ${amount} points!`, 'success');
}

// ==================== FRUIT QUIZ ====================
function initQuiz() {
    const quizData = [
        { question: "Which fruit is known as the 'king of fruits'?", options: ["Mango", "Durian", "Pineapple", "Banana"], correct: 0 },
        { question: "Which fruit is technically a berry?", options: ["Strawberry", "Raspberry", "Banana", "Apple"], correct: 2 },
        { question: "Which fruit has its seeds on the outside?", options: ["Strawberry", "Kiwi", "Dragon Fruit", "Passion Fruit"], correct: 0 },
        { question: "Which fruit is the main ingredient in guacamole?", options: ["Tomato", "Avocado", "Cucumber", "Lime"], correct: 1 },
        { question: "Which fruit is 92% water?", options: ["Watermelon", "Orange", "Grapefruit", "Cantaloupe"], correct: 0 }
    ];

    let currentQuestion = 0;
    let score = 0;
    const totalQuestions = quizData.length;

    const questionEl = document.getElementById('quiz-question');
    const optionsEl = document.getElementById('quiz-options');
    const scoreEl = document.getElementById('quiz-score');
    const progressEl = document.getElementById('quiz-progress');

    function loadQuestion() {
        const q = quizData[currentQuestion];
        questionEl.textContent = q.question;
        optionsEl.innerHTML = '';
        q.options.forEach((opt, idx) => {
            const btn = document.createElement('button');
            btn.className = 'quiz-option';
            btn.textContent = opt;
            btn.dataset.idx = idx;
            btn.addEventListener('click', () => handleAnswer(idx));
            optionsEl.appendChild(btn);
        });
    }

    function handleAnswer(selectedIdx) {
        const q = quizData[currentQuestion];
        const isCorrect = selectedIdx === q.correct;

        // Disable all options
        document.querySelectorAll('.quiz-option').forEach(btn => {
            btn.disabled = true;
            if (parseInt(btn.dataset.idx) === q.correct) {
                btn.classList.add('correct');
            } else if (parseInt(btn.dataset.idx) === selectedIdx && !isCorrect) {
                btn.classList.add('incorrect');
            }
        });

        if (isCorrect) {
            score++;
            addPoints(5);
        }

        setTimeout(() => {
            currentQuestion++;
            if (currentQuestion < totalQuestions) {
                loadQuestion();
            } else {
                showNotification(`Quiz completed! Your score: ${score}/${totalQuestions}`, 'info');
                questionEl.textContent = `Game Over! Your score: ${score}/${totalQuestions}`;
                optionsEl.innerHTML = '';
                // Reset quiz (could add restart button)
            }
            scoreEl.textContent = `Score: ${score}`;
            progressEl.value = currentQuestion;
        }, 1000);
    }

    // Initialize
    loadQuestion();
    scoreEl.textContent = `Score: 0`;
    progressEl.max = totalQuestions;
    progressEl.value = 0;
}

// ==================== MEMORY MATCH ====================
function initMemoryMatch() {
    const fruits = ['🍎', '🍌', '🍊', '🍇', '🍓', '🍒', '🍑', '🥝'];
    let cards = [...fruits, ...fruits]; // pairs
    let flippedCards = [];
    let matchedPairs = 0;
    let timer;
    let timeLeft = 60;
    let canFlip = true;

    const board = document.getElementById('memory-board');
    const timeSpan = document.getElementById('time');
    const matchesSpan = document.getElementById('matches');
    const restartBtn = document.getElementById('memory-restart');

    function shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    function renderBoard() {
        board.innerHTML = '';
        shuffle(cards).forEach((fruit, index) => {
            const card = document.createElement('div');
            card.className = 'memory-card';
            card.dataset.index = index;
            card.dataset.fruit = fruit;
            card.addEventListener('click', () => flipCard(card));
            board.appendChild(card);
        });
    }

    function flipCard(card) {
        if (!canFlip || card.classList.contains('flipped') || card.classList.contains('matched')) return;

        card.classList.add('flipped');
        card.textContent = card.dataset.fruit;
        flippedCards.push(card);

        if (flippedCards.length === 2) {
            canFlip = false;
            const card1 = flippedCards[0];
            const card2 = flippedCards[1];
            if (card1.dataset.fruit === card2.dataset.fruit) {
                // Match
                card1.classList.add('matched');
                card2.classList.add('matched');
                matchedPairs++;
                matchesSpan.textContent = matchedPairs;
                addPoints(10);
                flippedCards = [];
                canFlip = true;

                if (matchedPairs === fruits.length) {
                    clearInterval(timer);
                    showNotification('Congratulations! You matched all pairs!', 'success');
                }
            } else {
                // No match
                setTimeout(() => {
                    card1.classList.remove('flipped');
                    card2.classList.remove('flipped');
                    card1.textContent = '';
                    card2.textContent = '';
                    flippedCards = [];
                    canFlip = true;
                }, 800);
            }
        }
    }

    function startTimer() {
        timer = setInterval(() => {
            timeLeft--;
            timeSpan.textContent = timeLeft;
            if (timeLeft <= 10) timeSpan.classList.add('warning');
            if (timeLeft <= 0) {
                clearInterval(timer);
                canFlip = false;
                showNotification('Time\'s up! Game over.', 'error');
            }
        }, 1000);
    }

    function restartGame() {
        clearInterval(timer);
        timeLeft = 60;
        matchedPairs = 0;
        flippedCards = [];
        canFlip = true;
        timeSpan.textContent = timeLeft;
        timeSpan.classList.remove('warning');
        matchesSpan.textContent = matchedPairs;
        renderBoard();
        startTimer();
    }

    restartBtn.addEventListener('click', restartGame);
    restartGame();
}

// ==================== VIRTUAL FARM ====================
function initVirtualFarm() {
    const farmLand = document.getElementById('farm-land');
    const seedsSpan = document.getElementById('seeds');
    const coinsSpan = document.getElementById('coins');
    const plantBtn = document.getElementById('plant-seed');
    const harvestBtn = document.getElementById('harvest-all');

    let seeds = 5;
    let coins = 0;
    let plots = [
        { state: 'empty' }, // 0: empty, 1: growing, 2: ready
        { state: 'empty' },
        { state: 'empty' },
        { state: 'empty' },
        { state: 'empty' },
        { state: 'empty' },
        { state: 'empty' },
        { state: 'empty' },
        { state: 'empty' }
    ];
    let growthTimers = [];

    function renderFarm() {
        farmLand.innerHTML = '';
        plots.forEach((plot, index) => {
            const plotDiv = document.createElement('div');
            plotDiv.className = 'farm-plot';
            if (plot.state === 'growing') {
                plotDiv.classList.add('growing');
                plotDiv.textContent = '🌱';
            } else if (plot.state === 'ready') {
                plotDiv.classList.add('ready');
                plotDiv.textContent = '🍎'; // or specific fruit
            }
            plotDiv.dataset.index = index;
            plotDiv.addEventListener('click', () => {
                if (plot.state === 'ready') {
                    // Harvest single
                    harvestPlot(index);
                } else if (plot.state === 'empty' && seeds > 0) {
                    plantPlot(index);
                }
            });
            farmLand.appendChild(plotDiv);
        });
        seedsSpan.textContent = seeds;
        coinsSpan.textContent = coins;
    }

    function plantPlot(index) {
        if (seeds <= 0) return;
        seeds--;
        plots[index].state = 'growing';
        renderFarm();

        // Simulate growth after 5 seconds
        const timer = setTimeout(() => {
            if (plots[index].state === 'growing') {
                plots[index].state = 'ready';
                renderFarm();
            }
        }, 5000);
        growthTimers.push({ index, timer });
    }

    function harvestPlot(index) {
        if (plots[index].state === 'ready') {
            plots[index].state = 'empty';
            coins += 5; // earn coins
            addPoints(2); // also points
            renderFarm();
        }
    }

    function harvestAll() {
        let harvested = 0;
        plots.forEach((plot, index) => {
            if (plot.state === 'ready') {
                plot.state = 'empty';
                harvested++;
            }
        });
        coins += harvested * 5;
        addPoints(harvested * 2);
        renderFarm();
    }

    plantBtn.addEventListener('click', () => {
        // Find first empty plot
        const emptyIndex = plots.findIndex(p => p.state === 'empty');
        if (emptyIndex !== -1 && seeds > 0) {
            plantPlot(emptyIndex);
        } else if (seeds <= 0) {
            showNotification('No seeds left!', 'error');
        } else {
            showNotification('No empty plots!', 'error');
        }
    });

    harvestBtn.addEventListener('click', harvestAll);

    renderFarm();
}

// ==================== COLORING PAGES ====================
function initColoringPages() {
    const gallery = document.getElementById('coloring-gallery');
    const coloringPages = [
        { name: 'Apple', image: 'assets/images/coloring-apple.jpg' },
        { name: 'Banana', image: 'assets/images/coloring-banana.jpg' },
        { name: 'Orange', image: 'assets/images/coloring-orange.jpg' },
        { name: 'Strawberry', image: 'assets/images/coloring-strawberry.jpg' },
        { name: 'Grapes', image: 'assets/images/coloring-grapes.jpg' },
        { name: 'Watermelon', image: 'assets/images/coloring-watermelon.jpg' }
    ];

    gallery.innerHTML = coloringPages.map(page => `
        <div class="coloring-card">
            <img src="${page.image}" alt="${page.name} Coloring Page" loading="lazy">
            <div class="coloring-info">
                <h4>${page.name}</h4>
                <a href="${page.image}" download="${page.name.toLowerCase()}-coloring.jpg" class="download-btn">Download</a>
            </div>
        </div>
    `).join('');

    // Add points when downloading (demo)
    gallery.querySelectorAll('.download-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            addPoints(1);
        });
    });
}