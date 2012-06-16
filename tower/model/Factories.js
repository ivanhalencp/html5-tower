// USE IT TO CREATE AND GET A NEW BULLET
function BulletFactory()
{
    var bulletOuid = 0;
    this.buildBullet = function(shot)
    {
        var tower = shot.tower;
        var bullet = null;
        switch (tower.type)
        {
            case "chinoky":
                bullet = new Bullet(bulletOuid++, "chinoky_bullet", 6, 15, 15);
                break;
        }
        if (bullet != null)
            bullet.init(tower.realPosition.copy(), shot.enemy, tower.turretAngle);
        return bullet;
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
                enemy = new Enemy(enemyOuid++, type, 0, .7, 1, 15, 15);
                break;
            case "maluko":
                enemy = new Enemy(enemyOuid++, type, 5, .7, 2, 20, 20);
                break;
        }
        return enemy;
    }
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
                tower = new Tower(towerOuid++, type, 70, 2, 1, 20);
                break;
        }
        if (tower != null && isset(cellPosition))
            tower.setCellPosition(cellPosition);
        return tower;
    }
}