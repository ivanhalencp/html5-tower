/*
 *  TOWER
 */
function Tower(id, type, attackRange, angularSpeed, bulletType, reloadTime, cost)
{
    // ENTITIES SUPERCLASS (GAMEENTITY)
    this.superClass = GameEntity;
    this.superClass();
    this.id = id;
    this.type = type;
    this.cellPosition = new Vector2(0, 0);
    this.attackRange = attackRange;
    this.angularSpeed = angularSpeed;
    this.bulletType = bulletType;
    this.reloadTime = reloadTime;
    this.cost = cost;
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
        var shot = null;
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
                        shot = new Shot(this, enemy);
                        // RESET RELOAD TIMER
                        this.reloadTimer = 0;
                    }
                }
            }
            else
                enemyIndex++;
        }
        return shot;
    }
}