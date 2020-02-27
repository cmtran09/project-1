![General Assembly](images/ga&#32;logo.png)
# Project 1 - Vanilla Tetris

## Overview
Tetris is a puzzle game originally designed by Alexey Pajitnov and was released on June 6, 1984. The game requires players to strategically move, rotate and drop a random sequence of Tetriminos into a grid at increasing speeds. Players attempt to accrue as many points as possible each time they clear a line, done by creating horizontal rows of blocks without any gaps. The game ends if a Tetrimino surpasses the upper limit of the grid.

This was my first project from General Assembly’s Software Engineering Immersive Course. It was an individual project where I decided to create a clone of Tetris using purely Vanilla Javascript, HTML5 and CSS3 in a week. 


![Tetris Clone](images/tetris&#32;gif&#32;640px&#32;low.gif)

<img align="center" src="https://github.com/cmtran09/project-1-vanillaJS-tetris/blob/development/images/tetris%20gif%20640px%20low.gif?raw=true" />

You can launch the game on [GitHub Pages](https://cmtran09.github.io/project-1-vanillaJS-tetris/), or check out the [Repo](https://github.com/cmtran09/project-1-vanillaJS-tetris).

## Brief
* Render a game in the browser
* Switch turns between two players
* Design logic for winning & visually display which player won
* Include separate HTML / CSS / JavaScript files
* Stick with KISS (Keep It Simple Stupid) and DRY (Don't Repeat Yourself) principles
* Use Javascript for DOM manipulation
* Deploy your game online, where the rest of the world can access it
* Use semantic markup for HTML and CSS (adhere to best practices)
* The game should stop if a Tetrimino fills the highest row of the game board
* The player should be able to rotate each Tetrimino about its own axis
* If a line is completed it should be removed and the pieces above should take its place

## Technologies Used
* HTML5 with HTML5 audio
* CSS3 with animation
* JavaScript (ES6)
* Git
* GitHub
* Google Fonts

## Approach Taken
### The Grid
My approach to creating the grid the game would be played on was to create a div with the class name ```tetris-board``` and populate this with smaller divs that represent the individual squares that make up the grid. An additional row that will act like the floor is added to the bottom of the grid to assist in handling some of the game logic.

To achieve this I first created a 2-dimensional array called ```tetrisArena``` using the desired grid height and grid width.  Each element in this array that will represent a grid square is assigned the value 0.  

```js
  let height = 20;
  let width = 10;

  const tetrisArena = [...Array(height)].map(() => Array(width).fill(0));
```
A row is then added to the end of the ```tetrisArena``` array using the ```.push``` method. All elements in this row have the value 1.

```js
  tetrisArena.push([...Array(width).fill(1)]);
```

The ```drawArena``` function loops through the ```tetrisArena``` array, each time the function encounters the value 0 it adds a div with the class ```square``` and ```poistionnumber``` into the parent ```tetris-board``` div. When the function encounters the value 1, it adds a div with the class ```the-floor``` and ```hidden``` into the parent ```tetris-board``` div.
```js

  const tetrisBoard = document.querySelector(".tetris-board");

  //create arena on html
  function drawArena() {
    tetrisBoard.innerHTML = "";
    for (let i = 0; i < tetrisArena.length; i++) {
      for (let j = 0; j < tetrisArena[i].length; j++)
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
```
### The Tetriminos
I decided to assign each of the Tetriminoes to an array, each of these arrays can be split into three parts. The first being where each block that makes up the tetromino shall be drawn relative to the height and width of the grid. The second being the four possible rotations of the tetrominoes and lastly the colour of the tetrinimno.
```js
  const jTetrimino = [
    [2, width + 2, 2 * width + 1, 2 * width + 2],
    [width, 2 * width, 2 * width + 1, 2 * width + 2],
    [0, 1, width, width * 2],
    [0, 1, 2, width + 2],
    ["blue"]
  ];
```
I found it particularly difficult visualising and coding each tetromino and their possible rotations, to aid this I used Excel and drew out a table.  

![Tetriminos](images/Screenshot&#32;Tetriminos&#32;Rotations&#32;.png)

### Moving the Tetriminos
The user can move the tetromino left, right and down inside the grid using the arrow keys. To avoid the tetromino moving beyond grid boundaries or moving through frozen tetriminoes, I included checking logic that is run each time the user moves the tetromino in either direction.

Each time the Left key is pressed the boolean variable ```isAtLeftEdge``` is determined. If the ```currentTetrimino``` is not at the left grid boundary, ```isAtLeftEdge``` is false and the tetromino moves left. If ```isAtLeftEdge``` is true the tetromino will not be able to move further left. 

```js
  function moveLeft() {
    clear();
    const isAtLeftEdge = currentTetrimino.some(index => (position + index) % width === 0);
    if (!isAtLeftEdge) {
      position -= 1;
    ...
    }
```

Moving right uses the same fundamental logic

```js
function moveRight() {
    clear();
    const isAtRightEdge = currentTetrimino.some(index => (position + index) % width === width - 1);
    if (!isAtRightEdge) {
      position += 1;
    ...
}
```

### Freezing the Tetriminos
When a tetromino lands at the bottom of the grid or another frozen tetromino it should freeze in place and become inactive. To do this I created a function that is run each time the ```currentTetrimino``` moves down a row.  

This function uses the ```.some``` array method to check if any of the ```currentTetrimino``` blocks in the row below contains the class of ```.the-floor``` or ```.freeze```.  If this returns false the ```currentTetrimino``` is still able to move further downwards if true the ```currentTetrimino``` is frozen into place.

```js
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
    ...
}
```

### Clearing Rows
Each time a row in the grid contains frozen blocks with no gaps that row should be cleared and all the pieces above should take its place.  My approach to implementing this logic into my code was to run the ```updateScore``` function each time a tetromino is frozen into place.

```js
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
```

## Bugs
When a tetromino is at either the left or right grid boundary and is rotated, the tetromino will split into two, one half appending itself to the opposite side of the grid. To debug this I would implement similar checking logic as my ```moveLeft``` and ```moveRight``` functions.  I will not allow the tetromino to rotate if it lies at either boundary or next to a frozen block.

## Winners and Blockers
Despite not being completely satisfied with the final version of the game I produced in the original week, I learnt huge amounts of debugging and solving problems encountered during the journey.  The key three being pseudocoding and using diagrams before any hard coding to aid visualisation and know what the problems I will likely face will be.  Lastly implementing the various new array methods that I have not used before and using the Mozilla MDN web docs as a reference.  


## Future Content
* Persistent leaderboard using ```localStorage``` 
* Responsive design
* Next tetrimiono display
* Instant drop button 
* Let user set grid dimensions 
