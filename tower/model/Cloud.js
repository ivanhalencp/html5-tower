function Cloud(id, type, realPosition, speed, screenLimits)
{
    // ENTITIES SUPERCLASS (GAMEENTITY)
    this.superClass = GameEntity;
    this.superClass();
    this.id = id;
    this.type = type;
    this.realPosition = realPosition;
    this.speed = speed;
    this.screenLimits = screenLimits;
    this.doAction = function()
    {
        this.realPosition.add(this.speed);
        this.outOfScreenCheck();
    };
    this.outOfScreenCheck = function()
    {
        if (this.realPosition.x > this.screenLimits.x)
            this.respawn();
    };
    this.respawn = function()
    {        
        this.realPosition.set(-150, Math.floor(Math.random() * this.screenLimits.y));
        this.type = 'cloud_' + (Math.floor(Math.random() * 3) + 1).toString();     
        //alert(this.type);
    };
}
