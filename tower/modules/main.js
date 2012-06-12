$include("model/Animation.js");
$include("model/AnimationManager.js");
$include("model/Bullet.js");
$include("model/Enemy.js");
$include("model/Factories.js");
$include("model/Game.js");
$include("model/GameEntity.js");
$include("model/Horde.js");
$include("model/Level.js");
$include("model/LogicMap.js");
$include("model/Shot.js");
$include("model/Tower.js");

function ResourceManager()
{
    this.grassImage = null;
    this.roadImage = null;
    this.grassBaseTower = null;
    this.towerImage = null;
    this.crosshairImage = null;
    this.alienImage = null;
    // INIT
    this.init = function(canvasManager)
    {
        this.grassImage = canvasManager.loadImage("img/grass_1.png");
        this.roadImage = canvasManager.loadImage("img/road_1.png");
        this.grassBaseTower = canvasManager.loadImage("img/grassBaseTower_1.png");
        this.towerImage = canvasManager.loadImage("img/turret_2.png");
        this.crosshairImage = canvasManager.loadImage("img/crosshair_2.png");
        this.alienImage = canvasManager.loadImage("img/alien_1.png");
    }
}

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