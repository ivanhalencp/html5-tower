function ResourceManager()
{
    this.images = new Array();
    this.imagesIndexAssoc = new Array();
    this.imageLoadedCount = 0;
    this.allImagePreLoaded = false;
    // INIT (CREATE IMAGES DEFINITIONS / LOAD ALL IMAGES)
    this.init = function(canvasManager)
    {
        this.addImage("grass", relPath + "img/grass_2.png");
        this.addImage("road", relPath + "img/road_1.png");
        this.addImage("towerBase", relPath + "img/baseTower_3.png");
        this.addImage("crosshair", relPath + "img/crosshair_2.png");
        this.addImage("mouseCrosshair", relPath + "img/mouseCrosshair_1.png");
        this.addImage("alien_1", relPath + "img/alien_2.png");
        this.addImage("alien_2", relPath + "img/alien_3.png");
        this.addImage("tower", relPath + "img/turret_3.png");
        this.addImage("moneyBox", relPath + "img/moneyBox.png");
        this.addImage("gameOver", relPath + "img/gameOver_1.png");
        this.loadImages(canvasManager);
    }
    // [CREATE / ADD / ASSOCIATE] IMAGES DEFINITIONS
    this.addImage = function (id, imageSrc)
    {
        var imageDef = new Array();
        imageDef['id'] = id;
        imageDef['src'] = imageSrc;
        imageDef['image'] = null;
        this.imagesIndexAssoc[id] = this.images.push(imageDef) - 1;
    }
    // LOAD ALL IMAGES
    this.loadImages = function(canvasManager)
    {
        var imageDef;
        for (var i = 0; i < this.images.length; i++)
        {
            imageDef = this.images[i];
            imageDef['image'] = canvasManager.loadImage(imageDef['src'], this.imageLoaded(this));
        }
    }
    // IMAGE PRELOAD
    this.imageLoaded = function(resourceManager)
    {
        resourceManager.imageLoadedCount++;
        if (resourceManager.imageLoadedCount == resourceManager.images.length)
            resourceManager.allImagePreLoaded = true;
    }
    // CHECK COMPLETE IMAGE LOADING
    this.allImagesLoaded = function()
    {
        var complete = false;
        if (this.allImagePreLoaded)
        {
            var i = 0;
            complete = true;
            while (i < this.images.length && complete)
            {
                if (!this.images[i]['image'].complete)
                    complete = false;
                i++;
            }
        }
        return complete;
    }
    // GET IMAGE BY ID
    this.getImage = function(id)
    {
        return this.images[this.imagesIndexAssoc[id]]['image'];
    }
}