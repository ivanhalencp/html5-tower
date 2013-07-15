// SIMPLE ANIMATION
function Animation(imageSrc, frameWidth, frameHeight, framesCount, delay)
{
    this.imageSrc = imageSrc;
    this.frameWidth = frameWidth;
    this.frameHeight = frameHeight;
    this.frameRect = new Rectangle(0, 0, frameWidth, frameHeight);
    this.framesCount = framesCount;
    this.delay = delay;
    this.delayTimer = 0;
    this.frameIndex = 0;
    this.scenes = [{name:"default", firstFrame:0, lastFrame:framesCount - 1, gotoAndPlay:""}];
    // SET THE CURRENT SCENE
    this.setScene = function(sceneName)
    {
        var i = 0;
        var found = false;
        while (i < this.scenes.length && !found)
        {
            if (this.scenes[i].name === sceneName)
            {
                this.currentScene = this.scenes[i];
                this.frameIndex = this.currentScene.firstFrame;
                found = true;
            }
            else
                i++;
        }
    };
    // INIT DEFAULT SCENE ANIMATION
    this.setScene("default");
    // TO DE ANIMATION (SET THE CURRENT FRAMERECT TO DRAW THE SPRITE)
    this.doAnimation = function()
    {
        if (this.framesCount > 0)
        {
            this.delayTimer++;
            if (this.delayTimer >= this.delay)
            {
                this.frameIndex++;
                this.delayTimer = 0;
                if (this.frameIndex > this.currentScene.lastFrame) //  framesCount)
                {
                    if (this.currentScene.gotoAndPlay === "")
                        this.frameIndex = this.currentScene.firstFrame;
                    else
                        this.setScene(this.currentScene.gotoAndPlay);
                }    
                
            }
            this.frameRect.x = this.frameWidth * this.frameIndex;
        }
    };
}