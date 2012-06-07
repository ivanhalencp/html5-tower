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
        var horde = new Horde(20, 100, path);
        horde.addEnemies("malito", 100);
        var horde2 = new Horde(50, 100, path2);
        horde2.addEnemies("malito", 150);
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
        var shot = null;
        var bullet;
        for (var towerIndex = 0; towerIndex < this.towers.length; towerIndex++)
        {
            shot = this.towers[towerIndex].doAction(enemiesInAction);
            if (shot != null)
            {
                bullet = this.bulletFactory.buildBullet(shot);
                this.bullets.push(bullet);
            }
        }
        // BULLET ACTIONS
        for (var bulletIndex = 0; bulletIndex < this.bullets.length; bulletIndex++)
        {
            bullet = this.bullets[bulletIndex];
            if (bullet.active)
                bullet.doAction();
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
    // DRAW ALL ENTITIES (ENEMIES / TOWERS / BULLETS)
    this.drawAll = function()
    {
        var currentEnemy = null;
        var currentTower = null;
        var currentBullet = null;
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
        // BULLETS
        for (var bulletIndex = 0; bulletIndex < this.bullets.length; bulletIndex++)
        {
            currentBullet = this.bullets[bulletIndex];
            if (currentBullet.active)
                this.canvasManager.drawCircle(currentBullet.realPosition.x, currentBullet.realPosition.y, 2, "blue", "#CCCCCC");
        }
        // TEXTS
        this.canvasManager.drawText(" $" + this.money + " action:" + this.gameTimer.toString(), 8, 18, "12pt Arial", "yellow");
    }
    // DESTROY INACTIVE ENEMIES, HORDES AND BULLETS
    this.deadBodiesCollect = function()
    {
        // ENEMIES AND HORDES
        var hordeIndex = 0;
        var enemyIndex;
        var horde = null;
        var enemy = null;
        var enemiesAlive;
        while (hordeIndex < this.currentLevel.hordes.length)
        {
            horde = this.currentLevel.hordes[hordeIndex];
            enemiesAlive = false;
            enemyIndex = 0;
            while (enemyIndex < horde.enemiesInAction.length)
            {
                enemy = horde.enemiesInAction[enemyIndex];
                if (enemy.alive)
                {
                    enemyIndex++;
                    enemiesAlive = true;
                    //divDebug(enemy.inAction.toString() + ", index: " + enemyIndex);
                }
                else
                {
                    horde.enemiesInAction.splice(enemyIndex, 1);
                    //divDebug("destroy enemy...");
                }
            }
            hordeIndex++;
            /*if (enemiesAlive || !horde.inAction)
                hordeIndex++;
            else
            {
                this.currentLevel.hordes.splice(hordeIndex, 1);
                divDebug("destroy horde...");
                //this.state = "paused";
            }*/
        }
        // BULLETS
        var bulletIndex = 0;
        var bullet;
        while (bulletIndex < this.bullets.length)
        {
            bullet = this.bullets[bulletIndex];
            if (bullet.active)
                bulletIndex++;
            else
            {
                this.bullets.splice(bulletIndex, 1);
                //divDebug("destroy bullet...");
            }
        }
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
                this.deadBodiesCollect();
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