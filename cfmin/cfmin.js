var num = 0;
function addTrans() 
{   a = document.getElementById("list");
    b =  document.createElement("div");

    inx = document.createElement("input");
    inx.setAttribute("type","text");
    inx.setAttribute("placeholder","From(sender's name)");
    inx.setAttribute("id","from" + num);

    in1 = document.createElement("input");
    in1.setAttribute("type","text");
    in1.setAttribute("placeholder","to(reciever's name)");
    in1.setAttribute("id","to" + num);

    in2 = document.createElement("input");
    in2.setAttribute("type","number");
    in2.setAttribute("placeholder","Amount");
    in2.setAttribute("id","cost" + num);

    b.appendChild(inx);
    b.appendChild(in1);
    b.appendChild(in2);
    a.appendChild(b);
    num++;
}

let myMap = function() {
    this.collection = {};
    this.count = 0;
    this.size = function() {
        return this.count;
    };
    this.set = function(key, value) {
        this.collection[key] = value;
        this.count++;
    };
    this.has = function(key) {
        return (key in this.collection);
    };
    this.get = function(key) {
        return (key in this.collection) ? this.collection[key] : null;
    };
    this.delete = function(key) {
        if (key in this.collection) {
            delete this.collection[key];
            this.count--;
        }
    };
    this.values = function() {
        let result = new Array();
        for (let key of Object.keys(this.collection)) {
            console.log(key);
            result.push(this.collection[key]);
        };
        return (result.length > 0) ? result : null;
    };
    this.clear = function() {
        this.collection = {};
        this.count = 0;
    };
};

var map;
var positive;
var negative;
var ans;
var dataset;
var idxToIdx;
var node,edges;
function input()
{
    map         = new myMap();
    nameToIdx   = new myMap();
    positive    = new Array();
    negative    = new Array();
    ans         = new Array();
    dataset     = {};
    node        = new Array();
    edges       = new Array();
    let idx     = 0;

    for (var i = 0; i < num; i++) 
    {
        var from = document.getElementById("from" + i).value;
        var to   = document.getElementById("to"   + i).value;
        var cost = document.getElementById("cost" + i).value;
        cost = parseInt(cost);
        let name = from;
        let source,target;
        if(nameToIdx.has(name))
            source=nameToIdx.get(name);
        else
        {   source = idx;
            node.push({name});
            nameToIdx.set(name,(idx++));
        }
        name = to;
        if(nameToIdx.has(name))
            target=nameToIdx.get(name);
        else
        {   target = idx;
            node.push({name});
            nameToIdx.set(name,(idx++));
        }
        edges.push({source,target,cost});

        if(map.has(from))
        {
            let tmp = parseInt(map.get(from));
            map.delete(from);
            tmp = tmp + cost;
            map.set(from,tmp);
        }
        else
            map.set(from,cost);
        
        if(map.has(to))
        {
            let tmp = parseInt(map.get(to));
            map.delete(to);
            tmp = tmp - cost;
            map.set(to,tmp);
        }
        else
            map.set(to,-cost);
    }
    dataset["nodes"]=node;
    dataset["edges"]=edges;
    graph();
    logic();    
}
function logic(){
    for (let key of Object.keys(map.collection)) {
        let val = map.collection[key];
        if(val > 0)
            positive.push({key,val});
        if(val < 0){
            val = -val;
            negative.push({key,val});
        }
    };
    function des( a, b ) {
      if ( a.val > b.val )
        return -1;
      if ( a.val < b.val )
        return 1;
      return 0;
    }
    positive.sort(des);
    negative.sort(des);
    let l = 0,r = 0;
    let pos = positive.length;
    let neg = negative.length;

    while(l<pos && r<neg)
    {
        let cost = Math.min(positive[l].val,negative[r].val);
        positive[l].val = positive[l].val - cost;
        negative[r].val = negative[r].val - cost;

        let from = positive[l].key;
        let to = negative[r].key;

        ans.push({to,from,cost});

        if(positive[l].val==0)
            l++;
        if(negative[r].val==0)
            r++;
    }
    for(let i=0;i < ans.length;i++)    
    {
        a = document.getElementById("ansList");
        b =  document.createElement("div");

        inx  = document.createTextNode(ans[i].from + " -> ");
        in1x = document.createTextNode(ans[i].to + " : ");
        in2x = document.createTextNode(ans[i].cost);

        b.appendChild(inx);
        b.appendChild(in1x);
        b.appendChild(in2x);  
        a.appendChild(b);       
     }
}
function graph()
{
  var w = 1000;
  var h = 600;
  var linkDistance=200;
  var colors = d3.scale.category10();
  var svg = d3.select("body").append("svg").attr({"width":w,"height":h});
  var force = d3.layout.force()
      .nodes(dataset.nodes)
      .links(dataset.edges)
      .size([w,h])
      .linkDistance([linkDistance])
      .charge([-500])
      .theta(0.1)
      .gravity(0.05)
      .start();

  var edges = svg.selectAll("line")
    .data(dataset.edges)
    .enter()
    .append("line")
    .attr("id",function(d,i) {return 'edge'+i})
    .attr('marker-end','url(#arrowhead)')
    .style("stroke","#ccc")
    .style("pointer-events", "none");

  var nodes = svg.selectAll("circle")
    .data(dataset.nodes)
    .enter()
    .append("circle")
    .attr({"r":10})
    .style("fill",function(d,i){return colors(i);})
    .call(force.drag)

  var nodelabels = svg.selectAll(".nodelabel") 
     .data(dataset.nodes)
     .enter()
     .append("text")
     .attr({"x":function(d){return d.x;},
            "y":function(d){return d.y;},
            "class":"nodelabel",
            "font-size":20,
            "fill":"black",
            "stroke":"white",
            "stroke-opacity":0.5,
            "strokeWidth":.2})
     .text(function(d){return d.name;});

  var edgepaths = svg.selectAll(".edgepath")
      .data(dataset.edges)
      .enter()
      .append('path')
      .attr({'d': function(d) {return 'M '+d.source.x+' '+d.source.y+' L '+ d.target.x +' '+d.target.y},
             'class':'edgepath',
             'fill-opacity':0,
             'stroke-opacity':0,
             'fill':'blue',
             'stroke':'red',
             'id':function(d,i) {return 'edgepath'+i}})
      .style("pointer-events", "none");

  var edgelabels = svg.selectAll(".edgelabel")
      .data(dataset.edges)
      .enter()
      .append('text')
      .style("pointer-events", "none")
      .attr({'class':'edgelabel',
             'id':function(d,i){return 'edgelabel'+i},
             'dx':80,
             'dy':0,
             'font-size':10,
             'fill':'black'});

  edgelabels.append('textPath')
      .attr('xlink:href',function(d,i) {return '#edgepath'+i})
      .style("pointer-events", "none")
      .text(function(d){return d.cost});

  svg.append('defs').append('marker')
      .attr({'id':'arrowhead',
             'viewBox':'-0 -5 10 10',
             'refX':25,
             'refY':0,
             'orient':'auto',
             'markerWidth':10,
             'markerHeight':10,
             'xoverflow':'visible'})
      .append('svg:path')
          .attr('d', 'M 0,-5 L 10 ,0 L 0,5')
          .attr('fill', '#ccc')
          .attr('stroke','#ccc');  

  force.on("tick", function(){
      edges.attr({"x1": function(d){return d.source.x;},
                  "y1": function(d){return d.source.y;},
                  "x2": function(d){return d.target.x;},
                  "y2": function(d){return d.target.y;}
      });
      nodes.attr({"cx":function(d){return d.x;},
                  "cy":function(d){return d.y;}
      });
      nodelabels.attr("x", function(d) { return d.x; }) 
                .attr("y", function(d) { return d.y; });
      edgepaths.attr('d', function(d) { 
        var path='M '+d.source.x+' '+d.source.y+' L '+ d.target.x +' '+d.target.y;
      return path});       
      edgelabels.attr('transform',function(d,i){
          if (d.target.x<d.source.x){
              bbox = this.getBBox();
              rx = bbox.x+bbox.width/2;
              ry = bbox.y+bbox.height/2;
              return 'rotate(180 '+rx+' '+ry+')';
              }
          else {
              return 'rotate(0)';
              }
      });
  });
}

