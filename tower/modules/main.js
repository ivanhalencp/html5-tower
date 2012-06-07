$include("model/Bullet.js");
$include("model/Enemy.js");
$include("model/Factories.js");
$include("model/Game.js");
$include("model/Horde.js");
$include("model/Level.js");
$include("model/LogicMap.js");
$include("model/Shot.js");
$include("model/Tower.js");

// SIMPLE ANIMATION
/* function Animation(imageSrc, frameRect, framesCount, delay)
{
    this.imageSrc = imageSrc;
    this.frameRect = frameRect;
    this.framesCount = framesCount;
    this.delay = delay;
    this.frameIndex = 0;
    this.drawCurrentFrame = function(canvasManager, realPosition, angle)
    {
        // TODO
    }
}
function AnimationManager()
{
    // TODO : IMPLEMENT THIS!
}*/


// RETURN CELL COORDINATES FROM REAL COORDINATES
function getCellCoords(realX, realY)
{
    var x = Math.floor(realX / 50);
    var y = Math.floor(realY / 50);
    return new Vector2(x, y);
}
// RETURN REAL COORDINATES FROM CELL COORDINATES
function getRealCoords(cellX, cellY)
{
    var x = (cellX * 50) + 25;
    var y = (cellY * 50) + 25;
    return new Vector2(x, y);
}
// DEBUG TO DEBUG DIV
function divDebug(str)
{
    document.getElementById("debugWindow").innerHTML = str;
}
// EVENTS
function mouseDownHandler(ev)
{
    var x, y;
    // Get the mouse position relative to the canvas element.
    if (ev.offsetX || ev.offsetX == 0)
    {
        // OPERA / CHROME
        x = ev.offsetX;
        y = ev.offsetY;
    }
    else if (ev.layerX || ev.layerX == 0)
    {
        // FIREFOX
        x = ev.layerX;
        y = ev.layerY;
        // OFFSET DEL CANVAS
        if (this.offsetLeft)
            x = x - this.offsetLeft;
        if (this.offsetTop)
            y = y - this.offsetTop;
    }
    juego.mouseDown(x, y);
}