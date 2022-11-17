// Idea and logic is based on https://natureofcode.com/book/chapter-7-cellular-automata/
// Specifics of ruleset and visuals are my own

let cells = [];
let gridSize = 50; // Must fit well into canvas size
let cellSize;
let currentCell;

function setup() {
  createCanvas(500, 500);
  cellSize = width / gridSize;
  frameRate(30);

  createGrid();
  noStroke();
}

function draw() {
  for (let row = 0; row < cells.length; row++) {
    for (let column = 0; column < cells[0].length; column++) {
      cells[row][column].state = cells[row][column].calculateNext();
    }
  }
  showAll();
}

function createGrid() {
  for (let row = 0; row < gridSize; row++) {
    cells.push([]);
    for (let column = 0; column < gridSize; column++) {
      cells[row].push(new Cell(row, column));
    }
  }
}

function showAll() {
  for (let row = 0; row < cells.length; row++) {
    for (let column = 0; column < cells[0].length; column++) {
      cells[row][column].render();
      cells[row][column].pastState = cells[row][column].state;
    }
  }
}

class Cell {
  constructor(row, column, state = Math.round(random())) {
    this.arrayRow = row;
    this.arrayColumn = column;
    this.x = row * cellSize;
    this.y = column * cellSize;
    this.state = state;
    this.pastState = state;
    this.color = ((row + column) / (gridSize * 2)) * 255;
  }

  render() {
    // Determine Fill
    if (this.pastState == 0 && this.state == 1) {
      // Birth
      //fill(0, 255, 0);
      fill(this.color, 0, this.color);
    } else if (this.pastState == 1 && this.state == 0) {
      // Death
      //fill(255, 0, 0);
      fill(255);
    } else if (this.state == 0) {
      // Off
      fill(255);
    } else {
      // On
      fill(this.color, 0, this.color);
    }
    // Draw shape
    rect(this.x, this.y, cellSize);
  }

  calculateNext() {
    // Check if cell is an edge
    if (
      this.arrayRow === 0 ||
      this.arrayRow === gridSize - 1 ||
      this.arrayColumn === 0 ||
      this.arrayColumn === gridSize - 1
    ) {
      return 0;
    }

    // Count neighbors
    let neighbors = 0;
    for (let i = -1; i <= 1; i++) {
      for (let j = -1; j <= 1; j++) {
        neighbors += cells[this.arrayRow + i][this.arrayColumn + j].pastState;
      }
    }
    neighbors -= this.pastState;

    if (this.pastState == 1 && neighbors < 2) {
      return 0;
    } else if (this.pastState == 1 && neighbors > 3) {
      return 0;
    } else if (this.pastState == 0 && neighbors == 3) {
      return 1;
    } else {
      return this.state;
    }
  }
}
