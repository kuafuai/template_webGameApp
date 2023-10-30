class Game {
  constructor() {
    this.canvas = null; // The game canvas
    this.context = null; // The canvas context
    this.snake = null; // The snake object
    this.food = null; // The food object
    this.direction = null; // The current direction of the snake
    this.gameOver = false; // Flag to indicate if the game is over
    this.score = 0; // The player's score
    this.speed = 1; // The speed of the snake
  }

  // Initialize the game canvas and snake
  init() {
    this.canvas = document.getElementById("game-canvas");
    this.context = this.canvas.getContext("2d");
    this.snake = new Snake();
    this.food = new Food();
    this.direction = "right";
    this.gameOver = false;
    this.score = 0;
    this.speed = 1;
    this.draw();
    this.update();
  }

  // Draw the game canvas, snake, and food
  draw() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.snake.draw(this.context);
    this.food.draw(this.context);
  }

  // Update the game logic and check for collisions
  update() {
    if (!this.gameOver) {
      this.snake.move(this.direction);
      this.checkCollision();
      this.draw();
      setTimeout(() => this.update(), 1000 / this.speed);
    }
  }

  // Check for collisions with walls, snake body, and food
  checkCollision() {
    const head = this.snake.body[0];
    const { x, y } = head;

    // Check for collision with walls
    if (x < 0 || x >= this.canvas.width || y < 0 || y >= this.canvas.height) {
      this.gameOver = true;
      return;
    }

    // Check for collision with snake body
    for (let i = 1; i < this.snake.body.length; i++) {
      if (this.snake.body[i].x === x && this.snake.body[i].y === y) {
        this.gameOver = true;
        return;
      }
    }

    // Check for collision with food
    if (x === this.food.x && y === this.food.y) {
      this.snake.grow();
      this.score++;
      this.speed += 0.1;
      this.food.generate(this.canvas.width, this.canvas.height);
    }
  }

  // Handle keyboard input to change the snake's direction
  handleInput(event) {
    const key = event.key;
    if (key === "ArrowUp" && this.direction !== "down") {
      this.direction = "up";
    } else if (key === "ArrowDown" && this.direction !== "up") {
      this.direction = "down";
    } else if (key === "ArrowLeft" && this.direction !== "right") {
      this.direction = "left";
    } else if (key === "ArrowRight" && this.direction !== "left") {
      this.direction = "right";
    }
  }
}

// Define the snake object
class Snake {
  constructor() {
    this.body = [{ x: 0, y: 0 }]; // The body of the snake
  }

  // Move the snake in the specified direction
  move(direction) {
    const head = { ...this.body[0] };
    switch (direction) {
      case "up":
        head.y--;
        break;
      case "down":
        head.y++;
        break;
      case "left":
        head.x--;
        break;
      case "right":
        head.x++;
        break;
    }
    this.body.unshift(head);
    this.body.pop();
  }

  // Increase the length of the snake by adding a new segment
  grow() {
    const tail = { ...this.body[this.body.length - 1] };
    this.body.push(tail);
  }

  // Draw the snake on the canvas
  draw(context) {
    context.fillStyle = "green";
    this.body.forEach((segment) => {
      context.fillRect(segment.x * 10, segment.y * 10, 10, 10);
    });
  }
}

// Define the food object
class Food {
  constructor() {
    this.x = 0; // The x-coordinate of the food
    this.y = 0; // The y-coordinate of the food
  }

  // Generate a random position for the food within the canvas
  generate(canvasWidth, canvasHeight) {
    this.x = Math.floor(Math.random() * (canvasWidth / 10)) * 10;
    this.y = Math.floor(Math.random() * (canvasHeight / 10)) * 10;
  }

  // Draw the food on the canvas
  draw(context) {
    context.fillStyle = "red";
    context.fillRect(this.x, this.y, 10, 10);
  }
}

// Create a new game instance and initialize it
const game = new Game();
game.init();

// Listen for keyboard input to change the snake's direction
document.addEventListener("keydown", (event) => {
  game.handleInput(event);
});