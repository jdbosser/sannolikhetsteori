var out = document.getElementById("steps"),
    loopsOut = document.getElementById("loops"),
    isRunning = false,
    worker;

document.getElementById("start").addEventListener("click",function(){
    if(isRunning){worker.terminate();}
    
    var deviation = +document.getElementById("avvikelse").value,
        expectedVal = +document.getElementById("vantevarde").value;

    worker = new Worker('algorithm.js');
    worker.addEventListener("message", function(e){
        var data = e.data;
        out.innerHTML = data.genom;
        loopsOut.innerHTML = data.ggr;
    }, false);
    isRunning = true;
    worker.postMessage({sigma: deviation, my: expectedVal});
});

document.getElementById("stop").addEventListener("click",function(){
    worker.terminate();
    isRunning = false;
});