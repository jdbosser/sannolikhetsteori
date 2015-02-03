var ShowCase = function(l, u, my, canvasContext){
    var upperLimit = u;
    var lowerLimit = l;
    var ctx = canvasContext;
    
    var width = ctx.canvas.width;
    var height = ctx.canvas.height;
    
    var valuePerPixel = (u-l)/width;
    
    var bars = [];
    
    var graph = function(values){
        if(values.length === 0) {return};
        var numRect = values.length;
        
        var rectWidth = width/numRect;
        
        var valueInABar = valuePerPixel * rectWidth;
        
        
        
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
            for(;a < values.length; a++){
                if(values[a]>start && values[a]<stop){
                    thisBar.values.push(values[a]);
                    values.splice(a,1);
                }
            }
        }
        
        bars.push(thisBar);
        
    };
    var Bar = function(){
        this.values = [];
        this.stop;
        this.start;
        this.drawFrom;
    }    
    
    return {graph:graph}; 
}