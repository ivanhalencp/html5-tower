var relPath = "tower/";

$include(relPath + "model/Animation.js");
$include(relPath + "model/AnimationManager.js");
$include(relPath + "model/Bullet.js");
$include(relPath + "model/Enemy.js");
$include(relPath + "model/Factories.js");
$include(relPath + "model/Game.js");
$include(relPath + "model/GameEntity.js");
$include(relPath + "model/Horde.js");
$include(relPath + "model/Level.js");
$include(relPath + "model/LogicMap.js");
$include(relPath + "model/Shot.js");
$include(relPath + "model/Tower.js");

function ResourceManager()
{
    this.grassImage = null;
    this.roadImage = null;
    this.grassBaseTower = null;
    this.towerImage = null;
    this.crosshairImage = null;
    this.alienImage = null;
    this.alien2Image = null;
    this.imagesLoaded = 0;
    this.allImagesLoaded = false;
    // INIT
    this.init = function(canvasManager)
    {
        this.grassImage = canvasManager.loadImage(relPath + "img/grass_2.png", this.imageLoaded(this));
        this.roadImage = canvasManager.loadImage(relPath + "img/road_1.png", this.imageLoaded(this));
        this.grassBaseTower = canvasManager.loadImage(relPath + "img/grassBaseTower_2.png", this.imageLoaded(this));
        this.towerImage = canvasManager.loadImage(relPath + "img/turret_2.png", this.imageLoaded(this));
        this.crosshairImage = canvasManager.loadImage(relPath + "img/crosshair_2.png", this.imageLoaded(this));
        this.alienImage = canvasManager.loadImage(relPath + "img/alien_2.png", this.imageLoaded(this));
        this.alien2Image = canvasManager.loadImage(relPath + "img/alien_3.png", this.imageLoaded(this));
    }
    this.imageLoaded = function(resourceManager)
    {
        resourceManager.imagesLoaded++;
        if (resourceManager.imagesLoaded == 7)
            resourceManager.allImagesLoaded = true;
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