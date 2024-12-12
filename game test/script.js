document.addEventListener("DOMContentLoaded", function () {
    const levels = [
        { question: "Irmak'ın lisesinin adı nedir?", answer: "4", image: "images/lise.jpg" },
        { question: "Irmak nerelidir?", answer: "4", image: "images/paris.jpg" },
        { question: "Irmak gerçekte nerelidir?", answer: "4", image: "images/location.jpg" },
    ];

    let currentLevel = 0;
    let playerName = "";
    let totalElapsedTime = 0; // Tracks total time across restarts
    let restartCount = 0;
    let intervalID;

    const leaderboard = [
        { name: "Orkun", time: 45, restarts: 1 },
        { name: "Irmak", time: 30, restarts: 0 },
    ];
    

    const startContainer = document.getElementById("start-container");
    const questionContainer = document.getElementById("question-container");
    const feedbackContainer = document.getElementById("feedback-container");
    const leaderboardContainer = document.getElementById("leaderboard-container");
    const congratsMessage = document.getElementById("congrats-message");

    const levelHeader = document.getElementById("level-header");
    const questionElement = document.getElementById("question");
    const answerInput = document.getElementById("answer-input");

    const playerNameInput = document.getElementById("player-name-input");
    const playerNameDisplay = document.getElementById("player-name");
    const elapsedTimeDisplay = document.getElementById("elapsed-time");
    const restartCountDisplay = document.getElementById("restart-count");

    const startButton = document.getElementById("start-game");
    const submitButton = document.getElementById("submit-answer");
    const nextLevelButton = document.getElementById("next-level");
    const tryAgainButton = document.getElementById("try-again");
    const validationError = document.getElementById("validation-error");
    const questionImage = document.getElementById("question-image");

    startButton.addEventListener("click", () => {
        playerName = playerNameInput.value.trim();
        if (!playerName) {
            validationError.classList.remove("hidden");
            return;
        }
        validationError.classList.add("hidden");
        playerNameDisplay.textContent = `👤 ${playerName}`;
        startContainer.classList.add("hidden");
        questionContainer.classList.remove("hidden");
        startTimer();
        startLevel();
    });

    function startLevel() {
        const currentQuestion = levels[currentLevel];
        levelHeader.textContent = `Level ${currentLevel + 1}`;
        questionElement.textContent = currentQuestion.question;
        answerInput.value = "";

        if (currentQuestion.image) {
            questionImage.src = currentQuestion.image;
            questionImage.classList.remove("hidden");
        } else {
            questionImage.classList.add("hidden");
        }
    }

    submitButton.addEventListener("click", () => {
        const userAnswer = answerInput.value.trim();
        const correctAnswer = levels[currentLevel].answer;
        if (userAnswer === correctAnswer) {
            showFeedback(true);
        } else {
            showFeedback(false);
        }
    });

    nextLevelButton.addEventListener("click", () => {
        feedbackContainer.classList.add("hidden");
        if (++currentLevel < levels.length) {
            questionContainer.classList.remove("hidden");
            startLevel();
        } else {
            endGame();
        }
    });

    tryAgainButton.addEventListener("click", () => {
        feedbackContainer.classList.add("hidden");
        currentLevel = 0;
        restartCount++;
        restartCountDisplay.textContent = `🔄 ${restartCount}`;
        questionContainer.classList.remove("hidden");
        startLevel();
    });

    function showFeedback(correct) {
        const feedbackTitle = document.getElementById("feedback-title");
        const feedbackText = document.getElementById("feedback-text");

        feedbackContainer.classList.remove("hidden");
        questionContainer.classList.add("hidden");

        if (correct) {
            feedbackTitle.textContent = `Level ${currentLevel + 1} Completed! 🎉`;
            feedbackText.textContent = "Great job!";
            nextLevelButton.classList.remove("hidden");
            tryAgainButton.classList.add("hidden");

            playConfetti();
        } else {
            feedbackTitle.textContent = "Incorrect Answer!";
            feedbackText.textContent = "Please try again.";
            tryAgainButton.classList.remove("hidden");
            nextLevelButton.classList.add("hidden");

            playWrongAnswerAnimation();
        }
    }

    function playConfetti() {
        var scalar = 4;
        var particleCount = 150;
        var celebrationEmoji = confetti.shapeFromText({ text: '🎉', scalar });
        var partyPopperEmoji = confetti.shapeFromText({ text: '🎊', scalar });
        var threeEmoji = confetti.shapeFromText({ text: '3️⃣', scalar });
        var zeroEmoji = confetti.shapeFromText({ text: '0️⃣', scalar });
        confetti({
            shapes: [threeEmoji, zeroEmoji, celebrationEmoji, partyPopperEmoji],
            scalar,
            particleCount,
            origin: {
              x: 0.5,
              y: 0.75
          },
        });
    }

    function startTimer() {
        intervalID = setInterval(() => {
            totalElapsedTime++;
            elapsedTimeDisplay.textContent = `⏰ ${formatTime(totalElapsedTime)}`;
        }, 1000);
    }

    function stopTimer() {
        clearInterval(intervalID);
    }

    function formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return minutes > 0
            ? `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`
            : `${remainingSeconds}`;
    }

    function endGame() {
        questionContainer.classList.add("hidden");
        leaderboardContainer.classList.remove("hidden");
        congratsMessage.classList.remove("hidden");
        document.getElementById("winner-name").textContent = playerName;

        stopTimer();

        leaderboard.push({ name: playerName, time: totalElapsedTime, restarts: restartCount });
        leaderboard.sort((a, b) => a.time - b.time);

        const leaderboardList = document.getElementById("leaderboard");
        leaderboardList.innerHTML = "";
        leaderboard.forEach((entry, index) => {
            const listItem = document.createElement("li");
            listItem.innerHTML = `${index + 1}. 👤 ${entry.name} - ⏰ ${formatTime(entry.time)} - 🔄 ${entry.restarts}`;
            leaderboardList.appendChild(listItem);
        });
    }

    function playWrongAnswerAnimation() {
        const emojis = ["😭",];
        const confettiContainer = document.createElement("div");
        confettiContainer.style.position = "fixed";
        confettiContainer.style.top = "0";
        confettiContainer.style.left = "0";
        confettiContainer.style.width = "100%";
        confettiContainer.style.height = "100%";
        confettiContainer.style.pointerEvents = "none";
        confettiContainer.style.overflow = "hidden";
        confettiContainer.style.zIndex = "9999";
        document.body.appendChild(confettiContainer);
    
        const totalEmojis = 80;
        const animationDuration = 2500;
    
        for (let i = 0; i < totalEmojis; i++) {
            const emoji = document.createElement("span");
            emoji.textContent = emojis[Math.floor(Math.random() * emojis.length)];
            emoji.style.position = "absolute";
            emoji.style.fontSize = `${Math.random() * 30 + 16}px`;
            emoji.style.top = `${Math.random() * 40 - 50}%`;
            emoji.style.left = `${Math.random() * 100}%`;
            emoji.style.opacity = "0";
            emoji.style.transition = `transform ${animationDuration}ms ease-out, opacity ${animationDuration}ms ease-out`;
            confettiContainer.appendChild(emoji);
    
            requestAnimationFrame(() => {
                emoji.style.transform = `translateY(140vh) rotate(${Math.random() * 360}deg)`;
                emoji.style.opacity = "1";
            });
    
            setTimeout(() => {
                emoji.remove();
            }, animationDuration);
        }
    
        setTimeout(() => {
            confettiContainer.remove();
        }, animationDuration);
    }

});
