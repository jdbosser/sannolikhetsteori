var out = document.getElementById("steps"),
    loopsOut = document.getElementById("loops"),
    yAxis = document.getElementById("y-axel"),
    isRunning = false,
    randData, randIndex = {min:null,max:null}, margin,
    worker;

var roundValues = function(middle, margin, number){
    if(margin<=0)throw "too little margin";
    
    number-=middle;
    var mod = Math.abs(number%margin);
    var val;
    if((mod>margin/2)+(number<0)==1)val = Math.ceil(number/margin)*margin;
    else val = Math.floor(number/margin)*margin;
    
    //floating point errror fix
    return +val.toPrecision(8)+middle;
};

document.getElementById("start").addEventListener("click",function(){
    if(isRunning){worker.terminate();}
    
    var deviation = +document.getElementById("avvikelse").value,
        expectedVal = +document.getElementById("vantevarde").value;

    margin = +document.getElementById("chartPrecision").value;
    randData = {};

    worker = new Worker("algorithm.js");
    worker.addEventListener("message", function(e){
        var data = e.data;
        out.innerHTML = data.genom;
        loopsOut.innerHTML = data.ggr;
        
        //add values
        var rounded = roundValues(deviation,margin,data.stok);
        if(randData[rounded])randData[rounded]++;
        else{
            randData[rounded] = 1;
            
            if(randIndex.max === null)randIndex.min=randIndex.max=rounded; //fix null-comparison
            else if(randIndex.max < rounded)randIndex.max=rounded;
            else if(randIndex.min > rounded)randIndex.min=rounded;
        }
    }, false);
    isRunning = true;
    worker.postMessage({sigma: deviation, my: expectedVal});
});

document.getElementById("stop").addEventListener("click",function(){
    worker.terminate();
    isRunning = false;
});



document.getElementById("stop").addEventListener("click",function(){
    worker.terminate();
    isRunning = false;
    
    crunchData();
});

var crunchData = function(){
    var max = Math.max(Math.abs(randIndex.min),Math.abs(randIndex.max)),
        chartData = {names:[],data:[]};
    for(var i=-max; i<=max;i+=margin){
        //floating point fix
        i = +i.toPrecision(8);
        if(Math.abs(i)<margin)i=0;
        
        chartData.names.push((+(i-margin/2).toPrecision(8))+' - '+(+(i+margin/2).toPrecision(8)));
        chartData.data.push(randData[i]||0);
    };
    drawChart(chartData,yAxis.options[yAxis.selectedIndex].value==="relative",document.getElementById("kumulativ").checked);
};

var drawChart = function(){
    
    var loaded = false,
        script = document.createElement('script');
    
    script.src = "Chart.js/chart.js";
    script.async = true;
    
    script.addEventListener("load",function(){
        loaded = true;
        
        //Chart.js settings here
        
            // Boolean - Whether to animate the chart
        Chart.defaults.global.animation = false;

            // Number - Number of animation steps
        Chart.defaults.global.animationSteps = 60;

            // Boolean - Determines whether to draw tooltips on the canvas or not
        Chart.defaults.global.showTooltips = true;
    });
    document.head.appendChild(script);
    
    
    //actual function
    return function(data,printInRelative,comulative){
        if(!data || !Array.isArray(data.names) || !Array.isArray(data.data) || data.names.length !== data.data.length)
        if(!loaded)throw "chart.js not yet loaded";
        
        //turn data into percentage
        if(printInRelative){
            var total=0;
            for(var i=data.data.length;i--;)total+= data.data[i];
            
            //percentage
            for(var i=data.data.length;i--;)data.data[i]=data.data[i]/total;
        }
        if(comulative){
            for(var i=1;i<data.data.length;i++)data.data[i]+=data.data[i-1];
        }
        
        var canvas = document.createElement('canvas');

        canvas.width = innerWidth * Math.max(1,data.data.length/50);
        canvas.height = innerHeight;
        document.body.appendChild(canvas);

        var buyerData = {
            labels : data.names,
            datasets : [
                {
                    fillColor : "rgba(99,123,133,0.4)",
                    strokeColor : "rgba(220,220,220,1)",
                    pointColor : "rgba(220,220,220,1)",
                    pointStrokeColor : "#fff",
                    data : data.data
                }
            ]
        }

        new Chart(canvas.getContext('2d')).Line(buyerData);
    };
}();