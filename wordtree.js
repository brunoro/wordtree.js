function imprime(final, num)
{
    indent = "";
    for(i=0; i<num; i++)
    {
        indent += "_";
    }
    document.writeln(indent + final.key + " (" + final.num + ")<br>");
    for(var i=0; i<final.filho.length; i++)
    {
        imprime(final.filho[i], num + 1);
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

/* constantes */
sizex = 800;
sizey = 400;
// TODO: colocar aqui todos os parametros fixos (cores, fontes, etc)
offx = 50;
// TODO: setar valor de offy por número de coisas no fim da árvore
offy = 25;
dotdist = 5;
//TODO: setar tamanho da fonte por número total de elementos
maxfont = 80; 
count = 0;
clicada = 0;

//window.onload = function(){
// TODO: centralizar no meio da página (subpaper raphael?)
function renderJSON(canvas, final, px, py, prof, lim, inity)
{
    var n = 0;
    var ret_text = new Array();
    var ret;
    var texto = canvas.text(px, py, final.key);

    /* eventos */
    $(texto.node).mouseover(function (){
        texto.attr("fill", "#3f9ada");
    });

    $(texto.node).mouseout(function(){
        texto.attr("fill", "#000");
    });

    /* clique na palavra */
    // TODO: fazer animação
    $(texto.node).click(function(){
        /* se for uma coisa que não foi clicada, vai para subárvore */
        // TODO: concatenar caminho no primeiro nodo até vértice
        if (clicada == 0)
        {
            canvas.clear();
            count = 0;
            maxnum = final.num;
            clicada = 1;
            renderJSON(canvas, final, 10, 50, 0, 6, 0);
        }
        /* senão vai para árvore inicial */
        else
        {
            canvas.clear();
            count = 0;
            maxnum = ripper.num;
            clicada = 0;
            renderJSON(canvas, ripper, 10, 50, 0, 6, 0);
        }
    });

    texto.attr({
        "font-size": maxfont * final.num/(maxnum + 2) + 5,
        "font-family": "Trebuchet MS"
    });
            
    /* ultima coluna */
    /* coloca posição */
    if((prof == lim) || (final.filho.length == 0))
    {
        /* corta texto muito grande */
        // TODO: fazer texto ocupar máximo de espaço possível usando maxfont
        tstr = texto.attr("text");
        if(tstr.length > 80)
        {
            for(var fim=80; tstr.charAt(fim) != ' '; fim--)
            {
                texto.attr("text", tstr.substring(0, fim));
            }
        }
        texto.attr({
            "x": px + offx + texto.getBBox().width/2,
            "y": py + offy * count,
            "font-size": maxfont * final.num/(maxnum + 2) + 5,
            "fill": "#555"
        });
        $(texto.node).mouseout(function (){
                texto.attr("fill", "#555");
        });
        /* faz um ponto para ser ligado à direita do texto */
        var ldot = canvas.circle(px + offx - dotdist,
                                    py + offy * count, 1);
        ldot.attr({"stroke-opacity": 0});
        count++;
        return new Array(1, ldot);
    }

    /* colunas do meio */
    for(var i=0; i<final.filho.length; i++)
    {
        ret = renderJSON(canvas, final.filho[i], px + texto.getBBox().width + offx,
                         py, prof + 1, lim, i/final.filho.length * count * offy);
        n += ret[0];
        ret_text[i] = ret[1];
    }

    /* ajusta posição dos textos */
    texto.attr({
        "x": px + offx + texto.getBBox().width/2,
        "y": py + (count - n/2) * offy - texto.getBBox().height/3
    });
   
    /* ponto da direita do texto */
    var rdot = canvas.circle(px + offx + texto.getBBox().width + dotdist,
                             py + (count - n/2) * offy - texto.getBBox().height/3, 1);
    rdot.attr({"stroke-opacity": 0});

    /* conecta ldot recebido com rdot gerado */
    for(var i=0; i<final.filho.length; i++)
    {
        conn = canvas.connection(rdot, ret_text[i], '#3f9ada', '#5599ff|2')
            $(rdot).data('conn', conn)
    }

    /* gera outro ponto da esquerda */
    var ldot = canvas.circle(px + offx - dotdist,
                             py + (count - n/2) * offy - texto.getBBox().height/3, 1);
    ldot.attr({"stroke-opacity": 0});
        
    return new Array(n, ldot);
}
    /*
    var arvore = eval('(' + '{ "key": "Dilma", "num": 11, "filho": [  { "key": " aparece  na  sequência,  com  23%,  e  Marina  Silva  tem  22% ", "num": 1, "filho": [  ]},  { "key": " se  referia  às  críticas  feita  por  Serra  nesta  segunda-feira  ao  Programa  de  Aceleração  do  Crescimento  (PAC)  em  reunião  com  empresários  em  Minas  Gerais ", "num": 1, "filho": [  ]},  { "key": " teria  reclamado  até  que  sequer  viu  o  texto ", "num": 1, "filho": [  ]},  { "key": " era  a  responsável  pela  gestão  do  programa  quando  estava  no  governo  federal ", "num": 1, "filho": [  ]},  { "key": " irá  a  Belo  Horizonte,  Ouro  Preto,  Diamantina ", "num": 1, "filho": [  ]},  { "key": " deixará  o  cargo  de  ministra  da  Casa  Civil  para  se  consagrar  exclusivamente  à  pré-campanha,  que  dura  até  o  fim  de  junho,  quando  a  lei  eleitoral  estabelece  o  início  oficial  do  pleito  presidencial ", "num": 1, "filho": [  ]},  { "key": "ainda", "num": 2, "filho": [    { "key": " não  rebolou,  mas  já  cantou  alguns  versinhos  de  El  Dia  que  Me  Quieras,  famosa  na  voz  de  Carlos  Gardel,  para  José  Luiz  Datena,  da  TV  Record ", "num": 1, "filho": [    ]},    { "key": " poderá  esticar  sua  viagem  a  Londrina,  onde  visitaria  um  call  center ", "num": 1, "filho": [    ]}  ]},  { "key": " disse  que ", "num": 2, "filho": [    { "key": " achou  `muito  estranho`  os  elogios  da  oposição  ao  governo ", "num": 1, "filho": [    ]},    { "key": " foi  lá  para  se  encontrar  com  a  primeira-dama  Marisa  Letícia,  para  `uma  conversa  entre  mulheres`  e  comentou  que  espera  poder  contar  com  ajuda  dela  na  campanha,  ressalvando  que  não  foi  este  o  assunto  que  a  levou  à  atual  sede  do  governo ", "num": 1, "filho": [    ]}  ]},  { "key": "nega", "num": 1, "filho": [  ]}]}' +')' );
    */
    
function drawWordtree(jsonFromHtml, offx_, offy_, dotdist_, maxfont_)
{
    count = 0;
    clicada = 0;
    offx = parseInt(offx_);
    offy = parseInt(offy_);
    dotdist = parseInt(dotdist_);
    maxfont = parseInt(maxfont_);

    var arvore = eval('(' + jsonFromHtml + ')');

    /* seta tamanho máximo */
    maxnum = arvore.num;
            
    area = Raphael("main", sizex, sizey);
    renderJSON(area, arvore, 10, 50, 0, 6, 0);
}
//}
//imprime(ripper);
