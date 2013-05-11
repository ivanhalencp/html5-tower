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
    this.doAnimation = function()
    {
        if (this.framesCount > 0)
        {
            this.delayTimer++;
            if (this.delayTimer >= this.delay)
            {
                this.frameIndex++;
                this.delayTimer = 0;
                if (this.frameIndex === this.framesCount)
                    this.frameIndex = 0;
            }
            this.frameRect.x = this.frameWidth * this.frameIndex;
        }
    };
}