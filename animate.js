// https://www.youtube.com/watch?v=GFO_txvwK_c&t=1s&ab_channel=freeCodeCamp.org

let playerState = "idle";
const menu = document.querySelector('#animations');
menu.addEventListener('change', function(event){
    playerState = event.target.value;
})

const canvas1 = document.getElementById('canvas1');
const ctx = canvas1.getContext('2d');
const canvasWidth = canvas1.width = 32;
const canvasHeight = canvas1.height = 32;

const playerSprite = new Image()
playerSprite.src = 'sheets/redhood-spritesheet.png';
const spriteWidth = 32;
const spriteHeight = 32;

let frameX = 0;
let frameY = 0;
let gameFrame = 0;
const framePersistence = 7;
const spriteAnimations = [];
const animationStates = [
    {
        name: 'idle',
        frames: 2,
    },
    {
        name: 'idle2',
        frames: 2,
    },
    {
        name: 'walking',
        frames: 4,
    },
    {
        name: 'running',
        frames: 8,
    },
    {
        name: 'crouching',
        frames: 6,
    },
    {
        name: 'jumping',
        frames: 8,
    },
    {
        name: 'banished',
        frames: 6,
    },
    {
        name: 'defeated',
        frames: 8,
    },
    {
        name: 'attack',
        frames: 8,
    }
]

animationStates.forEach((state, index) => {
    let frames = {
        loc: [],
    }
    for (let i = 0; i <state.frames; i++){
        let positionX = i * spriteWidth;
        let positionY = index * spriteHeight;
        frames.loc.push({x: positionX, y: positionY});
    }
    spriteAnimations[state.name] = frames;
});


function animate() {
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    let position = Math.floor(gameFrame/framePersistence) % spriteAnimations[playerState].loc.length;
    frameX = spriteWidth * position;
    let frameY = spriteAnimations[playerState].loc[position].y;
    ctx.drawImage(playerSprite, frameX, frameY, spriteWidth, spriteHeight, 0, 0, spriteWidth, spriteHeight);

    gameFrame++;
    requestAnimationFrame(animate);
};

animate();