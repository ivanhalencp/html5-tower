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
                /* IDEA OF JSON INIT 
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
                            {attackRange: 70, angularSpeed: 2, bulletType: "smallDamage", reloadTime: 20, cost: 50}, 
                            // LEVEL 3
                            {attackRange: 70, angularSpeed: 2, bulletType: "mediumDamage", reloadTime: 20, cost: 50}
                        ]
                    }
                ); */              
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