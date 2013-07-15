// @By ICP (ivanhalen@gmail.com)
//
//
function CanvasManager(canvasId)
{
    this.canvas = document.getElementById(canvasId);
    this.context = this.canvas.getContext("2d");
    this.width = this.canvas.width;
    this.height = this.canvas.height;
    // CLEAR
    this.clear = function()
    {
        this.context.clearRect(0, 0, this.width, this.height);
    };
    // DRAW TEXT
    this.drawText = function(text, x, y, fontName, color)
    {
        this.context.save();
        this.context.font = fontName;
        this.context.fillStyle = color;
        this.context.fillText(text, x, y);
        this.context.restore();
    };
    // DRAW LINEA
    this.drawLine = function(x1, y1, x2, y2, lineColor)
    {
        this.context.save();
        this.context.strokeStyle = lineColor;  
        this.context.beginPath();
        this.context.moveTo(x1, y1);
        this.context.lineTo(x2, y2);
        this.context.closePath();
        this.context.stroke();
        this.context.restore();
    };
    // DRAW / FILL RECTANGLE
	this.drawRectangle = function(x, y, width, height, borderColor, backgroundColor)
	{
        this.context.save();
        if (isset(borderColor))
        {
            this.context.strokeStyle = borderColor;
            this.context.strokeRect(x, y, width, height);
        }
        if (isset(backgroundColor))
        {
            this.context.fillStyle = backgroundColor;
            this.context.fillRect(x, y, width, height);
        }
        this.context.restore();
	};
    // DRAW / FILL CIRCLE
	this.drawCircle = function (x, y, radius, borderColor, backgroundColor)
	{
        this.context.save();
        if (isset(borderColor))
            this.context.strokeStyle = borderColor;
        if (isset(backgroundColor))
            this.context.fillStyle = backgroundColor;
        this.context.beginPath();
		this.context.arc(x, y, radius, 0, Math.PI * 2, false);
		this.context.closePath();
        if (isset(borderColor))
            this.context.stroke();
        if (isset(backgroundColor))
            this.context.fill();
        this.context.restore();
	};
    // LOAD IMAGE
    this.loadImage = function(imageSrc, onLoadHandler)
    {
        var image = new Image();
        image.src = imageSrc;
        if (isset(onLoadHandler))
            image.onload = onLoadHandler;
        return image;
    };
    // DRAW IMAGE
    this.drawImage = function(image, x, y)
    {
        this.context.drawImage(image, x, y);
    };
    // DRAW SPRITE
    this.drawSprite = function(image, x, y, rotation, scale, section)
    {
        var spriteWidth = image.width;
        var spriteHeight = image.height;
        this.context.save();
        this.context.translate(x, y);
        this.context.rotate(rotation);
        if (isset(scale))
            this.context.scale(scale, scale);
        if (!isset(section))
            section = new Rectangle(0, 0, spriteWidth, spriteHeight);
        // PARAMS (IMAGEOBJECT, SOURCEX, SOURCEY, SOURCEWIDTH, SOURCEHEIGHT,
        //         DESTINATIONX, DESTINATIONY, DESTINATIONWIDTH, DESTINATIONHEIGHT)
        this.context.drawImage(image, section.x, section.y, section.width, section.height, -section.width/2, -section.height/2, section.width, section.height);
        this.context.restore();
    };
    this.drawEnergyBar = function(direction, x, y, energy, rectWidth, borderColor, energyColor, sense)
    {
        var width, height;
        if (!isset(sense))
            sense = 1;
        if (direction === "h")
        {
            width = energy * sense;
            height = rectWidth;
        }
        else
        {
            width = rectWidth;
            height = energy * sense;
        }
        this.drawRectangle(x, y, width, height, borderColor, energyColor);
    };
    // SAVE IMA
    this.getImageData = function(section)
    {
        if (!isset(section))
            section = new Rectangle(0, 0, this.width, this.height);
        var imageData = this.context.getImageData(section.x, section.y, section.width, section.height);
        return imageData;
    };
    this.putImageData = function(imageData, x, y)
    {
        if (!isset(x))
            x = 0;
        if (!isset(y))
            y = 0;
        this.context.putImageData(imageData, x, y);
    };
    // OTHERS
    this.hideMousePointer = function()
    {
        this.canvas.style.cursor = "none";
    };
    this.showMousePointer = function()
    {
        this.canvas.style.cursor  = "pointer";
    };
}
// SIMPLE RECTANGLE IMPLEMENTATION
function Rectangle(x, y, width, height)
{
	this.x = x;
	this.y = y;
	this.width = width;
	this.height = height;
	this.copy = function(rectangle)
	{
		this.x = rectangle.x;
		this.y = rectangle.y;
		this.width = rectangle.width;
		this.height = rectangle.height;
	};
    this.translation = function(vector)
    {
        this.x += vector.x;
        this.y += vector.y;
    };
}
// SIMPLE VECTOR 2 IMPLEMENTATION
function Vector2(x, y)
{
    this.x = x;
    this.y = y;
    this.set = function(x, y)
    {
        this.x = x;
        this.y = y;
    };
    this.add = function(vector)
    {
        this.x += vector.x;
        this.y += vector.y;
    };
    this.mult = function(scalar)
    {
        this.x *= scalar;
        this.y *= scalar;
    };
    this.equal = function(vector)
    {
        if (this.x === vector.x && this.y === vector.y)
            return true;
        else
            return false;
    };
    this.copy = function()
    {
        var vector = new Vector2(this.x, this.y);
        return vector;
    };
}
// SIMPLE POINT
function PathPoint(x, y)
{
    this.x = x;
    this.y = y;
}
// GROUP OF POINTS
function Path()
{
    this.points = new Array();
    this.pointsCount = 0;
    this.addPoint = function (x, y)
    {
        var point = new PathPoint(x, y);
        this.pointsCount = this.points.push(point);
        return point;
    };
}
// GENERAL UTIL
function isset(param)
{
    var result;
    if (typeof(param) === 'undefined')
        result = false;
    else
        result = true;
    return result;
}
// CONVERT DEGREE TO RAD (USE IT TO CONVERT ROTATION PARAM, IF YOU WANT...)
function degToRad(degAngle)
{
    return degAngle * Math.PI / 180;
}
// CONVERT RAD TO DEGREE
function radToDeg(radAngle)
{
    return radAngle * 180 / Math.PI;
}
// DISTANCE BETWEEN 2 POINTS
function distance(p1, p2)
{
    return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
}
// ANGLE BETWEEN X AXIS AND POINT
function xAxisAngle(axisCenterPoint, point)
{
    var hypo = distance(axisCenterPoint, point);
    var radAngle = 0;
    if (hypo !== 0)
    {
        var xDiff = point.x - axisCenterPoint.x;
        var yDiff = point.y - axisCenterPoint.y;
        var ady = Math.abs(xDiff);
        var op = Math.abs(yDiff);
        if (op === 0)
            radAngle = Math.PI;
        else if (ady !== 0)
        {
            radAngle = Math.atan(op / ady);
            if (xDiff > 0 && yDiff < 0)
                radAngle *= -1;
            else if (xDiff < 0 && yDiff > 0)
                radAngle = Math.PI - radAngle;
            else if (xDiff < 0 && yDiff < 0)
                radAngle += Math.PI;
        }
        // FIX DIVISION BY ZERO
        else
        {
            if (yDiff > 0)
                radAngle = Math.PI / 2;
            else
                radAngle = Math.PI * 1.5;
        }
    }
    return radAngle;
}
// ANGLE BETWEEN Y AXIS AND POINT
function yAxisAngle(axisCenterPoint, point)
{
    var radAngle = xAxisAngle(axisCenterPoint, point) + (Math.PI / 2);
    return radAngle;
}
// GET VECTOR DIRECTOR
function getDirectionVector(magnitude, radAngle)
{
    var vx = magnitude * Math.cos(radAngle);
    var vy = magnitude * Math.sin(radAngle);
    return new Vector2(vx, vy);
}