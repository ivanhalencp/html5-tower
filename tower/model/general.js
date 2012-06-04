// BASIC CELL MAP
function LogicMap(width, height)
{
    this.width = width;
    this.height = height;
    this.map = [];
    // INITIALIZE MAP
    this.init = function()
    {
        this.map = new Array(this.width);
        for (var x = 0; x < this.width ; x++)
            this.map[x] = new Array(this.height);
        // RESET MAP
        this.reset(0);
    }
    // RESET MAP
    this.reset = function(typeId)
    {
        for (var x = 0; x < this.width ; x++)
            for (var y = 0; y < this.height; y++)
                this.map[x][y] = typeId;
    }
    // LOGIC CELL
    this.getLogicCell = function(x, y)
    {
        if (x < this.width && y < this.height)
            return this.map[x][y];
        else
            return -1;
    }
    this.setLogicCell = function (x, y, typeId)
    {
        this.map[x][y] = typeId;
    }
}
/*
 *  HORDE
 *  [actionTime] : Time when the horde comes into action
 *  [actionDelay] : Action time between enemies
 *  [path] : Route that the enemies should follow
 */
function Horde(actionTime, actionDelay, path)
{
    this.actionTime = actionTime;
    this.actionDelay = actionDelay;
    this.inAction = false;
    this.enemyFactory = new EnemyFactory();
    this.enemies = new Array();
    this.enemiesInAction = new Array();
    this.path = path;
    this.enemyActionIndex = 0;
    this.enemyDelayIndex = 0;
    this.currentQuadrant = 0;
    this.active = true;
    this.relativeQuadrantPositions = new Array(5);
    this.relativeQuadrantPositions[0] = new Vector2(12, -12);
    this.relativeQuadrantPositions[1] = new Vector2(0, 0);
    this.relativeQuadrantPositions[2] = new Vector2(-12, 12);
    this.relativeQuadrantPositions[3] = new Vector2(12, 12);
    this.relativeQuadrantPositions[4] = new Vector2(-12, -12);    
    this.addEnemy = function(type)
    {
        this.enemies.push(this.enemyFactory.getEnemy(type));
    }
    this.addEnemies = function(type, count)
    {
        for (var n = 0; n < count; n++)
        {
            this.enemies.push(this.enemyFactory.getEnemy(type));
        }
    }
    this.doAction = function(gameTimer)
    {
        var baseDamage = 0;
        var enemy = null;
        if (gameTimer >= this.actionTime)
            if (!this.inAction)
                this.inAction = true;
        if (this.inAction)
        {
            if (this.enemyActionIndex < this.enemies.length)
            {
                this.enemyDelayIndex++;
                if (this.enemyDelayIndex == this.actionDelay)
                {
                    enemy = this.enemies[this.enemyActionIndex];
                    enemy.realPosition = getRealCoords(path.points[0].x, path.points[0].y);
                    // QUADRANT ASSIGN
                    enemy.setRelativePosition(this.relativeQuadrantPositions[this.currentQuadrant++]);
                    if (this.currentQuadrant == this.relativeQuadrantPositions.length)
                        this.currentQuadrant = 0;
                    enemy.inAction = true;
                    this.enemiesInAction.push(enemy);
                    this.enemyActionIndex++;
                    this.enemyDelayIndex = 0;
                }
            }
            var enemyBaseDamage = 0;
            for (var enemyInActionIndex = 0; enemyInActionIndex < this.enemiesInAction.length; enemyInActionIndex++)
            {
                enemy = this.enemiesInAction[enemyInActionIndex];
                if (enemy.alive)
                {
                    enemyBaseDamage = enemy.doAction(this.path);
                    baseDamage += enemyBaseDamage;
                    if (enemyBaseDamage > 0)
                        enemy.alive = false;
                    // RESET ENEMY TARGETED
                    enemy.targeted = false;
                }
            }
        }
        return baseDamage;
    }
}
/*
 *   LEVEL
 */
function Level(name, initialMoney)
{
    this.name = name;
    this.map = new LogicMap(16, 12);
    this.initialMoney = initialMoney;
    this.paths = new Array();
    this.hordes = new Array();
    this.addPath = function(path)
    {
        this.paths.push(path);
    }
    this.addHorde = function(horde)
    {
        this.hordes.push(horde);
    }
    this.init = function()
    {
        this.map.init();
        // TEMPORARY ALL PATH POINT ARRAY (TO FIX CORNERS)
        var allPathPoints = new Array();
        // DRAW LOGIC PATH
        for (var pathIndex = 0; pathIndex < this.paths.length; pathIndex++)
        {
            for (var pointIndex = 0; pointIndex < this.paths[pathIndex].points.length - 1; pointIndex++)
            {
                var point = this.paths[pathIndex].points[pointIndex];
                var nextPoint = this.paths[pathIndex].points[pointIndex + 1];
                var pathDirection; // 6 right, 4 left, 8 up, 2 down
                var distance;
                if (nextPoint.x > point.x)
                {
                    pathDirection = 6;
                    distance = nextPoint.x - point.x;
                }
                else if (nextPoint.x < point.x)
                {
                    pathDirection = 4;
                    distance = point.x - nextPoint.x;
                }
                else if (nextPoint.y > point.y)
                {
                    pathDirection = 2;
                    distance = nextPoint.y - point.y;
                }
                else if (nextPoint.y < point.y)
                {
                    pathDirection = 8;
                    distance = point.y - nextPoint.y;
                }
                var pathDrawer = new Vector2(point.x, point.y);
                for (var i = 0; i < distance; i++)
                {
                    if (pathDrawer.x >= 0 && pathDrawer.y >= 0)
                    {
                        this.map.setLogicCell(pathDrawer.x, pathDrawer.y, 1);
                        allPathPoints.push(pathDrawer.x, pathDrawer.y);
                    }
                    if (pathDirection == 6)
                        pathDrawer.x++;
                    else if (pathDirection == 4)
                        pathDrawer.x--;
                    else if (pathDirection == 8)
                        pathDrawer.y--;
                    else if (pathDirection == 2)
                        pathDrawer.y++;
                }
            }
        }
        // FIX CORNERS - ASSIGN A SPECIFIC TYPE FOR VISUALLY REPRESENTING THE CORNERS
        /*for (var pathPointIndex = 0; pathPointIndex < allPathPoints.length; pathPointIndex++)
        {
            // TODO : IMPLEMENT THIS !
            var pathPoint = allPathPoints[pathPointIndex];
        }*/
    }
}
/*
 *  ENEMY
 */
function Enemy(id, type, armor, speed, damage, scoreReward, moneyReward)
{
    this.id = id;
    this.type = type;
    this.armor = armor;
    this.speed = speed;
    this.damage = damage;
    this.scoreReward = scoreReward;
    this.moneyReward = moneyReward;
    this.realPosition = new Vector2(0, 0);
    this.relativePosition = new Vector2(0, 0);
    this.energy = 100;
    this.inAction = false;
    this.alive = true;
    this.pathIndexTarget = 1;
    // TO DRAW SPRITE IN DIRECTION (2 : DOWN , 4 : LEFT, 6 : RIGHT, 8 : UP, 5 : NO INITIALIZED)
    this.direction = 5;
    // TO DRAW / OR NOT CROSSHAIRS OVER THE SPRITE
    this.targeted = false;
    this.setRelativePosition = function(relativePosition)
    {
        this.relativePosition = relativePosition;
        this.realPosition.add(this.relativePosition);
    }
    this.doAction = function(path)
    {
        // ENERGY BAR TEST
        if (this.targeted)
            this.onDamage(2);
        var baseDamage = 0;
        // MOVE INTO DE PATH
        var cellTarget = path.points[this.pathIndexTarget];
        var realTarget = getRealCoords(cellTarget.x, cellTarget.y);
        realTarget.add(this.relativePosition);
        var scalarSpeed = this.speed;
        var v2Speed = new Vector2(0, 0);
        if (this.realPosition.x < realTarget.x)
        {
            // SCALAR SPEED ADJUST (WHEN DISTANCE IS LESS THAN SPEED INCREMENT)
            if (realTarget.x - this.realPosition.x < scalarSpeed)
                scalarSpeed = realTarget.x - this.realPosition.x;
            v2Speed = new Vector2(scalarSpeed, 0);
            // [ MOVE TO THE RIGHT ]
            this.direction = 6;
        }
        else if (this.realPosition.x > realTarget.x)
        {
            if (this.realPosition.x - realTarget.x < scalarSpeed)
                scalarSpeed = this.realPosition.x - realTarget.x;
            v2Speed = new Vector2(scalarSpeed * -1, 0);
            // [ MOVE TO THE LEFT ]
            this.direction = 4;
        }
        else if (this.realPosition.y < realTarget.y)
        {
            if (realTarget.y - this.realPosition.y < scalarSpeed)
                scalarSpeed = realTarget.y - this.realPosition.y;
            v2Speed = new Vector2(0, scalarSpeed);
            // [ MOVE DOWN ]
            this.direction = 2;
        }
        else if (this.realPosition.y > realTarget.y)
        {
            if (this.realPosition.y - realTarget.y < scalarSpeed)
                scalarSpeed = this.realPosition.y - realTarget.y;
            v2Speed = new Vector2(0, scalarSpeed * -1);
            // [ MOVE UP ]
            this.direction = 8;
        }
        // ADD V2 SPEED
        this.realPosition.add(v2Speed);
        // IF REACH TARGET (CELL AND REAL POSITION)
        var cellPosition = getCellCoords(this.realPosition.x, this.realPosition.y);
        if (cellPosition.equal(cellTarget) && this.realPosition.equal(realTarget))
        {
            if (this.pathIndexTarget < path.points.length - 1)
                this.pathIndexTarget++;
            else
            {
                this.inAction = false;
                this.alive = false;
                baseDamage = this.damage;
            }
        }
        return baseDamage;
    }
    this.onDamage = function(damage)
    {
        var realDamage = damage - this.armor;
        if (realDamage > 0)
            this.energy -= realDamage;
        if (this.energy <= 0)
            this.alive = false;
        return this.alive;
    }
}
/*
 *  TOWER
 */
function Tower(id, type, attackRange, angularSpeed, bulletType, reloadTime)
{
    this.id = id;
    this.type = type;
    this.cellPosition = new Vector2(0, 0);
    this.realPosition = new Vector2(0, 0);
    this.attackRange = attackRange;
    this.angularSpeed = angularSpeed;
    this.bulletType = bulletType;
    this.reloadTime = reloadTime;
    this.reloadTimer = 0;
    this.turretAngle = 0;
    this.setCellPosition = function(cellPosition)
    {
        this.cellPosition = cellPosition;
        this.realPosition = getRealCoords(cellPosition.x, cellPosition.y);
    }
    this.doAction = function(enemies)
    {
        var enemy = null;
        var enemyIndex = 0;
        // IF FOUND ENEMY IN ATTACK RANGE
        var enemyFound = false;
        var radAngle;
        var degAngle;
        var angleDiff;
        var inverseAngleDiff;
        var fireIntent = null;
        // UPDATE RELOAD TIMER
        if (this.reloadTimer < this.reloadTime)
            this.reloadTimer++;
        while (enemyIndex < enemies.length && !enemyFound)
        {
            // RANGE CHECK
            enemy = enemies[enemyIndex];
            if (enemy.alive && distance(this.realPosition, enemy.realPosition) <= this.attackRange)
            {                
                enemyFound = true;                
                radAngle = yAxisAngle(this.realPosition, enemy.realPosition);
                degAngle = Math.round(radToDeg(radAngle));
                angleDiff = Math.abs(degAngle - this.turretAngle);
                // TRYING TO MAKE A MORE INTELLIGENT SENSE OF ROTATION
                // [-- START --]
                inverseAngleDiff = Math.abs(degAngle - (this.turretAngle + 360));
                if (angleDiff > 180)
                {
                    if (inverseAngleDiff < angleDiff)
                        this.turretAngle += 360;
                    else if (inverseAngleDiff > angleDiff)
                        this.turretAngle -= 360;
                }
                // [-- END --]
                if (this.turretAngle < degAngle)
                {
                    if (angleDiff >= this.angularSpeed)
                        this.turretAngle += this.angularSpeed;
                    else
                        // TO ADJUST ANGULAR MOVEMENT
                        this.turretAngle += angleDiff;
                }
                else if (this.turretAngle > degAngle)
                {
                    if (angleDiff >= this.angularSpeed)
                        this.turretAngle -= this.angularSpeed;
                    else
                        // TO ADJUST ANGULAR MOVEMENT
                        this.turretAngle -= angleDiff;
                }
                // TARGET IN CROSSHAIRS
                if (this.turretAngle == degAngle)
                {
                    // MARK ENEMY AS TARGETED
                    enemy.targeted = true;
                    if (this.reloadTimer == this.reloadTime)
                    {
                        fireIntent = new FireIntent(this, enemy);
                        // RESET RELOAD TIMER
                        this.reloadTimer = 0;
                    }
                }
            }
            else
                enemyIndex++;
        }
        return fireIntent;
    }
}
function FireIntent(tower, enemy)
{
    this.tower = tower;
    this.enemy = enemy;
}
function Bullet(id, type, speed, damage, damageRange)
{
    this.id = id;
    this.type = type;
    this.speed = speed;
    this.damage = damage;
    this.damageRange = damageRange;
    this.realPosition = null;
    this.target = null;
    this.targetPosition = null;
    this.init = function(realPosition, enemy)
    {
        this.realPosition = realPosition;
        this.targetPosition = enemy.realPosition;
        this.target = enemy;
    }
    this.doAction = function(enemies)
    {
        // MOVE
    }
}
// USE IT TO CREATE AND GET A NEW ENEMY
function EnemyFactory()
{
    var enemyOuid = 0;
    this.getEnemy = function(type)
    {
        var enemy;
        switch (type)
        {
            case "malito":
                enemy = new Enemy(enemyOuid++, type, 0, 1, 1, 15, 15);
                break;
        }
        return enemy;
    }
}
// USE IT TO CREATE AND GET A NEW TOWER
function TowerFactory()
{
    var towerOuid = 0;
    this.buildTower = function (type, cellPosition)
    {
        var tower = null;
        switch (type)
        {
            case "chinoky":
                tower = new Tower(towerOuid++, type, 100, 2, 1, 10);
                break;
        }
        if (tower != null && isset(cellPosition))
            tower.setCellPosition(cellPosition);
        return tower;
    }
}
// USE IT TO CREATE AND GET A NEW BULLET
function BulletFactory()
{
    // TODO
}
// THE GAME (CANVAS MANAGER REQUIRED)
function Game(canvasManager)
{
    this.canvasManager = canvasManager;
    this.state = "initializing";
    // FACTORIES
    this.towerFactory = new TowerFactory();
    this.enemyFactory = new EnemyFactory();
    this.bulletFactory = new BulletFactory();
    // COLLECTIONS OF ENTITIES
    this.enemies = new Array();
    this.towers = new Array();
    this.bullets = new Array();
    this.entities = new Array();
    // TO ADD A NEW TOWER
    this.towerTypeSelected = null;
    // REPRESENT THE CURRENT LEVEL WHERE IS PLAYING
    this.currentLevel = null;
    this.money = 0;
    this.score = 0;
    this.gameTimer = 0;
    this.interval = null;
    this.grassImage = null;
    this.roadImage = null;
    // INIT ALL
    this.init = function ()
    {
        // EVENTOS
        //this.canvasManager.onMouseDown(mouseDownHandler);
        // LOAD IMAGE DATA
        this.grassImage = this.canvasManager.loadImage("img/grass_1.png");
        this.roadImage = this.canvasManager.loadImage("img/road_1.png");
        this.grassBaseTower = this.canvasManager.loadImage("img/grassBaseTower_1.png");
        this.towerImage = this.canvasManager.loadImage("img/turret_1.png");
        this.crosshair = this.canvasManager.loadImage("img/crosshair_2.png");
        // TEST LEVEL
        this.currentLevel = new Level("test", 1500);
        this.money = this.currentLevel.initialMoney;
        // PATH DE PRUEBA
        var path = new Path();
        path.addPoint(-1, 8);
        path.addPoint(4, 8);
        path.addPoint(4, 4);
        path.addPoint(8, 4);
        path.addPoint(8, 8);
        path.addPoint(16, 8);
        this.currentLevel.addPath(path);
        var path2 = new Path();
        path2.addPoint(-1, 2);
        path2.addPoint(6, 2);
        path2.addPoint(6, 4);
        path2.addPoint(8, 4);
        path2.addPoint(8, 8);
        path2.addPoint(16, 8);
        this.currentLevel.addPath(path2);
        // HORDE
        var horde = new Horde(20, 50, path);
        horde.addEnemies("malito", 30);
        var horde2 = new Horde(50, 50, path2);
        horde2.addEnemies("malito", 50);
        this.currentLevel.addHorde(horde);
        this.currentLevel.addHorde(horde2);
        // INIT LEVEL
        this.currentLevel.init();
        // TOWER TEST
        this.addTower("chinoky", new Vector2(155, 155));
        this.addTower("chinoky", new Vector2(305, 255));
        this.addTower("chinoky", new Vector2(455, 155));
        this.addTower("chinoky", new Vector2(455, 355));
        this.state = "playing";
    }
    this.addTower = function(type, realPosition)
    {
        var cellPosition = getCellCoords(realPosition.x, realPosition.y);
        var towerAdded = false;
        if (this.currentLevel.map.getLogicCell(cellPosition.x, cellPosition.y) == 0)
        {
            var tower = this.towerFactory.buildTower(type, cellPosition);
            this.currentLevel.map.setLogicCell(cellPosition.x, cellPosition.y, 2);
            this.towers.push(tower);
            towerAdded = true;
        }
        return towerAdded;
    }
    // **********
    // DO ACTIONS
    // **********
    this.doActions = function()
    {
        this.gameTimer++;
        var enemiesInAction = new Array();
        // HORDES / ENEMIES ACTION
        for (var hordeIndex = 0; hordeIndex < this.currentLevel.hordes.length; hordeIndex++)
        {
            this.currentLevel.hordes[hordeIndex].doAction(this.gameTimer);
            enemiesInAction = enemiesInAction.concat(this.currentLevel.hordes[hordeIndex].enemiesInAction);
        }
        // TOWERS ACTION
        var fireIntent = null;
        for (var towerIndex = 0; towerIndex < this.towers.length; towerIndex++)
        {
            fireIntent = this.towers[towerIndex].doAction(enemiesInAction);
            if (fireIntent != null)
            {
                // TODO : CREATE A BULLET
            }
        }
    }
    // ********
    // DRAW ALL
    // ********
    // DRAW MAP
    this.drawMap = function()
    {
        // CLEAR CANVAS
        this.canvasManager.clear();
        // DRAW MAP CELLS
        for (var x = 0; x < this.currentLevel.map.width; x++)
        {
            for (var y = 0; y < this.currentLevel.map.height; y++)
            {
                typeId = this.currentLevel.map.getLogicCell(x, y);
                if (typeId == 0)
                    this.canvasManager.drawImage(this.grassImage, x * 50, y * 50);
                else if (typeId == 1)
                    this.canvasManager.drawImage(this.roadImage, x * 50, y * 50);
                else if (typeId == 2)
                    this.canvasManager.drawImage(this.grassBaseTower, x * 50, y * 50);
            }
        }
    }
    // DRAR ALL ENTITIES (ENEMIES / TOWERS / BULLETS)
    this.drawAll = function()
    {
        var currentEnemy = null;
        var currentTower = null;
        var enemyEnergyBarColor = "";
        var crosshairPosition = new Vector2(0, 0);
        // DRAW ENEMIES
        for (var hordeIndex = 0; hordeIndex < this.currentLevel.hordes.length; hordeIndex++)
        {
            for (var enemyIndex = 0; enemyIndex < this.currentLevel.hordes[hordeIndex].enemiesInAction.length; enemyIndex++)
            {
                currentEnemy = this.currentLevel.hordes[hordeIndex].enemiesInAction[enemyIndex];
                if (currentEnemy.alive)
                {
                    // DRAW ENEMY
                    this.canvasManager.drawCircle(currentEnemy.realPosition.x, currentEnemy.realPosition.y, 5, "white", "red");
                    if (currentEnemy.targeted)
                    {
                        crosshairPosition.x = currentEnemy.realPosition.x - (this.crosshair.width / 2);
                        crosshairPosition.y = currentEnemy.realPosition.y - (this.crosshair.height / 2);
                        this.canvasManager.drawImage(this.crosshair, crosshairPosition.x, crosshairPosition.y);
                    }
                    // DRAW ENERGY BAR
                    if (currentEnemy.energy > 50)
                        enemyEnergyBarColor = "green";
                    else if (currentEnemy.energy > 25)
                        enemyEnergyBarColor = "yellow";
                    else
                        enemyEnergyBarColor = "red";
                    this.canvasManager.drawRectangle(currentEnemy.realPosition.x - 12.5, currentEnemy.realPosition.y - 15, currentEnemy.energy / 4, 2, "white", enemyEnergyBarColor);
                }
            }
        }
        // TOWERS
        for (var towerIndex = 0; towerIndex < this.towers.length; towerIndex++)
        {
            currentTower = this.towers[towerIndex];
            this.canvasManager.drawSprite(this.towerImage, currentTower.realPosition.x, currentTower.realPosition.y, degToRad(currentTower.turretAngle), 1);
            this.canvasManager.drawCircle(currentTower.realPosition.x, currentTower.realPosition.y, currentTower.attackRange, "red");
        }
        // TEXTS
        this.canvasManager.drawText(" $" + this.money + " action:" + this.gameTimer.toString(), 8, 18, "12pt Arial", "yellow");
    }
    // SIMPLE GAME LOOP
    this.mainLoop = function ()
    {        
        switch (this.state)
        {
            case "initializing":
                this.init();
                break;
            case "playing":
                this.doActions();
                this.drawMap();
                this.drawAll();
                break;
        }
    }
    // START GAME
    this.start = function()
    {
        this.interval = setInterval("juego.mainLoop()", 20);
    }
    // MOUSE EVENT
    this.mouseDown = function(realX, realY)
    {
        var cellPosition = getCellCoords(x, y);
        //this.map.setLogicCell(celdaX, celdaY, 1);
        //this.towers.push(this.towerFactory.getTower("chinoky", x, y));
    }
    this.mouseUp = function(realX, realY)
    {
    }
    this.mouseOver = function(realX, realY)
    {
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