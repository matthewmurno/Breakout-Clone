let counter = 0;
let score = 0;
var lives = 3;
var level = 1;
let ballHistory = [];

export class Breakout {
    constructor(canvas, keyMap) {
        // save canvas and keyMap as members
        this.canvas = canvas;
        this.keyMap = keyMap;
        
        // set size of canvas
        canvas.width = 640;
        canvas.height = 480;
        
        // save canvas context as member
        this.ctx = canvas.getContext('2d'); 

        this.Box = new Box();
        this.Box.xVel = 0; // units: pixels per frame
        this.Box.yVel = 2;
        this.Box.minX = (this.canvas.width/2)-5;
        this.Box.minY = this.canvas.height-200;
        this.Box.width = 10;
        this.Box.height = 10;
        this.Box.positions = [];

        this.initializeBricks()

        //paddle
        this.paddle = new Box();
        this.paddle.minX = (this.canvas.width/2)-75;
        this.paddle.minY = this.canvas.height-50;
        this.paddle.isPaddle = true;
        this.paddle.width = 150;
        this.paddle.height = 10;
        this.paddle.color = [255, 255, 255];


        this.prevDraw = 0;

        // state variables
        this.welcome = true;
        this.gameOver = false;
        this.paused = false;

    } 

    initializePaddle() {
        this.paddle.minX = (this.canvas.width/2)-75;
        this.paddle.minY = this.canvas.height-50;
        this.paddle.isPaddle = true;
        this.paddle.width = 150;
        this.paddle.height = 10;
        this.paddle.color = [255, 255, 255];
    }

    initializeBall() {
        this.Box = new Box();
        this.Box.xVel = 0; // units: pixels per frame
        this.Box.yVel = 2;
        this.Box.minX = (this.canvas.width/2)-5;
        this.Box.minY = this.canvas.height-200;
        this.Box.width = 10;
        this.Box.height = 10;
        this.Box.positions = [];
    }

    initializeBricks() {
        this.bricks = [];

        let specialBricks = [];

        for (let i = 0; i < level; i++) {
            // picking random indexes
            let indices = Math.floor(Math.random() * 40);

            if (specialBricks.indexOf(indices) === -1) {
                specialBricks.push(indices);
            }
            else {
                // If the random index is already in the specialBricks array, decrement the loop counter
                i--;
            }
        }



        const baseColor = [getRandomInt(50, 200), getRandomInt(50, 200), getRandomInt(50, 200)];

        for (let i = 0; i < 40; i++) {
            this.bricks.push(new Box())
            this.bricks[i].minX = i % 8 * (60 + 20) + 2;
            this.bricks[i].minY = Math.floor(i / 8)*(20+10)+30;
            this.bricks[i].width = 75;
            this.bricks[i].height = 20;
            this.bricks[i].IsActive = true;
            this.bricks[i].IsBreakable = true;
            this.bricks[i].color = [
                baseColor[0] + getRandomInt(-10, 10),
                baseColor[1] + getRandomInt(-10, 10),
                baseColor[2] + getRandomInt(-10, 10)
            ];

            if (specialBricks.indexOf(i) !== -1) {
                this.bricks[i].isSpecial = true;
                this.bricks[i].IsBreakable = false;
                this.bricks[i].height = 10;
                this.bricks[i].minY = Math.floor(i / 8)*(20+10)+35;
                this.bricks[i].color = [
                    baseColor[0] + getRandomInt(-60, -40),
                    baseColor[1] + getRandomInt(-60, -40),
                    baseColor[2] + getRandomInt(-60, -40)
                ];
            }
        }

        function getRandomInt(min, max) {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        }
    }

    drawGooglyEyesPupils() {
      const eyeRadius = 6;
      const pupilRadius = 3;
      const eyeOffsetX = 40;
      const eyeOffsetY = 5;

      const leftEyeCenterX = this.paddle.minX + eyeOffsetX;
      const leftEyeCenterY = this.paddle.minY + eyeOffsetY;
      const rightEyeCenterX = this.paddle.minX + this.paddle.width - eyeOffsetX;
      const rightEyeCenterY = this.paddle.minY + eyeOffsetY;

      const ballCenterX = this.Box.minX + this.Box.width / 2;
      const ballCenterY = this.Box.minY + this.Box.height / 2;
    
      const leftPupilDist = Math.sqrt(Math.pow(ballCenterX - leftEyeCenterX, 2) + Math.pow(ballCenterY - leftEyeCenterY, 2));
      const rightPupilDist = Math.sqrt(Math.pow(ballCenterX - rightEyeCenterX, 2) + Math.pow(ballCenterY - rightEyeCenterY, 2));
      const maxDist = eyeRadius - pupilRadius * 2 - 2;
      const leftPupilX = leftEyeCenterX + (ballCenterX - leftEyeCenterX) / leftPupilDist * maxDist;
      const leftPupilY = leftEyeCenterY + (ballCenterY - leftEyeCenterY) / leftPupilDist * maxDist;
      const rightPupilX = rightEyeCenterX + (ballCenterX - rightEyeCenterX) / rightPupilDist * maxDist;
      const rightPupilY = rightEyeCenterY + (ballCenterY - rightEyeCenterY) / rightPupilDist * maxDist;
    
      this.ctx.fillStyle = '#000000';
      this.ctx.beginPath();
      this.ctx.arc(leftEyeCenterX, leftEyeCenterY, eyeRadius, 0, Math.PI * 2);
      this.ctx.fill();
    
      this.ctx.fillStyle = '#000000';
      this.ctx.beginPath();
      this.ctx.arc(rightEyeCenterX, rightEyeCenterY, eyeRadius, 0, Math.PI * 2);
      this.ctx.fill();

      const leftAngle = Math.atan2(ballCenterY - leftEyeCenterY, ballCenterX - leftEyeCenterX);
      const rightAngle = Math.atan2(ballCenterY - rightEyeCenterY, ballCenterX - rightEyeCenterX);
      
      this.ctx.fillStyle = '#FFFFFF';
      this.ctx.save();
      this.ctx.translate(leftPupilX, leftPupilY);
      this.ctx.rotate(leftAngle);
      this.ctx.beginPath();
      this.ctx.arc(0, 0, pupilRadius, 1, Math.PI * 2);
      this.ctx.fill();
      this.ctx.restore();
    
      this.ctx.save();
      this.ctx.translate(rightPupilX, rightPupilY);
      this.ctx.rotate(rightAngle);
      this.ctx.beginPath();
      this.ctx.arc(0, 0, pupilRadius, 1, Math.PI * 2);
      this.ctx.fill();
      this.ctx.restore();
    }
    
    drawGooglyEyes() {
        const eyeRadius = 10;
        const eyeOffsetX = 40;
        const eyeOffsetY = 5;
      
        this.ctx.fillStyle = '#ffffff';
        this.ctx.beginPath();
        this.ctx.arc(this.paddle.minX + eyeOffsetX, this.paddle.minY + eyeOffsetY, eyeRadius, 0, Math.PI * 2);
        this.ctx.arc(this.paddle.minX + this.paddle.width - eyeOffsetX, this.paddle.minY + eyeOffsetY, eyeRadius, 0, Math.PI * 2);
        this.ctx.fill();
    }

    mainLoop() {
        // Compute the FPS
        // First get #milliseconds since previous draw
        const elapsed = performance.now() - this.prevDraw;

        if (elapsed < 1200/60) {
            return;
        }
        // 1000 seconds = elapsed * fps. So fps = 1000/elapsed
        const fps = 1200 / elapsed;
        // Write the FPS in a <p> element.
        
        this.update();
        this.draw(Math.round(fps));
    }

    update() {
        if (this.keyMap['ArrowLeft'] && !this.paused) {
            this.paddle.minX -= 3;
            if (this.paddle.minX < 0) {
                this.paddle.minX = 0;
            }
        }
        if (this.keyMap['ArrowRight'] && !this.paused) {
            this.paddle.minX += 3;
            if (this.paddle.minX + this.paddle.width > this.canvas.width) {
                this.paddle.minX = this.canvas.width - this.paddle.width;
            }
        }
        
        if (this.keyMap[' '] && this.welcome) {
            this.initializeBall();
            this.initializeBricks();
            this.initializePaddle();
            this.welcome = false;
        }

        if (this.keyMap['p'] && !this.gameOver && !this.welcome) {
            this.paused = !this.paused;
        }
        
        if (this.paused) {
            return;
        }

        //press space when game ends to start a new game
        if (this.keyMap[' '] && this.gameOver && !this.welcome) {
            lives = 3;
            counter = 0;
            score = 0;
            level = 1;
            this.initializeBall();
            this.initializeBricks();
            this.initializePaddle();
            this.gameOver = false;
            
        }

        const obstacles = [this.paddle];
        
        const topEdge = new Box();
        topEdge.minX = 0;
        topEdge.minY = -10;
        topEdge.width = this.canvas.width;
        topEdge.height = 10;
        obstacles.push(topEdge);
        
        const leftEdge = new Box();
        leftEdge.minX = -10;
        leftEdge.minY = 0;
        leftEdge.width = 10;
        leftEdge.height = this.canvas.height;
        obstacles.push(leftEdge);

        const rightEdge = new Box();
        rightEdge.minX = this.canvas.width;
        rightEdge.minY = 0;
        rightEdge.width = 10;
        rightEdge.height = this.canvas.height;
        obstacles.push(rightEdge);

        this.Box.update(obstacles.concat(this.bricks));
        if (!this.gameOver && !this.welcome) {
            //if the ball goes off the screen
            if (this.Box.minY > this.canvas.height) {
                this.initializeBall();
                    lives -= 1;
                    ballHistory = [];
            }

            //if there are no boxes
            if (counter == 40) {
                counter = 0;
                level++;
                this.initializeBricks();
                this.initializeBall();
            }
        
            //game over
            if (lives == 0) {
                this.gameOver = true;
            }
        }
    }

    draw(fps) {
        // clear background
        this.ctx.fillStyle = "rgb(10, 10, 10)";
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height); 
        
        if (this.welcome) {
            let x = "Welcome";
            let y = "Press Space to play and P to pause"
            this.ctx.font = "50px serif";
            this.ctx.textAlign = "center";
            this.ctx.fillStyle = 'rgb(255,255,255)';
            this.ctx.fillText(x, this.canvas.width/2, this.canvas.height/2)  
            this.ctx.font = "20px serif";
            this.ctx.textAlign = "center";
            this.ctx.fillStyle = 'rgb(255,255,255)';         
            this.ctx.fillText(y, this.canvas.width/2, this.canvas.height/2+25)   
        }
        
        if (this.gameOver) {
            let x = "Game Over";
            let y = "Press Space to play again"
            let z = "Score: " + score;
            this.ctx.font = "50px serif";
            this.ctx.textAlign = "center";
            this.ctx.fillStyle = 'rgb(255,0,0)';
            this.ctx.fillText(x, this.canvas.width/2, this.canvas.height/2)  
            this.ctx.font = "20px serif";
            this.ctx.textAlign = "center";
            this.ctx.fillStyle = 'rgb(255,255,255)';         
            this.ctx.fillText(z, this.canvas.width/2, this.canvas.height/2+25)   
            this.ctx.font = "20px serif";
            this.ctx.textAlign = "center";
            this.ctx.fillStyle = 'rgb(255,255,255)';         
            this.ctx.fillText(y, this.canvas.width/2, this.canvas.height/2+50)   
        }

        if (this.paused) {
            let x = "Paused";
            this.ctx.font = "50px serif";
            this.ctx.textAlign = "center";
            this.ctx.fillStyle = 'rgb(255,255,255)';
            this.ctx.fillText(x, this.canvas.width/2, this.canvas.height/2)  
        }

        if (!this.gameOver && !this.welcome) {
            this.ctx.font = "15px serif";
            this.ctx.textAlign = "left";
            this.ctx.fillStyle = 'rgb(255,255,255)';         
            this.ctx.fillText("Number of Lives: "  + lives, 5, 15);
            this.ctx.font = "15px serif";
            this.ctx.textAlign = "center";
            this.ctx.fillStyle = 'rgb(255,255,255)';         
            this.ctx.fillText("Score: "  + score, this.canvas.width/2, 15);
            this.ctx.font = "15px serif";
            this.ctx.textAlign = "right";
            this.ctx.fillStyle = 'rgb(255,255,255)';         
            this.ctx.fillText("FPS: "  + fps, this.canvas.width-5, 15);

            this.Box.drawCircle(this.ctx);
            
            // Draw the Paddle
            this.paddle.draw(this.ctx);

            this.drawGooglyEyes();
            this.drawGooglyEyesPupils()

            // Draw the bricks
            for (let i = 0; i < 40; i++) {
                if (this.bricks[i].IsActive == true) {
                    this.bricks[i].draw(this.ctx);
                }
            }    
        }
    
        // Save the value of performance.now() for FPS calculation
        this.prevDraw = performance.now();
    }
}

class Box {
    constructor() {
        this.minX;
        this.minY;
        this.width;
        this.height;
        this.IsActive = true;
        this.IsBreakable = false;
        this.isPaddle = false;
        this.isSpecial = false;
        this.xVel = 1;
        this.yVel = 1;  
        this.color = [255, 0, 0];
    }

    intersects(box2) {

            const circleX = this.minX + (this.width / 2);
            const circleY = this.minY + (this.height / 2);
            const rectCenterX = box2.minX + (box2.width / 2);
            const rectCenterY = box2.minY + (box2.height / 2);

            const dx = Math.max(Math.abs(circleX - rectCenterX) - box2.width / 2, 0);
            const dy = Math.max(Math.abs(circleY - rectCenterY) - box2.height / 2, 0);
            return Math.sqrt(dx * dx + dy * dy) <= this.width / 2;
        
    }


    update(obstacles) {
        // move x and y
     
        // move x
        this.minX += this.xVel;
        for (const o of obstacles) {
            if (this.intersects(o) && o.IsActive == true) {
                // undo the step that caused the collision
                this.minX -= this.xVel;
                
                // reverse xVel to bounce
                this.xVel *= -1;

                if (o.IsActive == true && o.IsBreakable == true) {
                    o.IsActive = false;
                    playSound();
                    score++;
                    counter++;
                }

                if (o.isSpecial && !o.IsBreakable) {
                    o.IsBreakable = true;
                    playSound();
                }
            }
        }

        // move y
        this.minY += this.yVel;

        for (const o of obstacles) {
            if (this.intersects(o) && o.IsActive == true) {
                // undo the step that caused the collision
                this.minY -= this.yVel;
                
                if (o.isPaddle == true) {
                    const dist = (o.minX+o.width/2 - this.minX+this.width/2)
                    const ratio = -dist/(o.width / 2)
                    this.xVel = ratio * 5;
                }

                // reverse yVel to bounce
                this.yVel *= -1;

                if (o.IsActive == true && o.IsBreakable == true) {
                    o.IsActive = false;
                    playSound();
                    score++;
                    counter++;
                }

                if (o.isSpecial && !o.IsBreakable) {
                    o.IsBreakable = true;
                    playSound();
                }

            }  
        } 

        this.positions.push({ x: this.minX, y: this.minY });
        if (this.positions.length > 50) {
            this.positions.shift();
        }

    
    }


    draw(ctx) {
        const [r,g,b] = this.color;
        ctx.fillStyle = `rgb(${r},${g},${b})`;
        ctx.fillRect(this.minX, this.minY, this.width, this.height);                
    }

    drawCircle(ctx) {
        const [r, g, b] = this.color;
        const centerX = this.minX + this.width / 2;
        const centerY = this.minY + this.height / 2;
        const radius = Math.min(this.width, this.height) / 2;
        ctx.lineWidth = 4; 

        for (let i = 1; i < this.positions.length; i++) {
        const prevPosition = this.positions[i - 1];
        const currentPosition = this.positions[i];

        const prevCenterX = prevPosition.x + this.width / 2;
        const prevCenterY = prevPosition.y + this.height / 2;

        const currentCenterX = currentPosition.x + this.width / 2;
        const currentCenterY = currentPosition.y + this.height / 2;

        const distanceToCenter = Math.sqrt(
            (currentCenterX - prevCenterX) ** 2 + (currentCenterY - prevCenterY) ** 2
        );

        const opacity = 1 - distanceToCenter / (radius * 2); 

        ctx.strokeStyle = `rgba(${r},${g},${b}, ${opacity})`;

        ctx.beginPath();
        ctx.moveTo(prevCenterX, prevCenterY);
        ctx.lineTo(currentCenterX, currentCenterY);
        ctx.stroke();
        }

        ctx.fillStyle = `rgb(${r},${g},${b})`;
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
        ctx.fill();
    }
}

function playSound() {
    var context = new AudioContext()
    var a = context.createOscillator()
    var g = context.createGain()
    a.type = "triangle"
    var frequency = 116.5;
    a.frequency.value = frequency
    a.connect(g)
    g.connect(context.destination)
    a.start()
    g.gain.exponentialRampToValueAtTime(0.00001, context.currentTime + 1)
    setTimeout(1); // stop audio after duration
  }