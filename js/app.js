document.addEventListener("DOMContentLoaded", () => {
  const welcomeCow = document.querySelector(".welcome-cow");
  const startYesBtn = document.querySelector(".start-game");
  const terisAscii = document.querySelector(".tetris-into");
  const cowAscii = document.querySelector(".cow");
  const mainElement = document.querySelector("main");
  const gameDisplay = document.querySelector(".outermost");
  const muteBtn = document.querySelector(".mute");

  const gameoverAscii = document.querySelector(".gameoverCow");
  const cowGameOver = document.querySelector(".gameoverCowGraphic");

  const tetrisAudio = document.querySelector(".tetrisAudio");
  tetrisAudio.src = "/project-1-vanillaJS-tetris/sounds/TEtris sound.mp3";

  const movementAudio = document.querySelector(".movementAudio");
  movementAudio.src = "/project-1-vanillaJS-tetris/sound/action.wav";

  let points = 0;
  let lines = 0;

  const pointsDis = document.querySelector(".points p");
  pointsDis.innerHTML = `${points}`;

  console.log("TESTYYYY", pointsDis);

  const linesDis = document.querySelector(".lines p");
  linesDis.textContent = ` ${lines}`;

  let gameStatus;

  console.log("gamestatus", gameStatus);

  document.addEventListener("keydown", e => {
    // let kCode = e.keyCode
    if (e.keyCode === 37) {
      console.log("moveLeft");
      moveLeft();
      movementAudio.play();
    } else if (e.keyCode === 39) {
      console.log("moveRight");
      moveRight();
      movementAudio.play();
    } else if (e.keyCode === 40) {
      console.log("moveDown");
      moveDown();
      movementAudio.play();
    } else if (e.keyCode === 32) {
      console.log("instantDown");
      hardDrop();
      movementAudio.play();
    } else if (e.keyCode === 38) {
      console.log("rotate90");
      rotate90();
      movementAudio.play();
    }
  });

  function toggleMute() {
    console.log("toggleMute");
    if (tetrisAudio.muted == false && movementAudio.muted == false) {
      tetrisAudio.muted = true;
      movementAudio.muted = true;
    } else {
      tetrisAudio.muted = false;
      movementAudio.muted = false;
    }
  }

  muteBtn.addEventListener("click", () => {
    console.log("hi");
    toggleMute();
  });

  startYesBtn.addEventListener("click", () => {
    // welcomeCow.classList.add("colorChange");
    welcomeCow.classList.remove("slide-in-right");
    welcomeCow.classList.add("slide-out-bottom");
    terisAscii.classList.add("slide-l-r-Out");
    cowAscii.classList.add("colourChange");
    // muteBtn.classList.remove("hidden");
    muteBtn.classList.add("fadeIn");
    console.log("added");
    //PLAY TETRIS MUSIC
    setTimeout(() => {
      tetrisAudio.play();
    }, 500);
    bringInGame();
  });

  function bringInGame() {
    setTimeout(() => {
      mainElement.classList.remove("hidden");
      setTimeout(() => {
        gameDisplay.classList.add("fadeIn");
      }, 1000);
      tetrisCountDown();
    }, 16000);
  }

  const tetrisCountDown = () => {
    setTimeout(() => {
      gameloop();
    }, 6000);
  };

  let height = 20;
  let width = 10;

  //  create an array grid with height and witdth, each cell with the value 0
  const tetrisArena = [...Array(height)].map(() => Array(width).fill(0));
  //  add a row of the value 1 at the bottom
  tetrisArena.push([...Array(width).fill(1)]);
  console.log(tetrisArena);

  const tetrisBoard = document.querySelector(".tetris-board");

  //create arena on html
  function drawArena() {
    tetrisBoard.innerHTML = "";
    for (let i = 0; i < tetrisArena.length; i++) {
      // console.log(tetrisArena[i]);
      for (let j = 0; j < tetrisArena[i].length; j++)
        // console.log(tetrisArena[i][j]);
        if (tetrisArena[i][j] === 0) {
          //give each individual div (each are a squre in the html grid)
          tetrisBoard.innerHTML += `<div class='position${i * width + j} square'></div>`;
        } else if (tetrisArena[i][j] === 1) {
          // add the class 'floor' to bottom divs, those who have a value of 1
          // display none so not seen on screen
          tetrisBoard.innerHTML += `<div style="display:none" class='the-floor'></div>`;
        }
    }
  }
  drawArena();

  let squares = Array.from(tetrisBoard.querySelectorAll("div"));
  console.log(squares);

  //THE TETROMINO BLOCKS EACH WITH 90Ddeg ROTATION AND THEIR OWN COLOUR
  const iTetrimino = [
    [1, width + 1, 2 * width + 1, 3 * width + 1],
    [width, width + 1, width + 2, width + 3],
    [1, width + 1, 2 * width + 1, 3 * width + 1],
    [width, width + 1, width + 2, width + 3],
    ["cyan"]
  ];

  const jTetrimino = [
    [2, width + 2, 2 * width + 1, 2 * width + 2],
    [width, 2 * width, 2 * width + 1, 2 * width + 2],
    [0, 1, width, width * 2],
    [0, 1, 2, width + 2],
    ["blue"]
  ];

  const lTetrimino = [
    [1, width + 1, 2 * width + 1, 2 * width + 2],
    [1, 2, 3, width + 1],
    [2, 3, width + 3, 2 * width + 3],
    [2 * width + 1, 2 * width + 2, 2 * width + 3, width + 3],
    ["orange"]
  ];

  const sTetrimino = [
    [1, 2, width, width + 1],
    [1, width + 1, width + 2, 2 * width + 2],
    [width + 1, width + 2, 2 * width, 2 * width + 1],
    [0, width, width + 1, 2 * width + 1],
    ["green"]
  ];

  const zTetrimino = [
    [0, 1, width + 1, width + 2],
    [2, width + 1, width + 2, 2 * width + 1],
    [width, width + 1, 2 * width + 1, 2 * width + 2],
    [0, width, width + 1, 2 * width + 1],
    ["red"]
  ];

  const tTetrimino = [
    [1, width, width + 1, width + 2],
    [1, width + 1, width + 2, 2 * width + 1],
    [width, width + 1, width + 2, 2 * width + 1],
    [1, width, width + 1, 2 * width + 1],
    ["purple"]
  ];

  const oTetrimino = [
    [0, 1, width, width + 1],
    [0, 1, width, width + 1],
    [0, 1, width, width + 1],
    [0, 1, width, width + 1],
    ["yellow"]
  ];

  // Array containing all tetrominos
  const tetriminosArray = [
    iTetrimino,
    jTetrimino,
    lTetrimino,
    sTetrimino,
    zTetrimino,
    tTetrimino,
    oTetrimino
  ];

  let currentRotation = 0;

  //pull a random tertrimino from the teriminos array
  let randomIndex = Math.floor(Math.random() * tetriminosArray.length);
  let currentTetrimino = tetriminosArray[randomIndex][currentRotation];
  console.log("       current currentTetrimino", currentTetrimino);
  let tetrominoColour = tetriminosArray[randomIndex][4];

  let position = Math.floor(width / 2) - 1;

  //will always spawn brick center of the top of the grid
  let spawnPoint = Math.floor(width / 2) - 1;
  console.log("spawn", spawnPoint);

  function generate() {
    currentTetrimino.forEach(index => {
      squares[position + index].classList.add("block");
      //add classlist of colour
      squares[position + index].classList.add(tetrominoColour);
    });
  }

  function clear() {
    currentTetrimino.forEach(index => {
      squares[position + index].classList.remove("block");
      //remove classlist of colour
      squares[position + index].classList.remove(tetrominoColour);
    });
  }

  generate();

  //randomly select a tetrimino
  function randomTetrimino() {
    currentRotation = 0;
    randomIndex = Math.floor(Math.random() * tetriminosArray.length);
    currentTetrimino = tetriminosArray[randomIndex][currentRotation];
    // tetrominoColour = tetriminosArray[randomIndex][1];
    console.log("NEW", tetriminosArray[randomIndex]);
  }

  // console.log("ranmdcom", currentTetrimino[0]);

  //change this to speed the fall rate
  let difficulty = 1000;

  const gravity = () => {
    position += width;
  };

  function gameloop() {
    clear();
    gravity();
    generate();
    // console.log("loop", currentRotation);
    stopTetrimino();
    // gameOverCheck();

    gameStatus = setTimeout(gameloop, difficulty);
  }

  function endGameloop() {
    clearTimeout(gameStatus);
    cowGameOver.classList.add("slide-in-left");
    console.log("new gamestts", gameStatus);
  }

  console.log("matixtestos", currentTetrimino[currentRotation]);

  function stopTetrimino() {
    // if row beneath tetrimino has the class "the-floor" or 'freeze' freeze the tetrimino
    if (
      currentTetrimino.some(
        elem =>
          squares[position + elem + width].classList.contains("the-floor") ||
          squares[position + elem + width].classList.contains("freeze")
      )
    ) {
      // add freeze class
      currentTetrimino.forEach(elem => squares[elem + position].classList.add("freeze"));
      // start a new tetromino falling
      position = Math.floor(width / 2) - 1;
      randomTetrimino();
      tetrominoColour = tetriminosArray[randomIndex][4];
      console.log("      new tetrimino with roation ", currentRotation);
      removeShake();
      //   console.log("new teromino has rotatin", currentRotation);
      updateScore();
      gameOverCheck();
    }
  }
  stopTetrimino();

  // console.log("toppp check", squares[0]);

  function gameOverCheck() {
    let topRow = squares.slice(0, 20);
    if (topRow.some(elem => elem.classList.contains("freeze") === true)) {
      console.log("LLLLLLOPOOOOOOOSSSSSSEEEEEEEE");
      gameoverAscii.classList.remove("hidden");
      endGameloop();
      // alert("Game over");
    } else console.log("no");
  }

  function moveLeft() {
    clear();
    const isAtLeftEdge = currentTetrimino.some(index => (position + index) % width === 0);
    if (!isAtLeftEdge) {
      position -= 1;
    }
    if (currentTetrimino.some(index => squares[position + index].classList.contains("freeze"))) {
      position += 1;
    }
    generate();
  }

  function moveRight() {
    clear();
    const isAtRightEdge = currentTetrimino.some(index => (position + index) % width === width - 1);
    if (!isAtRightEdge) {
      position += 1;
    }
    if (currentTetrimino.some(index => squares[position + index].classList.contains("freeze"))) {
      position -= 1;
    }
    generate();
  }

  function rotate90() {
    clear();
    currentRotation++;
    if (currentRotation === 4) {
      currentRotation = 0;
    }
    currentTetrimino = tetriminosArray[randomIndex][currentRotation];
    generate();
  }

  function moveDown() {
    clear();
    if (
      currentTetrimino.some(
        elem =>
          squares[position + elem + width].classList.contains("the-floor") === true ||
          squares[position + elem + width].classList.contains("freeze") === true
      )
    ) {
      return;
    }
    position += width;
    // console.log("check", squares.slice(0, 20));
    generate();
    stopTetrimino();
  }

  function increaseDifficulty() {
    if (lines % 2 === 0) {
      difficulty /= 2;
      console.log("speed increased");
    }
  }

  function addShake() {
    pointsDis.classList.add("shake");
    linesDis.classList.add("shake");
  }

  function removeShake() {
    pointsDis.classList.remove("shake");
    linesDis.classList.remove("shake");
  }

  function updateScore() {
    //create and array for each row in the game board
    for (positionId = 0; positionId < 199; positionId += width) {
      const row = [
        positionId,
        positionId + 1,
        positionId + 2,
        positionId + 3,
        positionId + 4,
        positionId + 5,
        positionId + 6,
        positionId + 7,
        positionId + 8,
        positionId + 9
      ];
      //check if each array has all their elements filled with and element with the class freeze
      if (row.every(index => squares[index].classList.contains("freeze"))) {
        points += 10;
        lines += 1;
        addShake();
        // check if difficulty needs to be increased
        increaseDifficulty();
        pointsDis.innerHTML = points;
        linesDis.innerHTML = lines;
        row.forEach(index => {
          squares[index].style.backgroundImage = "none";
          squares[index].classList.remove("freeze") ||
            squares[index].classList.remove("blue") ||
            squares[index].classList.remove("orange") ||
            squares[index].classList.remove("green") ||
            squares[index].classList.remove("block") ||
            squares[index].classList.remove("red") ||
            squares[index].classList.remove("purple") ||
            squares[index].classList.remove("yellow") ||
            squares[index].classList.remove("cyan");
        });
        //splice array that have all the elements with the a class freeze and add another clear row, then bring everything down
        const squaresRemoved = squares.splice(positionId, width);
        squares = squaresRemoved.concat(squares);
        squares.forEach(elem => tetrisBoard.appendChild(elem));
      }
    }
  }
});
