function AnimationManager(resourceManager)
{
    this.animationCounter = 0;
    this.animations = new Array();
    this.resourceManager = resourceManager;
    this.initAnimation = function(entity)
    {
        //alert("id:" + entity.id);
        var image;
        var animation;
        // TOWERS
        if (entity instanceof Tower)
        {
            switch (entity.type)
            {
                case "chinoky":
                    image = this.resourceManager.getImage('tower');
                    // animation = new Animation(image, image.width / 2, image.height, 2, 15);
                    animation = new Animation(image, image.width, image.height, 1, 15);
                    break;
                case "chinoky_2":
                    image = this.resourceManager.getImage('tower');
                    // animation = new Animation(image, image.width / 2, image.height, 2, 15);
                    animation = new Animation(image, image.width, image.height, 1, 15);
                    break;
            }
        }
        // ENIMIES
        else if (entity instanceof Enemy)
        {
            switch (entity.type)
            {
                case "malito":                    
                    image = this.resourceManager.getImage('alien_1');
                    animation = new Animation(image, image.width / 4, image.height, 4, 15);
                    break;
                case "maluko":
                    image = this.resourceManager.getImage('alien_2');
                    animation = new Animation(image, image.width / 4, image.height, 4, 15);
                    break;
            }
        }
        // BULLETS
        else if (entity instanceof Bullet)
        {
            // TODO
        }
        // ADD ANIMATION
        this.animations.push(animation);
        entity.animationIndex = this.animationCounter++;
    };
    // GET ENTITY ANIMATION
    this.getAnimation = function(entity)
    {
        if (entity.animationIndex === -1)
            this.initAnimation(entity);
        return this.animations[entity.animationIndex];
    };
    this.getImage = function(entity)
    {
        return this.animations[entity.animationIndex].imageSrc;
    };
    this.getFrameRect = function(entity)
    {
        return this.animations[entity.animationIndex].frameRect;
    };
    this.doAnimations = function()
    {
        for (var itAnimation = 0; itAnimation < this.animations.length; itAnimation++)
        {
            this.animations[itAnimation].doAnimation();
        }
    };
}