function printTree(subtree, num)
{
    indent = "";
    for(i=0; i<num; i++)
    {
        indent += "_";
    }
    document.writeln(indent + subtree.key + " (" + subtree.num + ")<br>");
    for(var i=0; i<subtree.son.length; i++)
    {
        printTree(subtree.son[i], num + 1);
    }
}

Raphael.fn.connection = function (obj1, obj2, line, bg){
    var somax = 18
    var bb1 = obj1.getBBox();
    var bb2 = obj2.getBBox();
    var path = ["M", bb1.x, bb1.y , "C", bb1.x + somax, bb1.y, bb2.x - somax, bb2.y, bb2.x, bb2.y].join(",");
    if (line && line.line) {
        line.bg && line.bg.attr({path: path});
        line.line.attr({path: path});
    } else {
        var color = typeof line == "string" ? line : "#000";
        return {
            bg: bg && bg.split && this.path(path).attr({stroke: bg.split("|")[0], fill: "none", "stroke-width": bg.split("|")[1] || 3}),
            line: this.path(path).attr({stroke: color, fill: "none"}),
            from: obj1,
            to: obj2
        };
    }
};

/* control variables */
count = 0;
clicked = 0;

/* default values (for no CSS) */
/* sizes */
sizex = 800;
sizey = 400;
offx = 50;
offy = 25; // TODO: set offy by number of sons on tree 
dotdist = 5;
maxfont = 80; //TODO: set fontsize by number of elements 

/* colors and font */
font = "Trebuchet MS"
color_texthover = "#3f9ada";
color_text = "#444444";
color_linebg = "#5599ff|2";
color_line = "#3f9ada";

function renderJSON(canvas, subtree, px, py, prof, lim, inity)
{
    var n = 0;
    var ret_text = new Array();
    var ret;
    var texto = canvas.text(px, py, subtree.key);

    /* eventos */
    $(texto.node).mouseover(function (){
        texto.attr("fill", color_texthover);
    });

    $(texto.node).mouseout(function(){
        texto.attr("fill", color_text);
    });

    /* clique na palavra */
    $(texto.node).click(function(){
        /* if it wasn't clicked, go to subtree */ 
        if (clicked == 0)
        {
            canvas.clear();
            count = 0;
            maxnum = subtree.num;
            clicked = 1;
            renderJSON(canvas, subtree, 10, 50, 0, 6, 0);
        }
        /* else goes to initial tree */
        else
        {
            canvas.clear();
            count = 0;
            maxnum = ripper.num;
            clicked = 0;
            renderJSON(canvas, ripper, 10, 50, 0, 6, 0);
        }
    });

    texto.attr({
        "font-size": maxfont * subtree.num/(maxnum + 2) + 5,
        "font-family": font 
    });
            
    /* last column */
    /* set position */
    if((prof == lim) || (subtree.son.length == 0))
    {
        /* cut big text */
        // TODO: set maxfont according to textsize 
        tstr = texto.attr("text");
        if(tstr.length > 80)
        {
            for(var end = 80; tstr.charAt(fim) != ' '; fim--)
            {
                texto.attr("text", tstr.substring(0, end));
            }
        }
        texto.attr({
            "x": px + offx + texto.getBBox().width/2,
            "y": py + offy * count,
            "font-size": maxfont * subtree.num/(maxnum + 2) + 5,
            "fill": color_text 
        });
        $(texto.node).mouseout(function (){
                texto.attr("fill", color_text);
        });
        /* make a fake point left to the text (ldot) */
        var ldot = canvas.circle(px + offx - dotdist,
                                    py + offy * count, 1);
        ldot.attr({"stroke-opacity": 0});
        count++;
        return new Array(1, ldot);
    }

    /* middle columns */
    for(var i=0; i<subtree.son.length; i++)
    {
        ret = renderJSON(canvas, subtree.son[i], px + texto.getBBox().width + offx,
                         py, prof + 1, lim, i/subtree.son.length * count * offy);
        n += ret[0];
        ret_text[i] = ret[1];
    }

    /* adjust positions */
    texto.attr({
        "x": px + offx + texto.getBBox().width/2,
        "y": py + (count - n/2) * offy - texto.getBBox().height/3
    });
   
    /* fake point right to the text (rdot) */
    var rdot = canvas.circle(px + offx + texto.getBBox().width + dotdist,
                             py + (count - n/2) * offy - texto.getBBox().height/3, 1);
    rdot.attr({"stroke-opacity": 0});

    /* connect recieved ldot with the generated rdot */
    for(var i=0; i<subtree.son.length; i++)
    {
        conn = canvas.connection(rdot, ret_text[i], color_line, color_linebg);
        $(rdot).data('conn', conn)
    }

    /* make another left connection point */ 
    var ldot = canvas.circle(px + offx - dotdist,
                             py + (count - n/2) * offy - texto.getBBox().height/3, 1);
    ldot.attr({"stroke-opacity": 0});
        
    return new Array(n, ldot);
}

function drawWordtree(jsonFromHtml, offx_, offy_, dotdist_, maxfont_)
{
    count = 0;
    clicked = 0;
    offx = parseInt(offx_);
    offy = parseInt(offy_);
    dotdist = parseInt(dotdist_);
    maxfont = parseInt(maxfont_);

    var arvore = eval('(' + jsonFromHtml + ')');

    /* seta tamanho máximo */
    maxnum = arvore.num;
            
    area = Raphael("wordtree", sizex, sizey);
    renderJSON(area, arvore, 10, 50, 0, 6, 0);
}
//}
//printTree(ripper);
