document.addEventListener('DOMContentLoaded', () => {
    // Game elements
    const mario = document.getElementById('mario');
    const gameScreen = document.getElementById('game-screen');
    const scoreElement = document.getElementById('score');
    
    // Game state
    let score = 0;
    let isJumping = false;
    let isMovingLeft = false;
    let isMovingRight = false;
    let marioPosition = 50;
    let marioBottom = 60;
    let gravity = 0;
    let gameSpeed = 3;
    let gameRunning = true;
    
    // Controls
    const leftBtn = document.getElementById('left-btn');
    const rightBtn = document.getElementById('right-btn');
    const jumpBtn = document.getElementById('jump-btn');
    
    // Event listeners for mobile controls
    leftBtn.addEventListener('touchstart', moveLeft);
    leftBtn.addEventListener('touchend', stopMoving);
    rightBtn.addEventListener('touchstart', moveRight);
    rightBtn.addEventListener('touchend', stopMoving);
    jumpBtn.addEventListener('touchstart', jump);
    
    // Event listeners for keyboard controls
    document.addEventListener('keydown', (e) => {
        if (e.code === 'ArrowLeft') moveLeft();
        if (e.code === 'ArrowRight') moveRight();
        if (e.code === 'Space') jump();
    });
    
    document.addEventListener('keyup', (e) => {
        if (e.code === 'ArrowLeft' || e.code === 'ArrowRight') stopMoving();
    });
    
    // Movement functions
    function moveLeft() {
        isMovingLeft = true;
        isMovingRight = false;
        mario.style.transform = 'scaleX(-1)';
    }
    
    function moveRight() {
        isMovingRight = true;
        isMovingLeft = false;
        mario.style.transform = 'scaleX(1)';
    }
    
    function stopMoving() {
        isMovingLeft = false;
        isMovingRight = false;
    }
    
    function jump() {
        if (!isJumping) {
            isJumping = true;
            gravity = 15;
        }
    }
    
    // Create game elements
    function createCoin() {
        if (!gameRunning) return;
        
        const coin = document.createElement('div');
        coin.className = 'coin';
        coin.style.left = `${gameScreen.offsetWidth}px`;
        coin.style.bottom = `${Math.random() * 100 + 100}px`;
        gameScreen.appendChild(coin);
        
        moveCoin(coin);
        
        // Randomly create coins
        setTimeout(createCoin, Math.random() * 2000 + 1000);
    }
    
    function createGoomba() {
        if (!gameRunning) return;
        
        const goomba = document.createElement('div');
        goomba.className = 'goomba';
        goomba.style.left = `${gameScreen.offsetWidth}px`;
        gameScreen.appendChild(goomba);
        
        moveGoomba(goomba);
        
        // Randomly create goombas
        setTimeout(createGoomba, Math.random() * 3000 + 2000);
    }
    
    // Move elements
    function moveCoin(coin) {
        let coinPosition = parseInt(coin.style.left);
        
        const coinInterval = setInterval(() => {
            coinPosition -= gameSpeed;
            coin.style.left = `${coinPosition}px`;
            
            // Check collision with Mario
            if (checkCollision(mario, coin)) {
                collectCoin(coin);
                clearInterval(coinInterval);
            }
            
            // Remove when off screen
            if (coinPosition < -30) {
                coin.remove();
                clearInterval(coinInterval);
            }
        }, 20);
    }
    
    function moveGoomba(goomba) {
        let goombaPosition = parseInt(goomba.style.left);
        
        const goombaInterval = setInterval(() => {
            goombaPosition -= gameSpeed;
            goomba.style.left = `${goombaPosition}px`;
            
            // Check collision with Mario
            if (checkCollision(mario, goomba)) {
                gameOver();
                clearInterval(goombaInterval);
            }
            
            // Remove when off screen
            if (goombaPosition < -50) {
                goomba.remove();
                clearInterval(goombaInterval);
            }
        }, 20);
    }
    
    // Collision detection
    function checkCollision(a, b) {
        const aRect = a.getBoundingClientRect();
        const bRect = b.getBoundingClientRect();
        
        return !(
            aRect.bottom < bRect.top ||
            aRect.top > bRect.bottom ||
            aRect.right < bRect.left ||
            aRect.left > bRect.right
        );
    }
    
    // Game actions
    function collectCoin(coin) {
        score += 10;
        scoreElement.textContent = `Score: ${score}`;
        coin.remove();
        
        // Increase game speed every 100 points
        if (score % 100 === 0) {
            gameSpeed += 0.5;
        }
    }
    
    function gameOver() {
        gameRunning = false;
        alert(`Game Over! Your score: ${score}`);
        location.reload();
    }
    
    // Game loop
    function gameLoop() {
        if (!gameRunning) return;
        
        // Apply gravity
        if (isJumping) {
            marioBottom += gravity;
            gravity -= 0.5;
            
            if (marioBottom <= 60) {
                marioBottom = 60;
                isJumping = false;
                gravity = 0;
            }
        }
        
        // Move Mario left/right
        if (isMovingLeft && marioPosition > 0) {
            marioPosition -= 5;
        }
        if (isMovingRight && marioPosition < gameScreen.offsetWidth - 50) {
            marioPosition += 5;
        }
        
        // Update Mario position
        mario.style.left = `${marioPosition}px`;
        mario.style.bottom = `${marioBottom}px`;
        
        requestAnimationFrame(gameLoop);
    }
    
    // Start game
    createCoin();
    createGoomba();
    gameLoop();
});