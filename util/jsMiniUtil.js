// @By ICP (ivanhalen@gmail.com)
//
//
// OBTENER ELEMENTO POR ID
function $(id)
{
    return document.getElementById(id);
}
// OBTENER ELEMENTO POR NOMBRE
function $name(name)
{
    return document.getElementsByName(name);
}
// SETEAR VALOR DE UNA PROPIEDAD CSS A UN ELEMENTO
function $cssSet(element, param, value)
{
    element.style[param] = value;
}
// OBTENER VALOR DE UNA PROPIEDAD CSS DE UN ELEMENTO
function $cssGet(element, param)
{
    return element.style[param];
}
// CSS SET (PARA UN ELEMENTO O UN CONJUNTO DE ELEMENTOS) / GET
function $css(element, param, value)
{
     var paramValue = "";
     if (typeof(value) != 'undefined')
     {
        if ($isArray(element))
        {
            for (var n = 0; n < $count(element); n++)
            {
                element[n].style[param] = value;
            }
        }
        else
        {
            element.style[param] = value;
            paramValue = element.style[param];
        }
     }
     else
         paramValue = element.style[param];
     return paramValue;
}
// AGREGAR CLASE CSS (NO FUNCA EN BROWSER DEL ANDROID)
function $addClass(element, className)
{
    element.classList.add(className);
}
// QUITAR CLASE CSS (NO FUNCA EN BROWSER DEL ANDROID)
function $removeClass(element, className)
{
    if (element.classList.contains(className))
        element.classList.remove(className);
}
// SETEAR CLASE CSS A UN ELEMENTO
function $className(element, className)
{
    element.className = className;
}
// OBTENER GRUPO DE ELEMENTOS POR TAG NAME (div, p, td, etc...)
function $groupByTagName(tagName)
{
    var elements = document.getElementsByTagName(tagName);
    return elements;
}

// OBTENER GRUPO DE ELEMENTOS HIJOS DE UN ELEMENTO
function $childs(parent)
{
    var childs = new Array();
    if (parent.hasChildNodes())
        childs = parent.childNodes;
    return childs;
}
// BUSQUEDA DE TIPO LIKE O ESTRICTA POR ID SOBRE UN DETERMINADO GRUPO DE ELEMENTOS
/*
 *  Si se define elemento padre(parent), busca en los hijos de ese elemento, si no
 *  busca en los elementos del body.
 */
function $find(id, like, parent)
{
    if (typeof(like) == 'undefined')
        like = false;
    if (typeof(parent) == 'undefined')
        parent = document.body;
    var elements = new Array();
    if (parent.hasChildNodes())
    {
        var childs = parent.childNodes;
        for (var n = 0; n < $count(childs); n++)
        {
            // SI TIENE ID DEFINIDO, HAGO EL FIND
            if (typeof(childs[n].id) != 'undefined')
            {
                // BUSQUEDA LIKE
                if (like)
                {
                    if (childs[n].id.indexOf(id) != -1)
                        elements.push(childs[n]);
                }
                else
                {
                    if (childs[n].id == id)
                        elements.push(childs[n]);
                }
            }
        }
    }
    return elements;
}
function $findClassName(className, like, parent)
{
    if (typeof(like) == 'undefined')
        like = false;
    if (typeof(parent) == 'undefined')
        parent = document.body;
    var childs = $childs(parent);
    var elements = new Array();
    if ($count(childs) > 0)
    {
        for (var n = 0; n < $count(childs); n++)
        {
            // BUSQUEDA LIKE
            if (like)
            {
                if (childs[n].className.indexOf(className) != -1)
                    elements.push(childs[n]);
            }
            else
            {
                if (childs[n].className == className)
                    elements.push(childs[n]);
            }
        }
    }
    return elements;
}
// SETEAR A UN GRUPO DE ELEMENTOS UNA PROPIEDAD CSS
function $groupCSSSet(elements, param, value)
{
    for (var n = 0; n < $count(elements); n++)
    {
        elements[n].style[param] = value;
    }
}
// AGREGAR CLASE CSS A UN GRUPO DE ELEMENTOS
function $groupAddClass(elements, className)
{
    for (var n = 0; n < $count(elements); n++)
    {
        elements[n].classList.add(className);
    }
}
// QUITAR CLASE CSS A UN GRUPO DE ELEMENTOS
function $groupRemoveClass(elements, className)
{
    for (var n = 0; n < $count(elements); n++)
    {
        elements[n].classList.remove(className);
    }
}
// CANTIDAD ELEMENTOS
function $count(elements)
{
    return elements.length;
}
// AGREGA UN ELEMENTO A LA PÁGINA DE FORMA DINÁMICA
function $addChild(newChild, parent)
{
    if (typeof(parent) == 'undefined')
        parent = document.body;
    parent.appendChild(newChild);
}
// AGREGA UN ELEMENTO A LA PÁGINA DE FORMA DINÁMICA ANTES DE OTRO ELEMENTO
function $addChildBefore(newChild, element)
{
    document.body.insertBefore(newChild, element);
}
// MOSTRAR ELEMENTO
function $show(element)
{
    $cssSet(element, 'display', 'inherit');
}
function $collapse(element, collapse)
{
    if (collapse)
        $css(element, 'visibility', 'collapse');
    else
        $css(element, 'visibility', 'visible');
}
// OCULTAR ELEMENTO
function $hide(element)
{
    if ($isArray(element))
    {
        for (var n = 0; n < $count(element); n++)
        {
            $cssSet(element[n], 'display', 'none');
        }
    }
    else
        $cssSet(element, 'display', 'none');
}
// RETORNA [ SETEA ] EL CONTENIDO DE UN ELEMENTO
function $content(element, content)
{
    if (typeof(content) != 'undefined')
        element.innerHTML = content;
    return element.innerHTML;
}
// RETORNA [ SETEA ] EL VALUE DE UN ELEMENTO
function $value(element, value)
{
    if (typeof(value) != 'undefined')
        element.value = value;
    return element.value;
}
function $isArray(element)
{
   if (element.constructor.toString().indexOf("Array") == -1)
      return false;
   else
      return true;
}
function $isset(param)
{
    var resultado;
    if (typeof(param) == 'undefined')
        resultado = false;
    else
        resultado = true;
    return resultado;
}
// INCLUDE
function $include(src)
{
    document.write('<script type="text/javascript" src="' + src + '"></script'+'>');
}