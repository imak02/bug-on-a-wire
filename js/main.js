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

  function animate(timestamp) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawPole();
    updatePole();
    drawLogs();

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

    gameOver = false;
    requestAnimationFrame(animate);
  }
});
