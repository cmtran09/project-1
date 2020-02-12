document.addEventListener("DOMContentLoaded", () => {
  const welcomeCow = document.querySelector(".welcome-cow");
  const startYesBtn = document.querySelector(".start-game");
  const terisAscii = document.querySelector(".tetris-into");
  const cowAscii = document.querySelector(".cow");
  const mainElement = document.querySelector("main");
  const gameDisplay = document.querySelector(".outermost");

  const gameoverAscii = document.querySelector("gameoverCowGraphic");

  const tetrisAudio = document.querySelector(".tetrisAudio");
  // tetrisAudio.src = "/sounds/TEtris sound.mp3";

  const movementAudio = document.querySelector(".movementAudio");
  movementAudio.src = "/sounds/action.wav";

  let points = 0;
  let lines = 0;

  startYesBtn.addEventListener("click", () => {
    // welcomeCow.classList.add("colorChange");
    welcomeCow.classList.remove("slide-in-right");
    welcomeCow.classList.add("slide-out-bottom");
    terisAscii.classList.add("slide-l-r-Out");
    cowAscii.classList.add("colourChange");
    console.log("added");
    //PLAY TETRIS MUSIC
    setTimeout(() => {
      tetrisAudio.play();
    }, 500);
    bringInGame();
  });

  const bringInGame = () => {
    setTimeout(() => {
      mainElement.classList.remove("hidden");
      setTimeout(() => {
        gameDisplay.classList.add("fadeIn");
      }, 1000);
      tetrisCountDown();
    }, 16000);
  };

  const tetrisCountDown = () => {
    setTimeout(() => {
      gameloop();
    }, 6000);
  };

  const height = 20;
  const width = 10;

  //  create an array grid with height and witdth, each cell with the value 0
  const tetrisArena = [...Array(height)].map(() => Array(width).fill(0));
  //  add a row of the value 1 at the bottom
  tetrisArena.push([...Array(width).fill(1)]);
  console.log(tetrisArena);

  const tetrisBoard = document.querySelector(".tetris-board");

  //create arena on html
  const drawArena = () => {
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
  };
  drawArena();

  let squares = Array.from(tetrisBoard.querySelectorAll("div"));
  console.log(squares);

  //THE TETROMINO BLOCKS EACH WITH 90Ddeg ROTATION AND THEIR OWN COLOUR
  const iTetrimino = {
    matrix: [
      [1, width + 1, 2 * width + 1, 3 * width + 1],
      [width, width + 1, width + 2, width + 3],
      [1, width + 1, 2 * width + 1, 3 * width + 1],
      [width, width + 1, width + 2, width + 3]
    ],
    color: "cyan"
  };
  const jTetrimino = {
    matrix: [
      [2, width + 2, 2 * width + 1, 2 * width + 2],
      [width, 2 * width, 2 * width + 1, 2 * width + 2],
      [0, 1, width, width * 2],
      [0, 1, 2, width + 2]
    ],
    color: "blue"
  };
  const lTetrimino = {
    matrix: [
      [1, width + 1, 2 * width + 1, 2],
      [width, width + 1, width + 2, 2 * width + 2],
      [1, width + 1, 2 * width + 1, 2 * width],
      [width, 2 * width, 2 * width + 1, 2 * width + 2]
    ],
    color: "orange"
  };
  const sTetrimino = {
    matrix: [
      [1, 2, width, width + 1],
      [1, width + 1, width + 2, 2 * width + 2],
      [width + 1, width + 2, 2 * width, 2 * width + 1],
      [0, width, width + 1, 2 * width + 1]
    ],
    color: "green"
  };
  const zTetrimino = {
    matrix: [
      [0, 1, width + 1, width + 2],
      [2, width + 1, width + 2, 2 * width + 1],
      [width, width + 1, 2 * width + 1, 2 * width + 2],
      [0, width, width + 1, 2 * width + 1]
    ],
    color: "red"
  };
  const tTetrimino = {
    matrix: [
      [1, width, width + 1, width + 2],
      [1, width + 1, width + 2, 2 * width + 1],
      [width, width + 1, width + 2, 2 * width + 1],
      [1, width, width + 1, 2 * width + 1]
    ],
    color: "purple"
  };

  const oTetrimino = {
    matrix: [
      [0, 1, width, width + 1],
      [0, 1, width, width + 1],
      [0, 1, width, width + 1],
      [0, 1, width, width + 1]
    ],
    color: "yellow"
  };

  // Array containing all tetrominos
  const tetriminosArray = [
    [iTetrimino],
    [jTetrimino],
    [lTetrimino],
    [sTetrimino],
    [zTetrimino],
    [tTetrimino],
    [oTetrimino]
  ];

  //pull a random tertrimino from the teriminos array
  let currentRotation = 0;

  let randomIndex = Math.floor(Math.random() * tetriminosArray.length);
  let currentTetrimino = tetriminosArray[randomIndex][currentRotation];

  let position = Math.floor(width / 2) - 1;

  const randomTetrimino = () => {
    currentRotation = 0;
    randomIndex = Math.floor(Math.random() * tetriminosArray.length);
    currentTetrimino = tetriminosArray[randomIndex][0];
  };

  console.log("current Tet", currentTetrimino);
  console.log("ranmdcom", currentTetrimino.matrix[0]);

  //will always spawn brick center of the top of the grid
  let spawnPoint = Math.floor(width / 2) - 1;
  console.log("spawn", spawnPoint);

  const generate = () => {
    for (let i = 0; i < currentTetrimino.matrix[0].length; i++) {
      squares[position + currentTetrimino.matrix[0][i]].classList.add("block");
      // console.log(currentTetrimino.color);
      //add classlist of colour
      squares[position + currentTetrimino.matrix[0][i]].classList.add(currentTetrimino.color);
    }
  };

  const clear = () => {
    for (let i = 0; i < currentTetrimino.matrix[0].length; i++) {
      squares[position + currentTetrimino.matrix[0][i]].classList.remove("block");
      // console.log(currentTetrimino.color);
      //add classlist of colour
      squares[position + currentTetrimino.matrix[0][i]].classList.remove(currentTetrimino.color);
    }
  };

  generate();

  //change this
  let difficulty = 1000;

  const gameloop = () => {
    // gravity();
    clear();
    position += width;
    generate();
    // console.log("loop", currentRotation);
    stopTetrimino();
    gameOverCheck();

    setTimeout(gameloop, difficulty);
  };

  //   gameloop();

  console.log("matixtestos", currentTetrimino.matrix[currentRotation]);

  function stopTetrimino() {
    // if row beneath tetrimino has the class "the-floor" or 'freeze' freeze the tetrimino
    if (
      currentTetrimino.matrix[0].some(
        elem =>
          squares[position + elem + width].classList.contains("the-floor") ||
          squares[position + elem + width].classList.contains("freeze")
      )
    ) {
      // add freeze class
      currentTetrimino.matrix[0].forEach(elem => squares[elem + position].classList.add("freeze"));
      // start a new tetromino falling
      position = Math.floor(width / 2) - 1;
      randomTetrimino();
      removeShake();
      //   console.log("new teromino has rotatin", currentRotation);
      updateScore();
    }
  }

  // console.log("toppp check", squares[0]);

  //   function gameOverCheck() {
  //     if (squares.slice(0, 20).some(elem => elem.contains("freeze"))) {
  //       console.log("LLLLLLOPOOOOOOOSSSSSSEEEEEEEE");
  //       // gameoverAscii.classList.remove('hidden')
  //       alert("Game over");
  //     }
  //   }

  function gameOverCheck() {
    //loops throgh top row if 'freeze' class spotted aleart user gameover
    for (let i = 0; i < 20; i++) {
      if (squares[i].classList.contains("freeze") === true) {
        console.log("LLLLLLOPOOOOOOOSSSSSSEEEEEEEE");
        // gameoverAscii.classList.remove('hidden')
        alert("Game over");
      }
    }
  }

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

  function moveLeft() {
    clear();
    const isAtLeftEdge = currentTetrimino.matrix[0].some(index => (position + index) % width === 0);
    if (!isAtLeftEdge) {
      position -= 1;
    }

    if (
      currentTetrimino.matrix[0].some(index =>
        squares[position + index].classList.contains("block2")
      )
    ) {
      position += 1;
    }
    generate();
  }

  const moveRight = () => {
    clear();
    const isAtRightEdge = currentTetrimino.matrix[0].some(
      index => (position + index) % width === width - 1
    );
    if (!isAtRightEdge) {
      position += 1;
    }

    if (
      currentTetrimino.matrix[0].some(index =>
        squares[position + index].classList.contains("freeze")
      )
    ) {
      position -= 1;
    }
    generate();
  };

  // undraw()
  //     currentRotation++
  //     if (currentRotation === current.length) {
  //         currentRotation = 0
  //     }
  //     current = theTetrominoes[random][currentRotation]
  //     draw()

  //===================current roation never goes to 0
  const rotate90 = () => {
    clear();
    currentRotation++;
    console.log("current rotation", currentRotation);
    // if (currentRotation === currentTetrimino.matrix[0].length)
    if (currentRotation === currentTetrimino.matrix[0].length) {
      currentRotation = 0;
      //   clear();
      //   generate();
      //   return;
    }
    currentTetrimino.matrix[0] = currentTetrimino.matrix[currentRotation];
    generate();
  };

  const moveDown = () => {
    clear();
    if (
      currentTetrimino.matrix[0].some(
        elem =>
          squares[position + elem + width].classList.contains("the-floor") === true ||
          squares[position + elem + width].classList.contains("freeze") === true
      )
    ) {
      return;
    }
    position += width;
    console.log("check", squares.slice(0, 20));
    generate();
    stopTetrimino();
  };

  const pointsDis = document.querySelector(".points p");
  pointsDis.innerHTML = `${points}`;

  console.log("TESTYYYY", pointsDis);

  const linesDis = document.querySelector(".lines p");
  linesDis.textContent = ` ${lines}`;

  const increaseDifficulty = () => {
    if (lines % 2 === 0) {
      difficulty /= 2;
      console.log("speed increased");
    }
  };

  const addShake = () => {
    pointsDis.classList.add("shake");
    linesDis.classList.add("shake");
  };

  const removeShake = () => {
    pointsDis.classList.remove("shake");
    linesDis.classList.remove("shake");
  };

  const updateScore = () => {
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
        squares.forEach(cell => tetrisBoard.appendChild(cell));
      }
    }
  };
});
