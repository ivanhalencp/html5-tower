// USE IT TO CREATE AND GET A NEW BULLET
function BulletFactory()
{
    var bulletOuid = 0;
    this.buildBullet = function(shot)
    {
        var tower = shot.tower;
        var bullet = null;
        switch (shot.bulletType)
        {
            case "smallDamage":
                bullet = new Bullet(bulletOuid++, shot.bulletType, 6, 15, 15);
                break;
             case "mediumDamage":
                bullet = new Bullet(bulletOuid++, shot.bulletType, 6, 15, 30);
                break;
             case "laser":
                bullet = new Bullet(bulletOuid++, shot.bulletType, -1, 50, 5);
                break;
        }
        if (bullet !== null)
            bullet.init(tower.realPosition.copy(), shot.enemy, tower.turretAngle, tower.cannonLenght);
        return bullet;
    };
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
                enemy = new Enemy(enemyOuid++, type, 3, .7, 10, 15, 15);
                break;
            case "maluko":
                enemy = new Enemy(enemyOuid++, type, 7, 1, 25, 20, 20);
                break;
        }
        return enemy;
    };
}
// USE IT TO CREATE AND GET A NEW TOWER
function TowerFactory()
{
    var towerOuid = 0;
    this.buildTower = function(type, cellPosition)
    {
        var tower = null;
        switch (type)
        {
            case "chinoky":
                tower = new Tower(towerOuid++, type, 70, 2, "smallDamage", 20, 50, 25);
                /* IDEA OF JSON INIT */
                tower.jsonInit(
                    {
                        id: towerOuid++,
                        type: type,
                        cannonLenght: 25,
                        levels: 
                        [
                            // LEVEL 1
                            {attackRange: 70, angularSpeed: 2, bulletType: "smallDamage", reloadTime: 20, cost: 50},
                            // LEVEL 2
                            {attackRange: 90, angularSpeed: 3, bulletType: "smallDamage", reloadTime: 10, cost: 50}, 
                            // LEVEL 3
                            {attackRange: 110, angularSpeed: 5, bulletType: "smallDamage", reloadTime: 5, cost: 50}
                        ]
                    }
                );            
                break;
            case "chinoky_2":
                tower = new Tower(towerOuid++, type, 210, 5, "mediumDamage", 10, 100, 25);
                break;
            case "tesla":
                tower = new Tower(towerOuid++, type, 250, 90, "laser", 60, 150, 0);
                break;
        }
        if (tower !== null && isset(cellPosition))
            tower.setCellPosition(cellPosition);
        return tower;
    };
}
// USE IT TO CREATE AND GET A NEW RANDOM CLOUD
function CloudFactory()
{
    var cloudOuid = 0;
    var windSpeed = new Vector2(.3, 0);
    this.buildClouds = function(screenLimits, amount)
    {
        var clouds = new Array();
        for (var n = 0; n < amount; n++)
        {
            clouds.push(this.buildCloud(screenLimits));
        }
        return clouds;
    };
    this.buildCloud = function(screenLimits)
    {
        var typeIndex = Math.floor(Math.random() * 3) + 1;
        var cloudInitialPosition = new Vector2(0, 0);                
        cloudInitialPosition.set(Math.floor(Math.random() * screenLimits.x), Math.floor(Math.random() * screenLimits.y));                
        var cloud = new Cloud(cloudOuid++, "cloud_" + typeIndex, cloudInitialPosition, windSpeed, screenLimits);        
        return cloud;
    };
}