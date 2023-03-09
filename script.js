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
const winningScore = 3000;
let Dtype = 0;
let Ptype = 0;

let enemiesInterval = 500;
let cost = 50;
let numberOfResources = 560;
let round = 1;

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
const floatingMessages = [];
class floatingMessage{
    constructor(value,x,y,size,color){
        this.value = value;
        this.x = x;
        this.y = y;
        this.size = size;
        this.lifeSpan = 0;
        this.color = color;
        this.opacity = 1;
    }
    update(){
        this.y -= 0.3;
        this.lifeSpan += 1;
        if (this.opacity > 0.01) this.opacity -= 0.01;

    }
    draw(){
        ctx.globalAlpha = this.opacity;
        ctx.fillStyle = this.color;
        ctx.font = this.size + 'px Orbitron';
        ctx.fillText(this.value, this.x, this.y);
        ctx.globalAlpha = 1;
    }
    
}
function handleFloatingMessages(){
    for(let i = 0; i < floatingMessages.length; i++){
        floatingMessages[i].update();
        floatingMessages[i].draw();
        if (floatingMessages[i].lifeSpan >= 50){
            floatingMessages.splice(i, 1);
            i--;

        }

    }
}
// Projectiles
class Projectile {
    constructor(x, y){
      
        this.type = Ptype;
        if (this.type == 1){
            this.x = x - 20;
          }else if (this.type == 3){
            this.x = x - 20;
          }else if (this.type == 4){
            this.x = x - 20;
          }else this.x = x + 10;

        if (this.type == 1){
            this.y = y - 45;
          }else if (this.type == 0){
            this.y = y-29;
          }else if(this.type == 3 ){
            this.y = y -40;
          }else if (this.type ==2 || this.type == 5){
            this.y = y -47;
          }else if ( this.type == 4){
            this.y = y -27;
          }
          //projectile width
          if (this.type == 1){
            this.width = 30;
          } else if(this.type == 4){
            this.width = 50;
          }else if (this.type == 0){
            this.width = 40;
          }else if(this.type == 3 ){
            this.width = 30;
          }else if (this.type == 2 || this.type == 5){
            this.width = 1;
          }
          //projectile height
          if (this.type == 1){
            this.height = 30;
          } else if(this.type == 4){
            this.height = 10;
          }else if (this.type == 0){
            this.height = 40
          }else if(this.type == 3){
            this.height = 30;
          }else if (this.type == 2 || this.type == 5){
            this.height = 1;
          }
      
        this.speed = 3;
        //projectile power 
        if (this.type == 1 || this.type == 4){
            this.power = 16;
          }else if (this.type == 0 ){
            this.power = 50;
          }else if (this.type == 2 || this.type == 5){
            this.power = 0;
          }else if(this.type == 3){
            this.power = 105;
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
    }
    draw(){
       
        if (this.type == 1){
          img = document.getElementById("YWB");
        }else if(this.type == 0 ){
            var img = document.getElementById("WF");
        }else if(this.type == 2 || this.type == 5){
           
            img = document.getElementById("cannonball");
           
        }else if(this.type == 4){
           
            img = document.getElementById("cannonball");
           
        }else if( this.type == 3){
           
            img = document.getElementById("FWB");
           
        }
        ctx.drawImage(img,this.x, this.y, this.width, this.height);
    }
}
function handleProjectiles(){
    for (let i = 0; i < projectiles.length; i++){
        projectiles[i].update();
        projectiles[i].draw();
        for (let y = 0; y < enemies.length; y++){
            if (enemies[y] && projectiles[i] && collision(projectiles[i], enemies[y])){
                enemies[y].health -= projectiles[i].power;
                if (projectiles[i].type == 4 && enemies[y].type == 0){
                    console.log('working');
                    let bonus =50;
                    numberOfResources += bonus;
                    floatingMessages.push(new floatingMessage('+' + bonus, enemies[y].x, enemies[y].y, 25,'yellow'));
                    floatingMessages.push(new floatingMessage('+' + bonus, 250, 70, 30, 'yellow'));
                    }else{
                        floatingMessages.push(new floatingMessage('-' + projectiles[i].power, enemies[y].x, enemies[y].y, 25,'white'));
                        }
               if (projectiles[i].type != 3){
                projectiles.splice(i, 1);
                i--;
               }
                
            }
        };
        if (projectiles[i] && projectiles[i].x > canvas.width - 100){
                projectiles.splice(i, 1);
                i--;
            
           
        }
    }
}
/*********************************************************************************/

// Defenders
const DefenderTypes = [];
const plant= new Image();
plant.src ='plant.png';
DefenderTypes.push(plant);
const YW = new Image();
YW.src = 'YW.png';
DefenderTypes.push(YW);
const BW = new Image();
BW.src = 'Wizard.png';
DefenderTypes.push(BW);
const FW = new Image();
FW.src = 'FW.png';
DefenderTypes.push(FW);
const SA = new Image();
SA.src = 'SA.png';
DefenderTypes.push(SA);
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
        this.frameX = 0;
        this.frameY = 0;
        this.minFrame = 0;
        if(this.type == 4){
            this.maxFrame = 1;
           }else if (this.type == 1){
            this.maxFrame = 6;
           }else if (this.type == 0){
            this.maxFrame = 7;
 
           }else if (this.type == 3){
            this.maxFrame = 7;
 
           }else if (this.type == 5){
            this.maxFrame = 4;
 
           }
       
       
        if(this.type == 4){
            this.spriteWidth = 167;

           }else if(this.type == 1){
            this.spriteWidth = 187.857143;

           }else if(this.type == 0){
            this.spriteWidth = 108;

           }else if (this.type == 3){
            this.spriteWidth = 108.25;
 
           }else if (this.type == 5){
            this.spriteWidth = 141.2;
 
           }

           if(this.type == 4){
            this.spriteHeight = 243;

           }else if(this.type == 1){
            this.spriteHeight = 140;

           }else if(this.type == 0){
            this.spriteHeight = 88;

           }else if(this.type == 3){
            this.spriteHeight = 97;

           }else if(this.type == 5){
            this.spriteHeight = 124;

           }
        if(this.type == 1|| this.type == 4){
            this.health = 200;
           }else if(this.type == 0 ){
               this.health = 500;
           }else if (this.type==2 || this.type==5){
              this.health = 2000;
           }else if (this.type == 3){
            this.health = 1000;
         }
           if(this.type == 1 || this.type == 4){
            cost = 15;
           }else if(this.type == 0 ){
               cost = 50;
           }else if (this.type == 2){
            cost = 30;
           }else if(this.type == 3){
            cost = 750;
           }else if(this.type == 5){
            cost = 150;

           }
           if(this.type == 4){
            this.DefenderType = DefenderTypes[0];

           }else if(this.type == 1){
            this.DefenderType = DefenderTypes[1];

           }else if(this.type == 0){
            this.DefenderType = DefenderTypes[2];

           }else if(this.type == 3){
            this.DefenderType = DefenderTypes[3];

           }else if(this.type == 5){
            this.DefenderType = DefenderTypes[4];

           }

        
    }
    draw(){
        
        if(this.type == 1){
         ctx.drawImage(this.DefenderType, this.frameX * this.spriteWidth, 0,this.spriteWidth,this.spriteHeight,this.x,this.y,this.width,this.height);
        }
         if(this.type == 0){
            ctx.drawImage(this.DefenderType, this.frameX * this.spriteWidth, 0,this.spriteWidth,this.spriteHeight,this.x,this.y,this.width,this.height);
        }
         if (this.type == 2){
            var cimg = document.getElementById("wall");

        } else if (this.type == 3){
            ctx.drawImage(this.DefenderType, this.frameX * this.spriteWidth, 0,this.spriteWidth,this.spriteHeight,this.x,this.y,this.width,this.height);

        }else if (this.type == 5){
            ctx.drawImage(this.DefenderType, this.frameX * this.spriteWidth, 0,this.spriteWidth,this.spriteHeight,this.x,this.y,this.width,this.height);

        } 
         if (this.type == 4){
            ctx.drawImage(this.DefenderType, this.frameX * this.spriteWidth, 0,this.spriteWidth,this.spriteHeight,this.x,this.y,this.width,this.height);
           }
        
            if(this.type != 4 && this.type != 1 && this.type != 0 && this.type != 3 && this.type != 5 )ctx.drawImage(cimg,this.x, this.y, this.width, this.height);
       
       
        if(this.type == 1 || this.type == 4){
            ctx.fillStyle = "red";
            ctx.fillRect(this.x,this.y-14,this.width,10);
            ctx.fillStyle = "green";
             ctx.fillRect(this.x,this.y-14,this.width * this.health/100 /2,10);
           }else if(this.type == 0){
            ctx.fillStyle = "red";
            ctx.fillRect(this.x,this.y-14,this.width,10);
            ctx.fillStyle = "green";
            ctx.fillRect(this.x,this.y-14,this.width * this.health/100 /5,10);
           }else if (this.type == 2 || this.type == 5){
            ctx.fillStyle = "red";
            ctx.fillRect(this.x,this.y-14,this.width,10);
            ctx.fillStyle = "green";
            ctx.fillRect(this.x,this.y-14,this.width * this.health/100 /20,10);
           }else if (this.type == 3){
            ctx.fillStyle = "red";
            ctx.fillRect(this.x,this.y-14,this.width,10);
            ctx.fillStyle = "green";
            ctx.fillRect(this.x,this.y-14,this.width * this.health/100 /10,10);
           }
           

    }
    update(){
        if (this.shooting){
            this.timer++;
            
            Ptype = this.type;
            let shootingSpeed = 0;
            let frameShot = 0 ;
            if(this.type == 1){
              
               frameShot = 6;
               }else if(this.type == 0){
               
                frameShot = 8;
               }else if (this.type == 3){
                
                   frameShot = 10;
               }else if (this.type == 2 || this.type == 5 ){
                   shootingSpeed = 0;
       
               }else if (this.type == 4){
                
                frameShot = 20;
            }
            if(frame % frameShot == 0){
                if(this.frameX < this.maxFrame) this.frameX++;
                else {
                    this.frameX = this.minFrame;
                    projectiles.push(new Projectile(this.x + 70, this.y + cellSize / 2));
                }
            }
            if (this.timer % shootingSpeed === 0 && this.type != 0 && this.type != 1 && this.type != 4  && this.type != 3  && this.type != 5 ){
                projectiles.push(new Projectile(this.x + 70, this.y + cellSize / 2));
            }
            
        }else this.frameX = this.minFrame;

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
    }else if(numberOfResources < cost){
        floatingMessages.push(new floatingMessage('Need more Resources!', mouse.x, mouse.y, 25,'blue'));
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
                if(enemies[j].type == 1){
                    enemies[j].maxFrame = 5;
                    enemies[j].spriteWidth = 112.333333;
                    enemies[j].enemyType = enemyTypesA[0];
                } else if(enemies[j].type == 2){
                    enemies[j].maxFrame = 3;
                    enemies[j].enemyType = enemyTypesA[2];
                
                } else if(enemies[j].type == 0){
                    enemies[j].maxFrame = 4;
                    enemies[j].spriteWidth = 59.4;
                    enemies[j].enemyType = enemyTypesA[1];
                
                }
                if(enemies[j].type == 1 && enemies[j].frameX == 4){
                    defenders[i].health -= 10;
                }else if(enemies[j].type == 2 && enemies[j].frameX == 3){
                    defenders[i].health -= 45;
                }else if(enemies[j].type == 0 && enemies[j].frameX == 4){
                    defenders[i].health -= 5;
                }  
           
                
                if(defenders[i].type == 5){
                    let frameShot = 5;
                    if(frame % frameShot == 0){
                    if(defenders[i].frameX < defenders[i].maxFrame){ defenders[i].frameX++;
                    }else {
                        defenders[i].frameX = defenders[i].minFrame;
       
                    }
                    if(defenders[i].frameX == 4){
                    enemies[j].health -= 400;
                    floatingMessages.push(new floatingMessage("-400",enemies[j].x,enemies[j].y - 20 ,30 ,'black'));
                    }
                }
            }
            
            } 
            if (defenders[i] && defenders[i].health <= 0){
                console.log(enemies[j]);
                defenders.splice(i, 1);
                 enemies[j].movement = enemies[j].speed;       
                 if(enemies[j].type == 1){
                    enemies[j].enemyType = enemyTypes[1];
                    enemies[j].spriteWidth = 109.666667;
                } else if(enemies[j].type == 2){
                    enemies[j].maxFrame = 3;
                    enemies[j].enemyType = enemyTypes[2];
                }  else if(enemies[j].type == 0){
                    enemies[j].maxFrame = 4;
                    enemies[j].spriteWidth = 60.4;
                    enemies[j].enemyType = enemyTypes[0];
                }   
               
            }
      
     
            
        
       
       
    }
}
}
const enemyTypes = [];
const weakling = new Image();
weakling.src ='weakling.png';
enemyTypes.push(weakling);
const IP = new Image();
IP.src ='2enemy.png';
enemyTypes.push(IP);
const BB = new Image();
BB.src ='BBW.PNG';
enemyTypes.push(BB);


const enemyTypesA = [];
const EA1 = new Image();
 EA1.src ='2EA1.png';
enemyTypesA.push(EA1);
const EA2 = new Image();
EA2.src ='2EA2.png';
enemyTypesA.push(EA2);
const BBA = new Image();
BBA.src ='BBA.PNG';
enemyTypesA.push(BBA);







//const average = new Image();
//average.src ='average.png';
//enemyTypes.push(average);
// Enemies
let Eamounts = [200,500,2000];
class Enemy {
    constructor(verticalPosition){
        
        
        this.x = canvas.width;
        this.y = verticalPosition;
        this.width = cellSize - cellGap * 2;
        this.height = cellSize - cellGap * 2;
        this.health = Eamounts[Math.floor(Math.random() * Eamounts.length)];
        this.startinghealth = Eamounts[Math.floor(Math.random() * Eamounts.length)];
        if(this.health == 200){
            this.type = 0;

           }else if(this.health == 500){
            this.type = 1;
           
           }else if (this.health == 2000){
            this.type = 2;
           
           }
        if(this.type == 0){
            this.speed =  0.9;

           }else if(this.type == 1){
            this.speed = 0.6;
           
           }else if (this.type == 2){
            this.speed =  0.2;
           
           }
           if(this.type == 0){
            this.enemyType = enemyTypes[0];

           } else if(this.type == 1){
            this.enemyType = enemyTypes[1];

           } else if(this.type == 2){
            this.enemyType = enemyTypes[2];

           }
       
        this.frameX = 0;
        this.frameY = 0;
        this.minFrame = 0;
        if(this.type == 0){
            this.maxFrame = 4;

           }else if(this.type == 1){
            this.maxFrame = 5;
           
           }else if (this.type == 2){
            this.maxFrame = 5;
           
           }
       
       
        if(this.type == 0){
            this.spriteWidth = 60.4;

           }else if(this.type == 1){
            this.spriteWidth = 109.666667;
           
           }else if (this.type == 2){
            this.spriteWidth = 46.8333333;
           
           }
           if(this.type == 0){
            this.spriteHeight = 58;

           }else if(this.type == 1){
            this.spriteHeight = 71;

           
           }else if (this.type == 2){
            this.spriteHeight = 51;

           
           }
        
           
        this.movement = this.speed;
      
        
    }
    update(){
    let renderSpeed = 10;
    if(this.type == 2){
        renderSpeed = 20;
    }else if(this.type == 0){
        renderSpeed = 12;
    }
        if(frame % renderSpeed == 0){
            if(this.frameX < this.maxFrame) this.frameX++;
            else this.frameX = this.minFrame;
        }
        this.x -= this.movement;
    }
    draw(){
       // ctx.fillStyle = 'red';
       // ctx.fillRect(this.x, this.y, this.width, this.height);
        if(this.type == 0){
            ctx.fillStyle = "red";
            ctx.fillRect(this.x,this.y-15,this.width,10);
            ctx.fillStyle = "green";
             ctx.fillRect(this.x,this.y-15,this.width * this.health/100 /2,10);
           }else if(this.type == 1){
            ctx.fillStyle = "red";
            ctx.fillRect(this.x,this.y-15,this.width,10);
            ctx.fillStyle = "green";
            ctx.fillRect(this.x,this.y-15,this.width * this.health/100 /5,10);
           }else if (this.type == 2){
            ctx.fillStyle = "red";
            ctx.fillRect(this.x,this.y-15,this.width,10);
            ctx.fillStyle = "green";
            ctx.fillRect(this.x,this.y-15,this.width * this.health/100 /20,10);
           }
       
       
        if(this.type == 0){
        ctx.drawImage(this.enemyType, this.frameX * this.spriteWidth, 0,this.spriteWidth,this.spriteHeight,this.x,this.y,this.width,this.height);
           }else if(this.type == 1){
            ctx.drawImage(this.enemyType, this.frameX * this.spriteWidth, 0,this.spriteWidth,this.spriteHeight,this.x,this.y,this.width,this.height);
           }else if (this.type == 2){
            ctx.drawImage(this.enemyType, this.frameX * this.spriteWidth, 0,this.spriteWidth,this.spriteHeight,this.x,this.y,this.width,this.height);
           }

        //ctx.drawImage(img, sx, sy,sw,sh,dx,dy,dw,dh);
       
       

    }
}

let verticalPosition = Math.floor(Math.random() * 5 + 1) * cellSize + cellGap;
function handleEnemies(){
    for (let i = 0; i < enemies.length; i++){
        enemies[i].update();
        enemies[i].draw();
        if (enemies[i] && enemies[i].health <= 0){
            let gainedResources = enemies[i].startinghealth/10;
            numberOfResources += gainedResources;
            score++;
            floatingMessages.push(new floatingMessage('+' + 1, 120, 35, 30, 'black'));
            if(enemies[i].type != 0){
                floatingMessages.push(new floatingMessage('+' + gainedResources,enemies[i].x ,enemies[i].y+40  ,30 ,'black'));
            }
            if(enemies[i].type == 0){
                floatingMessages.push(new floatingMessage('+' + gainedResources,enemies[i].x ,enemies[i].y + 40 ,30 ,'black'));
            }
              
          
            floatingMessages.push(new floatingMessage('+' + gainedResources, 250, 50, 30, 'black'));
            const findThisIndex = enemyPositions.indexOf(enemies[i].y);
            enemyPositions.splice(findThisIndex,1);
            enemies.splice(i, 1);
            i--;
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
        this.amount = 15;
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
            floatingMessages.push(new floatingMessage('+' + resources[i].amount,resources[i].x ,resources[i].y ,30 ,'black'));
            floatingMessages.push(new floatingMessage('+' + resources[i].amount, 250, 50, 30, 'black'));
            resources.splice(i, 1);
        }
    }
};

let addResources = setInterval(function(){
    if (score <= winningScore) resources.push(new Resource());
}, 7000);

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
    handleFloatingMessages();
    frame++;
    if (!gameOver) requestAnimationFrame(animate);
}
animate();

function handleGameStatus(){
    ctx.fillStyle = 'white';
    ctx.font = '25px Helvetica';
    if(score == 50){
        round = 2;
        enemiesInterval = 450;
      }else if(score == 150){
        round = 3;
        enemiesInterval  = 400;
      }else if(score == 250){
        round = 4;
        enemiesInterval = 350;
        Eamounts = [500,2000];
      }else if(score == 350){
        round = 5;
        enemiesInterval = 300;
      }else if(score == 450){
        round = 6;
        enemiesInterval = 250;
        Eamounts = [2000];
      }else if(score == 750){
        round = 7;
        enemiesInterval = 200;
      }else if(score == 1250){
        round = 8;
        enemiesInterval = 150;
      }else if(score == 2250){
        round = 9;
        enemiesInterval = 100;
      }else if(score == 3000){
        round = 'last';
        enemiesInterval = 1;
      }
    ctx.fillText('Score: ' + score, 10, 35);
    ctx.fillText('Available resources: ' + numberOfResources, 10, 85);
    
    ctx.fillText('Round: ' + round,700,35);
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
function BWizard(){
    Dtype = 0;
    Ptype = 0;
}
function YWizard(){
    Dtype = 1;
    Ptype = 1;
}
function wall(){
    Dtype = 2; 
    Ptype = 2;
}
function FWizard(){
    Dtype = 3;
    Ptype = 3;
}
function Plant(){
    Dtype = 4;
    Ptype = 4;
}
function Samurai(){
    Dtype = 5;
    Ptype = 5;
}