var out = document.getElementById("steps"),
    loopsOut = document.getElementById("loops"),
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
        var rounded = roundValues(vantevarde,margin,data.stok);
        if(randData[rounded])randData[rounded]++;
        else{
            randData[rounded] = 1;
            if(randIndex.max < rounded)randIndex.max=rounded;
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