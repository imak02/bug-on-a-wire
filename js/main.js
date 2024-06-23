document.getElementById("play-button").addEventListener("click", function () {
  document.getElementById("menu").style.display = "none";
  document.getElementById("main-game").style.display = "block";

  const canvas = document.getElementById("main-game");
  const ctx = canvas.getContext("2d");

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const logImage = new Image();
  logImage.src = "../assets/img/log.png";

  const insectSprite = new Image();
  insectSprite.src = "../assets/img/insectSprite.png";

  const poleImage = new Image();
  poleImage.src = "../assets/img/pole.png";

  const chickenSprite = new Image();
  chickenSprite.src = "../assets/img/chickenSprite.png";

  const backgroundMusic = new Audio("../assets/sounds/background.mp3");
  const moveSound = new Audio("../assets/sounds/move.wav");
  const collisionSound = new Audio("../assets/sounds/collision.wav");

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

  document.addEventListener("keydown", (event) => {
    if (event.code === "ArrowUp") {
      moveUp();
    } else if (event.code === "ArrowDown") {
      moveDown();
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

  function animate(timestamp) {
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

    // Schedule next frame
    requestAnimationFrame(animate);
  }

  function startGame() {
    backgroundMusic.currentTime = 0;
    backgroundMusic.loop = true;
    backgroundMusic.play();

    requestAnimationFrame(animate);
    spawnChicken();
  }

  function spawnChicken() {
    if (chickens.length < maxChickens) {
      chickens.push(createChicken());
    }

    const randomInterval = Math.random() * 2000 + 2000;
    setTimeout(spawnChicken, randomInterval);
  }
});
