function ResourceManager()
{
    // IMAGES
    this.images = new Array();
    this.imagesIndexAssoc = new Array();
    this.imageLoadedCount = 0;
    this.allImagePreLoaded = false;
    // SOUNDS
    this.sounds = new Array();
    this.soundsIndexAssoc = new Array();
    this.soundLoadedCount = 0;
    this.allSoundsPreLoaded = false;
    // INIT (CREATE IMAGES DEFINITIONS / LOAD ALL IMAGES)
    this.init = function(canvasManager)
    {
        // IMAGES
        this.addImage("grass", relPath + "img/grass_3.png");
        this.addImage("road", relPath + "img/road_2.png");
        this.addImage("towerBase", relPath + "img/baseTower_3.png");
        this.addImage("crosshair", relPath + "img/crosshair_2.png");
        this.addImage("mouseCrosshair", relPath + "img/mouseCrosshair_1.png");
        this.addImage("alien_1", relPath + "img/alien_2.png");
        this.addImage("alien_2", relPath + "img/alien_3.png");
        //this.addImage("tower", relPath + "img/turret_3.png");
        this.addImage("tower", relPath + "img/turretAnimation.png");
        this.addImage("laserTower", relPath + "img/laserTurret_1.png");
        this.addImage("moneyBox", relPath + "img/moneyBox.png");
        this.addImage("gameOver", relPath + "img/gameOver_1.png");
        this.addImage("optionBox", relPath + "img/optionBox.png");
        this.loadImages(canvasManager);
        // SOUNDS
        //this.addSound("echo", relPath + "sound/echo.mp3");
        //this.loadSounds();
    };
    // [CREATE / ADD / ASSOCIATE] IMAGES DEFINITIONS
    this.addImage = function (id, imageSrc)
    {
        var imageDef = new Array();
        imageDef['id'] = id;
        imageDef['src'] = imageSrc;
        imageDef['image'] = null;
        this.imagesIndexAssoc[id] = this.images.push(imageDef) - 1;
    };
    // [CREATE / ADD / ASSOCIATE] SOUNDS DEFINITIONS
    this.addSound = function (id, soundSrc)
    {
        var soundDef = new Array();
        soundDef['id'] = id;
        soundDef['src'] = soundSrc;
        soundDef['sound'] = null;
        this.soundsIndexAssoc[id] = this.sounds.push(soundDef) - 1;
    };
    // LOAD ALL IMAGES
    this.loadImages = function(canvasManager)
    {
        var imageDef;
        for (var i = 0; i < this.images.length; i++)
        {
            imageDef = this.images[i];
            imageDef['image'] = canvasManager.loadImage(imageDef['src'], this.imageLoaded(this));
        }
    };
    // LOAD ALL SOUNDS
    this.loadSounds = function()
    {
        var soundDef;
        for (var i = 0; i < this.sounds.length; i++)
        {
            soundDef = this.sounds[i];
            soundDef['sound'] = new Audio(soundDef['src']);
        }
    };
    // IMAGE PRELOAD
    this.imageLoaded = function(resourceManager)
    {        
        resourceManager.imageLoadedCount++;
        if (resourceManager.imageLoadedCount === resourceManager.images.length)
            resourceManager.allImagePreLoaded = true;
    };
    // CHECK COMPLETE IMAGE LOADING
    this.allImagesLoaded = function()
    {
        var complete = false;
        if (this.allImagePreLoaded)
        {
            //divDebug("preloaded...");
            var i = 0;
            complete = true;
            while (i < this.images.length && complete)
            {
                //var image = this.images[i]['image'];
                if (this.images[i]['image'] === false)
                //if (image.complete === false)
                    complete = false;
                // divDebug("Image " + this.images[i]['id'] + " : " + complete);
                i++;
            }
        }
        return complete;
    };
    // GET IMAGE BY ID
    this.getImage = function(id)
    {
        return this.images[this.imagesIndexAssoc[id]]['image'];
    };
    // PLAY A SOUND BY ID
    this.playSound = function(id)
    {
        var sound = this.sounds[this.soundsIndexAssoc[id]]['sound'];
        if (sound.complete)
        {
            sound.pause();
            sound.currentTime = 0;
            sound.play();
        }
    };
}