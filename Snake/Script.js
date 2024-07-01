//define Html elements
const board = document.getElementById('gameboard');
const instructionText = document.getElementById('instructionText');
const logo = document.getElementById('logo');
const score = document.getElementById('score');
const previesScore = document.getElementById('previesScore');
const highScoreText = document.getElementById('highScore');

//define game variables
const gridSize = 20;
let snake = [{x: 10, y: 10}];
let food = generateFood();
let highScore = 0;
let direction = 'right';
let gameInterval;
let gameSpeedDelay = 200;
let gameStarted = false;
let isPause = false;

//draw game map, snake, and food
function draw(){
    board.innerHTML = '';
    drawSnake();
    drawFood();
    updateScore();
}

//draw snake
function drawSnake(){
    snake.forEach((segment) => {
        const snakeElement = createGameElement('div', 'snake');
        setPosition(snakeElement, segment)
        board.appendChild(snakeElement)
    });
}

//create a snake of food cube
function createGameElement(tag, className){
    const element = document.createElement(tag);
    element.className = className;
    return element;
}

//set the posotion of the snake or food
function setPosition(element, posotion){
    element.style.gridColumn = posotion.x;
    element.style.gridRow = posotion.y;
}

//drew food function
function drawFood(){
    if (gameStarted) {
        const foodElement = createGameElement('div', 'food');
        setPosition(foodElement, food);
        for(let i = 0; i < snake.length; i ++){
            if(food.x == snake[i].x && food.y == snake[i].y){
                // food = generateFood();
                // drawFood();
                setPosition(foodElement, food)
                food = generateFood();
            }
        }
        board.appendChild(foodElement);
    }
}

//generate food
function generateFood(){
    const x = Math.floor(Math.random() * gridSize) + 1;
    const y = Math.floor(Math.random() * gridSize) + 1;
    return {x, y}
}

//moving the snake
function move(){
    const head = { ...snake[0] }
    switch (direction) {
        case 'up':
            head.y--;
            break;
        case 'down':
            head.y++;
            break;
        case 'left':
            head.x--;
            break;
        case 'right':
            head.x++;
            break;
    }

    snake.unshift(head); 

    if (head.x === food.x && head.y === food.y){
        food = generateFood();
        increaseSpeed();
        clearInterval(gameInterval); //clear past interval
        gameInterval = setInterval(() => {
            move();
            checkCollision();
            draw();
        }, gameSpeedDelay);
    }
    else{
        snake.pop();
    }
}

//start game function
function startGame(){
    gameStarted = true; //keep track of a running game
    instructionText.style.display = 'none';
    logo.style.display = 'none';
    gameInterval = setInterval(() =>{
        move();
        checkCollision();
        draw();
    }, gameSpeedDelay);
}

//make a keyperess event listener
function handleKeyPress(event){
    if(
        ( !gameStarted && event.code === 'Space' )||
        ( !gameStarted && event.key === ' ' )
        ){
        startGame();
    }
    else{
        switch(event.key){
            case'ArrowUp':
            if(direction != 'down'){
                    direction = 'up';
            }
                break;
            case'ArrowDown':
            if(direction != 'up'){
                direction = 'down';
            }
                break;
            case'ArrowLeft':
            if(direction != 'right'){
                direction = 'left';
            }
                break;
            case'ArrowRight':
            if(direction != 'left'){
                direction = 'right';
            }
                break;
            case 'p':
                pause();
                break;
            case 'פ':
                pause();
                break;
        }
    }
}

document.addEventListener('keydown', handleKeyPress)

//increes the speed of the snake
function increaseSpeed(){
    if (gameSpeedDelay > 150) {
        gameSpeedDelay -= 5;
    }else if ( gameSpeedDelay > 100 ){
        gameSpeedDelay -= 3;
    }
    else if ( gameSpeedDelay > 50 ){
        gameSpeedDelay -= 2;
    }
    else if ( gameSpeedDelay > 25 ){
        gameSpeedDelay -= 1;
    }
}

//pause the game
function pause(){
    if(isPause){
        gameInterval = setInterval(() =>{
            move();
            checkCollision();
            draw();
        }, gameSpeedDelay);
        }
    else{
        clearInterval(gameInterval);
    }
    isPause = !isPause;
}

//check clooision function
function checkCollision(){
    const head = snake[0];

    if (head.x < 1 || head.x > gridSize || head.y < 1 || head.y > gridSize){
        resetGame();
    }

    for (let i = 1; i < snake.length; i++){
        if (head.x === snake[i].x && head.y === snake[i].y){
            resetGame();
        }
    }
}

//reset game in case of game over
function resetGame(){
    updateHighScore();
    stopGame();
    snake = [{x: 10, y: 10}];
    food = generateFood();
    direction = 'right';
    gameSpeedDelay = 200;
    updateScore();
}

//update the score
function updateScore(){
    const currentScore = snake.length -1;
    score.textContent = currentScore.toString().padStart(3, '0');
}

//stop and reset the game
function stopGame(){
    clearInterval(gameInterval);
    gameStarted = false;
    instructionText.style.display = 'block';
    logo.style.display = 'block';
}

//update the high score
function updateHighScore(){
    const currentScore = snake.length -1;
    if (currentScore > highScore){
        highScore = currentScore;
        highScoreText.textContent = highScore.toString().padStart(3, '0');
    }
    previesScore.textContent = currentScore.toString();
    previesScore.style.display = 'block';
    highScoreText.style.display = 'block';
}