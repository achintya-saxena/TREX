//declaring all the variables

    var trex, trex_running, trex_collided;
    var ground, invisibleGround, groundImage;

    var score=0; 

    var obstacleGroup;
    var cloudGroup;

    var jumpSound;
    var dieSound;
    var milestoneSound;

    var cloud,cloudImage;

    var PLAY=1;
    var END =0;
    var gameState= PLAY;


    var sun,sunImage;

    var gameOver,gameOverImage;
    var restart,restartImage;

    var sky;
    var land;

function preload(){
    //loading all the images and sounds` 
  
  trex_running = loadAnimation("trex1.png","trex2.png","trex3.png");
    trex_collided = loadImage("trex_collided.png");

    groundImage = loadImage("ground2.png");

     cloudImage= loadImage("cloud.png");

        obstacle1 = loadImage("obstacle1.png");
        obstacle2 = loadImage("obstacle2.png");
        obstacle3 = loadImage("obstacle3.png");
        obstacle4 = loadImage("obstacle4.png");
        obstacle5 = loadImage("obstacle5.png");
        obstacle6 = loadImage("obstacle6.png");
        gameOverImage =loadImage("gameOver.png");
        restartImage= loadImage("restart.png");
        sunImage=loadImage("sun.png");
  
  jumpSound =loadSound("jump.mp3");
  dieSound =loadSound("die.mp3");
  milestoneSound=loadSound("checkPoint.mp3");
  

}

function setup() {
  
  //creating the canvas
  createCanvas(600,200)
  
  //creating a trex sprite and adding its animation and giving it a size and also position
  trex = createSprite(50,160,20,50);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collide",trex_collided);
  trex.scale = 0.5;
  
  //creating a ground sprite and adding its image and giving its size and position
  ground = createSprite(200,180,400,20);
  ground.addImage("ground",groundImage);
  
  
  
  
  // making the restart button with size and position and loaction and hiding it for now
  restart = createSprite(300,120,20,20);
    restart.addImage("res",restartImage);
  restart.visible=false;
  restart.scale=0.3;
  
  
 // making the gameOver Image with size and position and loaction and hiding it for now
 gameOver = createSprite(300,100,20,20);
  gameOver.addImage("over",gameOverImage);
  gameOver.visible=false;
  gameOver.scale=0.5;
  
  
  sun=createSprite(400,20,10,10);
  sun.addImage("su",sunImage);
  sun.scale=0.05;
  
  
  //creating invisible ground
  invisibleGround = createSprite(200,190,400,10);
  invisibleGround.visible = false;
  
  //creating obstacle and cloud object groups
  obstacleGroup = new Group();
  cloudGroup = new Group();
  
   //CONCATENATION
  var test ="bro"
 console.log("hello"+"trex"+test)

  //setting collider radius and AI part 1
 // trex.setCollider("rectangle",0,0,400,trex.height);
trex.setCollider("circle",0,0,40);
  //trex.debug=true;
  
  
  sky= createSprite(300,80,600,190);
  sky.shapeColor="lightblue";
 
  
}


function draw() {
  //set background color
  background("lightgreen");
  
  fill("black");
  
  //game state checking
  console.log("this is" + gameState);
  
 //condition in which we are telling that what all should happen when the game state is play and end
  if(gameState===PLAY) {
     //score increasing as the trex moves further
   
    
    
    
      //(making the game more challenging) while the score increases the ground velocity also increases
     ground.velocityX = -(4+3*score/100);
    
     //  trex jumping when the space key is pressed and also playing sound
  if(keyDown("space")&& trex.y >= 125 ) {
    trex.velocityY = -12;
    jumpSound.play();
    
  }
     
  //gravity of trex
  trex.velocityY = trex.velocityY + 0.8; 
  
  //infinite scroll of ground
  if (ground.x < 0){
    ground.x = ground.width/2;
     } 
  
    //declaring the spawn obstacle and cloud function
    spawnClouds();
  spawnObstacles();
    
   //playing sound when the trex crosses a multiple of 100
    if(score>0 && score%100===0) {  
      milestoneSound.play();
      
    }
    
    
    
  
    //playing sound when trex touches obstacles and change game state to end but for now it is being used for AI
    if(obstacleGroup.isTouching(trex)) {
       gameState=END;
     dieSound.play();
      //trex.velocityY=-12;
       jumpSound.play();
       }
    
     }
 
  //game state end condtions
  else if(gameState===END) {
         //ground and trex velocity 0 
          ground.velocityX =0;
          trex.velocityY=0;
    
    //velocity of cloud and obstacles group is 0
    obstacleGroup.setVelocityXEach(0);
    cloudGroup.setVelocityXEach(0);
   
    //changing animation og trex
    trex.changeAnimation("collide",trex_collided);
    
    //pausing the groups where the trex got out so they never disappear
    obstacleGroup.setLifetimeEach(-1);
    cloudGroup.setLifetimeEach(-1);
   
    //making the game over and restart button visible
    gameOver.visible=true;
    restart.visible=true;
    
    
   }
  
 //stop trex from falling down
  trex.collide(invisibleGround);
  
  if(mousePressedOver(restart)) {
   // console.log("restart the game");
    
    reset();
    
  }
  
  sky.depth=sky.depth-300;
  
  
  
 
  //drawing all the sprites
  drawSprites();
   textSize(18);
 
  if(gameState===PLAY) {
  text("score:" + score,300,20);
  score= score+ Math.round(getFrameRate()/60);
}
}

//function to spawn the clouds
function spawnClouds(){
 
  //creating clouds in multiples of 100
  if(frameCount%100===0) {
     //setting location and size of the clouds
    cloud = createSprite(600,80,30,10);
    
    //cloud velocity
    cloud.velocityX =-2;
     
    //adding the image
    cloud.addImage("clo",cloudImage);
   
    //making clouds come at random y positions
    cloud.y =Math.round(random(20,80));
      
    cloud.lifetime=600/2;//memory leak resolved

      //always making the trex appear in front of the clouds so that it feels that clouds are in the background
    trex.depth=cloud.depth;
      trex.depth=trex.depth+1;
       
    
    
    
    //adding clouds in a group
    cloudGroup.add(cloud);
  }
 
}

//function to spawn the obstacles
function spawnObstacles() {
  
  //creating obstacles at multiples of 60
  if(frameCount%60===0) {
    
    //creating the sprite with location and size
    var obstacle =createSprite(600,160,10,40);
   
    //setting velocity and increasing it as the score increases
    obstacle.velocityX=-(4+score/75);
    
  
 //computer can choose random cases from 1 to 6
    var rand =Math.round(random(1,6))
  switch(rand) {
         case 1 : obstacle.addImage(obstacle1);
         break;
          case 2 : obstacle.addImage(obstacle2);
         break;
          case 3 : obstacle.addImage(obstacle3);
         break;
          case 4 : obstacle.addImage(obstacle4);
         break;
          case 5 : obstacle.addImage(obstacle5);
         break;
          case 6 : obstacle.addImage(obstacle6);
         break;
         default:break;
    }
  //scaling the obstacles
    obstacle.scale=0.6;
    
    //giving lifetime to obstacles
    obstacle.lifetime=600/3;
    
   //adding obstacles in a group
    obstacleGroup.add(obstacle);
  }
  
  
}

function reset() {
  gameState=PLAY;
  gameOver.visible=false;
  restart.visible=false;
  cloudGroup.destroyEach();
  obstacleGroup.destroyEach();
  trex.changeAnimation( "running",trex_running);
  score=0;
  
}



