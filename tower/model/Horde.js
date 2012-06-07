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
    this.enemiesInActionCounter = 0;
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
                    this.enemiesInActionCounter++;
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
            //divDebug(this.enemies.length.toString() + " / " + this.enemiesInAction.length.toString());
        }
        return baseDamage;
    }
}