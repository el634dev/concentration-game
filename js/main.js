// Represent each square and color
class BoardSquare {
    constructor(element, color) {
        this.element = element;
        // Add an event listner
        this.element.addEventListener("click", this, false);
        this.isFaceUp = false;
        this.isAMatch = false;
        this.setColor(color);
    }

    // handle event listener
    handleEvent(event) {
        switch (event.type) {
            case "click":
                if (this.isFaceUp || this.isAMatch) {
                    return;
                }

                this.isFaceUp = true;
                this.element.classList.add("flipped");

                squareFlipped(this);
        }
    }

    // Reset board
    reset() {
        this.isFaceUp = false;
        this.isAMatch = false;
        this.element.classList.remove("flipped");
    }

    // Handle case if a matching pair is found
    matchFound() {
        this.isFaceUp = true;
        this.isAMatch= true;
    }

    // Generate colors 
    setColor(color) {
        // Select elements with class name of faceup at index 0
        const faceUpElement = this.element.getElementsByClassName('faceup')[0];
        
        //remove the previous color if it exists
        faceUpElement.classList.remove(this.color);
        // Set color
        this.color = color;
        // Add colors
        faceUpElement.classList.add(color); 
    }
}

// Handle generating squares dynamically
function generateBoardSquares() {
    // Number of squares
    const numberOfSquares = 16;
    // Set squares to be empty
    let squaresHTML = "";

    // Generate Board Squares
    for (let i = 0; i < numberOfSquares; i += 1) {
        squaresHTML +=
            // add to <div> element
            '<div class="col-3 board-square">\n' +
            '<div class="face-container">\n' +
            '<div class="facedown"></div>\n' +
            '<div class="faceup"></div>\n' +
            '</div>\n' +
            '</div>\n';
    }

    // Select the div with the id of gameboard 
    const boardElement = document.getElementById('gameboard');
    // Insert board squares
    boardElement.innerHTML = squaresHTML;
}

generateBoardSquares();

// Empty array to hold the matching pairs
const colorPairs = [];

// Generate color pairs dynamically
function generateColorPairs() {
    if (colorPairs.length > 0) {
        return colorPairs;
    } else {
        // Generate matching pair for each color
        for (let i = 0; i < 8; i += 1) {
            colorPairs.push('color-' + i);
            colorPairs.push('color-' + i);
        }
        return colorPairs;
    }
}

// Fisher-Yates algo to do a random shuffle
function shuffle(array) {
    let currentIndex = array.length;
    let tempVal, randomIndex;

    // While there are remaining elements to shuffle
    while(0 !== currentIndex) {
        // Pick an element
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // Swap with the current element
        tempVal = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = tempVal;
    }
    return array;
} 

// Returns a shuffled array of matching color pairs
function shuffleColors() {
    const colorPairs = generateColorPairs()
    return shuffle(colorPairs);
}

let firstFaceUp = null;
// Handle squares that are flipped up and give flipped logic
function squareFlipped(square) {
    // Check for a null case
    if (firstFaceUp === null) {
        firstFaceUp = square;
        return
    }

    // Check if firstFaceUp's color is a match to a sqaure's color
    if (firstFaceUp.color === square.color) {
        firstFaceUp.matchFound();
        square.matchFound();

        firstFaceUp = null;
    } else {
        const upSquare = firstFaceUp;
        const matchingSquare = square;

        firstFaceUp = null;
        // Set a timeout
        setTimeout(function() {
            upSquare.reset();
            matchingSquare.reset();
        }, 400);
    }
}

// Handle clicks from clicking the reset button
const resetButton = document.getElementById("reset-button");
// Add an even listener
resetButton.addEventListener('click', () => {
    // reset the game
    resetGame();
});

// Empty array to hold board squares
const BoardSquares = [];

// Constant randomly shuffled color pairs
// Setup game board
function setupGame() {
    generateBoardSquares();

    const randomColorPairs = shuffleColors();
    // Get elements with the class of board-square
    const squareElements = document.getElementsByClassName("board-square");

    // Set each square and color
    for (let i = 0; i < squareElements.length; i += 1) {
        const element = squareElements[i];
        const color = randomColorPairs[i];

        const square = new BoardSquare(element, color)
        // Add to array
        BoardSquares.push(square)
    }
}

setupGame();

// Reset the game
function resetGame(){
    // Set firstUp to null
    firstFaceUp = null;

    // Loop through
    BoardSquares.forEach((square) => {
        square.reset()
    });

    // Set a timeout
    setTimeout(() => {
        // Shuffle colors
        const randomColorPairs = shuffleColors();

        // Loop through again
        for (let i = 0; i < BoardSquares.length; i += 1){
            const newColor = randomColorPairs[i];
            const square = BoardSquares[i];

            square.setColor(newColor);
        }
    }, 500);
}