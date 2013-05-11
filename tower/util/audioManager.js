// @By ICP (ivanhalen@gmail.com)
//
//
function AudioManager()
{
    this.context;
    this.channels;
    this.channelPointer;
    this.bufferLoader;
    this.bufferList;
    this.onLoadHandler;
    // INITIALIZATION
    this.init = function(channelsCount)
    {
        var initResult;
        try
        {
            this.context = new webkitAudioContext();
            initResult = true;
            if (!isset(channelsCount))
                channelsCount = 10;
            this.createChannels(channelsCount);
        }
        catch (e)
        {
            divDebug("webkitAudio is not supported :(");
            this.context = null;
            initResult = false;
        }
        return initResult;
    };
    this.createChannels = function(channelsCount)
    {
        this.channels = new Array();
        for (var i = 0; i < channelsCount; i++)
        {
            this.channels.push(this.context.createBufferSource()); 
        }
        this.channelPointer = 0;
    };
    this.loadSounds = function(soundsList, onLoadHandler)
    {
        this.onLoadHandler = onLoadHandler;
        this.bufferLoader = new BufferLoader(this.context, soundsList, this.onLoadBufferList);
        this.bufferLoader.load();
    };
    this.onLoadBufferList = function(bufferList)
    {
        audioManager.bufferList = bufferList;
        audioManager.onLoadHandler();
    };
    this.playSound = function(soundIndex)
    {
        this.channels[this.channelPointer].buffer = this.bufferList[soundIndex];
        this.channels[this.channelPointer].connect(this.context.destination);
        this.channels[this.channelPointer].noteOn(0);
        this.channelPointer++;
    };
}

// UTILITY CLASS
function BufferLoader(context,urlList,callback)
{
    this.context=context;
    this.urlList=urlList;
    this.onload=callback;
    this.bufferList=new Array();
    this.loadCount=0;
}

BufferLoader.prototype.loadBuffer=function(url,index)
{
    var request=new XMLHttpRequest();
    request.open("GET",url,true);
    request.responseType="arraybuffer";
    var loader=this;
    request.onload=function()
    {
        loader.context.decodeAudioData(request.response, function(buffer)
        {
            if(!buffer)
            {
                alert('error decoding file data: '+url);
                return;
            }
            loader.bufferList[index]=buffer;
            if (++loader.loadCount === loader.urlList.length)
                loader.onload(loader.bufferList);
        }
        , function(error)
        {
            console.error('decodeAudioData error', error);
        });
   };
   request.onerror = function()
   {
       alert('BufferLoader: XHR error');
   };
   request.send();
};

BufferLoader.prototype.load = function()
{
    for(var i = 0; i < this.urlList.length; ++i)
        this.loadBuffer(this.urlList[i], i);
};