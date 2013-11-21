// BASIC CELL MAP
function LogicMap(width, height, layers)
{
    this.width = width;
    this.height = height;
    if (!$isset(layers))
        layers = 1;
    this.layers = layers;
    this.map = [layers];
    this.terrainType = 1;
    // INITIALIZE MAP
    this.init = function()
    {
        for (var i = 0; i < this.layers; i++)
        {
            this.map[i] = new Array(this.width);
            for (var x = 0; x < this.width ; x++)
                this.map[i][x] = new Array(this.height);
            // RESET MAP
            this.reset(0, i);
        }
    };
    // RESET MAP
    this.reset = function(typeId, layer)
    {
        if (!$isset(layer))
            layer = 0;
        for (var x = 0; x < this.width ; x++)
            for (var y = 0; y < this.height; y++)
                this.map[layer][x][y] = typeId;
    };
    // LOGIC CELL
    this.getLogicCell = function(x, y, layer)
    {
        if (!$isset(layer))
            layer = 0;
        if (x < this.width && y < this.height)
            return this.map[layer][x][y];
        else
            return -1;
    };
    this.setLogicCell = function (x, y, typeId, layer)
    {
        if (!$isset(layer))
            layer = 0;
        this.map[layer][x][y] = typeId;
    };
}