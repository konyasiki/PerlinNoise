export interface Vector{
    x:number,
    y:number
}
interface Options{
    high:number,
    low:number
}
export class PerlinNoise{
    private sort(options:Options){
        this.map.length = 0;
        let number = 0;
        for(let i = options.low;i < options.high;i++){
            this.map.push(i);
        }
        for(let j = this.map.length - 1;j > 0;j--){
            number = this.map[j];
            let x = this.randomint(0,j);
            this.map[j] = this.map[x];
            this.map[x] = number;
        }
    }
    private randomint(low:number,high:number):number{
        low = Math.ceil(low);
        high = Math.floor(high); 
        return Math.floor((Math.random() * (high - low) + 1) + low);
    }
    private map:Array<number> = [
        151,160,137,91,90,15,131,13,201,95,96,53,194,233,7,
        225,140,36,103,30,69,142,8,99,37,240,21,10,23,190,6,
        148,247,120,234,75,0,26,197,62,94,252,219,203,117,
        35,11,32,57,177,33,88,237,149,56,87,174,20,125,136,
        171,168,68,175,74,165,71,134,139,48,27,166,77,146,
        158,231,83,111,229,122,60,211,133,230,220,105,92,41,
        55,46,245,40,244,102,143,54,65,25,63,161,1,216,80,
        73,209,76,132,187,208,89,18,169,200,196,135,130,116,
        188,159,86,164,100,109,198,173,186,3,64,52,217,226,
        250,124,123,5,202,38,147,118,126,255,82,85,212,207,
        206,59,227,47,16,58,17,182,189,28,42,223,183,170,
        213,119,248,152,2,44,154,163,70,221,153,101,155,167,
        43,172,9,129,22,39,253,19,98,108,110,79,113,224,232,
        178,185,112,104,218,246,97,228,251,34,242,193,238,
        210,144,12,191,179,162,241,81,51,145,235,249,14,239,
        107,49,192,214,31,181,199,106,157,184,84,204,176,
        115,121,50,45,127,4,150,254,138,236,205,93,222,114,
        67,29,24,72,243,141,128,195,78,66,215,61,156,180
    ]
    private getRandomVector(parameter:Array<Vector>):Array<Vector>{
        let VectorArray:Array<Vector> = [];
        parameter.forEach(pa=>{
            let x = this.getRandomParameter(pa.x);
            let y = this.getRandomParameter(pa.y);
            y = y / Math.sqrt(x * x + y * y);
            x = x / Math.sqrt(x * x + y * y);
            VectorArray.push({x:x,y:y})
        })
        return VectorArray;
    }
    private getRandomParameter(number:number):number{
        return this.map[number % this.map.length];//除以255的话会生成不连续的
    }
    private lerp(weight:number,firnumber:number,lasnumber:number):number{//插值
        return firnumber + weight * (lasnumber - firnumber);
    }
    private dot(fir:Vector,sec:Vector):number{
        return fir.x * sec.x + fir.y * sec.y;
    }
    private Easingfunction(t:number):number{//缓动函数
        return t*(t*(t*(10+t*(-15+6*t))));
    }
    randomVector3(objVector:Vector,Cycle:number):number{
        let xStart = Math.floor(objVector.x / Cycle) * Cycle ;
        let yStart = Math.floor(objVector.y / Cycle) * Cycle ;
        let xEnd = xStart + Cycle;
        let yEnd = yStart + Cycle;
        let yWeight = this.Easingfunction((objVector.y - yStart) / Cycle);
        let xWeight = this.Easingfunction((objVector.x - xStart) / Cycle);
        let randomVectorArr = this.getRandomVector([{x:xStart,y:yStart},{x:xEnd,y:yStart},{x:xStart,y:yEnd},{x:xEnd,y:yEnd}]);
        let ptpVector:Array<Vector> = [{x:objVector.x - xStart,y:objVector.y - yStart},{x:objVector.x - xEnd,y:objVector.y - yStart},{x:objVector.x - xStart,y:objVector.y - yEnd},{x:objVector.x - xEnd,y:objVector.y - yEnd}];
        let endArr:Array<number> = [];//↘,↙,↗,↖;
        randomVectorArr.forEach((parameter,index)=>{
            endArr.push(this.dot(parameter,ptpVector[index]));
        });
        let noise = this.lerp(yWeight,this.lerp(xWeight,endArr[0],endArr[1]),this.lerp(xWeight,endArr[2],endArr[3]));
        return noise;
    }
    randomVector2(x:number,Cycle:number):number{//Cycle(周期)也是一段的长度,同时实现了平铺
        let xStart = Math.floor(x / Cycle) * Cycle ;
        let xEnd = xStart + Cycle;
        let weight = this.Easingfunction((x - xStart) / Cycle);
        xStart = this.getRandomParameter(xStart);
        xEnd = this.getRandomParameter(xEnd);
        let noise = this.lerp(weight,xStart,xEnd);
        return noise / 255;//-1 ~ 1
    }
    constructor(options?:Options){
        if(options){
            this.sort(options);
            //非重复随机序列生成算法
        }
    }
}
