// BASIC CELL MAP
function LogicMap(width, height)
{
    this.width = width;
    this.height = height;
    this.map = [];
    this.terrainType = 1;
    // INITIALIZE MAP
    this.init = function()
    {
        this.map = new Array(this.width);
        for (var x = 0; x < this.width ; x++)
            this.map[x] = new Array(this.height);
        // RESET MAP
        this.reset(0);
    };
    // RESET MAP
    this.reset = function(typeId)
    {
        for (var x = 0; x < this.width ; x++)
            for (var y = 0; y < this.height; y++)
                this.map[x][y] = typeId;
    };
    // LOGIC CELL
    this.getLogicCell = function(x, y)
    {
        if (x < this.width && y < this.height)
            return this.map[x][y];
        else
            return -1;
    };
    this.setLogicCell = function (x, y, typeId)
    {
        this.map[x][y] = typeId;
    };
}