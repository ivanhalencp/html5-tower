function Bullet(id, type, speed, damage, damageRange)
{
    this.id = id;
    this.type = type;
    this.speed = speed;
    this.damage = damage;
    this.damageRange = damageRange;
    this.realPosition = null;
    this.enemyTarget = null;
    this.targetPosition = null;
    this.distance = 0;
    this.v2Speed = null;
    this.active = true;
    this.init = function(initPosition, enemy, angle)
    {
        this.realPosition = initPosition;
        this.targetPosition = enemy.realPosition.copy();
        this.enemyTarget = enemy;
        this.v2Speed = getDirectionVector(this.speed, degToRad(angle) - (Math.PI / 2));
    }
    this.doAction = function()
    {
        var impact = false;
        var targetDistance;
        switch (this.type)
        {
            case "chinoky_bullet":
                this.realPosition.add(this.v2Speed);
                targetDistance = distance(this.realPosition, this.targetPosition)
                if (targetDistance < this.speed)
                    impact = true;
                break;
        }
        if (impact)
        {
            if (this.enemyTarget.alive)
            {
                if (distance(this.realPosition, this.enemyTarget.realPosition) <= this.damageRange)
                {
                    this.enemyTarget.onDamage(this.damage);
                    //divDebug("impact...");
                }
                //else
                  //  divDebug("distance: " + distance(this.realPosition, this.enemyTarget.realPosition).toString());
            }
            this.active = false;
        }
    }
}