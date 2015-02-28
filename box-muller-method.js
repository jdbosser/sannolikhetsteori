self.addEventListener("message", function(e){
    var types = {
        GET_STOK_VAR: 0,
        GET_STOK_VAR_FLOW: 1
    };
    
    var my = e.data.my,
        sigma = e.data.sigma,
        type = e.data.type;
    
    switch(type){
        case types.GET_STOK_VAR_FLOW:
            console.log("börjar");
            getStokVarFlow(my, sigma);
            break;
    }
    
});

var getStokVarFlow = function(my, sigma){
    
    // Box muller method will allways generate two random variables
    // Generate two, place the second one in spare
    
    var spareStok;
    var startTime = +new Date();
    while(true){
        if(spareStok != null){
            
            // We had one spare, saving computation
            
            postMessage({value:spareStok});
            spareStok = null
            
        } else {
            
            // Create two uniform random numbers
            var U1 = Math.random();
            var U2 = Math.random();
            
            // Create theta and radius 
            var radius = Math.sqrt( (-2) * Math.log(U1) );
            var theta = 2 * Math.PI * U2;
            
            // According to Box muller method, both of these will be 
            // two independent random variables with a normal distribution. 
            var Z = radius * Math.cos(theta);
            // Save the other one. 
            var spareStok = radius * Math.sin(theta);
            
            // Send back the result. 
            postMessage({value:Z});
            
        }
        
        
    }
    console.log("klart! Tiden blev " + (+new Date - startTime) + "millijävlasekunder");
}