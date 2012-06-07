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
    // TO KNOW WHEN ANIMATION FINISH
    this.animationFrames = 0;
    // TO DRAW CURRENT ANIMATION FRAME
    this.animationIndex = 0;
    // TO DRAW / OR NOT CROSSHAIRS OVER THE SPRITE
    this.targeted = false;
    this.setRelativePosition = function(relativePosition)
    {
        this.relativePosition = relativePosition;
        this.realPosition.add(this.relativePosition);
    }
    this.doAction = function(path)
    {
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