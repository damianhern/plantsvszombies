const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');
canvas.width = 900;
canvas.height = 600;
const cellSize = 100;
const cellGap = 3;
const gameGrid = [];
let gameOver = false;
let frame = 0;
let score = 0;
const winningScore = 500;
let Dtype = 0;
let Ptype = 0;

let enemiesInterval = 500;
let cost = 0;
let numberOfResources = 1000;


const projectiles = [];
const defenders = [];
const enemies = [];
const enemyPositions = [];
const resources = [];

const mouse = {
    x: undefined,
    y: undefined,
    width: 0.00001,
    height: 0.00001,
}
let canvasPosition = canvas.getBoundingClientRect();
canvas.addEventListener('mousemove', function(e){
    mouse.x = e.x - canvasPosition.left;
    mouse.y = e.y - canvasPosition.top;
})

/*********************************************************************************/

// game board
const controlsBar = {
    width: canvas.width,
    height: cellSize,  
    
}
class Cell {
    constructor(x, y){
        this.x = x;
        this.y = y;
        this.width = cellSize;
        this.height = cellSize;
    }
    draw(){
        ctx.fillStyle = 'black';
        if (collision(this, mouse)){
            ctx.lineWidth = 1;
            ctx.strokeRect(this.x + 3, this.y + 3, this.width - 6, this.height - 6);
        }
    }
}
function handleGamegrid(){
    for (let i = 0; i < gameGrid.length; i++){
        gameGrid[i].draw();
    }
}

/*********************************************************************************/

// Projectiles
class Projectile {
    constructor(x, y){
        this.x = x + 10;
        this.type = Ptype;
        if (this.type == 1){
            this.y = y - 14;
          }else if (this.type==0){
            this.y = y -47;
          }else if (this.type==2){
            this.y = y -47;
          }
          //projectile width
          if (this.type == 1){
            this.width = 50;
          }else if (this.type==0){
            this.width = 30;
          }else if (this.type==2){
            this.width = 1;
          }
          //projectile height
          if (this.type == 1){
            this.height = 20;
          }else if (this.type==0){
            this.height = 30;
          }else if (this.type==2){
            this.height = 1;
          }
      
        this.speed = 3;
        //projectile power 
        if (this.type == 1){
            this.power = 50;
          }else if (this.type ==0){
            this.power = 100;
          }else if (this.type ==2){
            this.power = 0;
          }
       
    }
    update(){
        this.x ++;
        this.x ++;
        this.x ++;
        this.x ++;
        this.x ++;
        this.x ++;
        this.x ++;
        this.x ++;
        this.x ++;
        this.x ++;
        this.x ++;
        this.x ++;
        this.x ++;
        this.x ++;
        this.x ++;
        this.x ++;
        this.x ++;
        this.x ++;
        this.x ++;
        this.x ++;
    }
    draw(){
       
        if (this.type == 1){
          img = document.getElementById("arrow");
        }else if(this.type == 0 ){
            var img = document.getElementById("cannonball");
        }else if(this.type == 2 ){
            img = document.getElementById("cannonball");
        }
        ctx.drawImage(img,this.x, this.y, this.width, this.height);
    }
}
function handleProjectiles(){
    for (let i = 0; i < projectiles.length; i++){
        projectiles[i].update();
        projectiles[i].draw();
        console.log(projectiles[i]);
        for (let y = 0; y < enemies.length; y++){
            if (enemies[y] && projectiles[i] && collision(projectiles[i], enemies[y])){
                enemies[y].health -= projectiles[i].power;
                projectiles.splice(i, 1);
                i--;
            }
        };
        if (projectiles[i] && projectiles[i].x > canvas.width - cellSize){
            projectiles.splice(i, 1);
            i--;
        }
    }
}
/*********************************************************************************/

// Defenders

class Defender {
    constructor(x, y){
        this.x = x;
        this.y = y;
        this.type = Dtype;
        this.width = cellSize - cellGap * 4;
        this.height = cellSize - cellGap * 4;
        this.shooting = false;
        this.projectiles = [];
        this.timer = 0;
        this.shooting = false;
        if(this.type == 1){
            this.health = 200;
           }else if(this.type == 0){
               this.health = 500;
           }else if (this.type == 2){
              this.health = 2000;
           }
           if(this.type == 1){
            cost = 15;
           }else if(this.type == 0){
               cost = 50;
           }else if (this.type == 2){
            cost = 30;
           }

        
    }
    draw(){
        
        if(this.type == 1){
         cimg = document.getElementById("archer");
        }else if(this.type == 0){
            var cimg = document.getElementById("cannon");
        }else if (this.type == 2){
            cimg = document.getElementById("wall");

        }
        ctx.drawImage(cimg,this.x, this.y, this.width, this.height);
       
        if(this.type == 1){
            ctx.fillStyle = "red";
            ctx.fillRect(this.x,this.y-10,this.width,10);
            ctx.fillStyle = "green";
             ctx.fillRect(this.x,this.y-10,this.width * this.health/100 /2,10);
           }else if(this.type == 0){
            ctx.fillStyle = "red";
            ctx.fillRect(this.x,this.y-10,this.width,10);
            ctx.fillStyle = "green";
            ctx.fillRect(this.x,this.y-10,this.width * this.health/100 /5,10);
           }else if (this.type == 2){
            ctx.fillStyle = "red";
            ctx.fillRect(this.x,this.y-10,this.width,10);
            ctx.fillStyle = "green";
            ctx.fillRect(this.x,this.y-10,this.width * this.health/100 /20,10);
           }
    }
    update(){
        if (this.shooting){
            this.timer++;
            Ptype = this.type;
            if (this.timer % 90 === 0){
                projectiles.push(new Projectile(this.x + 70, this.y + cellSize / 2));
            }
        }

    }
}
canvas.addEventListener('click', function(e){
    const gridPositionX = (e.x - canvasPosition.left) - ((e.x - canvasPosition.left)%cellSize) + cellGap;
    const gridPositionY = (e.y - canvasPosition.top)- ((e.y - canvasPosition.top)%cellSize) + cellGap;
    if (gridPositionY < cellSize) return;
    for (let i = 0; i < defenders.length; i++){
        if (defenders[i].x === gridPositionX && defenders[i].y === gridPositionY) return;
    }
    if (numberOfResources >= cost) {
        defenders.push(new Defender(gridPositionX, gridPositionY));
        numberOfResources -= cost;
    }

})
function handleDefenders(){
    for (let i = 0; i < defenders.length; i++){
        defenders[i].draw();
        defenders[i].update();
        if (enemyPositions.indexOf(defenders[i].y) !== -1) {
            defenders[i].shooting = true;
        } else {
            defenders[i].shooting = false;
            defenders[i].timer = 0;
        }
        for (let j = 0; j < enemies.length; j++){
            if (defenders[i] && collision(defenders[i], enemies[j])){
                enemies[j].movement = 0;
                defenders[i].health--;
            }
            if (defenders[i] && defenders[i].health <= 0){
                defenders.splice(i, 1);
                if(enemies[j].health == 200){
                    i--;
        
                   }else if(enemies[j].health == 500){
                    i--;
                    i--;
                   }else if (enemies[j].health == 2000){
                    i--;
                    i--;
                    i--;
                    i--;
                   }
                enemies[j].movement = enemies[j].speed;
            }
            
        }

    }
}
/*********************************************************************************/

// Enemies
const Eamounts = [200,500,2000];
class Enemy {
    constructor(verticalPosition){
        this.x = canvas.width;
        this.y = verticalPosition;
        this.width = cellSize - cellGap * 2;
        this.height = cellSize - cellGap * 2;
        this.health = Eamounts[Math.floor(Math.random() * Eamounts.length)];
        this.startinghealth = this.health = Eamounts[Math.floor(Math.random() * Eamounts.length)];
        if(this.health == 200){
            this.speed =  0.9;

           }else if(this.health == 500){
            this.speed = 0.6;
           
           }else if (this.health == 2000){
            this.speed =  0.2;
           
           }
       
        this.movement = this.speed;
      
        
    }
    update(){
        this.x -= this.movement;
    }
    draw(){
        ctx.fillStyle = 'red';
        ctx.fillRect(this.x, this.y, this.width, this.height);
        if(this.startinghealth == 200){
            ctx.fillStyle = "red";
            ctx.fillRect(this.x,this.y-10,this.width,10);
            ctx.fillStyle = "green";
             ctx.fillRect(this.x,this.y-10,this.width * this.health/100 /2,10);
           }else if(this.startinghealth == 500){
            ctx.fillStyle = "red";
            ctx.fillRect(this.x,this.y-10,this.width,10);
            ctx.fillStyle = "green";
            ctx.fillRect(this.x,this.y-10,this.width * this.health/100 /5,10);
           }else if (this.startinghealth == 2000){
            ctx.fillStyle = "red";
            ctx.fillRect(this.x,this.y-10,this.width,10);
            ctx.fillStyle = "green";
            ctx.fillRect(this.x,this.y-10,this.width * this.health/100 /20,10);
           }
       
       
        if(this.startinghealth == 200){
            ctx.fillStyle = "white";
            ctx.font = '20px Helvetica';
            ctx.fillText("Weakling", this.x + 7, this.y + 50);
           }else if(this.startinghealth == 500){
            ctx.fillStyle = "white";
            ctx.font = '20px Helvetica';
            ctx.fillText("Average", this.x + 7, this.y + 50);
           }else if (this.startinghealth == 2000){
            ctx.fillStyle = "white";
            ctx.font = '20px Helvetica';
            ctx.fillText(" Big Boi", this.x + 7, this.y + 50);
           }
       

    }
}

let verticalPosition = Math.floor(Math.random() * 5 + 1) * cellSize + cellGap;
function handleEnemies(){
    for (let i = 0; i < enemies.length; i++){
        enemies[i].update();
        enemies[i].draw();
        if (enemies[i] && enemies[i].health <= 0){
            const findThisIndex = enemyPositions.indexOf(enemies[i].y);
            enemyPositions.splice(findThisIndex,1);
            enemies.splice(i, 1);
            numberOfResources += 10;
            i--
            score++;
        }
        if (enemies[i] && enemies[i].x < 0){
            gameOver = true;
        }
    }
    if (frame % enemiesInterval === 0 && score < winningScore) {
        verticalPosition = Math.floor(Math.random() * 5 + 1) * cellSize + cellGap;
        enemies.push(new Enemy(verticalPosition));
        enemyPositions.push(verticalPosition);
        if (enemiesInterval > 100) enemiesInterval -= 100;
        console.log('enemy added ' + enemiesInterval);
    };
};

/*********************************************************************************/

// Resources

class Resource {
    constructor(){
        this.x = Math.random() * (canvas.width - cellSize);
        this.y = Math.random() * (canvas.height - cellSize * 2) + cellSize
        this.width = cellSize / 2;
        this.height = cellSize / 2;
        this.amount = 25;
    }
    update(){
        if (collision(this, mouse)){
            ctx.lineWidth = 3;
            ctx.strokeRect(this.x + 3, this.y + 3, this.width - 6, this.height - 6);
        }
    }
    draw(){
       
        ctx.beginPath();
        ctx.arc(this.x +5, this.y + 30, 20, 0, 2 * Math.PI);
        ctx.fillStyle = "yellow";
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = 'black';
        ctx.font = '25px Helvetica';
        ctx.fillText(this.amount, this.x - 10, this.y + 40);
    }
}
function handleResources(){
    for (let i = 0; i < resources.length; i++){
        resources[i].update();
        resources[i].draw();
        if (resources[i] && collision(resources[i], mouse)){
            numberOfResources += resources[i].amount;
            resources.splice(i, 1);
        }
    }
};

let addResources = setInterval(function(){
    if (score <= winningScore) resources.push(new Resource());
}, 5000);

/*********************************************************************************/

function init(){
    for (let y = cellSize; y < canvas.height; y += cellSize){
    for (let x = 0; x < canvas.width; x += cellSize){
        gameGrid.push(new Cell(x, y));
    } 
}
}
init();
function animate(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'lightGray';
    ctx.fillRect(0, 0, controlsBar.width, controlsBar.height);
    handleGamegrid();
    handleResources();
    handleEnemies();
    handleDefenders();
    handleProjectiles();
    handleGameStatus();
    frame++;
    if (!gameOver) requestAnimationFrame(animate);
}
animate();

function handleGameStatus(){
    ctx.fillStyle = 'white';
    ctx.font = '25px Helvetica';
    ctx.fillText('Score: ' + score, 10, 35);
    ctx.fillText('Available resources: ' + numberOfResources, 10, 85);
    if (gameOver){
        ctx.fillStyle = 'black';
        ctx.font = '110px Helvetica';
        ctx.fillText('GAME OVER', 120, 390);
    }
    if (score >= winningScore && enemies.length == 0){
        ctx.fillStyle = 'black';
        ctx.font = '60px Helvetica';
        ctx.fillText('YOU WIN with ' + score + ' points!', 130, 370);
    }
}

// utilities
function collision(first, second){
if( !(first.x > second.x + second.width ||
    first.x + first.width < second.x ||
    first.y > second.y + second.height ||
    first.y + first.height < second.y)){
        return true;
    };
}
window.addEventListener('resize', function(){
    canvasPosition = canvas.getBoundingClientRect();
})

function restart(){
    window.location.reload();
}
function cannon(){
    Dtype = 0;
    Ptype = 0;
}
function archer(){
    Dtype = 1;
    Ptype = 1;
}
function wall(){
    Dtype = 2; 
    Ptype = 2;
}
function bomb(){
    Dtype = 3;
    Ptype = 3;
}