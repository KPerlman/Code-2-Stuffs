// Kyle Perlman
// Flappy Bird
// Font from https://www.fontspace.com/flappy-bird-font-f21349

// Enable to turn on autoplay
let autoPlay = true;
// Enable to see details for autoplay
let showAutoPlay = true;

let cloudSizes = [];
let hillSizes = [];
let font;
let gameRunning = true;
let pipes = [];

function preload() {
  font = loadFont('font.ttf');
}

function setup() {
  createCanvas(500, 500);
  noStroke();
  // Generate background size arrays
  for (let i = 0; i < 10; i++) {
    cloudSizes.push(random(70, 100))
    hillSizes.push(random(50, 75))
  }
  textFont(font, 60)
  textAlign(CENTER);
  
  scoreboard = new Scoreboard();
  bird = new Bird();
  for (let i = 1; i < 4; i++) {
    pipes.push(new Pipe(Math.round(((1.7*width/3) * i) + 500)));
  }
}

function draw() {
  background(123,197,205);
  drawBackdrop();
  bird.applyGravity();
  bird.render();
  for (let i = 0; i < 3; i++) {
    pipes[i].render();
  }
  if (!gameRunning) {
    scoreboard.showBoard();
    bird.jumpHeight = bird.speed; // Kill bird
  } else {
    stroke(83,56,70);
    fill(255);
    text(scoreboard.score, width/2, 50);
    for (let i = 0; i < 3; i++) {
      pipes[i].checkCollision(bird, scoreboard);
      pipes[i].move();
    if (autoPlay) {
      bigBrain();
    }
    }
  }
}

function bigBrain() {
  for (let i = 0; i < 3; i++) {
      if (pipes[i].pos > 150 && pipes[i].pos < 400) {
        pipes[i].selected = true;
        if (bird.pos > pipes[i].openingHeight+130) {
          bird.speed = bird.jumpHeight;
        }
      } else {
        pipes[i].selected = false;
        if (bird.pos > 350) {
            bird.speed = bird.jumpHeight;
        }
      }
      
    }
}

function drawBackdrop() {
  // Draw Clouds
  noStroke();
  fill(226,240,210);
  for (let i = 0; i < 10; i++) { // Shadows
    circle(i*50+25, 321, cloudSizes[i]);
  }
  fill(235,253,219);
  rect(0, 325, width);
  for (let i = 0; i < 10; i++) { // Clouds
    circle(i*50+25, 325, cloudSizes[i]);
  }
  // Draw Buildings
  fill(226,240,210);
  for (let i = 0; i < 3; i++) { // Shadows
    rect(i*165+5, 350, 30, 100);
    rect(i*165+25, 340, 30, 100);
    rect(i*165+55, 320, 30, 100);
    rect(i*165+115, 330, 10, 100);
    rect(i*165+125, 355, 30, 100);
  }
  stroke(163,215,218);
  strokeWeight(2);
  fill(219,242,201);
  for (let i = 0; i < 3; i++) { // Buildings
    rect(i*165+25, 350, 30, 100);
    rect(i*165+45, 340, 30, 100);
    rect(i*165+75, 320, 30, 100);
    rect(i*165+105, 330, 10, 100);
    rect(i*165+105, 355, 30, 100);
  }
  // Draw Hills
  fill(137,230,139);
  strokeWeight(4);
  stroke(121,202,135);
  for (let i = 0; i < 10; i++) {
    circle(i*50+25, 400, hillSizes[i]);
  }
  noStroke();
  rect(0, 390, width);
  // Draw Floor
  fill(219,218,150);
  rect(0, height-75, width, 75);
  fill(210,169,79);
  rect(0, height-79, width, 4);
  fill(119,194,44);
  rect(0, height-89, width, 10)
}

function mouseClicked() {
  bird.speed = bird.jumpHeight;
}

function keyPressed() {
  if (keyCode === UP_ARROW) {
    bird.speed = bird.jumpHeight;
  }
}

class Bird {
  constructor() {
    this.pos = height/3;
    this.jumpHeight = 7;
    this.speed = 0;
  }
  
  render() {
    strokeWeight(3);
    stroke(83,56,70);
    fill(250,241,35);
    ellipse(width/2, this.pos, 50, 40); // Fill
    fill(255);
    ellipse(width/2+11, this.pos-6, 20, 20); // Eye Fill
    fill(253,104,75);
    ellipse(width/2+15, this.pos+10, 35, 15); // Mouth Fill
    fill(250,252,233);
    ellipse(width/2-23, this.pos+1, 28, 22); // Wing Fill
    fill(83,56,70);
    noStroke();
    ellipse(width/2+15, this.pos-6, 5, 10); // Pupil
    rect(width/2+5, this.pos+8, 28, 4); // Lips
    
    //Show Hitbox
    /*
    strokeWeight(2);
    stroke(0, 0, 255);
    fill(0, 0, 255, 50);
    rect(width/2 - 25, this.pos-20, 50, 40)
    */
  }
  
  applyGravity() {
    if (this.pos < 389) {
      this.speed -= 0.3+(Math.abs(this.speed/50));
      this.pos -= this.speed;
    } else {
      this.pos = 389;
      gameRunning = false;
    }
  }
}

class Pipe {
  constructor(pos) {
    this.pos = pos;
    this.openingHeight = random(50, 200);
    this.selected = false;
  }
  
  render() {
    fill(117,190,47);
    stroke(83,56,70);
    rect(this.pos, 0, 70, this.openingHeight);
    rect(this.pos-5, this.openingHeight, 80, 35);
    rect(this.pos, this.openingHeight+200, 70, 209-this.openingHeight);
    rect(this.pos-5, this.openingHeight+165, 80, 35);
    
    noStroke();
    rect(this.pos+2, 0, 66, 5); // Cover top stroke
    rect(this.pos+2, 406, 66, 5);
    fill(158,234,87);
    rect(this.pos+2, 0, 15, this.openingHeight-2);
    rect(this.pos-3, this.openingHeight+2, 10, 31);
    rect(this.pos+2, this.openingHeight+202, 15, 209-this.openingHeight);
    rect(this.pos-3, this.openingHeight+167, 10, 31);
    fill(84,129,35);
    rect(this.pos+62, 0, 6, this.openingHeight-2);
    rect(this.pos+68, this.openingHeight+2, 5, 31);
    rect(this.pos+62, this.openingHeight+202, 6, 209-this.openingHeight);
    rect(this.pos+68, this.openingHeight+167, 5, 31);

    // Show Hitbox
    if (this.selected && showAutoPlay) {
      strokeWeight(2);
      stroke(0, 0, 255);
      fill(0, 0, 255, 50);
      rect(this.pos-5, 0, 80, this.openingHeight+35);
      rect(this.pos-5, this.openingHeight+167, 80, 244-this.openingHeight);
      line(0, this.openingHeight+130, 500, this.openingHeight+130)
    }
  }
  
  checkCollision(bird, scoreboard) {
    if (this.pos < width/2+25 && this.pos > width/2-105) { // Define horizontal hitboxes
      if (bird.pos < this.openingHeight + 55 || bird.pos > this.openingHeight+167) { // Define vertical hitboxes
        gameRunning = false;
      }
    } else if (this.pos > width/2-110 && this.pos <= width/2-107) {
        scoreboard.score += 1;
    }
  }
  
  move() {
    this.pos -= 3;
    if (this.pos < -width/5) {
      this.pos = 1.5*width;
      this.openingHeight = random(50, 200);
    }
  }
}

class Scoreboard {
  constructor() {
    this.score = 0;
    this.pos = 2*height;
    this.headerTransparency = 0
  }
  showBoard() {
    if (this.pos > height/3) {
        this.pos -= 8;
    }
    this.headerTransparency += 5;
    fill(219,218,150);
    stroke(83,56,70);
    textSize(60);
    rect(width/2-150, this.pos, 300, 150);
    fill(255);
    text("SCORE", width/2, this.pos + 50);
    text(this.score, width/2, this.pos + 115);
    fill(83,56,70);
    rect(width/2-100, this.pos+60, 200, 3)
    
    fill(245,186,24,this.headerTransparency);
    stroke(83,56,70,this.headerTransparency);
    textSize(96);
    text("GAME OVER", width/2, height/3 - 40)
  }
}