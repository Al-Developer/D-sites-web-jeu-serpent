window.onload = function ()
 {
     // width = largeur
     // height = longeur
    var canvasWidth = 900;
    var canvasHeight = 600;
    var blockSize = 30;
    var ctx;
    var delay = 100;
    var snakee;
    var applee;
    var widthInBlocks = canvasWidth/blockSize;
    var heightInBlocks = canvasHeight/blockSize;
    var score;
    var timeout;

    init();
    
    
    function init()
      {
        var canvas = document.createElement('canvas');
        canvas.width = canvasWidth;
        canvas.height = canvasHeight;
        canvas.style.border = "30px solid gray";
        canvas.style.margin = "50px auto";
        canvas.style.display = "block";
        canvas.style.backgroundColor = "#ddd";
        document.body.appendChild(canvas);
        ctx = canvas.getContext('2d');
        snakee = new Snake([[6,4], [5,4], [4,4]], "right");
        applee = new Apple([10,10]);
        score = 0;
        refreshCanvas();
     }

    function refreshCanvas()
     {
        snakee.advance();
            if(snakee.checkCollision())
            {   // execution d'une fonction
                gameOver();
            }
            else
            {
                if(snakee.isEatingApple(applee))
                {    
                    score++;
                    snakee.ateApple = true;
                    do
                    {   // pomme replace toi
                        applee.setNewPosition();
                    }   // verifier que cette nouvelle position est bonne sinon recommence
                    while(applee.isOnSnake(snakee))
                }
                ctx.clearRect(0, 0, canvasWidth, canvasHeight);
                drawScore();
                snakee.draw();
                applee.draw();
                // refait la fonction refreshCanvas apres un certain delay
                timeout = setTimeout(refreshCanvas,delay);
            }
        
     }
    // creation de la fonction
    function gameOver()
        {   // on garde les paramatres comme la couleurs etcc avec avec restore on les remet apres notre fonction
            ctx.save();
            ctx.font = "bold 70px sans-serif";
            ctx.fillStyle = "black";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.strokeStyle = "white";
            ctx.lineWidth = 5;
            var centreX = canvasWidth / 2;
            var centreY = canvasHeight / 2;
            ctx.strokeText("Game Over", centreX, centreY - 180);
            ctx.fillText("Game Over", centreX, centreY - 180);
            ctx.font = "bold 30px sans-serif";
            ctx.lineWidth = 4;
            ctx.strokeText("Appuyer sur la touche Espace pour rejoue", centreX, centreY - 120);
            ctx.fillText("Appuyer sur la touche Espace pour rejouer", centreX, centreY - 120);
            ctx.restore();
        }
     function restart()
     {
        snakee = new Snake([[6,4], [5,4], [4,4]], "right");
        applee = new Apple([10,10]);
        score = 0;
        clearTimeout(timeout);
        refreshCanvas();
     }   
     function drawScore()
     {
        ctx.save();
        ctx.font = "bold 200px sans-serif";
        ctx.fillStyle = "gray";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle"
        var centreX = canvasWidth / 2;
        var centreY = canvasHeight / 2;
        ctx.fillText(score.toString(), centreX, centreY );
        ctx.restore();
     }
     function drawBlock(ctx, position)
     {
         var x = position[0] * blockSize;
         var y = position[1] * blockSize;
         ctx.fillRect(x ,y , blockSize, blockSize);
     }
     function Snake(body, direction)
     {
         this.body = body;
         this.direction =direction;
         this.ateApple = false;
         this.draw = function()
         {
             // c'est pour sauvegarder sont contexet comme il etait avant (avant de rentrer dans cette donction)
            ctx.save();
            ctx.fillStyle = "#ff0000";
            for(var i = 0; i < this.body.length; i++)
            {
                drawBlock(ctx, this.body[i]);
            }
            ctx.restore();
         };
         this.advance = function()
         {
             var nextPosition = this.body[0].slice();
             switch(this.direction)
             {
                 case "left":
                     nextPosition[0] -= 1;
                    break;
                 case "right":
                     nextPosition[0] += 1;
                     break;
                 case "down":
                     nextPosition[1] += 1;
                     break;
                 case "up":
                     nextPosition[1] -= 1;    
                     break;
                 default:    
                     throw("Invalid Direction");    
             }
             // rajouter a la tete du serpent, ajouter un element 
                this.body.unshift(nextPosition);
             // si serpent mange une pomme alors il ne fais pas le pop
             if(!this.ateApple)
             // suprime le dernier element du tableau (le dernier block du serpent)
                this.body.pop();
             else
             this.ateApple = false;

         };
         this.setDirection = function(newDirection)
         {
            var allowedDirections;
            switch(this.direction)
            {
                 case "left":
                 case "right":
                     allowedDirections = ["up", "down"];
                     break;
                 case "down":
                 case "up":
                     allowedDirections = ["left", "right"];   
                     break
                 default:    
                     throw("Invalid Direction");
            }
            if(allowedDirections.indexOf(newDirection) > -1)
            {
                this.direction = newDirection;
            }
         };
         this.checkCollision = function()
         {
             var wallCollision = false;
             var snakeCollision = false;
             var head = this.body[0];
             var rest = this.body.slice(1);
             var snakeX = head[0];
             var snakeY = head[1];
             var minX = 0;
             var minY = 0;
             var maxX = widthInBlocks -1;
             var maxY = heightInBlocks -1;
             var isNotBetweenHorizontalWalls = snakeX < minX || snakeX > maxX;
             var isNotBetweenVerticalWalls = snakeY < minY || snakeY > maxY;
             
             if(isNotBetweenHorizontalWalls || isNotBetweenVerticalWalls)
             {
                 wallCollision = true;
             }
             for(var i = 0; i < rest.length ; i++)
             {
                 if(snakeX === rest[i][0] && snakeY === rest[i][1] )
                 {
                     snakeCollision = true;               
                 }
             }
             return wallCollision || snakeCollision;

         };
         // ca c'est une methode
         this.isEatingApple = function(appleTopEat)
         { // la tete est egal au corps a la place [0]
            var head = this.body[0];
            // une verification
            if(head[0] === appleTopEat.position[0] && head[1] === appleTopEat.position[1])
            {
                return true;
            }
            else
                return false;
         };
    
    }

    function Apple(position)
    {
        this.position = position;
        this.draw = function()
        {
            ctx.save();
            ctx.fillStyle = "#33cc33";
            ctx.beginPath();
            var radius = blockSize/2;
            var x = this.position[0]*blockSize + radius;
            var y = this.position[1]*blockSize + radius;
            ctx.arc(x,y, radius, 0, Math.PI*2, true);
            ctx.fill();
            ctx.restore();
        };
        this.setNewPosition = function()
        {   // donne un chiffre entre 0 et 29
            var newX = Math.round(Math.random() * (widthInBlocks -1));
            var newY = Math.round(Math.random() * (heightInBlocks -1));
            // donner la nouvelle position a la pomme
            this.position = [newX, newY];

        };
        this.isOnSnake = function(snakeToCheck)
        {   // non je ne suis pas sur le serpent
            var isOnSnake = false;
            // passer sur tout le coprs du serpent avec une boucle, i (la boucle) part de 0 et parcours tout le corps du snake 
            for (var i = 0; i < snakeToCheck.length; i++)
            {   // la on verifie si la pomme est sur le serpent le X et le Y
                if(this.position[0] === snakeToCheck.body[i][0] && this.position[1] === snakeToCheck.body[i][1])
                {   
                    isOnSnake = true;
                }
            } 
            return isOnSnake;
        };
    }

    document.onkeydown = function handleKeyDown(e)
    {
        var key = e.keyCode;
        var newDirection;
        switch(key)
        {
            case 37:
                newDirection = "left";
                break;
            case 38:
                newDirection = "up";
                break;
            case 39:
                newDirection = "right";
                break;
            case 40:
                newDirection = "down";
                break;
            case 32:
                restart();  
                return;  
            default:    
                return;
        }
        snakee.setDirection(newDirection);
    }

 }