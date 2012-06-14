// @By ICP (ivanhalen@gmail.com)
//
//
var onDataListener;
var onErrorListener;

function $post(url, data, pOnDataListener, pOnErrorListener)
{
    onDataListener = pOnDataListener;
    onErrorListener = pOnErrorListener;
    if (window.XMLHttpRequest)
    {
        req = new XMLHttpRequest();
        req.onreadystatechange = $onRequestChange;
        req.open('POST', url, true);
        req.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        req.send(data);
    }
    else if (window.ActiveXObject)
    {
        req = new ActiveXObject('Microsoft.XMLHTTP')
        if (req)
        {
            req.onreadystatechange = $onRequestChange;
            req.open('POST', url, true);
            req.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
            req.send(data);
        }
    }
}

function $onRequestChange()
{
    if (req.readyState == 4)
    {
        if (req.status == 200)
        {
           onDataListener(req.responseText);
        }
        else
            onErrorListener(req.responseText);
    }
}

function $jsonEval(jsonData)
{
    return eval('(' + jsonData + ')');
}