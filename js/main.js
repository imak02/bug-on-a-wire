document.getElementById("play-button").addEventListener("click", function () {
  document.getElementById("menu").style.display = "none";
  document.getElementById("main-game").style.display = "block";

  const canvas = document.getElementById("main-game");
  const ctx = canvas.getContext("2d");

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const logImage = new Image();
  logImage.src = "assets/img/log.png";

  const insectSprite = new Image();
  insectSprite.src = "assets/img/insectSprite.png";

  const poleImage = new Image();
  poleImage.src = "assets/img/pole.png";

  const chickenSprite = new Image();
  chickenSprite.src = "assets/img/chickenSprite.png";

  const backgroundMusic = new Audio("assets/sounds/background.mp3");
  const moveSound = new Audio("assets/sounds/move.wav");
  const collisionSound = new Audio("assets/sounds/collision.wav");

  let imagesLoaded = 0;

  function imageLoaded() {
    imagesLoaded++;
    if (imagesLoaded === 4) {
      startGame();
    }
  }

  logImage.addEventListener("load", imageLoaded);
  insectSprite.addEventListener("load", imageLoaded);
  poleImage.addEventListener("load", imageLoaded);
  chickenSprite.addEventListener("load", imageLoaded);

  const spriteWidth = 128;
  const spriteHeight = 128;
  const totalFrames = 8;
  let currentFrame = 0;
  const insectX = 100;
  let insectYIndex = 1;
  let poleX = canvas.width;
  let lastFrameTime = 0;
  const frameInterval = 1000 / 5;

  const logImageHeight = 20;
  const logPositions = [200, 400, 600];

  const chickenFrameWidth = 32;
  const chickenFrameHeight = 32;
  const chickenTotalFrames = 4;
  let chickenFrameInterval = 1000 / 5;
  let chickenLastFrameTime = 0;

  let chickens = [];
  const maxChickens = 6;

  let gameOver = false;

  let score = 0;
  let highScore = localStorage.getItem("highScore") || 0;

  document.addEventListener("keydown", (event) => {
    if (gameOver && event.code === "Enter") {
      restartGame();
    } else if (!gameOver) {
      if (event.code === "ArrowUp") {
        moveUp();
      } else if (event.code === "ArrowDown") {
        moveDown();
      }
    }
  });

  function moveUp() {
    if (insectYIndex > 0) {
      insectYIndex--;
      moveSound.currentTime = 0;
      moveSound.play();
    }
  }

  function moveDown() {
    if (insectYIndex < logPositions.length - 1) {
      insectYIndex++;
      moveSound.currentTime = 0;
      moveSound.play();
    }
  }

  function drawLogs() {
    const logImageX = -400;
    const logImageWidth = canvas.width * 2;

    logPositions.forEach((y) => {
      ctx.drawImage(logImage, logImageX, y, logImageWidth, logImageHeight);
    });
  }

  function drawPole() {
    ctx.drawImage(poleImage, poleX, 100, poleImage.width / 2, canvas.height);
  }

  function updatePole() {
    poleX -= 7;
    if (poleX + poleImage.width / 2 < 0) {
      poleX = canvas.width;
    }
  }

  function updateFrame() {
    currentFrame = (currentFrame + 1) % totalFrames;
  }

  function drawInsect() {
    const insectY = logPositions[insectYIndex];
    ctx.drawImage(
      insectSprite,
      currentFrame * spriteWidth,
      0,
      spriteWidth,
      spriteHeight,
      insectX,
      insectY - 50,
      spriteWidth,
      spriteHeight
    );
  }

  function drawChicken(chicken) {
    const chickenY = logPositions[chicken.yIndex];
    ctx.drawImage(
      chickenSprite,
      chicken.currentFrame * chickenFrameWidth,
      0,
      chickenFrameWidth,
      chickenFrameHeight,
      chicken.x,
      chickenY - 50,
      chickenFrameWidth * 2,
      chickenFrameHeight * 2
    );
  }

  function updateChicken(chicken, speed) {
    chicken.x -= speed;
    if (chicken.x + chickenFrameWidth * 2 < 0) {
      chicken.x = canvas.width;
      chicken.yIndex = Math.floor(Math.random() * logPositions.length);

      // Increase score when a chicken passes the canvas
      score++;
      if (score > highScore) {
        highScore = score;
        localStorage.setItem("highScore", highScore);
      }
    }
  }

  function updateChickenFrame(timestamp) {
    if (timestamp - chickenLastFrameTime > chickenFrameInterval) {
      chickens.forEach((chicken) => {
        chicken.currentFrame = (chicken.currentFrame + 1) % chickenTotalFrames;
      });
      chickenLastFrameTime = timestamp;
    }
  }

  function createChicken() {
    return {
      x: canvas.width,
      yIndex: Math.floor(Math.random() * logPositions.length),
      currentFrame: 0,
      speed: 5,
    };
  }

  function checkCollision() {
    const insectY = logPositions[insectYIndex];
    const insectRight = insectX + spriteWidth / 2 - 10;
    const insectBottom = insectY - 50 + spriteHeight / 2;

    chickens.forEach((chicken) => {
      const chickenY = logPositions[chicken.yIndex];
      const chickenRight = chicken.x + chickenFrameWidth * 2;
      const chickenBottom = chickenY - 50 + chickenFrameHeight * 2;

      if (
        insectX < chickenRight &&
        insectRight > chicken.x &&
        insectY - 50 < chickenBottom &&
        insectBottom > chickenY - 50
      ) {
        collisionSound.play();
        gameOver = true;
      }
    });
  }

  function showGameOver() {
    ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const boxWidth = 600;
    const boxHeight = 300;
    const boxX = (canvas.width - boxWidth) / 2;
    const boxY = (canvas.height - boxHeight) / 2 - 40;

    ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
    ctx.shadowColor = "rgba(0, 0, 0, 0.5)";
    ctx.shadowBlur = 15;
    ctx.shadowOffsetX = 5;
    ctx.shadowOffsetY = 5;
    drawRoundedRect(ctx, boxX, boxY, boxWidth, boxHeight, 20);

    ctx.shadowColor = "transparent";

    ctx.fillStyle = "black";
    ctx.font = "48px 'Press Start 2P', cursive";
    ctx.textAlign = "center";
    ctx.shadowColor = "white";
    ctx.shadowBlur = 10;
    ctx.fillText("Game Over", canvas.width / 2, boxY + 80);

    ctx.font = "36px 'Press Start 2P', cursive";
    ctx.fillText(`Score: ${score}`, canvas.width / 2, boxY + 140);
    ctx.fillText(`High Score: ${highScore}`, canvas.width / 2, boxY + 180);

    ctx.font = "24px 'Press Start 2P', cursive";
    ctx.fillText("Press Enter to Restart", canvas.width / 2, boxY + 240);

    ctx.shadowColor = "transparent";
    ctx.shadowBlur = 0;

    backgroundMusic.pause();
  }

  function drawRoundedRect(ctx, x, y, width, height, radius) {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  }

  function animate(timestamp) {
    if (gameOver) {
      showGameOver();
      return;
    }

    ctx.shadowColor = "transparent";
    ctx.shadowBlur = 0;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawPole();
    updatePole();
    drawLogs();

    chickens.forEach((chicken) => {
      updateChicken(chicken, chicken.speed);
      drawChicken(chicken);
    });

    updateChickenFrame(timestamp);

    if (timestamp - lastFrameTime > frameInterval) {
      updateFrame();
      lastFrameTime = timestamp;
    }
    drawInsect();

    checkCollision();

    ctx.fillStyle = "white";
    ctx.font = "24px 'Press Start 2P', cursive";
    ctx.textAlign = "left";
    ctx.fillText(`Score: ${score}`, 20, 40);
    ctx.fillText(`High Score: ${highScore}`, 20, 80);

    // Schedule next frame
    requestAnimationFrame(animate);
  }

  function increaseSpeed() {
    chickens.forEach((chicken) => {
      chicken.speed += 0.3;
    });
  }

  function startGame() {
    backgroundMusic.currentTime = 0;
    backgroundMusic.loop = true;
    backgroundMusic.play();

    gameOver = false;
    requestAnimationFrame(animate);

    setInterval(increaseSpeed, 3000);

    spawnChicken();
  }

  function spawnChicken() {
    if (!gameOver && chickens.length < maxChickens) {
      chickens.push(createChicken());
    }

    const randomInterval = Math.random() * 2000 + 2000;
    setTimeout(spawnChicken, randomInterval);
  }

  function restartGame() {
    chickens = [];
    score = 0;
    currentFrame = 0;
    chickenCurrentFrame = 0;
    lastFrameTime = 0;
    chickenLastFrameTime = 0;
    insectYIndex = 1;
    poleX = canvas.width;

    startGame();
  }
});
