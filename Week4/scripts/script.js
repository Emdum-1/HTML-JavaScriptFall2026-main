//alert("Welcome to the Lab");
/*
Allows you to comment out multiple lines of code
Week 4 Lab - Experimenting with Canvas animation
*/


const Canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

var fps = 1000 / 60;
var timer = setInterval(game, fps);

var startPoint = { x: canvas.width / 2, y: canvas.height / 2 };//canvas.width/2;
var boxCoolDown = 30;
var moveDirection = { x: 1, y: 1 };
var boxColor = "red";
var shipSprite = { image: document.getElementById("ship"), x: 1, y: 1, moveX: 0, moveY: 0 };

var acceleration = 0.6;
var friction = 0.94;
var score = 0;
var objectShot = 0;
var clickerSound = new Audio("audio/audiomass-output.mp3");
var boxShot = false;


function createStar() {
    var star = {
        x: 0,
        y: 0,
        radius: 0,
        color: "black",
        drawCircle: function () {
            ctx.beginPath()
            ctx.fillStyle = this.color;
            ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
            ctx.fill();

        }
    }
    return star;



}

var starCount = 50;
var stars = []; //creates an array
for (var i = 0; i < starCount; i++) {
    stars[i] = createStar();
    stars[i].x = Math.random() * canvas.width;
    stars[i].y = Math.random() * canvas.height;
    stars[i].radius = Math.random() * 5;
    // stars[i].color = `rgb(${Math.random()*255}, ${Math.random()*255}, ${Math.random()*255})`
    stars[i].color = "white";
}

shipSprite.x = canvas.width / 2;
shipSprite.y = canvas.height / 2 + 100;

var a = false;
var d = false;
var w = false;
var s = false;
var space = false;

//Add variable for the bullets
var bullets = [];
var shootCooldown = 0;


//on key pressed
document.addEventListener("keydown", function (e) {
    console.log(e.key);
    if (e.key == "a") {
        a = true;
    }
    if (e.key == "d") {
        d = true;
    }
    if (e.key == "w") {
        w = true;
    }
    if (e.key == "s") {
        s = true;
    }
    if (e.code == "Space") {
        space = true;


        e.preventDefault();
    }




})
//on key released
document.addEventListener("keyup", function (e) {
    console.log(e.key);
    if (e.key == "a") {
        a = false;
    }
    if (e.key == "d") {
        d = false;
    }
    if (e.key == "w") {
        w = false;
    }
    if (e.key == "s") {
        s = false;
    }
    if (e.code == "Space") {
        space = false;
    }

})

//This is our Game Loop function
function game() {

    //clear the screen
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    startPoint.x += moveDirection.x;
    startPoint.y += moveDirection.y;

    var hitBox = shipSprite.x < startPoint.x + 25 &&
        shipSprite.x + 25 > startPoint.x &&
        shipSprite.y < startPoint.y + 25 &&
        shipSprite.y + 25 > startPoint.y;



    if (hitBox == true) {
        shipSprite.x = canvas.width / 2

        shipSprite.y = canvas.height / 2 + 100;
        score = 0;
        objectShot = 0;
    }


    if (a == true) {
        //shipSprite.x -= 5;
        shipSprite.moveX -= acceleration;

    }
    if (d == true) {
        // shipSprite.x += 5  ; 
        shipSprite.moveX += acceleration;
    }
    if (w == true) {
        // shipSprite.y -= 5;
        shipSprite.moveY -= acceleration;
    }
    if (s == true) {
        //shipSprite.y += 5  ; 
        shipSprite.moveY += acceleration;
    }

    // if ship is off the right side of the screen make it come out left side

    if (shipSprite.x > canvas.width + 25) {
        shipSprite.x = -25;
    }

    else if (shipSprite.x < -25) {
        shipSprite.x = canvas.width + 25;
    }

    if (shipSprite.y > canvas.height + 25) {
        shipSprite.y = -25;
    }

    else if (shipSprite.y < -25) {
        shipSprite.y = canvas.height;
    }

    // if(shipSprite.x > canvas.width){
    //     shipSprite.x = 0;
    // }
    // if(shipSprite.x < 0){
    //     shipSprite.x = canvas.width  ;
    // }

    console.log(shipSprite.x);
    if (startPoint.y > canvas.height - 25 || startPoint.y < 0) {
        //startPoint.y = -25;
        moveDirection.y *= -1;
        boxColor = `rgb(${Math.random() * 255},${Math.random() * 255},${Math.random() * 255})`;
    }

    if (startPoint.x > canvas.width - 25 || startPoint.x < 0) {
        // startPoint.y = -25;
        moveDirection.x *= -1;
        boxColor = `rgb(${Math.random() * 255},${Math.random() * 255},${Math.random() * 255})`;

    }


    //Multiply by friction
    shipSprite.moveX *= friction;
    shipSprite.moveY *= friction;

    //update x and y position values
    shipSprite.x += shipSprite.moveX;
    shipSprite.y += shipSprite.moveY;

    //Bullet Firing code

    if (shootCooldown > 0) {
        shootCooldown--;

    }
    if (space && shootCooldown === 0) {
        bullets.push({
            x: shipSprite.x + 25 / 2 - 2,
            y: shipSprite.y + 25 / 2 - 10,
            width: 4,
            height: 10,
            speed: 8,
            color: "red"

        });
        clickerSound.play();
        shootCooldown = 10;
    }


    //Draws Background
    ctx.fillStyle = "black";


    ctx.fillRect(0, 0, canvas.width, canvas.height)

    //draws stars
    for (var i = 0; i < stars.length; i++) {





        //draw all the stars

        // var hitBox = shipSprite.x < stars[i].x + 25 &&
        //         shipSprite.x + 25 >stars[i].x  &&
        //         shipSprite.y  < stars[i].y +25  &&
        //         shipSprite.y +25 > stars[i].y ;


        //collide with star
        if (shipToStarCollision(shipSprite, stars[i])) {
            shipSprite.x = canvas.width / 2

            shipSprite.y = canvas.height / 2 + 100;
            shipSprite.moveX = 0;
            shipSprite.moveY = 0;
            score = 0;
            objectShot = 0;
            // return;
        }





        stars[i].drawCircle();
        stars[i].y++;
        if (stars[i].y > canvas.height + stars[i].radius * 2) {
            stars[i].x = Math.random() * canvas.width;
            stars[i].y = -(Math.random() * canvas.height);
            score += 10;
        }
    }
    //Draw and Check for bullet collision

    for (var i = bullets.length - 1; i > 0; i--) {
        var bullet = bullets[i];

        bullet.y -= bullet.speed;

        //Check for bullets that leave the screen
        if (bullet.y + bullet.height < 0) {
            bullets.splice(i, 1);
            continue;
        }

        var hitBox = bullet.x < startPoint.x + 25 &&
            bullet.x + bullet.width > startPoint.x &&
            bullet.y < startPoint.y + 25 &&
            bullet.y + bullet.width > startPoint.y;


        if (hitBox) {
            //remove bullet
            bullets.splice(i, 1);
            startPoint.x = 100000;
            moveDirection.x = 0;
            moveDirection.y = 0;
            objectShot += 1;
            boxShot = true; 


            continue;
        }



        if (boxShot == true) {
            if (boxCoolDown > 0) {
                boxCoolDown--;

            }
            if (boxCoolDown === 0) {
                startPoint.x = canvas.width/2
                startPoint.y = canvas.height/2
                moveDirection = { x: 1, y: 1 };
                boxCoolDown = 30;
                boxShot = false;
            }

        }




        for (var j = 0; j < stars.length; j++) {
            if (shipToStarCollision(bullet, stars[j])) {
                bullets.splice(i, 1);
                stars[j].x = Math.random() * canvas.width;
                stars[j].y = -(Math.random() * canvas.height);
                objectShot += 1;
                continue;
            }
        }
        ctx.fillStyle = bullet.color;
        ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height,)
    }

    //draws ship and box
    ctx.fillStyle = boxColor;
    ctx.fillRect(startPoint.x, startPoint.y, 25, 25);
    ctx.drawImage(shipSprite.image, shipSprite.x, shipSprite.y, 25, 25);


    //Draw our HUD elements

    ctx.fillStyle = "White";
    ctx.font = "30px Arial";
    ctx.fillText(`Score: ${score}`, 30, 80);
    ctx.fillText(`Objects Shot: ${objectShot}`, 550, 80);





}


function shipToStarCollision(obj, star) {

    var closestX = Math.max(obj.x, Math.min(star.x, obj.x + 25));
    var closestY = Math.max(obj.y, Math.min(star.y, obj.y + 25));

    var dx = star.x - closestX;
    var dy = star.y - closestY;

    var dist = dx * dx + dy * dy;
    return dist <= star.radius * star.radius;
}
