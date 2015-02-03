var my = 0;
var sigma = 1;
var type = {
    LAW_OF_LARGE_NUMBERS:1,
    GET_STOK_VAR:0,
};
var generateStokVarFranTathetsFunc = function(func, r, left, right, acc){
    //Integrate to the point we get r
    var currentSum = 0;
    var y;
    var lastOut = func(left);
    for(var i = left+acc; currentSum < r && i < right; i = i + acc){
        var dI = acc;
        var nowOut = func(i);
        currentSum = currentSum + ((lastOut + nowOut)/2 * dI);
        y = i;
        lastOut = nowOut;
        if(i == right){ 
            throw "not found";
            return;
        }
    }
    return y;
};

var normalfordelning = function(x){
    return  ((1/(sigma*Math.sqrt(2*Math.PI)))*(Math.pow(Math.E, -((Math.pow((x-my), 2)/(2*(Math.pow(sigma, 2))))))));
    };
self.addEventListener("message", function(e){
    if(e.data.type===type.LAW_OF_LARGE_NUMBERS){
        var data = e.data;
        my = data.my;
        sigma = data.sigma;

        var stokSum = 0;
        for(var i = 0; true; i++){
            var stok = generateStokVarFranTathetsFunc(normalfordelning, Math.random(), my-sigma*10, my+sigma*10, 2*sigma*10/1000000);
            stokSum = stokSum + stok;
            postMessage({genom: stokSum/i, ggr: i});
        }
    }
    else if(e.data.type===type.GET_STOK_VAR){
        var data = e.data;
        my = data.my;
        sigma = data.sigma;
        var stok = generateStokVarFranTathetsFunc(normalfordelning, Math.random(), my-sigma*10, my+sigma*10, 2*sigma*10/1000000);
        postMessage({value: stok});
    }
    
}, false);
