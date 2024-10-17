let score = 0;
let engine, render, world;
let fruitImages = ['./img/mango.png', './img/tomato.png', './img/shirt.png'];
let fruitBodies = [];
let basket; 
let ground; 
let timeLeft = 20; 
let gameInterval; 
let gameOver = false; 

const catchSound = new Audio('./audio/pa.mp3');
const end = new Audio('./audio/end.mp3');

function init() {
    engine = Matter.Engine.create();
    world = engine.world;

    render = Matter.Render.create({
        element: document.body,
        engine: engine,
        options: {
            width: 800,
            height: 600,
            wireframes: false,
            
            background: 'rgba(0, 0, 0, 0.5)'
        }
    });

    Matter.Render.run(render);

    let runner = Matter.Runner.create();
    Matter.Runner.run(runner, engine);
    
    ground = Matter.Bodies.rectangle(400, 590, 810, 60, { 
        isStatic: true,
        render: {
            fillStyle: 'white'
        }
    });
    Matter.World.add(world, ground);

    basket = Matter.Bodies.rectangle(400, 550, 100, 20, {
        isStatic: true,
        render: {
            fillStyle: 'brown'
        }
    });
    Matter.World.add(world, basket);

    gameInterval = setInterval(createFruit, 1000);

    startTimer();

    Matter.Events.on(engine, 'collisionStart', function(event) {
        if (gameOver) return; 

        event.pairs.forEach(pair => {
            if ((fruitBodies.includes(pair.bodyA) && pair.bodyB === basket) || 
                (fruitBodies.includes(pair.bodyB) && pair.bodyA === basket)) {
                
                score++;
                document.getElementById('score').textContent = score;
                removeFruit(pair.bodyA);
                removeFruit(pair.bodyB);
                catchSound.play();
            }

            
            if ((fruitBodies.includes(pair.bodyA) && pair.bodyB === ground) || 
                (fruitBodies.includes(pair.bodyB) && pair.bodyA === ground)) {
                removeFruit(pair.bodyA);
                removeFruit(pair.bodyB);
            }
        });
    });

    
    document.addEventListener('keydown', function(event) {
        if (gameOver) return; 

        
        if (basket.position.x < 50) {
            Matter.Body.setPosition(basket, { x: 50, y: 550 });
        } else if (basket.position.x > 750) {
            Matter.Body.setPosition(basket, { x: 750, y: 550 });
        } else if (event.key === 'ArrowLeft') {
            Matter.Body.translate(basket, { x: -60, y: 0 }); 
        } else if (event.key === 'ArrowRight') {
            Matter.Body.translate(basket, { x: 60, y: 0 }); 
        }
    });
}


function startTimer() {
    let timerElement = document.getElementById('timer');
    let timer = setInterval(function() {
        timeLeft--;
        timerElement.textContent = timeLeft;

        if (timeLeft <= 0) {
            clearInterval(timer); 
            clearInterval(gameInterval); 
            endGame(); 
        }
    }, 1000); 
}


function endGame() {
    gameOver = true; 
    end.play(); 

    
    let gameOverMessage = document.createElement('div');
    gameOverMessage.id = 'game-over-message';
    gameOverMessage.style.position = 'absolute';
    gameOverMessage.style.top = '50%';
    gameOverMessage.style.left = '50%';
    gameOverMessage.style.transform = 'translate(-50%, -50%)';
    gameOverMessage.style.fontSize = '30px';
    gameOverMessage.style.color = 'red';
    gameOverMessage.style.textAlign = 'center';
    gameOverMessage.innerHTML = `Time up!<br>Score: ${score}<br><a href="index.html">Click to play again.</a>`;

    document.body.appendChild(gameOverMessage);
}


function createFruit() {
    let x = Math.random() * 800; 
    let y = 0; 
    let imageIndex = Math.floor(Math.random() * fruitImages.length); 

    let fruit = Matter.Bodies.rectangle(x, y, 50, 50, {
        render: {
            sprite: {
                texture: fruitImages[imageIndex],
                xScale: 0.1,
                yScale: 0.1
            }
        }
    });

    fruitBodies.push(fruit);
    Matter.World.add(world, fruit);
}


function removeFruit(fruit) {
    if (fruitBodies.includes(fruit)) {
        Matter.World.remove(world, fruit);
        fruitBodies = fruitBodies.filter(f => f !== fruit);
    }
}


window.onload = function() {
    init();
};
