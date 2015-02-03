var ShowCase = function(l, u, my, canvasContext){
    var upperLimit = u;
    var lowerLimit = l;
    var ctx = canvasContext;
    
    var width = ctx.canvas.width;
    var height = ctx.canvas.height;
    
    var valuePerPixel = (u-l)/width;
    
    var calcHeight = function(bars){
        
        var areaPerBarBit = 1/bars.length;
        // Get the heighest bar
        var mostValuesSoFar = 0;
        for(var i = 0; i < bars.length; i++){
            var numVals = bars[i].values.length;
            if(numVals > mostValuesSoFar) mostValuesSoFar = numVals;
        }
        var mostValues = mostValuesSoFar;
        var heightPerBarBit = height/mostValues;
        
        // Give all of them hieght
        for(var i = 0; i < bars.length; i++){
            bars[i].height = bars[i].values.length * heightPerBarBit;
        }
    }
    
    var drawBars = function(bars){
        // Clear our canvas
        ctx.clearRect(0,0,width,height);
        
        //Set params
        ctx.fillStyle = "#000000";
        
        for(var i = 0; i < bars.length; i++){
            var y = height - bars[i].height;
            var x = bars[i].drawFrom;
            var barWidth = bars[i].width;
            var barHeight = bars[i].height;
            
            ctx.fillRect(x,y, barWidth, barHeight);
        }
    }
    
    var graphWithDecreasingBarWitdh = function(values){
        if(values.length === 0) {return};
        var numRect = values.length;
        
        var rectWidth = width/numRect;
        
        var valueInABar = valuePerPixel * rectWidth;
        
        var bars = [];
        
        
        for(var i = 0; i < numRect; i++){
            var start = l + valueInABar*i;
            var stop = start + valueInABar;
            
            var thisBar = new Bar();
            thisBar.start = start;
            thisBar.stop = stop;
            thisBar.width = rectWidth;
            thisBar.drawFrom = rectWidth*i;
            
            // How many values are inside the two values?
            
            var a = 0;
            var lowestVal;
            var highestVal;
            var numVals = values.length;
            for(;a < values.length; a++){
                if(values[a]>start && values[a]<stop){
                    thisBar.values.push(values[a]);
                    values.splice(a,1);
                    a--;
                }
            }
            bars.push(thisBar);
        }
        
        calcHeight(bars);
        
        drawBars(bars);
        
    };
    
    var graphWithPixelWidth = function(values){
        var barWidth = 1;
        var valueInABar = valuePerPixel;
        
        var bars = [];
        
        for(var i = 0; i < width; i++){
            var start = l + valueInABar*i;
            var stop = start + valueInABar;
            
            var thisBar = new Bar();
            thisBar.start = start;
            thisBar.stop = stop;
            thisBar.width = barWidth;
            thisBar.drawFrom = barWidth*i;
            
            
            for(var a = 0; a < values.length; a++){
                if(values[a]>start && values[a]<stop){
                    thisBar.values.push(values[a]);
                    values.splice(a,1);
                    a--;
                }
            }
            bars.push(thisBar);
        }
        calcHeight(bars);
        drawBars(bars)
    }
    
    var Bar = function(){
        this.values = [];
        this.stop;
        this.start;
        this.drawFrom;
        this.height;
    }    
    
    return {graphWithDecreasingBarWitdh:graphWithDecreasingBarWitdh, graphWithPixelWidth:graphWithPixelWidth}; 
}